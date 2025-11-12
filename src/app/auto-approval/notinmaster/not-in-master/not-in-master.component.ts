import { Component, ViewChild } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { FormArray, FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { NotinmasterService } from '../../../services/Auto-Approvals/notinmaster.service';
import { Router } from '@angular/router';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-not-in-master',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, IconField, InputIcon],
  templateUrl: './not-in-master.component.html',
  styleUrl: './not-in-master.component.css'
})
export class NotInMasterComponent {

  PartNumberForm!: FormGroup;
  PartNumberData: any[] = [];

  today = new Date().toISOString().split('T')[0];
  firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString('en-CA');

  userId: any
  Result: any
  visible: any
  Upload: Boolean = false
  BrandId: any

  ngOnInit() {
    this.fetchlocation()
    this.getHsnCode()
    this.getPartType()
    this.FetchNotInMasterParts(sessionStorage.getItem('brandid'), sessionStorage.getItem('dealerid'), null, null, null, null, null, null, 0)

    this.PartNumberForm = this.fb.group({
      rows: this.fb.array([])
    });
    this.userId = sessionStorage.getItem("userid")
    this.BrandId = sessionStorage.getItem("brandid")
  }
  constructor(private router: Router, private sharedService: SharedServiceService, private fb: FormBuilder, private globalBlockUiService: GlobalBlockUiService, private notinmasterservice: NotinmasterService) {
  }


  NotInMasterInputData = new FormGroup({
    Location: new FormControl(),
    FromDate: new FormControl(this.firstDayOfMonth),
    ToDate: new FormControl(this.today)
  })




  HSNCodeData: any
  getHsnCode() {
    this.globalBlockUiService.startLoading();
    this.notinmasterservice.getHSNcode().subscribe({
      next: (res: any) => {
        this.HSNCodeData = res.data
        this.globalBlockUiService.stopLoading();

      },
      error: (err: any) => {
        this.globalBlockUiService.stopLoading()
        console.error(err)
      }
    })
  }

  PartyTypeData: any
  getPartType() {
    this.globalBlockUiService.startLoading();
    this.notinmasterservice.getParttype().subscribe({
      next: (res: any) => {
        this.PartyTypeData = res.Data
        this.globalBlockUiService.stopLoading();

      },
      error: (err: any) => {
        this.globalBlockUiService.stopLoading()
        console.error(err)
      }
    })

  }

  submitRow(index: number, rowdata: any) {
    console.log(rowdata);

  }
  ImageAttatchment: any

