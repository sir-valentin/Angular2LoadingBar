/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {ConnectionBackend, Connection, Request, Response, ReadyState, XHRConnection, BrowserXhr, ResponseOptions, XHRBackend} from 'angular2/http';
import {Injectable, provide, Provider} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

export class LoadingBar {
    public static get provider(): Provider {
        ProgressIndicatorConnection.pending.subscribe((progressStart) => {
            console.log('progressStar: ', progressStart)
        });

        return provide(XHRBackend, { useClass: ProgressIndicatorBackend });
    }
}

@Injectable()
export class ProgressIndicatorBackend implements ConnectionBackend {
    constructor(private _browserXHR: BrowserXhr, private _baseResponseOptions: ResponseOptions) { }
    public createConnection(request: Request): ProgressIndicatorConnection {
        return new ProgressIndicatorConnection(request, this._browserXHR, this._baseResponseOptions);
    }
}

export class ProgressIndicatorConnection implements Connection {
    private baseConnection: XHRConnection;
    private static _pendingRequests: number = 0;
    private static _observer: Observable<Response>;
    public static pending: Observable<boolean> = new Observable(observer => ProgressIndicatorConnection._observer = observer);

    constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions?: ResponseOptions) {
        this.baseConnection = new XHRConnection(req, browserXHR, baseResponseOptions);
        ProgressIndicatorConnection.requestStarted();
        this.response.subscribe(() => {
            ProgressIndicatorConnection.requestEnded();
        });
    }

    private static requestStarted() {
        if (ProgressIndicatorConnection._pendingRequests == 0) {
            ProgressIndicatorConnection._observer.next(true);
        }
        ProgressIndicatorConnection._pendingRequests++;
    }

    private static requestEnded() {
        if (ProgressIndicatorConnection._pendingRequests == 1) {
            ProgressIndicatorConnection._observer.next(false);
        }
        ProgressIndicatorConnection._pendingRequests--;
    }

    get readyState(): ReadyState {
        return this.baseConnection.readyState;
    }
    get request(): Request {
        return this.baseConnection.request;
    }
    get response(): Observable<Response> {
        return this.baseConnection.response;
    }
}