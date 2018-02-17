import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

/**
 * Configuration
 */
@Injectable()
export class Config {

    private config: Object;
    private configCustom: Object;

    constructor(private http: Http) {
    }

    /**
     * Load the configuration
     */
    load() {
        return new Promise((resolve, reject) => {
            this.http.get('/assets/config.json')
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

    /**
     * Get a configuration by key
     */
    get(key: any) {
        return this.config[key];
    }

    /**
     * Add a custom configuration
     */
    setCustom(key: any, val: any) {
        this.configCustom[key] = val;
    }

    /**
     * Get a custom configuration by key
     */
    getCustom(key: any) {
        return this.configCustom[key];
    }
}
