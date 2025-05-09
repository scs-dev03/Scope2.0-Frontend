import { Component, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { SidebarComponent } from "./core/sidebar/sidebar.component";
import { HeaderComponent } from "./core/header/header.component";
import { CommonModule } from '@angular/common';
import { PrimengModuleModule } from './shared/primeng-module/primeng-module.module';
import { SharedModule } from './shared/shared.module';
import { BlockUI } from 'primeng/blockui';
import { GlobalBlockUiService } from './services/global-block-ui.service';
import { SidebarService } from './services/sidebar.service';
import { HomePageService } from './services/home-page/home-page.service';
import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule, SidebarComponent, HeaderComponent,CommonModule,SharedModule,PrimengModuleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-upload-frontend';
  visibleSidebar:boolean=true;
  isLoading:boolean=false;
  blocked:boolean=false;
  isLoginPage = false;
  @ViewChild('blockUI') blockUI!: BlockUI;
  @ViewChild('sidebar') sidebar!: SidebarComponent;
   token:any='0x020000002EB14F6A0A250DB388BEDD446A7DB9BBADD863F6293CC693258A5A69E6D8FBC7'
  constructor(private globalBlockUIService: GlobalBlockUiService,
    private router:Router, private route: ActivatedRoute,
    private renderer: Renderer2,
    public sidebarService: SidebarService,
    private utilitiesService:UtilitiesService,
  private homepageservice:HomePageService) {}

  ngOnInit() {
    // Set BlockUI reference in the global service
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
       
    //     if (event.urlAfterRedirects.includes('stock-upload')) {
    //       this.isLoading=true;  // Start loading for stock-upload route
    //     } else {
    //       this.isLoading=false;   // Stop loading for other routes
    //     }
    //   }
    // });
    this.globalBlockUIService.loading$.subscribe((loading:any)=>{
      this.isLoading=loading;
    })

    this.router.events.subscribe(() => {
      // Update whether the current route is the login page
      this.isLoginPage = this.router.url.includes('/login');
    });
    this.fetchUserinfo(this.token,'d');
  }

  updateLoaderHeight() {
    if (this.blockUI) {
      const contentHeight = document.documentElement.scrollHeight; // Full page height
      const viewportHeight = window.innerHeight; // Viewport height
      const viewportWidth = window.innerWidth; // Full screen width

      const newHeight = contentHeight > viewportHeight ? `${contentHeight}px` : '100vh';

      this.blockUI.el.nativeElement.style.height = newHeight;
      this.blockUI.el.nativeElement.style.width = `${viewportWidth}px`;
    }

    // if(this.sidebar){
    //   const contentHeight = document.documentElement.scrollHeight; // Full page height
    //   const viewportHeight = window.innerHeight; // Viewport height
    //   const viewportWidth = window.innerWidth; // Full screen width

    //   const newHeight = contentHeight > viewportHeight ? `${contentHeight}px` : '100vh';

    //   this.blockUI.el.nativeElement.style.height = newHeight;
    //   this.blockUI.el.nativeElement.style.width = `${viewportWidth}px`;
    // }
  }

  ngAfterViewInit() {
    this.updateLoaderHeight();
    window.addEventListener('resize', () => this.updateLoaderHeight());
  }
  ngAfterContentChecked() {
    this.updateLoaderHeight(); // Adjust height when content updates
  }

  toggleSidebar() {
    this.visibleSidebar = !this.visibleSidebar;
    this.sidebarService.toggle();
  }

  fetchUserinfo(usertoken:any,usertype:any){
    // console.log('fetch method',usertoken);
    // console.log('fetch method',usertype);
    
    //this.isloading = true
    // this.homepageservice.getuserinfo({ token: usertoken, usertype: usertype }).subscribe({
    //   next: (res: any) => {
    //    // console.log(res.Data);
    //     localStorage.setItem('userId',res.Data[0].UserId)
    //     if (usertype == 'd') {
    //       localStorage.setItem('brandid', res.Data[0].BrandID);
    //       localStorage.setItem('dealerid', res.Data[0].dealerid);
    //       localStorage.setItem('username', res.Data[0].username);
    //     }
    
    //     if (usertype == 'a') {
    //       localStorage.setItem('username', res.Data[0].username);
    //       localStorage.setItem('userid', res.Data[0].bintid_pk);
    //       localStorage.setItem('designation', res.Data[0].designation);
    //     }
    
    //  //   this.isloading = false;
    //   //  this.goToHomePage();
    //   },
    //   error: (err) => {
    //   //  console.error('Error fetching user info:', err);
    //   //  this.isloading = false;
    
    //     // Optional: show user-friendly message
    //     alert('Something went wrong while fetching user info. Please try again.');
    
    //     // You could also use a snackbar/toast service instead of alert
    //   }
    // });

    this.utilitiesService.getUserInfo({token:usertoken}).subscribe((res:any)=>{

      localStorage.setItem('userId',res.data[0].userId)
    })
    
  }
  
}
