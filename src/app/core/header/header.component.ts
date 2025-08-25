import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';

@Component({
  selector: 'app-header',
  imports: [SHARED_IMPORTS,
    SharedModule,
    PrimengModuleModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  isLoginPage = false;



  visibleSidebar: boolean = true;

  toggleSidebar() {
    this.visibleSidebar = !this.visibleSidebar;
    //this.sidebarService.toggle();
  }



  redirectToLegacyScope() {
    if (localStorage.getItem('usertype') == 'A') {
      window.location.href = 'https://scope.sparecare.in/UAD_SC_WAC/home.aspx';
    }
    else {
      window.location.href = 'https://scope.sparecare.in/UAP_SC/home.aspx';
    }
  }

}
