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
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {


  UserName: string = ''

  private subscription!: Subscription;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.UserName = sessionStorage.getItem('username') ?? ''
  }

  constructor(
    private homepageservice: HomePageService,
    private globalBlockUiService: GlobalBlockUiService,
    private sharedService: SharedServiceService
  ) { }

  chart2: any
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
