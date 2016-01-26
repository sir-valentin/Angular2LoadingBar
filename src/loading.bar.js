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
    var LoadingBar, ProgressIndicatorBackend, ProgressIndicatorConnection;
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
                        ProgressIndicatorConnection.pending.subscribe(function (progressStart) {
                            console.log('progressStar: ', progressStart);
                        });
                        return core_1.provide(http_1.XHRBackend, { useClass: ProgressIndicatorBackend });
                    },
                    enumerable: true,
                    configurable: true
                });
                return LoadingBar;
            })();
            exports_1("LoadingBar", LoadingBar);
            ProgressIndicatorBackend = (function () {
                function ProgressIndicatorBackend(_browserXHR, _baseResponseOptions) {
                    this._browserXHR = _browserXHR;
                    this._baseResponseOptions = _baseResponseOptions;
                }
                ProgressIndicatorBackend.prototype.createConnection = function (request) {
                    return new ProgressIndicatorConnection(request, this._browserXHR, this._baseResponseOptions);
                };
                ProgressIndicatorBackend = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.BrowserXhr, http_1.ResponseOptions])
                ], ProgressIndicatorBackend);
                return ProgressIndicatorBackend;
            })();
            exports_1("ProgressIndicatorBackend", ProgressIndicatorBackend);
            ProgressIndicatorConnection = (function () {
                function ProgressIndicatorConnection(req, browserXHR, baseResponseOptions) {
                    this.baseConnection = new http_1.XHRConnection(req, browserXHR, baseResponseOptions);
                    ProgressIndicatorConnection.requestStarted();
                    this.response.subscribe(function () {
                        ProgressIndicatorConnection.requestEnded();
                    });
                }
                ProgressIndicatorConnection.requestStarted = function () {
                    if (ProgressIndicatorConnection._pendingRequests == 0) {
                        ProgressIndicatorConnection._observer.next(true);
                    }
                    ProgressIndicatorConnection._pendingRequests++;
                };
                ProgressIndicatorConnection.requestEnded = function () {
                    if (ProgressIndicatorConnection._pendingRequests == 1) {
                        ProgressIndicatorConnection._observer.next(false);
                    }
                    ProgressIndicatorConnection._pendingRequests--;
                };
                Object.defineProperty(ProgressIndicatorConnection.prototype, "readyState", {
                    get: function () {
                        return this.baseConnection.readyState;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProgressIndicatorConnection.prototype, "request", {
                    get: function () {
                        return this.baseConnection.request;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProgressIndicatorConnection.prototype, "response", {
                    get: function () {
                        return this.baseConnection.response;
                    },
                    enumerable: true,
                    configurable: true
                });
                ProgressIndicatorConnection._pendingRequests = 0;
                ProgressIndicatorConnection.pending = new Observable_1.Observable(function (observer) { return ProgressIndicatorConnection._observer = observer; });
                return ProgressIndicatorConnection;
            })();
            exports_1("ProgressIndicatorConnection", ProgressIndicatorConnection);
        }
    }
});
