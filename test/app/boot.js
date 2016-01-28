System.register(['angular2/platform/browser', './app.component', './app.service', 'src/loading.bar'], function(exports_1) {
    var browser_1, app_component_1, app_service_1, loading_bar_1;
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
            function (loading_bar_1_1) {
                loading_bar_1 = loading_bar_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [app_service_1.AppService, loading_bar_1.LoadingBar.HTTP_PROVIDERS]);
        }
    }
});
