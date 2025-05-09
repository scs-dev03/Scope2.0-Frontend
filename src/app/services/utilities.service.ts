import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  private url:any=environment.apiUrl;
  constructor(private http:HttpClient) { }

  private dataSource = new BehaviorSubject<any | null>(null);
  private dataSubject = new Subject<any>(); 
  // Observable to subscribe to data changes
  data1$=this.dataSubject.asObservable();
  data$ = this.dataSource.asObservable();
  getBrands():Observable<any>{
    return this.http.get(`${this.url}utilities/brands`);
  }

  singleUploadFile(data:any):Observable<any>{
    return this.http.post(`${this.url}utilities/upload`,data)
  }


  //lead-time
  // getLocations(data:any):Observable<any>{
  //   return this.httpClient.post(`${this.url}utilities/selected-locations`,data)
  // }
  getLocations(data:any):Observable<any>{
    return this.http.post(`${this.url}utilities/locations`,data)
  }

  getDealers(data:any):Observable<any>{
    return this.http.post(`${this.url}utilities/dealers`,data)
  }
  
  getRoles():Observable<any>{
    return this.http.get(`${this.url}utilities/roles`)
  }

  getDesignations():Observable<any>{
    return this.http.get(`${this.url}utilities/designations`)
  }

  getBusinessVertical():Observable<any>{
    return this.http.get(`${this.url}utilities/business-vertical`);
  }
  emitData(data: any): void {
    // console.log("data ",data);
    
    this.dataSubject.next(data);
  }

  exportExcel(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/export`,data,{ responseType: 'blob' })
  }

  exportFile(data: any) {
    this.exportExcel(data).subscribe(blob => {
      saveAs(blob, 'export.xlsx');  // Save the file with a custom name (e.g., 'export.xlsx')
    }, error => {
      console.error('Error exporting file:', error);
    });
  }

  getFileType(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/file-type`,data);
  }

   // Method to change the data (can be called by any component)
   showModal(data: any) {
    this.dataSource.next(data);
  }

  getUserInfo(data:any){
    return this.http.post(`${this.url}user/user-details`,data);
  }
}
