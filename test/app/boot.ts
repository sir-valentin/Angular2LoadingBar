/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {AppService} from './app.service'
import {LoadingBar} from 'src/loading.bar';
import {HTTP_PROVIDERS} from 'angular2/http';

import {NgZone, ZeroArgFunction, ErrorHandlingFn, NgZoneError} from 'angular2/core';

bootstrap(AppComponent, [ AppService, LoadingBar.HTTP_PROVIDERS ]);
//zone.run()
