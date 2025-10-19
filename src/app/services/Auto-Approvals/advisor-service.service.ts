import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvisorServiceService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }


  BulkUploadAdvisor(data: any) {
    return this.http.post(`${this.apiurl}advisorupload`, data)
  }

  getlocationMaster(data: any) {
    return this.http.post(`${this.apiurlmaster}locations`, data)
  }

  getAdvisorViewData(data: any) {
    return this.http.post(`${this.apiurl}viewadvisor`, data)
  }

  CreateAdvisor(data: any) {
    return this.http.post(`${this.apiurl}addadvisor`, data)
  }

  updateAdvisorStatusAndData(data: any): Observable<any> {
    return this.http.put(`${this.apiurl}advisor`, data)
  }


}
