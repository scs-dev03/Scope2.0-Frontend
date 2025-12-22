import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RuleCreationService {

  private apiurl: any =
     `${environment.EnvApiUrlMaster}aa/`;
   
   private apiurlmaster: any =
     `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }




  fetchBrand(): Observable<any> {
    return this.http.get(`${this.apiurlmaster}brands`)
  }
  fetchDealer(data:any): Observable<any> {
    return this.http.post(`${this.apiurlmaster}dealers`,data)
  }
  fetchLocation(data:any): Observable<any> {
    return this.http.post(`${this.apiurlmaster}locations`,data)
  }
  fetchParameter(data:any): Observable<any>{
    return this.http.post(`${this.apiurl}parameterview`,data)
  }
  fetchBucket(): Observable<any>{
    return this.http.get(`${this.apiurl}bucketview`)
  }

  fetchOperator():Observable<any>{
    return this.http.get(`${this.apiurl}operatorview`)
  }

  CreateRule(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}add-rule`,data)
  }

  CreateRuleTemplate(data:any): Observable<any>{
    return this.http.post(`${this.apiurl}add-template`,data)
  }

  fetchRuleAction():Observable<any>{
    return this.http.get(`${this.apiurl}view-ruleoutput`)
  }


  FetchRemarkParameter():Observable<any>{
    return this.http.get(`${this.apiurl}remark-parameter`)
  }


  FetchPreDefinedParameter(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}parameter`,data)
  }
  
  




}
