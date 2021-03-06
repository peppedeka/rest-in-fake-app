import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from './../../environments/environment';

import { Project } from './../../interface/project.interface';

@Injectable()
export class DataService {
  baseUrl: string;
  constructor(private _http: HttpClient) {
    this.baseUrl = environment.apiConfig.baseUrl;
  }

  doGet(url: string): Observable<any> {
    return this._http.get(this.baseUrl + url);
  }

  doPost(url: string, param: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this._http.post(this.baseUrl + url + '/', param, { headers: headers });
  }
  doPut(url: string, param: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this._http.put(this.baseUrl + url + '/', param, { headers: headers });
  }
  doDelete(url: string, id: string): Observable<any> {
    return this._http.delete(this.baseUrl + url + '/' + id);
  }

  getProject(): Observable<Project[]> {
    return <Observable<Project[]>>this.doGet(environment.data.project);
  }
  getProjectDetails(project: string): Observable<Project> {
    return this.doGet('project-details/' + project);
  }
  getAPIDetails(api: string): Observable<any[]> {
    return this.doGet('api/' + api);
  }
  getFakeApi(project: string, api: string) {
    return this.doGet(project + '/' + api);
  }
  getObj(obj: string) {
    return this.doGet('obj/' + obj);
  }
  postProject(param: string): Observable<any> {
    return this.doPost(environment.data.project, param);
  }

  deleteProject(id: string): Observable<any> {
    return this.doDelete(environment.data.project, id);
  }
  saveElement(type: string, obj: object) {
    if (type === 'object') {
      type = 'obj';
    }
    return this.doPut(type + '/' + obj['name'], JSON.stringify(obj));
  }
}
