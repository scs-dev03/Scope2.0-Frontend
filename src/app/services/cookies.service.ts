import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(private cookieService:CookieService) { }

  // getCookie(name: string): string | undefined {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop()?.split(';').shift();
  //   console.log("parts ",parts)
  //   return undefined;
  // }
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
    return match
}
  // getCookiee(key:any) {
  //   const cookieValue = this.cookieService.get(key);
    
  //   console.log(cookieValue);
  //   return cookieValue
  // }
}
