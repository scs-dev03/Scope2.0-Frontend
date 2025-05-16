import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { HomePageService } from '../../services/home-page/home-page.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IndianCurrencyPipe } from '../../shared/Indian-currency/indian-currency.pipe';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home-page',
  imports: [
    SHARED_IMPORTS,
    SharedModule,
    PrimengModuleModule,
    NgxEchartsModule,
    IndianCurrencyPipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {

  private subscription!: Subscription;
  ngOnInit(): void {
    localStorage.setItem('dealerid', '8');
    this.globalBlockUiService.startLoading();

    this.fetchUserinfo(localStorage.getItem('usertoken'), localStorage.getItem('usertype'));
    
    this.fetchCardsData(
      localStorage.getItem('def_location'),
      localStorage.getItem('dealerid')
    );
    // this.homeData.patchValue({
    //   locationId: localStorage.getItem('def_location')
    // });

    //console.log("init called ");
      this.subscription=this.sharedService.locationIdForHomePage.subscribe((locationId:any)=>{
    //  console.log("location id in home page ",locationId)
      this.locationId=locationId;
      this.fetchCardsData(
      this.locationId,
      localStorage.getItem('dealerid')
    );
    })
    this.locationId=localStorage.getItem('def_location');
    console.log("locationis ",this.locationId)
     this.homeData.patchValue({
      locationId: this.locationId
    });
  }

  constructor(
    private homepageservice: HomePageService,
    private globalBlockUiService: GlobalBlockUiService,
    private sharedService:SharedServiceService
  ) {}


  locationData: any = [];
  isloading: boolean = false;
  CardsData: any = [];
  userInfo: any = [];
  filteredLocationData: any = [];
  snStockValue: any = {};
  StockValue: any 
  NonStockValue: any 
  chartDataLoaded = false;
  chart1: any
  rawData: any
  months: string[] = [];
  locationId:any;
  homeData = new FormGroup({
    locationId: new FormControl(),
  });

 
  async fetchUserinfo(usertoken: any, usertype: any) {
    this.globalBlockUiService.startLoading();
    // console.log('fetch method',usertoken);
    // console.log('fetch method',usertype);
 localStorage.setItem('brandid','9');
    localStorage.setItem('locationid','14');
     localStorage.setItem('token','0x020000002EB14F6A0A250DB388BEDD446A7DB9BBADD863F6293CC693258A5A69E6D8FBC7')
    this.globalBlockUiService.startLoading();
     usertoken='0x0200000046E3737AED5FE0B13F2E6D0710BC96ABB705BA29736DDB3ADE3CBC2F7260C908'
    await this.homepageservice
      .getuserinfo({ token: usertoken, usertype: 'U' })
      .subscribe({
        next: (res: any) => {
          this.userInfo = res.Data;
          localStorage.setItem('def_location', res.Data[0]?.locationid);
          //console.log(this.userInfo);
          this.filteredLocationData = this.userInfo.map((item: any) => ({
            locationid: item.locationid,
            location: item.location,
          }));
         
          this.sharedService.updateModuleName('Home Page')
          this.sharedService.updateHomePageData(this.filteredLocationData)

           this.locationId=localStorage.getItem('def_location')
           console.log("location is imn 98 ",this.locationId) 
          //console.log(this.filteredLocationData);
          this.globalBlockUiService.stopLoading();
        },
        error: (err) => {
          //  console.error('Error fetching user info:', err);
          this.globalBlockUiService.stopLoading();

          // Optional: show user-friendly message
          alert(
            'Something went wrong while fetching user info. Please try again.'
          );

          // You could also use a snackbar/toast service instead of alert
        },
      });
  }

  
  onclickLocation() {
   
    console.log("locationId ",this.locationId)

    // this.fetchCardsData(
    //   this.homeData.value.locationId,
    //   localStorage.getItem('dealerid')
    // );
    //  this.fetchCardsData(
    //   this.locationId,
    //   localStorage.getItem('dealerid')
    // );
  }

  ngOnDestroy() {
  if (this.subscription) this.subscription.unsubscribe();
}

  fetchCardsData(locationId: any, dealerid: any) {
    this.globalBlockUiService.startLoading();
    this.homepageservice
      .getcardsdata({ locationId: locationId, dealerid: dealerid })
      .subscribe({
        next: (res: any) => {
          this.CardsData = res;  
          console.log(this.CardsData);
               
          this.globalBlockUiService.stopLoading();
          this.StockValue = res.SNStockValue[0]?.StockableValue;
          this.NonStockValue = res.SNStockValue[0]?.NonStockableValue;
               
          this.chart1 = {
           tooltip: {
              trigger: 'item',
              textStyle: {
                fontSize: 10,  // Tooltip text size chhota
              },
              padding: 5,       // Tooltip padding kam
              formatter: '{b}: {c}',  // Sirf naam aur value dikhao, percentage hata do agar zarurat na ho
             
            }, 
            legend: {
              top: '1%',
              left: 'start',
              textStyle: {
              fontSize: 8, 
            },
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
                  position: 'center',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'bold',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: [
                  {
                    value: this.StockValue ,
                    name: 'Stockable ',
                    itemStyle: { color: '#91cc75' },
                  },
                  {
                    value: this.NonStockValue,
                    name: 'Non Stockable ',
                    itemStyle: { color: '#ee6666' },
                  },
                ],
              },
            ],
          };

          this.rawData = this.CardsData.SixMonthSaleValue[0]
          console.log(this.rawData);
          

          for (const key in this.rawData) {
            const [month, type] = key.split('_').slice(0, 2); // ['Apr', '25']
            const baseKey = `${month}_${type}`; // 'Apr_25'

            if (!this.months.includes(baseKey)) {
              this.months.push(baseKey);
            }
          }

          console.log(this.months);
          
         
          this.globalBlockUiService.stopLoading();
        },
        error: (err: any) => {
          console.error('Error fetching location data:', err);

          this.globalBlockUiService.stopLoading();
        },
      });
  }

  chart2 = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    top: '1%',
    left: 'start',
    data: ['WS Sale', 'CS Sale', 'Purchase'],
    textStyle: {
    fontSize: 10, 
    },
  },
  xAxis: [
    {
    textStyle: {
      fontSize: 4, 
    },
      type: 'category',
      data: ['Nov_24', 'Dec_24', 'Jan_25', 'Feb_25', 'Mar_25', 'Apr-25'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
    textStyle: {
      fontSize: 10, 
    },
      type: 'value',
      name: 'Sale',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
    textStyle: {
      fontSize: 10, 
    },
      type: 'value',
      name: 'Purchase',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value} '
      }
    }
  ],
  series: [
    {
      name: 'Workshop Sale',
      type: 'bar',
      tooltip: {
       
      },
      data: [
        121.0, 144.9, 113.0, 140.2, 124.6, 93.68  ]
    },
    {
      name: 'Counter Sale',
      type: 'bar',
      tooltip: {
        
      },
      data: [
        12, 5.8, 4.0, 9.54, 4.27, 19.79
      ]
    },
    {
      name: 'Purchase',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        
      },
      data: [108, 140, 105, 126, 108, 77.4]
    }
  ]
};
}
