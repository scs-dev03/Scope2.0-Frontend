import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopSaleService {

private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }

  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }


  getOrderType(){
    return this.http.get(`${this.apiurlmaster}ordertype`)
  }

  SingleAddWorkShopSale(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}addstk-ws`,data)
  }

  BulkUploadWorkShopSale(data:any): Observable<any>{
    return this.http.post(`${this.apiurl}stkupload-ws`,data)
  }

  sendOrderRequest(data: any){
    return this.http.post(`${this.apiurl}insert`,data)
  }
}
