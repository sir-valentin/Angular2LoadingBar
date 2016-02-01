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
            this.http.get('http://localhost/SharedLibrary.Demo/SharedLibrary.FormBuilder/FormBuilder/LoadFormConfig?configId=-1').subscribe((html) => {
                resolve(html.text());
            });
        });
    }
}