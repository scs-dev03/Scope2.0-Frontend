import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardSchedulerService {
  private apiurl: any =
  'http://web36.185.238.new.ocpwebserver.com/api/v1/dashboardscheduler/';

private apiurlmaster: any =
  'http://web36.185.238.new.ocpwebserver.com/api/v1/';

  

//  private apiurl: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/dashboardscheduler/';

// private apiurlmaster: any =
//   'https://6mztnd0t-3000.inc1.devtunnels.ms/api/v1/';


constructor(private http: HttpClient) {}
// userId: any = 143565;
// bintid_pk: any = this.userId;

// setLocalStorage() {
//   localStorage.setItem('userid', this.userId);
// }
getDashboard(data: any): Observable<any> {
  return this.http.post(
    `${this.apiurlmaster}dashboardscheduler/getdashboard`,
    data
  );
}
getDealersMaster(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}getdealers`, data);
}
setDashboardSchedule(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}setschedule`, data);
}
getDashboardSchedule(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}getrequests`,data);
}
getEditDashboard(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}editschedule`, data);
}
getDeletDashboard(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}delrequest`, data);
}
getBrandMaster(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}getbrands`,data);
}
getDashboardRequest(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}getnewdashboard`, data);
}
setNewDashboard(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}newdashboard`, data);
}
getWorkSpace(): Observable<any> {
  return this.http.get(`${this.apiurlmaster}Master/workspaces`);
}
getDashboardMaster(): Observable<any> {
  return this.http.get(`${this.apiurlmaster}Master/dashboards`);
}
getRequestedBy(): Observable<any> {
  return this.http.get(`${this.apiurl}requestby`);
}
submitChangeLog(data: any): Observable<any> {
  return this.http.post(`${this.apiurl}changelog`, data);
}
getChangeview(): Observable<any> {
  return this.http.get(`${this.apiurl}changelogview`);
}
getDashboardRequestView(): Observable<any> {
  return this.http.get(`${this.apiurl}newdashboardview`);
}
getBDM(): Observable<any> {
  return this.http.get(`${this.apiurl}getbdm`);
}
}
