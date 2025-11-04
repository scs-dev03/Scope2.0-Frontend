import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {

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

  getAdvisor(data: any) {
    return this.http.post(`${this.apiurl}viewadvisor`, data)
  }

  fetchViewOrderStatusData(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}view-os`,data)
  }

  SendYesOrNo(data:any):Observable<any>{
    return this.http.patch(`${this.apiurl}os/order`,data)
  }


  SendOrderRemark(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}os/re-order`,data)
  }





}
