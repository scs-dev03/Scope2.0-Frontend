import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuleViewManageService {
  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }

  fetchBrand(): Observable<any> {
    return this.http.get(`${this.apiurlmaster}brands`)
  }
  fetchDealer(data: any): Observable<any> {
    return this.http.post(`${this.apiurlmaster}dealers`, data)
  }
  fetchLocation(data: any): Observable<any> {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }

  fetchRule(data: any) {
    return this.http.post(`${this.apiurl}rule-mappings`, data)
  }
  
  FetchViewRuleData(data:any): Observable<any>{
    return this.http.post(`${this.apiurl}view-rule`,data)
  }

  FetchRule():Observable<any>{
    return this.http.get(`${this.apiurl}view-rules`)
  }


  EditPriority(data:any):Observable<any>{
    return this.http.put(`${this.apiurl}modify-priority`,data)
  }

  

}
