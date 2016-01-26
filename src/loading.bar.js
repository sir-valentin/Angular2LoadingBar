System.register(['angular2/http', 'angular2/core', 'rxjs/Observable'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
            case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
            case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
            case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
        }
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var http_1, core_1, Observable_1;
    var LoadingBar, LoadingBarBackend, LoadingBarConnection;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            LoadingBar = (function () {
                function LoadingBar() {
                }
                Object.defineProperty(LoadingBar, "provider", {
                    get: function () {
                        LoadingBarConnection.pending.subscribe(function (progressStart) {
                            console.log('progressStar: ', progressStart);
                        });
                        return core_1.provide(http_1.XHRBackend, { useClass: LoadingBarBackend });
                    },
                    enumerable: true,
                    configurable: true
                });
                LoadingBar = __decorate([
                    core_1.Component({
                        selector: 'loading-bar',
                        template: "<div id=\"loading-bar\"><div class=\"bar\"><div class=\"peg\"></div></div></div>",
                        styles: ["/* Make clicks pass-through */\n#loading-bar,\n#loading-bar-spinner {\n  pointer-events: none;\n  -webkit-pointer-events: none;\n  -webkit-transition: 350ms linear all;\n  -moz-transition: 350ms linear all;\n  -o-transition: 350ms linear all;\n  transition: 350ms linear all;\n}\n\n#loading-bar.ng-enter,\n#loading-bar.ng-leave.ng-leave-active,\n#loading-bar-spinner.ng-enter,\n#loading-bar-spinner.ng-leave.ng-leave-active {\n  opacity: 0;\n}\n\n#loading-bar.ng-enter.ng-enter-active,\n#loading-bar.ng-leave,\n#loading-bar-spinner.ng-enter.ng-enter-active,\n#loading-bar-spinner.ng-leave {\n  opacity: 1;\n}\n\n#loading-bar .bar {\n  -webkit-transition: width 350ms;\n  -moz-transition: width 350ms;\n  -o-transition: width 350ms;\n  transition: width 350ms;\n\n  background: #29d;\n  position: fixed;\n  z-index: 10002;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  border-bottom-right-radius: 1px;\n  border-top-right-radius: 1px;\n}\n\n/* Fancy blur effect */\n#loading-bar .peg {\n  position: absolute;\n  width: 70px;\n  right: 0;\n  top: 0;\n  height: 2px;\n  opacity: .45;\n  -moz-box-shadow: #29d 1px 0 6px 1px;\n  -ms-box-shadow: #29d 1px 0 6px 1px;\n  -webkit-box-shadow: #29d 1px 0 6px 1px;\n  box-shadow: #29d 1px 0 6px 1px;\n  -moz-border-radius: 100%;\n  -webkit-border-radius: 100%;\n  border-radius: 100%;\n}\n\n#loading-bar-spinner {\n  display: block;\n  position: fixed;\n  z-index: 10002;\n  top: 10px;\n  left: 10px;\n}\n\n#loading-bar-spinner .spinner-icon {\n  width: 14px;\n  height: 14px;\n\n  border:  solid 2px transparent;\n  border-top-color:  #29d;\n  border-left-color: #29d;\n  border-radius: 50%;\n\n  -webkit-animation: loading-bar-spinner 400ms linear infinite;\n  -moz-animation:    loading-bar-spinner 400ms linear infinite;\n  -ms-animation:     loading-bar-spinner 400ms linear infinite;\n  -o-animation:      loading-bar-spinner 400ms linear infinite;\n  animation:         loading-bar-spinner 400ms linear infinite;\n}\n\n@-webkit-keyframes loading-bar-spinner {\n  0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }\n  100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n}\n@-moz-keyframes loading-bar-spinner {\n  0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }\n  100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }\n}\n@-o-keyframes loading-bar-spinner {\n  0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }\n  100% { -o-transform: rotate(360deg); transform: rotate(360deg); }\n}\n@-ms-keyframes loading-bar-spinner {\n  0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }\n  100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }\n}\n@keyframes loading-bar-spinner {\n  0%   { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}"]
                    }), 
                    __metadata('design:paramtypes', [])
                ], LoadingBar);
                return LoadingBar;
            })();
            exports_1("LoadingBar", LoadingBar);
            LoadingBarBackend = (function () {
                function LoadingBarBackend(_browserXHR, _baseResponseOptions) {
                    this._browserXHR = _browserXHR;
                    this._baseResponseOptions = _baseResponseOptions;
                }
                LoadingBarBackend.prototype.createConnection = function (request) {
                    return new LoadingBarConnection(request, this._browserXHR, this._baseResponseOptions);
                };
                LoadingBarBackend = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.BrowserXhr, http_1.ResponseOptions])
                ], LoadingBarBackend);
                return LoadingBarBackend;
            })();
            exports_1("LoadingBarBackend", LoadingBarBackend);
            LoadingBarConnection = (function () {
                function LoadingBarConnection(req, browserXHR, baseResponseOptions) {
                    this.baseConnection = new http_1.XHRConnection(req, browserXHR, baseResponseOptions);
                    LoadingBarConnection.requestStarted();
                    this.response.subscribe(function () {
                        LoadingBarConnection.requestEnded();
                    });
                }
                LoadingBarConnection.requestStarted = function () {
                    if (LoadingBarConnection._pendingRequests == 0) {
                        LoadingBarConnection._observer.next(true);
                    }
                    LoadingBarConnection._pendingRequests++;
                };
                LoadingBarConnection.requestEnded = function () {
                    if (LoadingBarConnection._pendingRequests == 1) {
                        LoadingBarConnection._observer.next(false);
                    }
                    LoadingBarConnection._pendingRequests--;
                };
                Object.defineProperty(LoadingBarConnection.prototype, "readyState", {
                    get: function () {
                        return this.baseConnection.readyState;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LoadingBarConnection.prototype, "request", {
                    get: function () {
                        return this.baseConnection.request;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LoadingBarConnection.prototype, "response", {
                    get: function () {
                        return this.baseConnection.response;
                    },
                    enumerable: true,
                    configurable: true
                });
                LoadingBarConnection._pendingRequests = 0;
                LoadingBarConnection.pending = new Observable_1.Observable(function (observer) { return LoadingBarConnection._observer = observer; });
                return LoadingBarConnection;
            })();
            exports_1("LoadingBarConnection", LoadingBarConnection);
        }
    }
});
