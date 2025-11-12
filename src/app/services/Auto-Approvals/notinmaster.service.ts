import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotinmasterService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }


  FetchPartNumber(data: any) {
    return this.http.post(`${this.apiurl}nim/view`, data)
  }

  SendNotInMaster(data: any) {
    return this.http.post(`${this.apiurl}nim/add`, data)
  }


  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }


  getHSNcode(){
    return this.http.get(`${this.apiurlmaster}hsncode`)
  }

  getParttype(){
    return this.http.get(`${this.apiurlmaster}parttype`)  
  }

  UploadNotInMaster(data:any){
    return this.http.post(`${this.apiurl}nim/upload`, data)
  }



}
