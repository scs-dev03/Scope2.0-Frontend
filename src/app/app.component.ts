import { Component, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { SidebarComponent } from "./core/sidebar/sidebar.component";
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
import { PageStateService } from './services/page-state.service';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { IdleService } from './services/idle.service';
import { environment } from '../../environments/environment';
import { TieredMenu } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule, SidebarComponent, CommonModule, SharedModule, PrimengModuleModule, SHARED_IMPORTS, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild('menu') menu: TieredMenu | null = null;
  title = 'stock-upload-frontend';
  visibleSidebar: boolean = true;
  isLoading: boolean = false;
  blocked: boolean = false;
  UserName: string = ''
  isLoginPage = false;
  @ViewChild('blockUI') blockUI!: BlockUI;
  @ViewChild('sidebar') sidebar!: SidebarComponent;
  token: any;
  profilePhoto!: any;
  sidebarItems: any = [];
  usertype: any;
  moduleName: any;
  filteredLocationData: any = [];
  locationId: any;
  homeData: FormGroup;
  isHomePage: boolean = false;
  is404Page: boolean = false;
  constructor(private globalBlockUIService: GlobalBlockUiService,
    private router: Router, private route: ActivatedRoute,
    private renderer: Renderer2,
    public sidebarService: SidebarService,
    private utilitiesService: UtilitiesService,
    private sharedService: SharedServiceService,
    private pageStateService: PageStateService,
    //  private idleService:IdleService,
    private userService: UserService) {
    this.homeData = new FormGroup({
      locationId: new FormControl(),
    })


    this.UserName = sessionStorage.getItem('username') ?? ''

  }

  items: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logOut()
    },


  ];



  ngOnInit() {

    //  sessionStorage.setItem('userid',"293")
    this.is404Page = this.pageStateService.is404;
    // console.log(this.is404Page)
    this.globalBlockUIService.loading$.subscribe((loading: any) => {
      this.isLoading = loading;
    })

    this.sharedService.UserName.subscribe(user => {
      this.UserName = user && user.trim() !== '' ? user : sessionStorage.getItem('username') || '';
    })

    const data = sessionStorage.getItem('locationData')

    if (data) {
      console.log("new data", JSON.parse(data))
      this.filteredLocationData = JSON.parse(data);
    }

    setTimeout(() => {

      this.sharedService.profilePhoto$.subscribe(photo => {
        this.profilePhoto = photo;
      });

    }, 2000);


    this.homeData.patchValue({
      locationId: sessionStorage.getItem('def_location')
    })


    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isLoginPage =
          url.includes('/login') ||
          url.includes('/core/update-user-password');

        this.isHomePage = url.includes('/core/home')
        const currentComponent = this.getCurrentComponent(this.route);
        this.is404Page = currentComponent === PageNotFoundComponent;
        // console.log("isPage ",this.is404Page,currentComponent)

      });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/core/home') {
        this.sharedService.triggerSidebarReset();
      }
    });


    this.sharedService.homePageData.pipe(take(2)).subscribe((filteredLocationData: any) => {
      this.filteredLocationData = filteredLocationData
    })

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      // console.log('Received token:', token);
    });

   let userToken = sessionStorage.getItem('usertoken');



    this.sharedService.moduleName.subscribe((header: any) => {
      //console.log("header ",header)
      this.moduleName = header;
    })
  }

  private getCurrentComponent(route: ActivatedRoute): any {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.routeConfig?.component;

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

  // getModules() {
  //   this.isLoading = true;
  //   this.sidebarService.getModules().subscribe((res: any) => {
  //     this.sidebarItems = res.data.modules;
  //     //  console.log(res.data);
  //     this.isLoading = false;
  //     // this.transformData(this.sidebarItems)
  //     // this.sharedService.updateSidebarData(this.sidebarItems);
  //   }, (error: any) => {
  //     // this.globalBlockUiService.stopLoading();
  //     this.isLoading = false;
  //   })
  // }

  onClickLocation() {
    // console.log("location id in app component ",this.homeData,this.homeData.value.locationId)
    sessionStorage.setItem('headerlocation', this.homeData.value.locationId);
    this.sharedService.updateLocationIdForHomePageData(this.homeData.value.locationId);
  }

  redirectToLegacyScope() {

    window.location.href = environment.DiverterUser;
  }

  logOut() {
    window.location.href = environment.frontendUserUrl;
    sessionStorage.clear();
    sessionStorage.clear();
  }

  onButtonClick(event: any) {
    console.log('Button clicked');
    this.menu?.toggle(event);
  }
}
