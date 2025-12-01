import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandWiseUserMappingServiceService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/bwum/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }


  SendBrandWiseUserMapping(data:any){
    return this.http.post(`${this.apiurl}mapping`,data)
  }

  FetchBrandwiseUserMapping(data:any){
    return this.http.post(`${this.apiurl}view`,data)
  }

  EditBrandWiseUserMapping(data:any){
     return this.http.post(`${this.apiurl}edit`,data)
  }



}
