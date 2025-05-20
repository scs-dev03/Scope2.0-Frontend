import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DealerUserServiceService {

  private url:any=environment.apiUrl;
private allUserDataSubject=new BehaviorSubject<any>(null);
allUserData$=this.allUserDataSubject.asObservable();

  constructor(private http:HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get(`${this.url}user/get-dealer-user`)
  }

  createUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/create-dealer-user`,data)
  }

  viewUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/view-dealer-user`,data);
  }

  deleteUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/delete-dealer-user`,data);
  }

  editUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/edit-dealer-user`,data);
  }

  // requestNewMail(data:any):Observable<any>{
  //   return this.http.post(`${this.url}user/request-new-mail`,data)
  // }
}
