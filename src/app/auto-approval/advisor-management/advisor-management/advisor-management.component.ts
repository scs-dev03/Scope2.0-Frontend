import { Component, ViewChild } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AdvisorServiceService } from '../../../services/Auto-Approvals/advisor-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-advisor-management',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule, IconField, InputIcon],
  templateUrl: './advisor-management.component.html',
  styleUrl: './advisor-management.component.css'
})
export class AdvisorManagementComponent {

  //rowsPerPageOptions: any[] = [5, 10, 25, 50];

  rowsPerPageOptions: any[] = [5, 10, 25, 50];

  Result: any = null
  visible: boolean = false;


  constructor(private advisorservice: AdvisorServiceService, private globalBlockUiService: GlobalBlockUiService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchlocation(sessionStorage.getItem('dealerid') || '')
  }

  AdvisorData = new FormGroup({
    AdvisorName: new FormControl("", Validators.required),
    AdvisorPhone: new FormControl("", [Validators.minLength(10), Validators.maxLength(10)]),
    AdvisorEmail: new FormControl("", [Validators.email]),
    AdvisorLocation: new FormControl(null, Validators.required),

  })
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

  showtable: boolean = false
  onClickShowTable() {
    this.fetchAdvisorData(this.AdvisorData.value.AdvisorLocation);
  }

  SampleExcelDownload() {

    const Data = [
      {
        'Advisor': '',
        'PhoneNo': '',
        'Email': '',
      }
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Data)

    const workbook: XLSX.WorkBook = {
      Sheets: { 'SampleData': worksheet },
      SheetNames: ['SampleData']
    }

    const ExcelBuffer: any = XLSX.write(workbook, {
      type: 'array',
      bookType: 'xlsx'
    })

    const data: Blob = new Blob([ExcelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    });

    FileSaver.saveAs(data, 'Advisor_Bulk_Format.xlsx');
  }

  AdvisorExcel: any
  selectedFileName: any

  @ViewChild('fu') fu: any;

