import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private url:any=environment.apiUrl;
  constructor(private http:HttpClient) { }


  exportExcel(data:any): Observable<any> {
    return this.http.post(`${this.url}leadtime/export-multi`,data, { responseType: 'blob' });
  }

  downloadFormat(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/download-format`,data,{responseType:'blob'})
  }
  
  downloadLogs(data:any):Observable<any>{
    return this.http.post(`${this.url}leadtime/download-logs`,data,{responseType:'blob'})
  }

  // exportFile(data: any){
  //   this.downloadFormat(data).subscribe(blob => {
  //     saveAs(blob, 'export.xlsx');  // Save the file with a custom name (e.g., 'export.xlsx')
  //   }, error => {
  //     console.error('Error exporting file:', error);
  //   });
}
