import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterSaleService {
private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }


  
  getOrderType(){
    
    return this.http.get(`${this.apiurlmaster}ordertype`)

  }
  
  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }

  getPartyNameAndCode(data:any){
    return this.http.post(`${this.apiurl}viewparty`,data)
  }

  BulkUploadCounterSale(data:any): Observable<any>{
    return this.http.post(`${this.apiurl}stkupload-cs`,data)
  }

  SingleAddCounterSale(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}addstk-cs`,data)
  }

  sendOrderRequest(data: any){
    return this.http.post(`${this.apiurl}insert`,data)
  }

  getGroupStockData(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}group-stock`,data)
  }

  getNonMovingData(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}non-moving`,data)
  }

}
