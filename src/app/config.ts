import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

@Injectable()
export class Config {

    private config: Object
    private configCustom: Object

    constructor(private http: Http) {
    }

    load() {
        return new Promise((resolve, reject) => {
            this.http.get('/config.php')
                .map(res => res.json())
                .catch((error: any) => {
                    console.error(error);
                    return Observable.throw(error.json().error || 'Server error');
                })
                .subscribe((data) => {
                    this.config = data;
                    resolve(true);
                });
        });
    }

    get(key: any) {
        return this.config[key];
    }

    setCustom(key: any, val: any) {
        this.configCustom[key] = val;
    }

    getCustom(key: any) {
        return this.configCustom[key];
    }
};
