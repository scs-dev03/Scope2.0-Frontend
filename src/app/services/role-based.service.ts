import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleBasedService {

  private apiUrl:any=environment.apiUrl
  constructor(private http:HttpClient
  ) { }


  createRole(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/create`,data)
  }

  viewRole():Observable<any>{
    return this.http.get(`${this.apiUrl}roles/view`)
  }

  editRole(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/edit`,data)
  }

  deleteRole(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/delete`,data)
  }

  downloadRoleFormat(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/download-role-format`, { responseType: 'blob',data:data })
  }

  uploadRoleFormat(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/upload-role`,data)
  }

  getModules():Observable<any>{
    return this.http.get(`${this.apiUrl}sidebar/module`)
  }

  getModulesBasedOnBVID(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/access-setting-on-BVID`,data);
  }

  getEditModulesBasedOnBVID(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}roles/edit-access-setting-on-BVID`,data);
  }
}
