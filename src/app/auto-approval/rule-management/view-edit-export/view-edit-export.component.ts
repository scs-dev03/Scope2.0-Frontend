import { Component, ViewChild } from '@angular/core';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { SharedServiceService } from '../../../services/shared-service.service';
import { RuleViewManageService } from '../../../services/Auto-Approvals/rule-view-manage.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';

@Component({
  selector: 'app-view-edit-export',
  imports: [PrimengModuleModule, FormsModule, CommonModule, SHARED_IMPORTS, ReactiveFormsModule, IconField, InputIcon],
  templateUrl: './view-edit-export.component.html',
  styleUrl: './view-edit-export.component.css'
})
export class ViewEditExportComponent {

  

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('View & Manage Rules');
    this.FetchBrand()
    this.FetchRule();
  }

  constructor(private globalBlockUiService: GlobalBlockUiService, private ruleviewmanageservice: RuleViewManageService, private sharedService: SharedServiceService) { }

  Result: any;
  visible: boolean = false;
  priority: any;
  EditPriorityDialog:boolean=false;

  RuleViewBrandInputData = new FormGroup({
    brand: new FormControl(),
    dealer: new FormControl(),
    location: new FormControl(),
    Rule: new FormControl(),
  })
  

  EditRuleMapping = new FormGroup({
    Brand: new FormControl(),
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
    this.FetchDealer(this.RuleViewBrandInputData.value.brand)
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
    this.FetchLocation(this.RuleViewBrandInputData.value.dealer)
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
  searchValue: string | undefined;
  @ViewChild('dt1') dt1: any;
  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  onGlobalFilter(event: Event) {


    const value = (event.target as HTMLInputElement)?.value || '';
    console.log(value);

    this.dt1.filterGlobal(value, 'contains');
  }


  ViewRuleData: any[] = [];

  OnClickViewRule() {
    this.FetchRuleViewData()
  }

  FetchRuleViewData(): void {
    this.globalBlockUiService.startLoading();
    const BrandId = this.RuleViewBrandInputData.value.brand;
    const DealerId = this.RuleViewBrandInputData.value.dealer;
    const LocationId = this.RuleViewBrandInputData.value.location;
    const RuleId = this.RuleViewBrandInputData.value.Rule;

    this.ruleviewmanageservice.FetchViewRuleData({ BrandId, DealerId, LocationId, RuleId }).subscribe({
      next: (res: any) => {
        this.ViewRuleData = res?.data || res || [];
        console.log('Rule View Data:', res);
        this.globalBlockUiService.stopLoading();
      },
      error: (err) => {
        console.error('Error fetching rule view data:', err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  RuleData: any


  FetchRule() {
    this.globalBlockUiService.startLoading();
    this.ruleviewmanageservice.FetchRule().subscribe({
      next: (res: any) => {
        this.RuleData = res?.data || res || [];
        this.globalBlockUiService.stopLoading();
      },
      error: (err) => {
        console.error('Error fetching rule view data:', err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  LocationId:any
  RuleId:any
  Priority:any
  Status:any

  OnClickEditPriority(rowData: any) {
    this.EditPriorityDialog=true;
    this.LocationId = rowData.LocationId;
    this.RuleId = rowData.id;
    this.Status = rowData.Status;
  }

  

  onClickEditPriority() {
    console.log(this.priority,"   ",this.Priority);
    this.EditPriority(this.LocationId, this.RuleId, this.Priority, this.Status);
  }

  EditPriority(LocationId: any, RuleId: any, Priority: any, Status: any) {
    this.globalBlockUiService.startLoading();

    this.ruleviewmanageservice.EditPriority({ LocationId, RuleId, Priority, Status }).subscribe({
      next: (res: any) => {
        this.Result = res.message;
        this.visible = true;
        this.Priority = null;
        this.EditPriorityDialog=false;
        this.globalBlockUiService.stopLoading();
        this.OnClickViewRule()
      },
      error: (err) => {
        console.error('Error editing priority:', err);
        this.Priority = null;
        this.EditPriorityDialog=false;
        this.globalBlockUiService.stopLoading();
      }
    });
  }


}
