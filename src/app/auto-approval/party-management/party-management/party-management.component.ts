import { Component, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { PaginatorState } from 'primeng/paginator';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { PmServiceService } from '../../../services/Auto-Approvals/pm-service.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-party-management',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule, IconField, InputIcon],
  templateUrl: './party-management.component.html',
  styleUrl: './party-management.component.css'
})
export class PartyManagementComponent {




  constructor(private globalBlockUiService: GlobalBlockUiService, private pmservice: PmServiceService) { }

  PartyName: any = null
  PartyCode: any = null
  location: any = null
  visible: boolean = false;
  Result: any
  showError: boolean = false;

  validateFields() {
    // Agar dono empty hain toh error show karo
    this.showError = !this.PartyName?.trim() && !this.PartyCode?.trim();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchlocation(sessionStorage.getItem('dealerid') || '')
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


  showtable: boolean = false
  onClickShowTable() {
    this.fetchPartyData(this.location);
  }

  SampleExcelDownload() {

    const Data = [
      {
        'PartyName': '',
        'PartyCode': '',

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

    FileSaver.saveAs(data, 'Part_Bulk_Upload_format.xlsx');
  }



  PartyExcel: any
  selectedFileName: any
  @ViewChild('fu') fu: any;
  onFileSelect(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.PartyExcel = event.files[0];
      this.selectedFileName = event.files[0].name // Pehli file select karna
      this.globalBlockUiService.stopLoading()
    }
  }

  errorViewData: any
  showErrorsTable: boolean = false;

  UploadExcel() {
    this.globalBlockUiService.startLoading();
    if (this.PartyExcel) {
      const formData = new FormData()
      formData.append("file", this.PartyExcel)
      formData.append("LocationId", this.location)
      formData.append("userId", sessionStorage.getItem('userid') || '')

      this.pmservice.BulkUploadParty(formData).subscribe({
        next: (res: any) => {
          this.showErrorsTable = false;
          console.log("Upload success:", res);
          this.visible = true;
          this.Result = res.message
          this.PartyExcel = null
          this.onClickShowTable()
          this.globalBlockUiService.stopLoading();
          this.fu.clear();
        },
        error: (err: any) => {
          console.log("Upload failed:", err);
          this.Result = err.message;
          this.visible = true;
          this.errorViewData = err.error.errors || [];
          this.showErrorsTable = this.errorViewData.length > 0;

          this.PartyExcel = null;
          this.fu.clear();
          if (err?.error?.message) {
            this.Result = err.error.message;
            if (err?.error?.message == "Excel Contains Duplicate Values" || err?.error?.message == "Missing headers") {
              this.showErrorsTable = false;
            }
          } else {
            this.Result = "Something went wrong while Uploading party data.";
          }
          this.globalBlockUiService.stopLoading();
        }
      });
    } else {
      this.globalBlockUiService.stopLoading();
      alert("No file selected");
    }

  }

  LocationData: any
  fetchlocation(dealerId: any) {
    this.globalBlockUiService.startLoading();
    this.pmservice.getlocationMaster({ dealerid: dealerId }).subscribe({
      next: (res: any) => {
        this.LocationData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.log("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  PartyViewData: any;

  fetchPartyData(LocationId: any) {
    this.globalBlockUiService.startLoading();

    this.pmservice.getPartyViewData({ LocationId }).subscribe({
      next: (res: any) => {
        this.showtable = true;
        this.PartyViewData = res.data;

        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
        this.showErrorsTable = false


        if (err?.error?.message) {
          this.Result = err.error.message;
        } else {
          this.Result = "Something went wrong while fetching party data.";
        }

        this.visible = true;
      }
    });
  }

  CreateParty(LocationId: any, userId: any, PartyCode: any, PartyName: any) {
    this.globalBlockUiService.startLoading();
    this.pmservice.CreateParty({ LocationId: LocationId, userId: userId, PartyCode: PartyCode, PartyName: PartyName }).subscribe({
      next: (res: any) => {
        this.showErrorsTable = false
        this.Result = res.message;
        this.visible = true;
        this.PartyName = null
        this.PartyCode = null
        this.onClickShowTable()

        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error Creating Party:", err);
        this.globalBlockUiService.stopLoading();
        this.Result = err.message;
        this.visible = true;
        this.PartyName = null
        this.PartyCode = null
        this.errorViewData = err.error.errors || [];
        this.showErrorsTable = this.errorViewData.length > 0;


        if (err?.error?.message) {
          this.Result = err.error.message;
        } else {
          this.Result = "Something went wrong while Sending party data.";
        }

        this.visible = true;
      }

    })
  }

  OnClickSaveParty(form: any) {
    if (form.invalid) {
      this.showError = true;
      // Mark all controls as touched to trigger validation UI
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }
    else {
      this.CreateParty(this.location, sessionStorage.getItem('userid') || '', this.PartyCode, this.PartyName);
    }
  }

  onStatusChangeOfParty(rowData: any) {
    this.globalBlockUiService.startLoading();

    this.pmservice.UpdatePartyStatusAndData({
      Id: rowData.Id,
      status: rowData.Status
    }).subscribe({
      next: (res) => {
        this.showErrorsTable = false
        this.Result = res.message || 'Status updated successfully';
        this.visible = true;
        this.globalBlockUiService.stopLoading();
      },
      error: (err) => {
        console.error('Error updating status', err);
        this.globalBlockUiService.stopLoading();


        if (err?.error?.message) {
          this.Result = err.error.message;
        } else {
          this.Result = "Something went wrong while Sending party data.";
        }

        this.visible = true;
      }
    });

  }

  editDialogVisible = false;

  editParty = {
    Id: null,
    partyName: null,
    partyCode: null
  };

  OnClickUpdatePartyInfo(rowData: any) {
    console.log(rowData);

    this.editParty.Id = rowData.Id;
    this.editParty.partyName = rowData.PartyName;
    this.editParty.partyCode = rowData.PartyCode;
    this.editDialogVisible = true;

  }


  updatePartyInfo() {
    this.globalBlockUiService.startLoading();

    this.pmservice.UpdatePartyStatusAndData({
      Id: this.editParty.Id,
      status: null,
      PartyName: this.editParty.partyName,
      PartyCode: this.editParty.partyCode

    }).subscribe({
      next: (res) => {
        this.editDialogVisible = false;
        this.showErrorsTable = false
        this.fetchPartyData(this.location)
        this.Result = res.message || 'Status updated successfully';
        this.visible = true;
        this.globalBlockUiService.stopLoading();
      },
      error: (err) => {
        console.error('Error updating status', err);
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
    });
  }

  onCancelEdit() {
    this.editDialogVisible = false;
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



}
