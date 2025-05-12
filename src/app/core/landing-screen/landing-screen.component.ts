import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageService } from '../../services/home-page/home-page.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-landing-screen',
  imports: [LoaderComponent],
  templateUrl: './landing-screen.component.html',
  styleUrl: './landing-screen.component.css'
})
export class LandingScreenComponent {
  constructor(private route: ActivatedRoute,
    private router: Router,  private homepageservice: HomePageService,
  private utilitiesService:UtilitiesService) {}

  
  usertoken:any 
  usertype:any 
  isloading:boolean = false



  ngOnInit() {

    localStorage.clear()
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
    localStorage.setItem('usertype',this.usertype)
    
    this.fetchUserinfo(this.usertoken,this.usertype)
    this.getUserId();
     

    
  }

  getUserId(){
    let userToken=localStorage.getItem('usertoken');
    this.utilitiesService.getUserInfo({token:userToken}).subscribe((res:any)=>{

      localStorage.setItem('userId',res?.data[0]?.userId);
    })
  }

  fetchUserinfo(usertoken:any,usertype:any){
    // console.log('fetch method',usertoken);
    // console.log('fetch method',usertype);
    
    this.isloading = true
    this.homepageservice.getuserinfo({ token: usertoken, usertype: usertype }).subscribe({
      next: (res: any) => {
        console.log(res.Data);
    
        if (usertype == 'd') {
          localStorage.setItem('brandid', res.Data[0].BrandID);
          localStorage.setItem('dealerid', res.Data[0].dealerid);
          localStorage.setItem('username', res.Data[0].username);
          localStorage.setItem('def_location',res.Data[0].locationid)
        }
    
        if (usertype == 'a') {
          localStorage.setItem('username', res.Data[0].username);
          localStorage.setItem('userid', res.Data[0].bintid_pk);
          localStorage.setItem('designation', res.Data[0].designation);
        }
    
        this.isloading = false;
        this.goToHomePage();
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

  goToHomePage(){
    
    this.router.navigate(['/home']);
    
  }
}
