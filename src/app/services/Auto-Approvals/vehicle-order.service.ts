import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleOrderService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }

  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }


  getAdvisor(data: any) {
    return this.http.post(`${this.apiurl}viewadvisor`, data)
  }

  getOrderType() {

    return this.http.get(`${this.apiurlmaster}ordertype`)

  }
  getJobCardType() {
    return this.http.get(`${this.apiurlmaster}jobtype`)
  }

  VehicleUploadBulk(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}vehicleupload`,data)
  }

  sendSingleAddData(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}add-vehicle`,data)
  }

  sendMultiData(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}multi-vehicle`,data)
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
