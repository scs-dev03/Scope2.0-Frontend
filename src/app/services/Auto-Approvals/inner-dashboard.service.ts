import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InnerDashboardService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }

  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }


  getOrderType() {
    return this.http.get(`${this.apiurlmaster}ordertype`)
  }


  getDashboardData(data: any): Observable<any> {
    return this.http.post(`${this.apiurl}dashboard`, data);
  } 

}
