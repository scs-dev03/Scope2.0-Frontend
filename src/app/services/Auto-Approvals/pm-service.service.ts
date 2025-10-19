import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PmServiceService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }


  BulkUploadParty(data: any) {
    return this.http.post(`${this.apiurl}partyupload`, data)
  }

  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }

  getPartyViewData(data: any) {
    return this.http.post(`${this.apiurl}viewparty`,data)
  }

  CreateParty(data: any) {
    return this.http.post(`${this.apiurl}addparty`, data)
  }

  UpdatePartyStatusAndData(data: any): Observable<any> {
    return this.http.put(`${this.apiurl}party`, data)
  }

}
