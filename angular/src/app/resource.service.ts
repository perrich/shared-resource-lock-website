import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { Config } from './config';
import { Resource } from './resource';

@Injectable()
export class ResourceService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url: string;
  private maxHoldingDelayInHours: number;

  private resources: Resource[];
  private observable: Observable<any>;

  dataChange: Subject<string> = new Subject<string>();

  constructor(private http: Http, private config: Config) {
    this.url = config.get('WS_baseUrl');  // URL to web api
    this.maxHoldingDelayInHours = config.get('maxHoldingDelayInHours');

    const delay = config.get('WS_refreshDelayMs');

    if (delay > 100) {
      // Refresh cache every x milliseconds if something has changed
      Observable.timer(0, delay)
        .subscribe((x) => {
          this.fillCache().subscribe(a => a);
        });
    }
  }

  getResources(): Observable<Resource[]> {
    if (this.resources) {
      return Observable.of(this.resources);
    } else if (this.observable) {
      return this.observable;
    } else {
      return this.fillCache();
    }
  }

  getResource(id: number): Observable<Resource> {
    const _todos = new BehaviorSubject<Resource>(new Resource());
    this.getResources().subscribe(resources => {
      for (const resource of resources) {
        if (resource.id === id) {
          _todos.next(resource);
        }
      }
    });

    return _todos.asObservable();
  }

  update(resource: Resource): Observable<boolean> {
    const url = this.url + '/' + resource.id;
    return this.http.put(url, JSON.stringify(resource), { headers: this.headers, withCredentials: true })
      .map((response: Response) => {
        if (response.status === 200) {
          return this.manageUpdateResponse(response);
        }

        return false;
      }).share();
  }

  lock(): Observable<boolean> {
    const url = this.url + '/lock/';
    return this.http.get(url, { withCredentials: true })
      .map(this.HandleJsonResponseWithStatus).share();
  }

  unlock(): Observable<boolean> {
    const url = this.url + '/unlock/force';
    return this.http.get(url, { withCredentials: true })
      .map(this.HandleJsonResponseWithStatus).share();
  }

  saveAll(resources: Resource[]): Observable<boolean> {
    const url = this.url + '/configure/';
    return this.http.put(url, JSON.stringify(resources), { headers: this.headers, withCredentials: true })
      .map(this.HandleJsonResponseWithStatus).share();
  }

  getOldResources(user: string | null): Resource[] {
    const results: Resource[] = [];
    const minDate = new Date();
    minDate.setHours(minDate.getHours() - this.maxHoldingDelayInHours);

    for (const resource of this.resources) {
      if ((resource.user === null || resource.user === user) && (resource.date !== null && new Date(resource.date) < minDate)) {
        results.push(resource);
      }
    }

    return results;
  }

  private HandleJsonResponseWithStatus(response: Response) {
    if (response.status === 200) {
      const json = response.json();
      return json.state !== 'ERROR';
    }

    return false;
  }

  private fillCache(): Observable<Resource[]> {
    this.observable = this.http.get(this.url + '/', { withCredentials: true })
      .map((response: Response) => {
        this.observable = null;

        // only update if changed
        if (response.status === 200) {
          if (response.text() !== JSON.stringify(this.resources)) {
            this.resources = this.convert(response.json());
            this.dataChange.next('resources');
          }
          return this.resources;
        }

        throw new Error('Invalid response');
      })
      .catch(error => this.handleError(error))
      .share();

    return this.observable;
  }

  private convert(data: any): Resource[] {
    const a = data as Resource[];
    return a;
  }

  private manageUpdateResponse(response: any): boolean {
    const json = response.json();
    const changed = json.state !== 'ERROR';

    if (changed) {
      this.fillCache().subscribe(a => a);
    }

    return changed;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
