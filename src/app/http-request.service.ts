import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  key:any;
  value: any;
  constructor(private http: HttpClient) { }

  generalGetRequest(url) {
    return this.http.get<any>(url);
  }

  getRequest(param) {
    return this.http.get<any>(URL+param);
  }

  postRequest(url, param) {
    let formData = new FormData();
    for(let list of param) {
      this.key = Object.keys(list);
      this.value = Object.values(list);
      formData.append(this.key , this.value);
    };
    return this.http.post<any>(URL+url, formData);
  }

  deleteRequest() {
  }

  putRequest() {

  }
}
