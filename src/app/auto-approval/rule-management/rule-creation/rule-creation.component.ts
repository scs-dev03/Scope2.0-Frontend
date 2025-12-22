import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { SharedServiceService } from '../../../services/shared-service.service';
import { RuleCreationService } from '../../../services/Auto-Approvals/rule-creation.service';
import { MasterServiceService } from '../../../services/master-service/master-service.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';

@Component({
  selector: 'app-rule-creation',
  imports: [PrimengModuleModule, FormsModule, CommonModule, SHARED_IMPORTS, ReactiveFormsModule, PrimengModuleModule, SharedModule],
  templateUrl: './rule-creation.component.html',
  styleUrl: './rule-creation.component.css'
})
export class RuleCreationComponent {

  ngOnInit(): void {

    this.GetBucket();
    this.FetchBrand()
    this.GetOperator()
    this.FetchAction()
    this.FetchRemarkParameter()
    this.sharedService.updateModuleName('Rule Creation');
  }

  NumericRule: FormGroup;


  LocationSpecificName: FormGroup;
  GeneralRuleName: FormGroup;
  visibleTrueFalse: boolean = false
  visible: boolean = false
  Result: any
  trueRemarktext: any
  falseRemarktext: any

  ruleFor = [
    { name: 'Stock', value: '2' },
    { name: 'Vehicle', value: '1' }
  ]

  RuleName = new FormGroup({
    NameofRule: new FormControl('', [Validators.required]),
    Description: new FormControl('', [Validators.required]),
    RuleFor: new FormControl(null)
  })


  trueFalseInput = new FormGroup({

    trueAction: new FormControl(null,Validators.required),
    trueRemark: new FormControl('',Validators.required),
    trueParameter: new FormControl(null),
    falseAction: new FormControl(null,Validators.required),
    falseRemark: new FormControl('',Validators.required),
    falseParameter: new FormControl(null)

  })

  constructor(private fb: FormBuilder, private globalBlockUiService: GlobalBlockUiService, private MasterService: MasterServiceService, private sharedService: SharedServiceService, private ruleservice: RuleCreationService) {
    this.NumericRule = this.fb.group({
      selectedBucket: [],
      selectedParameter: [],
      selectedOperator: [],
      SubParameters: [],
      enteredValue: ['']
    });
    this.GeneralRuleName = this.fb.group({
      brand: [null, Validators.required],
      dealer: [null],
      location: [null]
    })
    this.LocationSpecificName = this.fb.group({
      brand: [null, Validators.required],
      dealer: [null, Validators.required],
      location: [null, Validators.required]
    })
  }




  selectedRuleType: string = 'numeric';
  locationSpecific: boolean = false
  GeneralRule: boolean = false
  ActionList: any = [
    {
      Name: "Internal Approver",
      Id: "IA"
    },
    {
      Name: "Manual Approval",
      Id: "MA"
    },

    {
      Name: "Move To Next Rule",
      Id: "MNR"
    },

    {
      Name: "Approve",
      Id: "AP"
    },
    {
      Name: "Reject",
      Id: "RJ"
    }
  ]
  enteredValue: string = '';
  expression = '';
  ruleChunks: string[] = []; // this will store each small expression added
  sendExpression = '';


  onLocationChange() {
    if (this.locationSpecific) {
      this.GeneralRule = false;
    }
  }

  onGeneralChange() {
    if (this.GeneralRule) {
      this.locationSpecific = false;
    }
  }


