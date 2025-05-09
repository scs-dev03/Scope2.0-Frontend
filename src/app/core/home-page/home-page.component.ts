import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { Sidebar2Component } from "../sidebar-2/sidebar-2.component";
import { HomePageService } from '../../services/home-page/home-page.service';
@Component({
  selector: 'app-home-page',
  imports: [SHARED_IMPORTS, SharedModule, PrimengModuleModule, NgxEchartsModule, Sidebar2Component],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  constructor(private homepageservice: HomePageService){}

  locationData: any = []
  isloading: boolean = false
  CardsData: any = []



  fetchlocation(dealerId: any) {
    this.isloading = true;
    this.homepageservice.getlocationMaster({ dealerid: dealerId }).subscribe({
        next: (res: any) => {
            this.locationData = res;
            this.isloading = false;
        },
        error: (err: any) => {
            console.error("Error fetching location data:", err);
            this.isloading = false;
        }
    });
  }

  fetchCardsData(locationId: any, dealerid: any){
    this.isloading = true
    this.homepageservice.getcardsdata({locationId:locationId,dealerid:dealerid}).subscribe({
      next: (res: any) =>{
        this.CardsData = res
        this.isloading = false
      },
      error: (err: any)=>{
        console.error("Error fetching location data:", err);
        
        this.isloading = false
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
          { value: 1048, name: 'Search Engine', itemStyle: { color: '#5470C6' } },
          { value: 735, name: 'Direct', itemStyle: { color: '#91CC75' } },
          { value: 580, name: 'Email', itemStyle: { color: '#FAC858' } },
          { value: 484, name: 'Union Ads', itemStyle: { color: '#EE6666' } },
          { value: 300, name: 'Video Ads', itemStyle: { color: '#73C0DE' } }
        ]
      }
    ]
  }; 


isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}

}
