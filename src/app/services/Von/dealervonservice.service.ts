import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DealervonserviceService {
  private apiurl: any =
  'http://web10.185.238.new.ocpwebserver.com/api/v1/von/';

private apiurlmaster: any =
  'http://web10.185.238.new.ocpwebserver.com/api/v1/master/';

//    private apiurl: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/von/';

// private apiurlmaster: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/master/';

dealerId: any = 8
brandID: any = 9
locationid: any = 14
usertype: any = "U"
// setLocalStorage(){
//   localStorage.setItem('dealerid',this.dealerId);
//   localStorage.setItem('brandid',this.brandID)
//   localStorage.setItem('usertype',this.usertype)
//   localStorage.setItem('locationid',this.locationid)
// }
constructor(private http: HttpClient) { }

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
  return this.http.post(`${this.apiurl}viewuser`,data)
}
getseason(){
  return this.http.get(`${this.apiurlmaster}seasonal`)
}
submituserlog(data:any){
  return this.http.post(`${this.apiurl}userlog`,data)
}
getDealerRemark(data:any){
  return this.http.post(`${this.apiurl}remark`,data)
}
getDealerViewLog(data:any){
  return this.http.post(`${this.apiurl}viewlog`,data)
}
getPartType(){
  return this.http.get(`${this.apiurlmaster}parttype`)
}
getSubstitutePart(data: any){
  return this.http.post(`${this.apiurl}partfamily`,data)
}

getPartFamilySales(data: any){
  return this.http.post(`${this.apiurl}partfamilysale`,data)
}
}