  isInvalid(name: string) {
    const c = this.trueFalseInput.get(name);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  appendToRuleNumeric() {
    const bucket = this.NumericRule.get('selectedBucket')?.value?.Bucket
    const sendparam = this.NumericRule.get('selectedParameter')?.value?.ColumnName
    const param = this.NumericRule.get('selectedParameter')?.value?.Parameter
    const operator = this.NumericRule.get('selectedOperator')?.value;

    console.log(bucket);

    const value = this.NumericRule.get('enteredValue')?.value;
    // Add param, operator, and value separately
    if (param) {
      this.ruleChunks.push(`${param} `);
      this.expression += `${param} `;
      this.sendExpression += ` ${bucket}.${sendparam} `
    }

    if (operator) {
      this.ruleChunks.push(`${operator} `);
      this.expression += `${operator} `;
      this.sendExpression += ` ${operator} `
    }

    if (value) {
      this.ruleChunks.push(`${value} `);
      this.expression += `${value} `;
      this.sendExpression += ` ${value} `
    }

    // Reset form

    this.NumericRule.get('enteredValue')?.setValue(null);
    this.NumericRule.get('selectedOperator')?.setValue(null);
    this.NumericRule.get('selectedParameter')?.setValue(null);
    this.NumericRule.get('selectedBucket')?.setValue(null);
  }
  removeLastChunk() {
    if (this.ruleChunks.length > 0) {
      this.ruleChunks.pop();
      this.expression = this.ruleChunks.join('');
      this.sendExpression = this.ruleChunks.join('')
    }
  }

  showDialogForfinalCondition() {

    if (this.locationSpecific == false && this.GeneralRule == false) {
      alert("Please select Rule Type Location Specific or General Rule")
      return;
    }

    if (this.locationSpecific == true) {
      if (!this.LocationSpecificName.valid) {
        this.LocationSpecificName.markAllAsTouched();
        return;
      }
    }

    if (this.GeneralRule == true) {
      if (!this.GeneralRuleName.valid) {
        this.GeneralRuleName.markAllAsTouched();
        return;
      }
    }


    if (!this.RuleName.valid) {
      this.RuleName.markAllAsTouched();
    }
    else {
      console.log("send rule  " + this.sendExpression);
      this.visibleTrueFalse = true
    }
  }

  Bucket: any
  GetBucket(): void {

    const Bucket = sessionStorage.getItem('Bucket')
    if (Bucket) {
      return this.Bucket = JSON.parse(Bucket)
    }
    this.ruleservice.fetchBucket().subscribe({
      next: (res: any) => {
        this.Bucket = res?.data || [];
        sessionStorage.setItem('Bucket', JSON.stringify(this.Bucket))
        console.log('Bucket List:', this.Bucket);
      },
      error: (err) => {
        console.error('Error fetching bucket list:', err);
        this.Bucket = [];
      }
    });
  }

  OnClickBucket() {
    this.GetParameters(this.NumericRule.get('selectedBucket')?.value?.BucketId)
    sessionStorage
  }

  parametersNumeric: any;
  GetParameters(bucketId: any): void {
    this.ruleservice.fetchParameter({ bucketId }).subscribe({
      next: (res: any) => {
        this.parametersNumeric = res?.data || [];
      },
      error: (err) => {
        console.error('Error fetching parameters:', err);
        this.parametersNumeric = [];
      }
    });
  }
  OperatorList: any
  GetOperator(): void {
    this.ruleservice.fetchOperator().subscribe({
      next: (res: any) => {
        this.OperatorList = res?.data || [];
      },
      error: (err) => {
        console.error('Error fetching operator list:', err);
        this.OperatorList = [];
      }
    });
  }

  Brand: any[] = [];

  FetchBrand(): void {

    this.ruleservice.fetchBrand().subscribe({
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
    this.FetchDealer(this.GeneralRuleName.value.brand)
  }
  Dealer: any[] = [];

  FetchDealer(brandId: any): void {
    this.MasterService.getDealersMasterMulti({ BrandIds: brandId }).subscribe({
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
    this.FetchLocation(this.GeneralRuleName.value.dealer)
  }

  Location: any[] = [];

  FetchLocation(dealerId: any): void {
    this.MasterService.getlocationMasterMulti({ DealerIds: dealerId }).subscribe({
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

  OnclickBrandSingle() {
    this.fetchDealerData(this.LocationSpecificName.value.brand)
  }

  dealerData: any;
  fetchDealerData(brandid: any) {
    this.globalBlockUiService.startLoading();
    this.MasterService.getDealersMaster({ brandid }).subscribe({
      next: (res: any) => {
        this.dealerData = res;
        this.dealerData.sort((a: any, b: any) =>
          a.dealer.localeCompare(b.dealer)
        );
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error('Error fetching dealer data:', err);
        this.globalBlockUiService.stopLoading();
      },
    });
  }

  OnclickDealerSingle() {
    this.fetchlocation(this.LocationSpecificName.value.dealer)
  }

  locaitonData: any;
  // Fetch Location
  fetchlocation(dealerId: any) {
    this.globalBlockUiService.startLoading();
    this.MasterService.getlocationMaster({ dealerid: dealerId }).subscribe({
      next: (res: any) => {
        this.locaitonData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error('Error fetching location data:', err);
        this.globalBlockUiService.stopLoading();
      },
    });
  }



  FetchAction() {
    this.ruleservice.fetchRuleAction().subscribe({
      next: (res: any) => {
        this.ActionList = res.data
      },
      error: (err) => {
        console.error("error Fetching Action List", err);

      }
    })
  }

  DealerMapping: any[] = []

  ExtractDealerObject(dealerArray: any[]) {
    if (dealerArray.length == null) {
      this.DealerMapping = []
      return;
    }
    this.DealerMapping = this.Dealer.filter(
      (d: any) => dealerArray.includes(d.DealerID)
    );
  }

  BrandMapping: any[] = []
  FromateBrandObject(brandArray: any[]) {
    
    this.BrandMapping = brandArray.map(id => ({ BrandId: id.bigid, DealerId: null, LocationId: null }));
  }

  LocationMapping: any[] = []
  ExtractLocationObject(locationArray: any[]) {
    if (locationArray.length == null) {
      this.LocationMapping = []
      return;
    }
    this.LocationMapping = this.Location.filter(
      (l: any) => locationArray.includes(l.LocationID)

    );


  }





  trueRemark: string = ''
  falseRemark: string = ''

  CreateRule(name: any, description: any, expression: any, trueOutput: any, falseOutput: any, createdBy: any, trueRemarktext: any, falseRemarktext: any, rulefor: any, RuleType: any, mappings: any) {
    const payload = {
      name: name,
      description: description,
      expression: expression,
      trueOutput: trueOutput,
      falseOutput: falseOutput,
      createdBy: createdBy,
      trueRemark: trueRemarktext,
      falseRemark: falseRemarktext,
      ruleFor: rulefor,
      RuleType: RuleType,
      mappings: mappings


    };

    this.ruleservice.CreateRule(payload).subscribe({
      next: (res: any) => {
        console.log("Rule created successfully:", res);
        this.visible = true;
        this.trueRemark = ''
        this.falseRemark = ''
        this.sendExpression = ''
        this.RuleName.reset()
        this.expression = ''
        this.Result = res.message
        this.visibleTrueFalse = false;
        this.trueRemarktext = null
        this.falseRemarktext = null
        this.LocationMapping = []
        this.DealerMapping = []
        this.BrandMapping = []
        this.GeneralRuleName.reset()
        this.LocationSpecificName.reset()
        this.trueFalseInput.reset()
        this.NumericRule.reset()

      },
      error: (err: any) => {
        this.Result = err.Error.message
        this.visible = true
        this.trueFalseInput.reset()
        this.RuleName.reset()
        this.LocationSpecificName.reset()
        this.GeneralRuleName.reset()
        this.NumericRule.reset()
        console.error("Error creating rule:", err);
      },
      complete: () => {
        console.log("CreateRule API call completed.");
      }
    });
  }



  OnClickSaveRule() {

    console.log(this.trueFalseInput.value);
    if (this.locationSpecific == true) {

      if (this.LocationSpecificName.invalid) {
        this.LocationSpecificName.markAllAsTouched();
        return;
      }

      if(this.trueFalseInput.invalid){
        this.trueFalseInput.markAllAsTouched();
        return;
      }
      const mappingLcationArray = [{
        BrandId: this.LocationSpecificName.value.brand,
        DealerId: this.LocationSpecificName.value.dealer,
        LocationId: this.LocationSpecificName.value.location
      }]

      this.CreateRule(this.RuleName.value.NameofRule, this.RuleName.value.Description, this.sendExpression, this.trueFalseInput.value.trueAction, this.trueFalseInput.value.falseAction, sessionStorage.getItem('userid'), this.trueFalseInput.value.trueRemark, this.trueFalseInput.value.falseRemark, this.RuleName.value.RuleFor, 1, mappingLcationArray)
    }

    if (this.GeneralRule == true) {

      this.FromateBrandObject(this.GeneralRuleName.value.brand)
      if(this.GeneralRuleName.value.dealer != null){
        this.ExtractDealerObject(this.GeneralRuleName.value.dealer)
      }
      if(this.GeneralRuleName.value.location != null){
        this.ExtractLocationObject(this.GeneralRuleName.value.location)
      }
      this.LocationMapping = this.LocationMapping.map((loc: any) => {
        return {
          ...loc,
          LocationId: loc.LocationID,
        };
      });

      if (this.LocationMapping.length > 0) {
        this.CreateRule(this.RuleName.value.NameofRule, this.RuleName.value.Description, this.sendExpression, this.trueFalseInput.value.trueAction, this.trueFalseInput.value.falseAction, sessionStorage.getItem('userid'), this.trueFalseInput.value.trueRemark, this.trueFalseInput.value.falseRemark, this.RuleName.value.RuleFor, 2, this.LocationMapping)
      }
      if (this.DealerMapping.length > 0 && this.LocationMapping.length == 0) {
        this.CreateRule(this.RuleName.value.NameofRule, this.RuleName.value.Description, this.sendExpression, this.trueFalseInput.value.trueAction, this.trueFalseInput.value.falseAction, sessionStorage.getItem('userid'), this.trueFalseInput.value.trueRemark, this.trueFalseInput.value.falseRemark, this.RuleName.value.RuleFor, 2, this.DealerMapping)
      }
      if (this.BrandMapping.length > 0 && this.DealerMapping.length == 0 && this.LocationMapping.length == 0) {
        this.CreateRule(this.RuleName.value.NameofRule, this.RuleName.value.Description, this.sendExpression, this.trueFalseInput.value.trueAction, this.trueFalseInput.value.falseAction, sessionStorage.getItem('userid'), this.trueFalseInput.value.trueRemark, this.trueFalseInput.value.falseRemark, this.RuleName.value.RuleFor, 2, this.BrandMapping)
      }

    }
  }

  RemarkParameter: any

  FetchRemarkParameter() {
    this.ruleservice.FetchRemarkParameter().subscribe({
      next: (res: any) => {
        this.RemarkParameter = res.data
      },
      error: (err: any) => {
        console.error("Error fetching Remark Parameter", err);
      }
    })
  }

  OnclickAddRemarkParameterInTrueRemark() {
    const remark = this.trueFalseInput.value.trueRemark || '';
    const parameter = this.trueFalseInput.value.trueParameter || '';

    if (!parameter) return;

    const newRemark = `${remark} <${parameter}>`;

    this.trueFalseInput.patchValue({
      trueRemark: newRemark
    });
  }


  OnclickAddRemarkParameterInFalseRemark() {
    const remark = this.trueFalseInput.value.falseRemark || '';
    const parameter = this.trueFalseInput.value.falseParameter || '';

    if (!parameter) return;

    const newRemark = `${remark} <${parameter}>`;

    this.trueFalseInput.patchValue({
      falseRemark: newRemark
    });
  }

  PreDefinedParameter: any

  OnclickParameter() {
    this.FetchPreDefinedParameter(this.LocationSpecificName.value.location, this.NumericRule.value.selectedParameter)
  }


  FetchPreDefinedParameter(LocationId: any, parameter: any) {

    this.ruleservice.FetchPreDefinedParameter({ parameter, LocationId }).subscribe({
      next: (res: any) => {
        this.PreDefinedParameter = res.data
      },
      error: (err: any) => {
        console.error("Error fetching PreDefined Parameter", err);
      }
    })
  }

}
