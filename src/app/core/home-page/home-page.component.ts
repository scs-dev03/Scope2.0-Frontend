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
    //localStorage.setItem('dealerid', '8');
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
    this.subscription = this.sharedService.locationIdForHomePage.subscribe((locationId: any) => {
      //  console.log("location id in home page ",locationId)
      this.locationId = locationId;
      this.fetchCardsData(
        this.locationId,
        localStorage.getItem('dealerid')
      );
    })
    this.locationId = localStorage.getItem('def_location');
    console.log("locationis ", this.locationId)
    this.homeData.patchValue({
      locationId: this.locationId
    });
  }

  constructor(
    private homepageservice: HomePageService,
    private globalBlockUiService: GlobalBlockUiService,
    private sharedService: SharedServiceService
  ) { }


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
  locationId: any;
  homeData = new FormGroup({
    locationId: new FormControl(),
  });


  async fetchUserinfo(usertoken: any, usertype: any) {
    this.globalBlockUiService.startLoading();
    this.globalBlockUiService.startLoading();
    //   usertoken='0x0200000046E3737AED5FE0B13F2E6D0710BC96ABB705BA29736DDB3ADE3CBC2F7260C908'
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

          this.locationId = localStorage.getItem('def_location')
          // console.log("location is imn 98 ",this.locationId) 
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

    console.log("locationId ", this.locationId)

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

  chart2: any

  fetchCardsData(locationId: any, dealerid: any) {
  this.globalBlockUiService.startLoading();

  this.homepageservice
    .getcardsdata({ locationId, dealerid })
    .subscribe({
      next: (res: any) => {
        this.CardsData = res;
        console.log('raw API response:', this.CardsData);

        // stop the loader as soon as possible
        this.globalBlockUiService.stopLoading();

        // 1) Pie chart data
        this.StockValue    = res.SNStockValue[0]?.StockableValue  || 0;
        this.NonStockValue = res.SNStockValue[0]?.NonStockableValue || 0;

        this.chart1 = {
          color: ['#34D399', '#EF4444'],
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.75)',
            padding: 4,
            textStyle: { fontSize: 12, color: '#e8c200' },
            formatter: '{b}: {c}\n{d}%'
          },
          legend: {
            bottom: '2%',
            left: 'center',
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { fontSize: 12, color: '#4B5563' }
          },
          series: [{
            name: 'Stock Type',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'inside',
              formatter: '{d}%',
              fontSize: 14,
              fontWeight: 'bold',
              color: '#e8c200'
            },
            labelLine: { show: false },
            emphasis: {
              scale: true,
              scaleSize: 8,
              label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#fff' }
            },
            data: [
              { value: this.StockValue,    name: 'Stockable' },
              { value: this.NonStockValue, name: 'Non-Stockable' }
            ]
          }]
        };

        // 2) reset & transform your 6-month arrays
        this.month = [];
        this.ws    = [];
        this.cs    = [];
        this.p     = [];

        this.transformSixMonthData(res.SixMonthSaleValue[0]);
        // at this point:
        //   this.month = ["Nov '24", ..., "Apr '25"]
        //   this.ws, this.cs, this.p are all length-matched arrays

        // 3) Bar+line chart configuration
        this.chart2 = {
          color: ['#4F46E5', '#10B981', '#F59E0B'],
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          legend: {
            itemGap: 10,
            textStyle: { fontSize: 12, color: '#4B5563' },
            data: ['Workshop Sale', 'Counter Sale', 'Purchase']
          },
          grid: {
            top: '20%', left: '5%', right: '5%', bottom: '0%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.month,
            axisLine: { lineStyle: { color: '#E5E7EB' } },
            axisTick: { show: false },
            axisLabel: { color: '#6B7280', fontSize: 12, rotate: 30 }
          },
          yAxis: [
            {
              type: 'value',
              name: 'Sale',
              nameLocation: 'middle',
              nameRotate: 90,
              nameGap: 35,
              nameTextStyle: { fontSize: 12, color: '#4B5563' },
              min: 0, max: 250, interval: 50,
              axisLine: { lineStyle: { color: '#E5E7EB' } },
              splitLine: { lineStyle: { type: 'dashed', color: '#F3F4F6' } },
              axisLabel: { color: '#6B7280', fontSize: 12 }
            },
            {
              type: 'value',
              name: 'Purchase',
              nameLocation: 'middle',
              nameRotate: 90,
              nameGap: 35,
              nameTextStyle: { fontSize: 12, color: '#4B5563' },
              position: 'right',
              min: 0, max: 250, interval: 50,
              axisLine: { lineStyle: { color: '#E5E7EB' } },
              splitLine: { show: false },
              axisLabel: { color: '#6B7280', fontSize: 12 }
            }
          ],
          series: [
            {
              name: 'Workshop Sale',
              type: 'bar',
              barWidth: '28%',
              itemStyle: { borderRadius: [4, 4, 0, 0] },
              emphasis: { focus: 'series' },
              data: this.ws
            },
            {
              name: 'Counter Sale',
              type: 'bar',
              barWidth: '28%',
              itemStyle: { borderRadius: [4, 4, 0, 0] },
              emphasis: { focus: 'series' },
              data: this.cs
            },
            {
              name: 'Purchase',
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
              symbol: 'circle',
              symbolSize: 8,
              lineStyle: { width: 3 },
              emphasis: { focus: 'series' },
              data: this.p
            }
          ]
        };
      },
      error: (err: any) => {
        console.error('Error fetching cards data:', err);
        this.globalBlockUiService.stopLoading();
      },
    });
}

  month: string[] = [];
  ws: number[] = [];
  cs: number[] = [];
  p: number[] = [];


  private transformSixMonthData(raw: { [key: string]: number }): void {
    const rx = /^(.+?)_(WS|CS|P)_Value$/;
    Object.entries(raw).forEach(([key, value]) => {
      const m = rx.exec(key);
      if (!m) return;

      const monthKey = m[1];   // ex: "Jun_25"
      const type = m[2];   // "WS" | "CS" | "P"
      const num = value;

      // Month को "Jun '25" फॉर्मैट में कन्वर्ट करें
      const [mon, yr] = monthKey.split('_');
      const label = `${mon} '${yr}`;

      // यदि पहले नहीं जोड़ा तो add करें
      if (!this.month.includes(label)) {
        this.month.push(label);
      }

      // type के हिसाब से value डालें
      if (type === 'WS') {
        this.ws.push(num);
      } else if (type === 'CS') {
        this.cs.push(num);
      } else if (type === 'P') {
        this.p.push(num);
      }
    });



  }


  // chart2 = {
  //   color: ['#4F46E5', '#10B981', '#F59E0B'],
  //   tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  //   legend: {

  //     itemGap: 10,
  //     textStyle: { fontSize: 12, color: '#4B5563' },
  //     data: ['Workshop Sale', 'Counter Sale', 'Purchase']
  //   },
  //   grid: {
  //     top: '20%',
  //     left: '5%',
  //     right: '5%',
  //     bottom: '0%',
  //     containLabel: true
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: ['Nov \'24', 'Dec \'24', 'Jan \'25', 'Feb \'25', 'Mar \'25', 'Apr \'25'],
  //     axisLine: { lineStyle: { color: '#E5E7EB' } },
  //     axisTick: { show: false },
  //     axisLabel: { color: '#6B7280', fontSize: 12, rotate: 30 }
  //   },
  //   yAxis: [
  //     {
  //       type: 'value',
  //       name: 'Sale',
  //       nameLocation: 'middle',
  //       nameRotate: 90,
  //       nameGap: 35,
  //       nameTextStyle: { padding: [0, 0, 0, 0], fontSize: 12, color: '#4B5563' },
  //       min: 0, max: 250, interval: 50,
  //       axisLine: { lineStyle: { color: '#E5E7EB' } },
  //       splitLine: { lineStyle: { type: 'dashed', color: '#F3F4F6' } },
  //       axisLabel: { color: '#6B7280', fontSize: 12 }
  //     },
  //     {
  //       type: 'value',
  //       name: 'Purchase',
  //       nameLocation: 'middle',
  //       nameRotate: 90,
  //       nameGap: 35,
  //       nameTextStyle: { padding: [0, 0, 0, 0], fontSize: 12, color: '#4B5563' },
  //       position: 'right',
  //       min: 0, max: 250, interval: 50,
  //       axisLine: { lineStyle: { color: '#E5E7EB' } },
  //       splitLine: { show: false },
  //       axisLabel: { color: '#6B7280', fontSize: 12 }
  //     }
  //   ],
  //   series: [
  //     {
  //       name: 'Workshop Sale',
  //       type: 'bar',
  //       barWidth: '28%',
  //       itemStyle: { borderRadius: [4, 4, 0, 0] },
  //       emphasis: { focus: 'series' },
  //       data: [121, 144.9, 113, 140.2, 124.6, 93.68]
  //     },
  //     {
  //       name: 'Counter Sale',
  //       type: 'bar',
  //       barWidth: '28%',
  //       itemStyle: { borderRadius: [4, 4, 0, 0] },
  //       emphasis: { focus: 'series' },
  //       data: [12, 5.8, 4, 9.54, 4.27, 19.79]
  //     },
  //     {
  //       name: 'Purchase',
  //       type: 'line',
  //       yAxisIndex: 1,
  //       smooth: true,
  //       symbol: 'circle',
  //       symbolSize: 8,
  //       lineStyle: { width: 3 },
  //       emphasis: { focus: 'series' },
  //       data: [108, 140, 105, 126, 108, 77.4]
  //     }
  //   ]
  // };



}
