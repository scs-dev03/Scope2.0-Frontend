import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemarkServiceService {

  private apiurl: any =
    `${environment.EnvApiUrlMaster}aa/remark/`;

  private apiurlmaster: any =
    `${environment.EnvApiUrlMaster}master/`;

  constructor(private http: HttpClient) { }

  SendRemarkData(data:any): Observable<any>{

    return this.http.post(`${this.apiurl}insert`, data)

  }

  fetchRemarkMaster(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}remarktype`,data)
  }

  
  FetchRemarkData(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}view`,data)
  }

  EditRemarkData(data:any){
    return this.http.post(`${this.apiurl}edit`,data)
  }

}
