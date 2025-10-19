import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private url:any=environment.apiUrl;
private allUserDataSubject=new BehaviorSubject<any>(null);
allUserData$=this.allUserDataSubject.asObservable();

  constructor(private http:HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get(`${this.url}user/get-user`)
  }

  createUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/create-user`,data)
  }

  viewUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/view-user`,data);
  }

  deleteUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/delete-user`,data);
  }

  editUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/edit-user`,data);
  }

  requestNewMail(data:any):Observable<any>{
    return this.http.post(`${this.url}user/request-new-mail`,data)
  }

  // loadDataOnce() {
  //   this.http.get(`${this.url}user/get-user`).subscribe((res:any) => {
  //     this.allUserDataSubject.next(res.data);
  //   });
  // }
}
