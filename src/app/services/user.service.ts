import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private url:any=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get(`${this.url}user/get-user`)
  }

  createUser(data:any):Observable<any>{
    return this.http.post(`${this.url}user/create-user`,data)
  }

  viewUser():Observable<any>{
    return this.http.get(`${this.url}user/view-user`);
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
}
