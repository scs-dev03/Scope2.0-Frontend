import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageService } from '../../services/home-page/home-page.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { UtilitiesService } from '../../services/utilities.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-landing-screen',
  imports: [LoaderComponent],
  templateUrl: './landing-screen.component.html',
  styleUrl: './landing-screen.component.css'
})
export class LandingScreenComponent {
  constructor(private route: ActivatedRoute,
    private router: Router,  private homepageservice: HomePageService,private sidebarService:SidebarService,
  private utilitiesService:UtilitiesService,private sharedService:SharedServiceService) {}

  
  usertoken:any
  usertype:any 
  isloading:boolean = false

 sidebarItems:any;
 

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.usertoken = params['usertoken'];
      this.usertype = params['usertype'];
    });
    if(this.usertype === 'd'){
      localStorage.setItem('usertype', 'U' )
     // console.log(localStorage.getItem('usertype'));
    }
    else if(this.usertype == 'a'){
      localStorage.setItem('usertype', 'A' )
     // console.log(localStorage.getItem('usertype'));
    }

    // console.log('User Token in ngoinint :', this.usertoken);
    // console.log('User Type  in ngoinint :  ',this.usertype);

    localStorage.setItem('usertoken', this.usertoken)
    localStorage.setItem('userType',this.usertype)
    console.log(this.usertoken);
    
    this.fetchUserinfo(this.usertoken,this.usertype)
    // this.getUserId();
  
    
  }

  getUserId(){
   
    this.utilitiesService.getUserInfo({token:this.usertoken}).subscribe((res:any)=>{

      localStorage.setItem('userId',res?.data[0]?.userId);
     
      this.getModules();
    })
  }


  fetchUserinfo(usertoken:any,usertype:any){
    // console.log('fetch method',usertoken);
    // console.log('fetch method',usertype);
    
    this.isloading = true;
   
    this.homepageservice.getuserinfo({ token: usertoken, usertype: usertype }).subscribe({
      next: (res: any) => {
      //  console.log(res.Data);
           localStorage.setItem('userId',res.Data[0].userId);
        if (usertype == 'd') {
          localStorage.setItem('brandid', res.Data[0].BrandID);
          localStorage.setItem('dealerid', res.Data[0].dealerid);
          localStorage.setItem('username', res.Data[0].username);
          localStorage.setItem('def_location',res.Data[0].locationid)
          localStorage.setItem('userid',res?.Data[0]?.userId);
          
        }
    
        if (usertype == 'a') {
          localStorage.setItem('username', res.Data[0].username);
          localStorage.setItem('userid', res.Data[0].bintid_pk);
          localStorage.setItem('userId', res.Data[0].bintid_pk);
          localStorage.setItem('designation', res.Data[0].designation);
        }
        
        this.isloading = false;
       
        
       // this.getUserId();
       this.getModules();
       
      },
      error: (err) => {
      //  console.error('Error fetching user info:', err);
        this.isloading = false;
    
        // Optional: show user-friendly message
        alert('Something went wrong while fetching user info. Please try again.');
    
        // You could also use a snackbar/toast service instead of alert
      }
    });
   
    
  }

  getModules(){
   
    this.sidebarService.getModules().subscribe((res:any)=>{
      const data = res.data;
  const cleaned = this.transformSidebarData(data);  // this will be dense, clean
 // console.log("cleaned ",cleaned)
  this.sidebarItems = cleaned;
  //console.log("landing screen ",res.data);
      this.sharedService.updateSidebarData(this.sidebarItems);
      
     //  this.sharedService.hasSidebarDataLoaded=true;
     
     this.goToHomePage();
    },(error:any)=>{
      // this.globalBlockUiService.stopLoading();
    })
  }

  transformSidebarData(data: any[]): any[] {
    const groupedData: { [key: string]: any } = {};
    const directParents: any[] = [];
  
    data.forEach((item) => {
      const parent = item.parentModuleName;
  
      if (!parent || parent.toLowerCase() === 'null') {
        // Direct parent (no group)
        directParents.push({
          parentModuleName: item.module_name,
          isOpen: false,
          subchildren: [], // treat like no children
          module_route: item.module_route,
          add1: item.add1,
          delete1: item.delete1,
          edit1: item.edit1,
          view1: item.view1,
          isActive: item.isActive
        });
      } else {
        // Grouped under a parent
        if (!groupedData[parent]) {
          groupedData[parent] = {
            parentModuleName: parent,
            isOpen: false,
            subchildren: []
          };
        }
  
        groupedData[parent].subchildren.push({
          module_name: item.module_name,
          module_route: item.module_route,
          add1: item.add1,
          delete1: item.delete1,
          edit1: item.edit1,
          view1: item.view1,
          isActive: item.isActive
        });
      }
    });
  
    const finalResult = [...Object.values(groupedData), ...directParents];
    return finalResult;
  }

  goToHomePage(){
    
    this.router.navigate(['core/home']
    //   {
    //    queryParams: { token:this.usertoken }
    // }
  );
    
  }
}
