import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RuleCreationService {

  private apiurlmaster: any =
    'http://web36.185.238.new.ocpwebserver.com/api/v1/master/';

  constructor(private http: HttpClient) { }


  fetchBrand(): Observable<any> {
    return this.http.get(`${this.apiurlmaster}brands`)
  }
}
