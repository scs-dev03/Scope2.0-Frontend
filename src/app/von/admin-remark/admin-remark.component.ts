import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { AdminvonserviceService } from '../../services/Von/adminvonservice.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Sidebar2Component } from "../../core/sidebar-2/sidebar-2.component";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-admin-remark',
  imports: [PrimengModuleModule, SharedModule, SHARED_IMPORTS, Sidebar2Component, LoaderComponent],
  templateUrl: './admin-remark.component.html',
  styleUrl: './admin-remark.component.css'
})
export class AdminRemarkComponent {

  ngOnInit(): void {
    //this.adminvonservice.setLocalStorage()
    this.typeData = [
      { name: 'Admin', code: 'A' },
      { name: 'User', code: 'U' },
    ];
    this.fetchBrandData();
     this.sharedService.updateModuleName('Remark Creation')
    
  }

  constructor(private adminvonservice: AdminvonserviceService,
    private sharedService:SharedServiceService
  ) {}

  adminRemarkInputData = new FormGroup({
    type: new FormControl(),
    brand: new FormControl(),
    remarkInput: new FormControl('', [Validators.maxLength(50), this.allowedCharactersValidator()]),
  });

  typeData: any = [];
  brandData: any = [];
  remarkData: any = []
  isloading: boolean = false;
  showtable:boolean = false;
  Result: any;
  visible: any;

  onSubmitRemarkData() {
    console.log(this.adminRemarkInputData.value);
    
    this.remarkCreation(
      this.adminRemarkInputData.value.remarkInput,
      this.adminRemarkInputData.value.brand,
      localStorage.getItem('userid'),
      this.adminRemarkInputData.value.type
    );

    
  }
  onclickShowTable(){
    this.showtable = true
    this.FetchViewRemark(this.adminRemarkInputData.value.brand,this.adminRemarkInputData.value.type)
  }
  allowedCharactersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const allowedPattern = /^[a-zA-Z0-9\s,-]*$/; // Regex for alphanumeric, comma, hyphen, and space
      const isValid = allowedPattern.test(control.value);
      return isValid ? null : { 'invalidCharacters': { value: control.value } };
    };
  }
  

  fetchBrandData() {
    this.isloading = true;
    this.adminvonservice.getBrandMaster().subscribe((res: any) => {
      this.brandData = res;
      this.isloading = false;
    });
  }

  remarkCreation(remark: any, brandid: any, addedby: any, usertype: any) {
    this.isloading = true;
    this.adminvonservice
      .newRemarkCreation({
        remark: remark,
        brandid: brandid,
        addedby: localStorage.getItem('userid'),
        usertype: usertype,
      })
      .subscribe((res: any) => {
        this.adminRemarkInputData.value.remarkInput='';
        this.visible = true;
        this.Result = res.message;
        this.isloading = false
        
        
      });
  }

  FetchViewRemark(brandid: any,usertype:any){
    this.isloading = true;
    this.adminvonservice.getViewRemark({
      brandid:brandid,usertype:usertype
    }).subscribe((res:any)=>{
      this.remarkData = res.Data
      this.isloading = false;
    })
  }


  
  
sidebarvisible: boolean = false;
    
   

onClickSidebar(){
    this.sidebarvisible = true
    console.log(this.sidebarvisible);
    
}
}
