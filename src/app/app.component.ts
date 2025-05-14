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
import { filter } from 'rxjs';
import { SharedServiceService } from './services/shared-service.service';
import { UserService } from './services/user.service';

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
   token:any;
   sidebarItems:any=[];
   usertype:any;
  constructor(private globalBlockUIService: GlobalBlockUiService,
    private router:Router, private route: ActivatedRoute,
    private renderer: Renderer2,
    public sidebarService: SidebarService,
    private utilitiesService:UtilitiesService,
    private sharedService:SharedServiceService,
  private userService:UserService) {}

  ngOnInit() {
   
    this.globalBlockUIService.loading$.subscribe((loading:any)=>{
      this.isLoading=loading;
    })

    // this.router.events.subscribe(() => {
    //   // Update whether the current route is the login page
    //   this.isLoginPage = this.router.url.includes('/login');
      
    // });

    this.router.events
    .pipe(filter((event:any) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;

      this.isLoginPage = 
        url.includes('/login') ||
        url.includes('/core/update-user-password');
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/core/home') {
        this.sharedService.triggerSidebarReset();
      }
    });

    
   
    
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      // console.log('Received token:', token);
    });

    this.userService.loadDataOnce();
    let userToken=localStorage.getItem('token');
    // this.utilitiesService.getUserInfo({token:userToken}).subscribe((res:any)=>{
    //   localStorage.setItem('userId',res.data[0].userId)
    // })
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

  getModules(){
    this.isLoading=true;
    this.sidebarService.getModules().subscribe((res:any)=>{
      this.sidebarItems=res.data;
    //  console.log(res.data);
     this.isLoading=false;
      // this.transformData(this.sidebarItems)
      // this.sharedService.updateSidebarData(this.sidebarItems);
    },(error:any)=>{
      // this.globalBlockUiService.stopLoading();
      this.isLoading=false;
    })
  }
  
  
}
