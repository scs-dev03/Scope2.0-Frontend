import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { SharedServiceService } from '../../../services/shared-service.service';
import { RuleViewManageService } from '../../../services/Auto-Approvals/rule-view-manage.service';

@Component({
  selector: 'app-view-edit-export',
  imports: [PrimengModuleModule, FormsModule, CommonModule, SHARED_IMPORTS, ReactiveFormsModule,],
  templateUrl: './view-edit-export.component.html',
  styleUrl: './view-edit-export.component.css'
})
export class ViewEditExportComponent {


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('View & Manage Rules');
    this.FetchBrand()
  }

  constructor(private ruleviewmanageservice: RuleViewManageService,private sharedService: SharedServiceService){}

  first: number = 0;

  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

BrandInputData = new FormGroup({
  brand: new FormControl(),
  dealer: new FormControl(),
  location: new FormControl(),
})


  Brand: any[] = [];

  FetchBrand(): void {

    const Brand = sessionStorage.getItem("Brand");
    if (Brand) {
      return this.Brand = JSON.parse(Brand);
    }
    this.ruleviewmanageservice.fetchBrand().subscribe({
      next: (res: any) => {
        this.Brand = res?.data || res || [];
        sessionStorage.setItem("Brand", JSON.stringify(this.Brand));
        console.log('Brand List:', this.Brand);
      },
      error: (err) => {
        console.error('Error fetching brand list:', err);
        this.Brand = [];
      }
    });
  }
  OnClickBrand() {
    this.FetchDealer(this.BrandInputData.value.brand)
  }
  Dealer: any[] = [];

  FetchDealer(brandId: any): void {
    this.ruleviewmanageservice.fetchDealer({ brandid: brandId }).subscribe({
      next: (res: any) => {
        this.Dealer = res?.data || res || [];
        console.log('Dealer List:', this.Dealer);
      },
      error: (err) => {
        console.error('Error fetching dealer list:', err);
        this.Dealer = [];
      }
    });
  }


  OnClickDealer() {
    this.FetchLocation(this.BrandInputData.value.dealer)
  }

  Location: any[] = [];

  FetchLocation(dealerId: any): void {
    this.ruleviewmanageservice.fetchLocation({ dealerid: dealerId }).subscribe({
      next: (res: any) => {
        this.Location = res?.data || res || [];
        console.log('Location List:', this.Location);
      },
      error: (err) => {
        console.error('Error fetching location list:', err);
        this.Location = [];
      }
    });
  }

  RuleData: any
  FetchTemplateRule(data:any){
    this.ruleviewmanageservice.fetchTemplateRule({createdBy:null,endDate: null,startDate:null}).subscribe((res:any)=>{
      this.RuleData = res
    })

  }

}