  onFileSelect(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.AdvisorExcel = event.files[0];
      this.selectedFileName = event.files[0].name // Pehli file select karna
      this.globalBlockUiService.stopLoading()
    }
  }

  errorViewData: any
  showErrorsTable: boolean = false;

  UploadExcel() {
    if (this.AdvisorExcel) {
      this.globalBlockUiService.startLoading()
      const formData = new FormData()
      formData.append("file", this.AdvisorExcel)
      formData.append("LocationId", this.AdvisorData.value.AdvisorLocation || '')
      formData.append("userId", sessionStorage.getItem('userid') || '')

      this.advisorservice.BulkUploadAdvisor(formData).subscribe({
        next: (res: any) => {
          console.log("Upload success:", res);
          this.visible = true;
          this.Result = res.message
          this.AdvisorExcel = null
          this.fu.clear();
          this.globalBlockUiService.stopLoading()
          this.fetchAdvisorData(this.AdvisorData.value.AdvisorLocation || '')
        },
        error: (err: any) => {
          console.error("Upload failed:", err);

          this.AdvisorExcel = null;
          this.fu.clear();
          this.errorViewData = err.error.errors || [];
          this.showErrorsTable = this.errorViewData.length > 0;
          this.globalBlockUiService.stopLoading()
          if (err?.error?.message) {
            this.Result = err.error.message;
            this.visible = true;
            if (err?.error?.message == "Excel Contains Duplicate Values" || err?.error?.message == "Missing headers") {
              this.showErrorsTable = false;
            }
          } else {
            this.Result = "Something went wrong while Sending Advisor data.";
          }
        }
      });
    } else {

      alert("No file selected");
    }

  }


  LocationData: any
  fetchlocation(dealerId: any) {
    this.globalBlockUiService.startLoading();
    this.advisorservice.getlocationMaster({ dealerid: dealerId }).subscribe({
      next: (res: any) => {
        this.LocationData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  AdvisorViewData: any
  fetchAdvisorData(LocationId: any) {
    this.globalBlockUiService.startLoading();

    this.advisorservice.getAdvisorViewData({ LocationId }).subscribe({
      next: (res: any) => {
        this.showtable = true;
        this.AdvisorViewData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
        this.showErrorsTable = false

        this.showErrorsTable = false
        if (err?.error?.message) {
          this.Result = err.error.message;

        } else {
          this.Result = "Something went wrong while fetching Advisor data.";
        }

        this.visible = true;
      }
    });
  }


  CreateAdvisor(LocationId: any, userId: any, Advisor: any, PhoneNo: any, Email: any) {
    this.globalBlockUiService.startLoading();
    this.advisorservice.CreateAdvisor({ LocationId: LocationId, userId: userId, Advisor: Advisor, PhoneNo: PhoneNo, Email: Email }).subscribe({
      next: (res: any) => {
        this.Result = res.message;
        this.visible = true;
        //this.fetchAdvisorData(LocationId);
        this.AdvisorData.get('AdvisorEmail')?.reset();
        this.AdvisorData.get('AdvisorName')?.reset();
        this.AdvisorData.get('AdvisorPhone')?.reset();

        this.fetchAdvisorData(this.AdvisorData.value.AdvisorLocation)
        this.showErrorsTable = false
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
        this.showErrorsTable = false
        if (err?.error?.message) {
          this.Result = err.error.message;
          this.visible = true;
        } else {
          this.Result = "Something went wrong while Creating Advisor.";
        }
      }
    })
  }

  OnclickSaveAdvisor() {
    this.CreateAdvisor(this.AdvisorData.value.AdvisorLocation, sessionStorage.getItem('userid') || '', this.AdvisorData.value.AdvisorName, this.AdvisorData.value.AdvisorPhone, this.AdvisorData.value.AdvisorEmail)
  }

  editDialogVisible = false;

  editAdvisor = {
    Id: null,
    Advisor: null,
    PhoneNo: null,
    Email: null
  };

  OnClickUpdateAdvisorInfo(rowData: any) {
    console.log(rowData);

    this.editAdvisor.Id = rowData.Id;
    this.editAdvisor.Advisor = rowData.Advisor;
    this.editAdvisor.PhoneNo = rowData.PhoneNo;
    this.editAdvisor.Email = rowData.Email;
    this.editDialogVisible = true;

  }

  updateAdvisorInfo() {
    this.globalBlockUiService.startLoading();
    this.advisorservice.updateAdvisorStatusAndData({
      Id: this.editAdvisor.Id,
      Advisor: this.editAdvisor.Advisor,
      PhoneNo: this.editAdvisor.PhoneNo,
      Email: this.editAdvisor.Email,
      Status: null
    }).subscribe({
      next: (res: any) => {
        this.Result = res.message;
        this.visible = true;
        this.editDialogVisible = false;
        this.showErrorsTable = false
        this.fetchAdvisorData(this.AdvisorData.value.AdvisorLocation);
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error updating Advisor data:", err);
        this.globalBlockUiService.stopLoading();
        this.editDialogVisible = false;
        this.showErrorsTable = false

        if (err?.error?.message) {
          this.Result = err.error.message;
        } else {
          this.Result = "Something went wrong while Sending party data.";
        }

        this.visible = true;
      }
    })

  }


  onCancelEdit() {
    this.editDialogVisible = false;
  }


  OnStatusChangeOfAdvisor(rowData: any) {
    this.globalBlockUiService.startLoading();

    this.advisorservice.updateAdvisorStatusAndData({
      Id: rowData.Id,
      Status: rowData.Status,
      Advisor: null,
      PhoneNo: null,
      Email: null
    }).subscribe({
      next: (res: any) => {
        this.Result = res.message || 'Status updated successfully';
        this.visible = true;
        this.showErrorsTable = false
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error('Error updating status', err);
        this.globalBlockUiService.stopLoading();

        // revert toggle switch on failure
        rowData.Status = !rowData.Status;
        this.showErrorsTable = false

        if (err?.error?.message) {
          this.Result = err.error.message;
        } else {
          this.Result = "Something went wrong while updating status.";
        }

        this.visible = true;
      }
    });
  }

  allowOnlyLetters(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[a-zA-Z\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }
  allowOnlyLettersAndNumber(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[a-zA-Z0-9\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }
  allowOnlyNumber(event: KeyboardEvent){
    const char = event.key;
    const pattern  = /^[0-9]*$/;
    if(!pattern.test(char)){
      event.preventDefault();
    }
  }




}
