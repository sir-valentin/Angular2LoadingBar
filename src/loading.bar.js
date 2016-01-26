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
