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
  private utilitiesService:UtilitiesService,private sharedService:SharedServiceService) {

   // localStorage.clear();
  }
  usertoken:any
  usertype:any 
  isloading:boolean = false

 sidebarItems:any;
 

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.usertoken = params['usertoken'];
      this.usertype = params['usertype'];
      // this.usertoken = 'dayKxo7bWm4:APA91bFIskDAjpGwlMlymh6BQxv6qJtWOgh6k3duRYHUS5fDujP5mwCMHtazI6wmXiZzoNTrWypaEy0GqVj1Ud-sdUVr4vNBFb5594D-cAPC8ZozzbSHwyYWCk22hM89j8pJKWqmLryY';
      // this.usertype = 'a';
    });
    
    
    if(this.usertype == 'a'){
      localStorage.setItem('usertype', 'A' )
     // console.log(localStorage.getItem('usertype'));
    }

    // console.log('User Token in ngoinint :', this.usertoken);
    // console.log('User Type  in ngoinint :  ',this.usertype);

    localStorage.setItem('usertoken', this.usertoken)
    localStorage.setItem('userType',this.usertype)
  //  console.log("token is ",this.usertoken);
    
    this.fetchUserinfo(this.usertype)
    // this.getUserId();
  
    
  }

  getUserId(){
   
    this.utilitiesService.getUserInfo({token:this.usertoken}).subscribe((res:any)=>{

      localStorage.setItem('userid',res?.data[0]?.userId);
      localStorage.setItem('username',res.data[0]?.username)
      this.getModules();
    })
  }


  fetchUserinfo(usertype:any){
    
    this.isloading = true;
    //let usertoken1='0x020000009479FC4863747E2DDF85514497DC6F42E63841CE394B28B7AFB6DADD9AC116C5'
   // let usertype1='U'
    let usertoken1= this.usertoken
   
    this.homepageservice.getuserinfo({ token: usertoken1, usertype: usertype }).subscribe({
      next: (res: any) => {
      //  console.log(res.Data);
          //  localStorage.setItem('userId',res.Data[0].userId);
            
        if (usertype == 'a') {
          localStorage.setItem('username', res.Data[0].username);
          localStorage.setItem('userid', res.Data[0].bintid_pk);
          // localStorage.setItem('userId', res.Data[0].bintid_pk);
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
      const data = res.data.modules;
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
