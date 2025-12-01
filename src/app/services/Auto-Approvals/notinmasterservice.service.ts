import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotinmasterserviceService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }


  FetchNotInMasterAdmin(data:any){
    return this.http.post(`${this.apiurl}nim/view`,data)
  }

  SendAdminAction(data:any){
    return this.http.post(`${this.apiurl}nim/action`,data)
  }
}
