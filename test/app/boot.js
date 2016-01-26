System.register(['angular2/platform/browser', './app.component', './app.service', 'angular2/http', 'src/loading.bar'], function(exports_1) {
    var browser_1, app_component_1, app_service_1, http_1, loading_bar_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (loading_bar_1_1) {
                loading_bar_1 = loading_bar_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [app_service_1.AppService, http_1.HTTP_PROVIDERS, loading_bar_1.LOADING_BAR_PROVIDERS]);
        }
    }
});
