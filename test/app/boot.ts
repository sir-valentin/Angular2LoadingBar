/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {AppService} from './app.service'
import {HTTP_PROVIDERS} from 'angular2/http';
import {LoadingBar} from 'src/loading.bar';

bootstrap(AppComponent, [
    AppService, HTTP_PROVIDERS,
    LoadingBar.provider
]);
