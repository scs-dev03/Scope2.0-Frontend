import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { Sidebar2Component } from "../sidebar-2/sidebar-2.component";
import { HomePageService } from '../../services/home-page/home-page.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IndianCurrencyPipe } from "../../shared/Indian-currency/indian-currency.pipe";
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
@Component({
  selector: 'app-home-page',
  imports: [SHARED_IMPORTS, SharedModule, PrimengModuleModule, NgxEchartsModule, Sidebar2Component, IndianCurrencyPipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  ngOnInit(): void {
    
    localStorage.setItem('dealerid',"8")
    this.globalBlockUiService.startLoading()
    // this.fetchCardsData(localStorage.get())
    localStorage.setItem('usertoken',this.token)

    this.fetchUserinfo(this.token,"d")  
    this.fetchCardsData(localStorage.getItem('def_location'),localStorage.getItem('dealerid'))    
  }

  constructor(private homepageservice: HomePageService,private globalBlockUiService:GlobalBlockUiService){}


  token : any = "0x02000000D1B3C7E7D011498C812162DDAFB9D30E887E185EF7F1D27ED92D60F85858FCBF"

  locationData: any = []
  isloading: boolean = false
  CardsData: any = []
  userInfo: any = []
  filteredLocationData:any =[]
  snStockValue:any = {}
  StockValue:any = 0
  NonStockValue:any = 0
  chartDataLoaded = false;

  

  homeData = new FormGroup({
    locationId : new FormControl(),
  })


  async fetchUserinfo(usertoken:any,usertype:any){
    this.globalBlockUiService.startLoading()
    // console.log('fetch method',usertoken);
    // console.log('fetch method',usertype);
    
    this.globalBlockUiService.startLoading()
    await this.homepageservice.getuserinfo({ token: usertoken, usertype: usertype }).subscribe({
      next: (res: any) => {

        this.userInfo = res.Data
        localStorage.setItem('def_location',res.Data[0].locationid)
        //console.log(this.userInfo);
        this.filteredLocationData  = this.userInfo.map((item:any) => ({
          locationid: item.locationid,
          location: item.location
        }));

        console.log(this.filteredLocationData);
        this.globalBlockUiService.stopLoading()
        
        
        
      },
      error: (err) => {
      //  console.error('Error fetching user info:', err);
        this.globalBlockUiService.stopLoading();
    
        // Optional: show user-friendly message
        alert('Something went wrong while fetching user info. Please try again.');
    
        // You could also use a snackbar/toast service instead of alert
      }
    });
    
  }

  onclickLocation(){
    this.fetchCardsData(this.homeData.value.locationId,localStorage.getItem('dealerid'))
  }

  fetchCardsData(locationId: any, dealerid: any){
    this.globalBlockUiService.startLoading()
    this.homepageservice.getcardsdata({locationId:locationId,dealerid:dealerid}).subscribe({
      next: (res: any) =>{
        this.CardsData = res
        this.globalBlockUiService.stopLoading()
        //console.log(this.locationData);
        this.StockValue = res.SNStockValue[0].StockableValue;
        this.NonStockValue = res.SNStockValue[0].NonStockableValue;
        console.log("stockable",this.StockValue);
        console.log("nonstockable",this.NonStockValue);
        this.chartDataLoaded = true;
        this.globalBlockUiService.stopLoading()
        
      },
      error: (err: any)=>{
        console.error("Error fetching location data:", err);
        
        this.globalBlockUiService.stopLoading()
      }
    })
  }

  sidebarvisible: boolean = false;
  
  chart1 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '1%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: this.StockValue, name: 'Stockable Value',itemStyle: { color: '#5470C6' } },
          { value: this.NonStockValue, name: 'Non Stockable Value', itemStyle: { color: '#EE6666' } },
          
        ]
      }
    ]
  };
  


isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}

}
