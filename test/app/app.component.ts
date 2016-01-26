/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {Component} from 'angular2/core';
import {AppService} from './app.service'

@Component({
    selector: 'my-app',
    template: `
        <h1>LoadingBar Test App</h1>
        {{ html }}
    `
})
export class AppComponent {
    public html:string;

    constructor(private _service:AppService) {
        this._service.getSomeData().then((html:string) => {
            this.html = html;
        });
    }
}