import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TocService {


  private  apiUrl=environment.apiUrl;

//  private const  apiUrl=environment.apiUrl
  constructor(private http:HttpClient) { }


  uploadToc(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}toc/upload`,data);
  }

  uploadBulkToc(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}toc/bulk`,data);
  }

  getRecords(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}toc/records`,data)
  }

}
