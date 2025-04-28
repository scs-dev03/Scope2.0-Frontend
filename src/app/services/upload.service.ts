import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

 private url:any=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getUploadedDetails(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/uploaded-data`,data)
  }

  uploadData(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/upload`,data)
  }

  uploadLogs(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/uploaded-logs`,data)
  }

  deleteUploadedData(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/delete-uploaded-data`,data);
  }

  downloadBrandFormat(data:any):Observable<Blob>{
    return this.http.post(`${this.url}leadtime/download-brand`,data, { responseType: 'blob' });
  }

  // downloadZip(): Observable<Blob> {
  //   return this.http.get(this.apiUrl, { responseType: 'blob' });
  // }

  // downloadAndSaveZip() {
  //   this.downloadZip().subscribe((blob) => {
  //     saveAs(blob, 'files.zip');
  //   }, (error) => {
  //     console.error('Error downloading the zip file', error);
  //   });
  // }
}
