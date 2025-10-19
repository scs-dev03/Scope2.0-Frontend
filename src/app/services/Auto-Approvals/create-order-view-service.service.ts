import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderViewServiceService {

  private apiurl: any =
     `${environment.EnvApiUrlMaster}aa/`;
   
   private apiurlmaster: any =
     `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }


  BulkUploadVehicle(data:any){
    return this.http.post(`${this.apiurl}vehicleupload`,data)
  }
  BulkUploadWorkShop(data:any){
    return this.http.post(`${this.apiurl}stkupload-ws`,data)
  }
}
