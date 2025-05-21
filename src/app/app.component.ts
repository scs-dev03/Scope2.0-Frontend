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
import { filter, take } from 'rxjs';
import { SharedServiceService } from './services/shared-service.service';
import { UserService } from './services/user.service';
import { SHARED_IMPORTS } from './shared/shared-imports/shared-module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule, SidebarComponent, HeaderComponent,CommonModule,SharedModule,PrimengModuleModule,SHARED_IMPORTS,ReactiveFormsModule],
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
   moduleName:any;
    filteredLocationData: any = [];
    locationId:any;
    homeData:FormGroup;
    isHomePage:boolean=false;
  constructor(private globalBlockUIService: GlobalBlockUiService,
    private router:Router, private route: ActivatedRoute,
    private renderer: Renderer2,
    public sidebarService: SidebarService,
    private utilitiesService:UtilitiesService,
    private sharedService:SharedServiceService,
  private userService:UserService) {
    this.homeData = new FormGroup({
    locationId: new FormControl(),
  })}

  ngOnInit() {
   
    this.globalBlockUIService.loading$.subscribe((loading:any)=>{
      this.isLoading=loading;
    })
   
   
   this.homeData.patchValue({
    locationId:localStorage.getItem('def_location')
   })
  

    this.router.events
    .pipe(filter((event:any) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;

      this.isLoginPage = 
        url.includes('/login') ||
        url.includes('/core/update-user-password');

    this.isHomePage=url.includes('/core/home')
    
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/core/home') {
        this.sharedService.triggerSidebarReset();
      }
    });

    
    this.sharedService.homePageData.pipe(take(2)).subscribe((filteredLocationData:any)=>{
      this.filteredLocationData=filteredLocationData

    //  console.log("filteredLocationData",filteredLocationData)
    })
    
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      // console.log('Received token:', token);
    });

    this.userService.loadDataOnce();
    // localStorage.setItem('brandid','9');
    // localStorage.setItem('def_location','14')
     localStorage.setItem('token','0x020000002EB14F6A0A250DB388BEDD446A7DB9BBADD863F6293CC693258A5A69E6D8FBC7')
    let userToken=localStorage.getItem('usertoken');

    this.utilitiesService.getUserInfo({token:userToken}).subscribe((res:any)=>{
      localStorage.setItem('userid',res.data[0]?.userId)
      localStorage.setItem('username',res.data[0]?.username)
    })

    this.sharedService.moduleName.subscribe((header:any)=>{
      //console.log("header ",header)
      this.moduleName=header;
    })
   

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
  
  onClickLocation(){
  // console.log("location id in app component ",this.homeData,this.homeData.value.locationId)
    this.sharedService.updateLocationIdForHomePageData(this.homeData.value.locationId);
  }
}
