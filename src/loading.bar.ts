/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {ConnectionBackend, Connection, Request, Response, ReadyState, XHRConnection, BrowserXhr, ResponseOptions, XHRBackend} from 'angular2/http';
import {Injectable, provide, Provider} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

export class LoadingBar {
    public static get provider(): Provider {
        LoadingBarConnection.pending.subscribe((progressStart) => {
            console.log('progressStar: ', progressStart)
        });

        return provide(XHRBackend, { useClass: LoadingBarBackend });
    }
}

@Injectable()
export class LoadingBarBackend implements ConnectionBackend {
    constructor(private _browserXHR: BrowserXhr, private _baseResponseOptions: ResponseOptions) { }
    public createConnection(request: Request): LoadingBarConnection {
        return new LoadingBarConnection(request, this._browserXHR, this._baseResponseOptions);
    }
}

export class LoadingBarConnection implements Connection {
    private baseConnection: XHRConnection;
    private static _pendingRequests: number = 0;
    private static _observer: Observable<Response>;
    public static pending: Observable<boolean> = new Observable(observer => LoadingBarConnection._observer = observer);

    constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions?: ResponseOptions) {
        this.baseConnection = new XHRConnection(req, browserXHR, baseResponseOptions);
        LoadingBarConnection.requestStarted();
        this.response.subscribe(() => {
            LoadingBarConnection.requestEnded();
        });
    }

    private static requestStarted() {
        if (LoadingBarConnection._pendingRequests == 0) {
            LoadingBarConnection._observer.next(true);
        }
        LoadingBarConnection._pendingRequests++;
    }

    private static requestEnded() {
        if (LoadingBarConnection._pendingRequests == 1) {
            LoadingBarConnection._observer.next(false);
        }
        LoadingBarConnection._pendingRequests--;
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