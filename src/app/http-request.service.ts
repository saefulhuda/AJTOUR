import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  constructor(private http: HttpClient) { }

  getRequest(param) {
    return this.http.get<any>(URL+param);
  }

  postRequest(url) {
    let param = new URLSearchParams();
    param.set('api_key', '414414');
    console.log(param);
    return this.http.post<any>(URL+url, param);
  }

  deleteRequest(url, param) {
  }
}
