import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
//   private apiurl: any =
//   'https://scopeapi.sparecare.in/api/v1/von/';

// private apiurlmaster: any =
//   'https://scopeapi.sparecare.in/api/v1/master/';
  private apiurl: any =
       `${environment.EnvApiUrlMaster}von/`;
     
     private apiurlmaster: any =
       `${environment.EnvApiUrlMaster}master/`;

// private apiurlmaster: any =
//   'http://localhost:3000/api/v1/master/';
//  private apiurl: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/von/';

// private apiurlmaster: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/master/';


    constructor(private http: HttpClient) {}

    getuserinfo(data:any): Observable<any>{
      return this.http.post(`${this.apiurlmaster}userinfo`,data)
    }

    getcardsdata(data: any): Observable<any>{
      return this.http.post(`${this.apiurlmaster}home`,data)
    } 
    
    getlocationMaster(data:any){
      return this.http.post(`${this.apiurlmaster}locations`,data)
    }
}
