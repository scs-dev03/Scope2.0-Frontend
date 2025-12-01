import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {

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

  getDealersMasterMulti(data: any): Observable<any> {
    return this.http.post(`${this.apiurlmaster}multi-dealer`, data);
  }
  getlocationMasterMulti(data: any) {
    return this.http.post(`${this.apiurlmaster}/multi-location`, data)
  }

  getUsersData(){
    return this.http.get(`${this.apiurlmaster}user`)
  }




}
