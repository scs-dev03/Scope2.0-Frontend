import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InnerdashboardserviceService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }

  getBrandMaster(): Observable<any> {
    return this.http.get(`${this.apiurlmaster}brands`);
  }

  getDealersMaster(data: any): Observable<any> {
    return this.http.post(`${this.apiurlmaster}dealers`, data);
  }
  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }

  getOrderType() {
    return this.http.get(`${this.apiurlmaster}ordertype`)
  }


  getDashboardData(data: any): Observable<any> {
    return this.http.post(`${this.apiurl}admin/dashboard`, data);
  }
  getBrandWiseDashboardData():Observable<any>{
    return this.http.get (`${this.apiurl}admin/dashboard`);
  }
}
