import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminReportServiceService {

  constructor(private http: HttpClient) {}
  //  private apiurl: any =
  //   'https://scopeapi.sparecare.in/api/v1/salesview/';

  // private apiurlmaster: any =
  //   'https://scopeapi.sparecare.in/api/v1/master/';
  private apiurl: any =
       `${environment.EnvApiUrlMaster}salesview/`;
     
     private apiurlmaster: any =
       `${environment.EnvApiUrlMaster}master/`;  
//   private apiurl: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/salesview/';

// private apiurlmaster: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/master/';

getBrandData(): Observable<any> {
  return this.http.get(`${this.apiurlmaster}brands`);
}

getDealerData(data: any): Observable<any> {
  return this.http.post(`${this.apiurlmaster}dealers`, data);
}
getLocaitonData(data: any): Observable<any> {
  return this.http.post(`${this.apiurlmaster}locations`, data);
}

getPartDescription(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}partdetails`, data);
}
getSalesInfo(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}ledger`, data);
}

}
