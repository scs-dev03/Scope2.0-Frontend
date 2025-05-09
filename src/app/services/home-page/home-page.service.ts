import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  private apiurl: any =
  'http://web10.185.238.new.ocpwebserver.com/api/v1/von/';

// private apiurlmaster: any =
//   'http://web10.185.238.new.ocpwebserver.com/api/v1/master/';

private apiurlmaster: any =
  'http://localhost:3000/api/v1/master/';
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
