/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {bootstrap}    from 'angular2/platform/browser'
import {HTTP_PROVIDERS, Http, ConnectionBackend, Connection, Request, Response, ReadyState, XHRConnection, BrowserXhr, ResponseOptions, XHRBackend, IRequestOptions} from 'angular2/http';
import {Injectable, provide, Provider, Component, ViewChild, Renderer, Injector} from 'angular2/core';
import {Observable, Subscriber} from 'rxjs/Observable';
import {MockBackend} from "../node_modules/angular2/ts/src/http/backends/mock_backend";

@Component({
    selector: 'loading-bar',
    template: `
        <div id="loading-bar-spinner" #loadingBarSpinner><div class="spinner-icon"></div></div>
        <div id="loading-bar" #loadingBarContainer><div class="bar" #loadingBar><div class="peg"></div></div></div>
    `,
    styles: [`
        /* Make clicks pass-through */
        #loading-bar,
        #loading-bar-spinner {
          pointer-events: none;
          -webkit-pointer-events: none;
          -webkit-transition: 350ms linear all;
          -moz-transition: 350ms linear all;
          -o-transition: 350ms linear all;
          transition: 350ms linear all;
        }

        #loading-bar.ng-enter,
        #loading-bar.ng-leave.ng-leave-active,
        #loading-bar-spinner.ng-enter,
        #loading-bar-spinner.ng-leave.ng-leave-active {
          opacity: 0;
        }

        #loading-bar.ng-enter.ng-enter-active,
        #loading-bar.ng-leave,
        #loading-bar-spinner.ng-enter.ng-enter-active,
        #loading-bar-spinner.ng-leave {
          opacity: 1;
        }

        #loading-bar .bar {
          -webkit-transition: width 350ms;
          -moz-transition: width 350ms;
          -o-transition: width 350ms;
          transition: width 350ms;

          background: #29d;
          position: fixed;
          z-index: 10002;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          border-bottom-right-radius: 1px;
          border-top-right-radius: 1px;
        }

        /* Fancy blur effect */
        #loading-bar .peg {
          position: absolute;
          width: 70px;
          right: 0;
          top: 0;
          height: 2px;
          opacity: .45;
          -moz-box-shadow: #29d 1px 0 6px 1px;
          -ms-box-shadow: #29d 1px 0 6px 1px;
          -webkit-box-shadow: #29d 1px 0 6px 1px;
          box-shadow: #29d 1px 0 6px 1px;
          -moz-border-radius: 100%;
          -webkit-border-radius: 100%;
          border-radius: 100%;
        }

        #loading-bar-spinner {
          display: block;
          position: fixed;
          z-index: 10002;
          top: 10px;
          left: 10px;
        }

        #loading-bar-spinner .spinner-icon {
          width: 14px;
          height: 14px;

          border:  solid 2px transparent;
          border-top-color:  #29d;
          border-left-color: #29d;
          border-radius: 50%;

          -webkit-animation: loading-bar-spinner 400ms linear infinite;
          -moz-animation:    loading-bar-spinner 400ms linear infinite;
          -ms-animation:     loading-bar-spinner 400ms linear infinite;
          -o-animation:      loading-bar-spinner 400ms linear infinite;
          animation:         loading-bar-spinner 400ms linear infinite;
        }

        @-webkit-keyframes loading-bar-spinner {
          0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
        }
        @-moz-keyframes loading-bar-spinner {
          0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }
          100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }
        }
        @-o-keyframes loading-bar-spinner {
          0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }
          100% { -o-transform: rotate(360deg); transform: rotate(360deg); }
        }
        @-ms-keyframes loading-bar-spinner {
          0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }
          100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }
        }
        @keyframes loading-bar-spinner {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`]
})
export class LoadingBar {
    public static _loadingBarComponentInstance: LoadingBar;
    public static get HTTP_PROVIDERS(): any[] {
        // subscribe on http activity and update progress
        LoadingBarConnection.pending.subscribe((progress: any) => {
            console.log('progress: ', progress);
            setTimeout(() => {
                if (LoadingBar._loadingBarComponentInstance) {
                    if (progress.started) LoadingBar._loadingBarComponentInstance.start();
                    if (progress.completed) LoadingBar._loadingBarComponentInstance.complete();
                }
            }, 10);
        });

        return [HTTP_PROVIDERS, provide(XHRBackend, { useClass: LoadingBarBackend })];
    }

    @ViewChild('loadingBarSpinner') _spinner: any;
    @ViewChild('loadingBarContainer') _loadingBarContainer: any;
    @ViewChild('loadingBar') _loadingBar: any;

    private _autoIncrement: boolean = true;
    private _includeSpinner: boolean = true;
    private _includeBar: boolean = true;
    private _latencyThreshold: number = 10;
    private _startSize: number = 0.02;

    private _started: boolean = false;
    private _status: number = 0;

    private _incTimeout: any;
    private _completeTimeout: any;

    private _startTimeout: any;

    constructor(private _renderer: Renderer) {
        LoadingBar._loadingBarComponentInstance = this;
    }

