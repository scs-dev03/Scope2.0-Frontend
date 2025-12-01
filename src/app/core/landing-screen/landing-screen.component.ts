import { Component, Input } from '@angular/core';
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
    private router: Router, private homepageservice: HomePageService, private sidebarservice: SidebarService,
    private utilitiesService: UtilitiesService, private sharedService: SharedServiceService) {

    // sessionStorage.clear();
  }
  usertoken: any
  usertype: any
  isloading: boolean = false

  sidebarItems: any;


  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.usertoken = params['usertoken'];
      this.usertype = params['usertype'];
      // this.usertoken = 'dayKxo7bWm4:APA91bFIskDAjpGwlMlymh6BQxv6qJtWOgh6k3duRYHUS5fDujP5mwCMHtazI6wmXiZzoNTrWypaEy0GqVj1Ud-sdUVr4vNBFb5594D-cAPC8ZozzbSHwyYWCk22hM89j8pJKWqmLryY';
      // this.usertype = 'a';
    });


    if (this.usertype == 'a') {
      sessionStorage.setItem('usertype', 'A')
      // console.log(sessionStorage.getItem('usertype'));
    }

    // console.log('User Token in ngoinint :', this.usertoken);
    // console.log('User Type  in ngoinint :  ',this.usertype);

    sessionStorage.setItem('usertoken', this.usertoken)
    sessionStorage.setItem('userType', this.usertype)
    //  console.log("token is ",this.usertoken);

    this.fetchUserinfo(this.usertype)
    // this.getUserId();


  }

  getUserId() {

    this.utilitiesService.getUserInfo({ token: this.usertoken }).subscribe((res: any) => {

      sessionStorage.setItem('userid', res?.data[0]?.userId);
      sessionStorage.setItem('username', res.data[0]?.username)
      //this.getModules();
    })
  }


  fetchUserinfo(usertype: any) {

    this.isloading = true;
    
    let usertoken1 = this.usertoken

    this.homepageservice.getuserinfo({ token: usertoken1, usertype: usertype }).subscribe({
      next: (res: any) => {
        //  console.log(res.Data);
        //  sessionStorage.setItem('userId',res.Data[0].userId);

        if (res?.Data?.length > 0) {

          const user = res.Data[0];
          sessionStorage.setItem('username', user.username);
          sessionStorage.setItem('userid', user.bintid_pk);
          // sessionStorage.setItem('userId', user.bintid_pk);
          sessionStorage.setItem('designation', user.designation);
          sessionStorage.setItem('usertype', "A");

          this.isloading = false;
          this.getSidebarModuleData();
          this.goToHomePage();

        }
        else{
          alert('No user data found')
        }


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

  permission: any;

  getSidebarModuleData() {

    console.log("hello from landing sidebar api ");

    this.sidebarservice.getModules().subscribe((res: any) => {
      this.menu = res.tree;
      this.sharedService.updateSidebarData(this.menu);
      this.permission = res.accessibleRoutes;
      sessionStorage.setItem('sidebarMenu', JSON.stringify(this.menu));
      sessionStorage.setItem('Permission', JSON.stringify(this.permission));

      this.goToHomePage();
    })
  }


  @Input() menu: any[] = []

  goToHomePage() {

    this.router.navigate(['core/home']
      //   {
      //    queryParams: { token:this.usertoken }
      // }
    );

  }
}
