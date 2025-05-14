import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { HomePageService } from '../../services/home-page/home-page.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IndianCurrencyPipe } from '../../shared/Indian-currency/indian-currency.pipe';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
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
  ngOnInit(): void {
    localStorage.setItem('dealerid', '8');
    this.globalBlockUiService.startLoading();
    // this.fetchCardsData(localStorage.get())

    
   

    this.fetchUserinfo(localStorage.getItem('usertoken'), localStorage.getItem('usertype'));
    this.fetchCardsData(
      localStorage.getItem('def_location'),
      localStorage.getItem('dealerid')
    );


     this.homeData.patchValue({
      locationId: localStorage.getItem('def_location')
    });
  }

  constructor(
    private homepageservice: HomePageService,
    private globalBlockUiService: GlobalBlockUiService
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

  homeData = new FormGroup({
    locationId: new FormControl(),
  });

  async fetchUserinfo(usertoken: any, usertype: any) {
    this.globalBlockUiService.startLoading();
    // console.log('fetch method',usertoken);
    // console.log('fetch method',usertype);

    this.globalBlockUiService.startLoading();
    await this.homepageservice
      .getuserinfo({ token: usertoken, usertype: usertype })
      .subscribe({
        next: (res: any) => {
          this.userInfo = res.Data;
          localStorage.setItem('def_location', res.Data[0]?.locationid);
          //console.log(this.userInfo);
          this.filteredLocationData = this.userInfo.map((item: any) => ({
            locationid: item.locationid,
            location: item.location,
          }));

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
    this.fetchCardsData(
      this.homeData.value.locationId,
      localStorage.getItem('dealerid')
    );
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