    public ngAfterViewInit() {
        this.hide(this._loadingBarContainer);
        this.hide(this._spinner);
    }

    /**
     * Inserts the loading bar element into the dom, and sets it to 2%
     */
    public start(): void {
        this._startTimeout = setTimeout(() => {

            clearTimeout(this._completeTimeout);

            // do not continually broadcast the started event:
            if (this._started) { return; }

            this._started = true;
            this._status = 0;

            if (this._includeBar) {
                this.show(this._loadingBarContainer);
            }

            if (this._includeSpinner) {
                this.show(this._spinner);
            }

            this.set(this._startSize);
        }, this._latencyThreshold);
    }
    /**
     * Set the loading bar's width to a certain percent.
     *
     * @param n any value between 0 and 1
     */
    public set(n): void {
        if (!this._started) { return; }
        var pct = (n * 100) + '%';
        this.setElementStyle(this._loadingBar, "width", pct);
        this._status = n;

        // increment loadingbar to give the illusion that there is always
        // progress but make sure to cancel the previous timeouts so we don't
        // have multiple incs running at the same time.
        if (this._autoIncrement) {
            clearTimeout(this._incTimeout);
            this._incTimeout = setTimeout(() => {
                this.inc();
            }, 250);
        }
    }

    /**
     * Increments the loading bar by a random amount
     * but slows down as it progresses
     */
    private inc(): void {
        if (this._status >= 1) {
            return;
        }

        var rnd = 0;

        // TODO: do this mathmatically instead of through conditions

        var stat = this._status;
        if (stat >= 0 && stat < 0.25) {
            // Start out between 3 - 6% increments
            rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (stat >= 0.25 && stat < 0.65) {
            // increment between 0 - 3%
            rnd = (Math.random() * 3) / 100;
        } else if (stat >= 0.65 && stat < 0.9) {
            // increment between 0 - 2%
            rnd = (Math.random() * 2) / 100;
        } else if (stat >= 0.9 && stat < 0.99) {
            // finally, increment it .5 %
            rnd = 0.005;
        } else {
            // after 99%, don't increment:
            rnd = 0;
        }

        var pct = this._status + rnd;
        this.set(pct);
    }

    public complete(): void {

        this.set(1);

        clearTimeout(this._completeTimeout);
        clearTimeout(this._startTimeout);

        // Attempt to aggregate any start/complete calls within 500ms:
        this._completeTimeout = setTimeout(() => {
            this._started = false;
            this.hide(this._loadingBarContainer);
            this.hide(this._spinner);
        }, 500);
    }

    private show(el: any): void {
        this.setElementStyle(el, "display", "block");
    }
    private hide(el: any): void {
        this.setElementStyle(el, "display", "none");
    }
    private setElementStyle(el: any, styleName: string, styleValue: string): void {
        this._renderer.setElementStyle(el.nativeElement, styleName, styleValue);
    }
}

function overrideFn(context, fnName, fn) {
    var baseFn = context[fnName] || function noop() { };

    context[fnName] = function overrideFunction() {
        var args = arguments;
        var params = Array.prototype.slice.call(args);

        params.unshift(function () {
            return baseFn.apply(this, arguments.length ? arguments : args);
        }.bind(this));

        return fn.apply(this, params);
    };
}

export class LoadingBarConnection implements Connection {
    private baseConnection: XHRConnection;
    private static _pendingRequests: number = 0;
    private static _observer: Observable<Response>;
    public static pending: Observable<boolean> = new Observable(observer => LoadingBarConnection._observer = observer);

    constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions?: ResponseOptions) {
        this.baseConnection = new XHRConnection(req, browserXHR, baseResponseOptions);

        overrideFn(this.baseConnection.response, 'subscribe',
            (baseFn, observerOrNext, error, complete) => {
                return baseFn(observerOrNext, error,
                    () => {
                        if (complete) complete();
                        LoadingBarConnection.requestEnded();
                    }
                );
            }
        );

        LoadingBarConnection.requestStarted();

        this.baseConnection.response.subscribe(() => {
            LoadingBarConnection.requestEnded();
        });
    }

    private static requestStarted() {
        let started = (LoadingBarConnection._pendingRequests == 0);
        LoadingBarConnection._pendingRequests++;
        LoadingBarConnection._observer.next({
            started: started,
            pendingRequests: LoadingBarConnection._pendingRequests
        });
    }

    private static requestEnded() {
        let completed = (LoadingBarConnection._pendingRequests == 1);
        LoadingBarConnection._pendingRequests--;
        LoadingBarConnection._observer.next({
            completed: completed,
            pendingRequests: LoadingBarConnection._pendingRequests
        });
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

@Injectable()
export class LoadingBarBackend implements ConnectionBackend {
    constructor(private _browserXHR: BrowserXhr, private _baseResponseOptions: ResponseOptions) {
    }
    public createConnection(request: Request): LoadingBarConnection {
        return new LoadingBarConnection(request, this._browserXHR, this._baseResponseOptions);
    }
}