  FetchNotInMasterParts(BrandId: any, DealerId: any, LocationId: any, PartNumber: any, PartTypeId: any, Addedby: any, From: any, To: any, Status: any) {
    this.globalBlockUiService.startLoading();

    this.notinmasterservice.FetchPartNumber({ BrandId: BrandId, DealerId: DealerId, LocationId: LocationId, PartNumber: PartNumber, PartTypeId: PartTypeId, Addedby: Addedby, From: From, To: To, Status: Status }).subscribe({
      next: (res: any) => {
        this.PartNumberData = res.data

        this.globalBlockUiService.stopLoading()
      },
      error: (err) => {
        this.globalBlockUiService.stopLoading()
      }
    })
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


  isEmpty(v: any): boolean {
    return v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
  }

  SendNotInMaster(rowData: any) {
    // mark this row as "tried"
    rowData._submitTry = true;

    // required checks (trim strings)
    rowData.PartDesc = rowData.PartDesc?.trim() ?? '';
    rowData.Model = rowData.Model?.trim() ?? '';

    const missing =
      this.isEmpty(rowData.PartDesc) ||
      this.isEmpty(rowData.MOQ) ||
      this.isEmpty(rowData.MRP) ||
      this.isEmpty(rowData.LandedCost) ||
      this.isEmpty(rowData.HSNID) ||
      this.isEmpty(rowData.PartTypeId) ||
      this.isEmpty(rowData.GSTPer) ||
      this.isEmpty(rowData.QtyPerVehicle) ||
      this.isEmpty(rowData.Model);

    if (missing) {
      // show your toast/modal
      this.Result = 'Please fill all mandatory fields.';
      this.visible = true;
      return;
    }

    // --- build FormData (same as before, safe appends) ---
    const fd = new FormData();
    const add = (k: string, v: any) => { if (v !== null && v !== undefined) fd.append(k, String(v)); };

    if (rowData.Image instanceof File) fd.append('image', rowData.Image, rowData.Image.name);

    add('Id', rowData.id);
    add('BrandId', rowData.BrandId);
    add('DealerId', rowData.DealerId);
    add('LocationId', rowData.LocationId);
    add('PartNumber', rowData.PartNumber);
    add('PartDesc', rowData.PartDesc);
    add('MRP', rowData.MRP);
    add('LandedCost', rowData.LandedCost);
    add('MOQ', rowData.MOQ);
    add('PartTypeId', rowData.PartTypeId);
    add('Model', rowData.Model);
    add('GSTPer', rowData.GSTPer);
    add('QtyPerVehicle', rowData.QtyPerVehicle);
    add('HSNID', rowData.HSNID);
    add('Remarks', rowData.Remarks ?? '');
    add('LatestPartNumber', rowData.LatestPartNumber ?? '');
    add('Detailsby', this.userId);
    add('Status', '1');

    this.notinmasterservice.SendNotInMaster(fd).subscribe({
      next: (res: any) => {
        this.Result = res?.message || 'Saved';
        this.visible = true;
        // remove row
        this.PartNumberData = this.PartNumberData.filter((x: any) => x.id !== rowData.id);
      },
      error: (err: any) => {
        this.Result = err?.error?.message || 'Error';
        this.visible = true;
      }
    });
  }


  LocationData: any
  fetchlocation() {
    this.globalBlockUiService.startLoading();
    this.notinmasterservice.getlocationMaster({ dealerid: sessionStorage.getItem('dealerid') || '' }).subscribe({
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


  RedirectToNotInMaster() {
    this.router.navigate(['/auto/master/viewnim']);
  }

  onAttach(evt: any, row: any) {
    const file: File = evt.files?.[0];
    if (!file) return;
    row.Image = file;
  }

  RemoveFile(row: any) {
    row.Image = null
  }


  NotInMasterExcel: any = null;
  OnSelectNotInMasterExcel(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.NotInMasterExcel = event.files[0];
      this.globalBlockUiService.stopLoading()
    }
    else {
      this.NotInMasterExcel = null;
      this.globalBlockUiService.stopLoading()
    }
  }

  brandid = sessionStorage.getItem("brandid")
  OnUploadNotInMasterExcel() {
    if (this.NotInMasterExcel == null) {
      this.Result = "Please Choose Excel"
      this.visible = true;
    }
    this.globalBlockUiService.startLoading();
    const formdata = new FormData

    formdata.append("BrandId", this.BrandId)
    formdata.append("userId", this.userId)
    formdata.append("file", this.NotInMasterExcel)

    this.notinmasterservice.UploadNotInMaster(formdata).subscribe({
      next: (res: any) => {
        this.Result = res.message;
        this.visible = true;
        this.globalBlockUiService.stopLoading()

      },
      error: (err: any) => {
        console.log(err);

        this.globalBlockUiService.stopLoading()

      },
    })
  }


  private readonly EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  ExportTableData() {
    if (this.PartNumberData) {

      const exportData = this.PartNumberData.map((item: any) => ({


        'PartNumber': item.PartNumber,
        'PartDesc': null,
        'MRP': null,
        'LandedCost': null,
        'MOQ': null,
        'Model': null,
        'PartType': null,
        'GSTPer': null,
        'QtyPerVehicle': null,
        'HSNCode': null,
        'Remark': null,
        'LatestPartNumber': null

      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Orders': worksheet },
        SheetNames: ['Orders']
      };


      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
      saveAs(data, 'NotInMasterData' + '.xlsx');

    }


  }











  preventNegative(event: KeyboardEvent) {

    const input = event.target as HTMLInputElement;

    if (event.key === '-' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }

    setTimeout(() => {
      const value = Number(input.value);
      if (value > 1000) {
        input.value = '1000'; // ✅ Lock it to 1000
      }
    });

  }

  blockNegativePaste(event: ClipboardEvent) {

    const pastedInput = event.clipboardData?.getData('text') || '';
    const isValid = /^[1-9][0-9]*$/.test(pastedInput);
    if (!isValid) {
      event.preventDefault();
    }
  }

  blockZero(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value === '0' || input.value.startsWith('0')) {
      input.value = '';
    }
  }

  allowOnlyLettersAndNumber(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[a-zA-Z0-9\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }

  allowNumberOnly(event: KeyboardEvent) {
    const char = event.key

    const pattern = /^[0-9\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault()
    }
  }


  allowLettersOnly(event: KeyboardEvent) {
    const char = event.key
    const pattern = /^[a-zA-Z\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }





}
