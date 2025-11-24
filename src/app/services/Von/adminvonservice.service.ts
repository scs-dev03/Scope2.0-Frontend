import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminvonserviceService {

  // private apiurl: any = 'https://scopeapi.sparecare.in/api/v1/von/';

  // private apiurlmaster: any =
  //   'https://scopeapi.sparecare.in/api/v1/master/';

    private apiurl: any =
     `${environment.EnvApiUrlMaster}von/`;
   
   private apiurlmaster: any =
     `${environment.EnvApiUrlMaster}master/`;
   
//  private apiurl: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/von/';

// private apiurlmaster: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/master/';

    // usertype: any = "A"
    // userid: any = '146297'
  // setlocalStorage(){
  //   localStorage.setItem('usertype',this.usertype)
  //   localStorage.setItem('userid',this.userid)

  // }

  constructor(private http: HttpClient) {}

  getBrandMaster(): Observable<any> {
    return this.http.get(`${this.apiurlmaster}brands`);
  }

  getDealersMaster(data: any): Observable<any> {
    return this.http.post(`${this.apiurlmaster}dealers`, data);
  }
  getlocationMaster(data:any){
    return this.http.post(`${this.apiurlmaster}locations`,data)
  }
  
  getModel(data: any){
    return this.http.post(`${this.apiurlmaster}model`,data)
  }
  getNature(){
    return this.http.get(`${this.apiurlmaster}nature`)
  }
  getdelarTableView(data:any){
    return this.http.post(`${this.apiurl}view`,data)
  }
  getseason(){
    return this.http.get(`${this.apiurlmaster}seasonal`)
  }
  getAdminViewData(data:any){
    return this.http.post(`${this.apiurl}viewuser`,data)
  }

  newRemarkCreation(data: any){
    return this.http.post(`${this.apiurl}newremark`,data)
  }
  getAdminRemark(data:any){
    return this.http.post(`${this.apiurl}remark`,data)
  }
  submitAdminlog(data:any){
    return this.http.post(`${this.apiurl}adminlog`,data)
  }
  getAdminViewLog(data:any){
    return this.http.post(`${this.apiurl}viewlog`,data)
  }
  getPartType(){
    return this.http.get(`${this.apiurlmaster}parttype`)
  }
  getViewRemark(data: any){
    return this.http.post(`${this.apiurl}viewremark`,data)
  }
  getSubstitutePart(data: any){
    return this.http.post(`${this.apiurl}partfamily`,data)
  }

  getPartFamilySales(data: any){
    return this.http.post(`${this.apiurl}partfamilysale`,data)
  }

  getPendingCount(){
    return this.http.get(`${this.apiurl}countpending`)
  }

  getAdminPendinview(data:any){
    return this.http.post(`${this.apiurl}adminpendingview`,data)
  }

  
  uploadExcelDealer(data:any){
    return this.http.post(`${this.apiurl}upload`,data)
  }

  AdminuploadExcel(data:any){
    return this.http.post(`${this.apiurl}aupload`,data)
  }

  getFullMaxAdmin(data:any){
    return this.http.post(`${this.apiurl}viewadmin`,data)
  }

}
