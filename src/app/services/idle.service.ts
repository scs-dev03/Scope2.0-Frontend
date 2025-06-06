import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private warningTimer: any;
  private logoutTimer: any;
  private warningTime = 4 * 60 * 1000; // 4 minutes
  private logoutTime = 5 * 60 * 1000;  // 5 minutes

  constructor(private router: Router, private zone: NgZone) {
    this.startWatching();
  }

  private resetTimer(): void {
    clearTimeout(this.warningTimer);
    clearTimeout(this.logoutTimer);

    // Show warning at 4 minutes
    this.warningTimer = setTimeout(() => {
      this.showWarning();
    }, this.warningTime);

    // Auto logout at 5 minutes
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, this.logoutTime);
  }

  private startWatching(): void {
    this.zone.runOutsideAngular(() => {
      ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
        window.addEventListener(event, () =>
          this.zone.run(() => this.resetTimer())
        );
      });
    });

    this.resetTimer(); // Start timer initially
  }

  private showWarning(): void {
    const confirmStay = window.confirm(
      'You have been inactive for 4 minutes. You will be logged out in 1 minute. Do you want to stay logged in?'
    );

    if (confirmStay) {
      this.resetTimer(); // user is active again
    }
  }

  private logout(): void {
    // Clear local/session storage if needed
    if(localStorage.getItem('usertype')=='A')
  {
window.location.href = 'http://web13.185.238.new.ocpwebserver.com/uad_sc_wac/Login.aspx';
  }else{
    
    window.location.href = 'http://web13.185.238.new.ocpwebserver.com/uap_sc/Login.aspx';
  }
   localStorage.clear();
   sessionStorage.clear();
  }
}
