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
    var ProgressIndicator, LoadingBar, LoadingBarConnection, LoadingBarBackend;
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
            ProgressIndicator = (function () {
                function ProgressIndicator() {
                }
                Object.defineProperty(ProgressIndicator, "LOADING_BAR_PROVIDERS", {
                    get: function () {
                        // create LoadingBar component and store to static var
                        //bootstrap(LoadingBar, [Renderer]).then((compRef) => {
                        //    ProgressIndicator._loadingBarComponentInstance = compRef.instance;
                        //});
                        // subscribe on http activity and update progress
                        LoadingBarConnection.pending.subscribe(function (progress) {
                            setTimeout(function () {
                                console.log('progressStar: ', progress);
                                //console.log('instance: ', ProgressIndicator._loadingBarComponentInstance);
                                if (ProgressIndicator._loadingBarComponentInstance) {
                                    if (progress.started)
                                        ProgressIndicator._loadingBarComponentInstance.start();
                                    if (progress.completed)
                                        ProgressIndicator._loadingBarComponentInstance.complete();
                                }
                            }, 10);
                        });
                        return [core_1.provide(http_1.XHRBackend, { useClass: LoadingBarBackend })];
                    },
                    enumerable: true,
                    configurable: true
                });
                return ProgressIndicator;
            })();
            exports_1("ProgressIndicator", ProgressIndicator);
            LoadingBar = (function () {
                function LoadingBar(_renderer) {
                    this._renderer = _renderer;
                    this._autoIncrement = true;
                    this._includeSpinner = true;
                    this._includeBar = true;
                    this._latencyThreshold = 10;
                    this._startSize = 0.02;
                    this._started = false;
                    this._status = 0;
                    //this.createView(this._renderer);
                    ProgressIndicator._loadingBarComponentInstance = this;
                }
                LoadingBar.prototype.ngAfterViewInit = function () {
                    //debugger;
                    this.hide(this._loadingBarContainer);
                    this.hide(this._spinner);
                    //debugger;
                    this.start();
                };
                LoadingBar.prototype.createView = function (renderer) {
                    debugger;
                    var body = renderer.selectRootElement('h1');
                    //this._spinner = renderer.createElement(body, 'div');
                    //renderer.setElementAttribute(this._spinner, "id", "loading-bar-spinner");
                    //let spinnerIcon = renderer.createElement(this._spinner, 'div');
                    //renderer.setElementAttribute(spinnerIcon, "class", "spinner-icon");
                };
                /**
                 * Inserts the loading bar element into the dom, and sets it to 2%
                 */
                LoadingBar.prototype.start = function () {
                    var _this = this;
                    this._startTimeout = setTimeout(function () {
                        clearTimeout(_this._completeTimeout);
                        // do not continually broadcast the started event:
                        if (_this._started) {
                            return;
                        }
                        _this._started = true;
                        if (_this._includeBar) {
                            _this.show(_this._loadingBarContainer);
                        }
                        if (_this._includeSpinner) {
                            _this.show(_this._spinner);
                        }
                        _this.set(_this._startSize);
                    }, this._latencyThreshold);
                };
                /**
                 * Set the loading bar's width to a certain percent.
                 *
                 * @param n any value between 0 and 1
                 */
                LoadingBar.prototype.set = function (n) {
                    var _this = this;
                    if (!this._started) {
                        return;
                    }
                    var pct = (n * 100) + '%';
                    this.setElementStyle(this._loadingBar, "width", pct);
                    this._status = n;
                    // increment loadingbar to give the illusion that there is always
                    // progress but make sure to cancel the previous timeouts so we don't
                    // have multiple incs running at the same time.
                    if (this._autoIncrement) {
                        clearTimeout(this._incTimeout);
                        this._incTimeout = setTimeout(function () {
                            _this.inc();
                        }, 250);
                    }
                };
                /**
                 * Increments the loading bar by a random amount
                 * but slows down as it progresses
                 */
                LoadingBar.prototype.inc = function () {
                    if (this._status >= 1) {
                        return;
                    }
                    var rnd = 0;
                    // TODO: do this mathmatically instead of through conditions
                    var stat = this._status;
                    if (stat >= 0 && stat < 0.25) {
                        // Start out between 3 - 6% increments
                        rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
                    }
                    else if (stat >= 0.25 && stat < 0.65) {
                        // increment between 0 - 3%
                        rnd = (Math.random() * 3) / 100;
                    }
                    else if (stat >= 0.65 && stat < 0.9) {
                        // increment between 0 - 2%
                        rnd = (Math.random() * 2) / 100;
                    }
                    else if (stat >= 0.9 && stat < 0.99) {
                        // finally, increment it .5 %
                        rnd = 0.005;
                    }
                    else {
                        // after 99%, don't increment:
                        rnd = 0;
                    }
                    var pct = this._status + rnd;
                    this.set(pct);
                };
                LoadingBar.prototype.complete = function () {
                    var _this = this;
                    this.set(1);
                    clearTimeout(this._completeTimeout);
                    clearTimeout(this._startTimeout);
                    // Attempt to aggregate any start/complete calls within 500ms:
                    this._completeTimeout = setTimeout(function () {
                        _this.hide(_this._loadingBarContainer);
                        _this.hide(_this._spinner);
                    }, 500);
                };
                LoadingBar.prototype.show = function (el) {
                    this.setElementStyle(el, "display", "block");
                };
                LoadingBar.prototype.hide = function (el) {
                    this.setElementStyle(el, "display", "none");
                };
                LoadingBar.prototype.setElementStyle = function (el, styleName, styleValue) {
                    this._renderer.setElementStyle(el.nativeElement, styleName, styleValue);
                };
                __decorate([
                    core_1.ViewChild('loadingBarSpinner'), 
                    __metadata('design:type', Object)
                ], LoadingBar.prototype, "_spinner");
                __decorate([
                    core_1.ViewChild('loadingBarContainer'), 
                    __metadata('design:type', Object)
                ], LoadingBar.prototype, "_loadingBarContainer");
                __decorate([
                    core_1.ViewChild('loadingBar'), 
                    __metadata('design:type', Object)
                ], LoadingBar.prototype, "_loadingBar");
                LoadingBar = __decorate([
                    core_1.Component({
                        selector: 'loading-bar',
                        template: "\n        <div id=\"loading-bar-spinner\" #loadingBarSpinner><div class=\"spinner-icon\"></div></div>\n        <div id=\"loading-bar\" #loadingBarContainer><div class=\"bar\" #loadingBar><div class=\"peg\"></div></div></div>\n    ",
                        styles: ["\n        /* Make clicks pass-through */\n        #loading-bar,\n        #loading-bar-spinner {\n          pointer-events: none;\n          -webkit-pointer-events: none;\n          -webkit-transition: 350ms linear all;\n          -moz-transition: 350ms linear all;\n          -o-transition: 350ms linear all;\n          transition: 350ms linear all;\n        }\n\n        #loading-bar.ng-enter,\n        #loading-bar.ng-leave.ng-leave-active,\n        #loading-bar-spinner.ng-enter,\n        #loading-bar-spinner.ng-leave.ng-leave-active {\n          opacity: 0;\n        }\n\n        #loading-bar.ng-enter.ng-enter-active,\n        #loading-bar.ng-leave,\n        #loading-bar-spinner.ng-enter.ng-enter-active,\n        #loading-bar-spinner.ng-leave {\n          opacity: 1;\n        }\n\n        #loading-bar .bar {\n          -webkit-transition: width 350ms;\n          -moz-transition: width 350ms;\n          -o-transition: width 350ms;\n          transition: width 350ms;\n\n          background: #29d;\n          position: fixed;\n          z-index: 10002;\n          top: 0;\n          left: 0;\n          width: 100%;\n          height: 2px;\n          border-bottom-right-radius: 1px;\n          border-top-right-radius: 1px;\n        }\n\n        /* Fancy blur effect */\n        #loading-bar .peg {\n          position: absolute;\n          width: 70px;\n          right: 0;\n          top: 0;\n          height: 2px;\n          opacity: .45;\n          -moz-box-shadow: #29d 1px 0 6px 1px;\n          -ms-box-shadow: #29d 1px 0 6px 1px;\n          -webkit-box-shadow: #29d 1px 0 6px 1px;\n          box-shadow: #29d 1px 0 6px 1px;\n          -moz-border-radius: 100%;\n          -webkit-border-radius: 100%;\n          border-radius: 100%;\n        }\n\n        #loading-bar-spinner {\n          display: block;\n          position: fixed;\n          z-index: 10002;\n          top: 10px;\n          left: 10px;\n        }\n\n        #loading-bar-spinner .spinner-icon {\n          width: 14px;\n          height: 14px;\n\n          border:  solid 2px transparent;\n          border-top-color:  #29d;\n          border-left-color: #29d;\n          border-radius: 50%;\n\n          -webkit-animation: loading-bar-spinner 400ms linear infinite;\n          -moz-animation:    loading-bar-spinner 400ms linear infinite;\n          -ms-animation:     loading-bar-spinner 400ms linear infinite;\n          -o-animation:      loading-bar-spinner 400ms linear infinite;\n          animation:         loading-bar-spinner 400ms linear infinite;\n        }\n\n        @-webkit-keyframes loading-bar-spinner {\n          0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }\n          100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n        }\n        @-moz-keyframes loading-bar-spinner {\n          0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }\n          100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }\n        }\n        @-o-keyframes loading-bar-spinner {\n          0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }\n          100% { -o-transform: rotate(360deg); transform: rotate(360deg); }\n        }\n        @-ms-keyframes loading-bar-spinner {\n          0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }\n          100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }\n        }\n        @keyframes loading-bar-spinner {\n          0%   { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }"]
                    }), 
                    __metadata('design:paramtypes', [core_1.Renderer])
                ], LoadingBar);
                return LoadingBar;
            })();
            exports_1("LoadingBar", LoadingBar);
            LoadingBarConnection = (function () {
                function LoadingBarConnection(req, browserXHR, baseResponseOptions) {
                    this.baseConnection = new http_1.XHRConnection(req, browserXHR, baseResponseOptions);
                    LoadingBarConnection.requestStarted();
                    this.response.subscribe(function () {
                        LoadingBarConnection.requestEnded();
                    });
                }
                LoadingBarConnection.requestStarted = function () {
                    var started = (LoadingBarConnection._pendingRequests == 0);
                    LoadingBarConnection._pendingRequests++;
                    LoadingBarConnection._observer.next({
                        started: started,
                        pendingRequests: LoadingBarConnection._pendingRequests
                    });
                };
                LoadingBarConnection.requestEnded = function () {
                    var completed = (LoadingBarConnection._pendingRequests == 1);
                    LoadingBarConnection._pendingRequests--;
                    LoadingBarConnection._observer.next({
                        completed: completed,
                        pendingRequests: LoadingBarConnection._pendingRequests
                    });
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
        }
    }
});
