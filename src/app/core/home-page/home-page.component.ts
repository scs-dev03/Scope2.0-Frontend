import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { Sidebar2Component } from '../sidebar-2/sidebar-2.component';
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
    Sidebar2Component,
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
    localStorage.setItem('usertoken', this.token);

    this.fetchUserinfo(this.token, 'd');
    this.fetchCardsData(
      localStorage.getItem('def_location'),
      localStorage.getItem('dealerid')
    );
  }

  constructor(
    private homepageservice: HomePageService,
    private globalBlockUiService: GlobalBlockUiService
  ) {}

  token: any =
    '0x02000000D1B3C7E7D011498C812162DDAFB9D30E887E185EF7F1D27ED92D60F85858FCBF';

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

          console.log(this.filteredLocationData);
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
              left: 'center',
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
                    value: this.StockValue,
                    name: 'Stockable Value',
                    itemStyle: { color: '#91cc75' },
                  },
                  {
                    value: this.NonStockValue,
                    name: 'Non Stockable Value',
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
    data: ['WS Sale', 'CS Sale', 'Purchase']
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Sale',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value} L'
      }
    },
    {
      type: 'value',
      name: 'Purchase',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value} L'
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
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ]
    },
    {
      name: 'Counter Sale',
      type: 'bar',
      tooltip: {
        
      },
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ]
    },
    {
      name: 'Purchase',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  ]
};
}
