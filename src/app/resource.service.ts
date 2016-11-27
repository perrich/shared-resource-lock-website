import 'rxjs/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable }              from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable }              from 'rxjs/Observable';
import { BehaviorSubject }         from 'rxjs/BehaviorSubject';
import { Subject }                 from 'rxjs/Subject';

import { Config }   from './config'
import { Resource } from './resource';

@Injectable()
export class ResourceService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private url: string;

  private resources: Resource[];
  private observable: Observable<any>;

  dataChange: Subject<string> = new Subject<string>();

  constructor(private http: Http, private config:Config) {
    this.url = config.get('WS_baseUrl');  // URL to web api
    
    // Refresh cache every x milliseconds if something has changed
    Observable.timer(0, config.get('WS_refreshDelayMs'))
      .subscribe((x) => {
        this.fillCache().subscribe(a => a);
      });
  }
  
  getResources() : Observable<Resource[]> {
    if (this.resources) {
      return Observable.of(this.resources);
    } else if (this.observable) {
      return this.observable;
    } else {
      return this.fillCache();
    }
  }

  getResource(id: number): Observable<Resource> {
    let _todos = new BehaviorSubject<Resource>(new Resource()); 

    let obs: Observable<Resource> = new Observable<Resource>();
    this.getResources().subscribe(resources => {
      for (let resource of resources) {
        if (resource.id == id) {
          _todos.next(resource);
        }
      }
    });
    
    return _todos.asObservable();
  }

  update(resource: Resource): Observable<boolean> {
    const url = `${this.url}/${resource.type}/${resource.name}`;
    return this.http.put(url, JSON.stringify(resource), {headers: this.headers})
        .map((response: Response) => {
          if (response.status == 200) {
            return this.manageUpdateResponse(response);
          }
          
          return false;
        }).share();
  }

  private fillCache() : Observable<Resource[]> {
    this.observable = this.http.get(this.url)
      .map((response: Response) => {
        this.observable = null;

        // only update if changed
        if (response.status == 200 && response.text() != JSON.stringify(this.resources)) {
          this.resources = this.convert(response.json());
          this.dataChange.next("resources");
          return this.resources;
        }
      })
      .catch(error => this.handleError(error))
      .share();
    
    return this.observable;
  }

  private convert(data: any) : Resource[]
  {
    let a = data as Resource[];
    return a;
  }

  private manageUpdateResponse(response: any) : boolean
  {
    let json = response.json();
    let changed = json.state != 'ERROR';

    if (changed) {
      this.fillCache().subscribe(a => a);
    }

    return changed;
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}