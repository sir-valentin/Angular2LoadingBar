/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class AppService {
    constructor(private http: Http) { }

    getSomeData() {
        return new Promise((resolve, reject) => {
            this.http.get('http://kendo.cdn.telerik.com/2016.1.112/js/kendo.all.min.js').subscribe((html) => {
                resolve(html.text());
            });
        });
    }
}