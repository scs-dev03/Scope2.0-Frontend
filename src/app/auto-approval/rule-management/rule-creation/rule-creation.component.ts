import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { SharedServiceService } from '../../../services/shared-service.service';
import { RuleCreationService } from '../../../services/Auto-Approvals/rule-creation.service';

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
    this.LocationSpecificName.disable()
    this.sharedService.updateModuleName('Rule Creation');
  }

  NumericRule: FormGroup;


  LocationSpecificName: FormGroup;

  visibleTrueFalse: boolean = false
  visible: boolean = false
  Result: any
  trueRemarktext: any
  falseRemarktext: any

  ruleType = [
    { name: 'Stock', value: 'S' },
    { name: 'Vehicle', value: 'V' }
  ]

  RuleName = new FormGroup({
    NameofRule: new FormControl('', [Validators.required]),
    Description: new FormControl('', [Validators.required]),
    RuleType: new FormControl(null)
  })
  trueFalseInput = new FormGroup({

    trueAction: new FormControl(null),
    trueRemark: new FormControl(null),
    trueParameter: new FormControl(null),
    falseAction: new FormControl(null),
    falseRemark: new FormControl(null),
    falseParameter: new FormControl(null)

  })

  constructor(private fb: FormBuilder, private sharedService: SharedServiceService, private ruleservice: RuleCreationService) {
    this.NumericRule = this.fb.group({
      selectedBucket: [],
      selectedParameter: [],
      selectedOperator: [],
      SubParameters: [],
      enteredValue: ['']
    });
    this.LocationSpecificName = this.fb.group({
      brand: [null],
      dealer: [null],
      location: [null]
    })
  }

  onlocationSpecificEnable(checked: boolean) {
    if (checked === true) {
      this.LocationSpecificName.enable();
    } else {
      this.LocationSpecificName.disable();
    }

  }


  selectedRuleType: string = 'numeric';
  locationSpecific: boolean = false
  SaveAsTemplate: boolean = false
  ActionList: any
  enteredValue: string = '';
  expression = '';
  ruleChunks: string[] = []; // this will store each small expression added
  sendExpression = '';

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

    const Brand = sessionStorage.getItem("Brand");
    if (Brand) {
      return this.Brand = JSON.parse(Brand);
    }
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
    this.FetchDealer(this.LocationSpecificName.value.brand)
  }
  Dealer: any[] = [];

  FetchDealer(brandId: any): void {
    this.ruleservice.fetchDealer({ brandid: brandId }).subscribe({
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
    this.FetchLocation(this.LocationSpecificName.value.dealer)
  }

  Location: any[] = [];

  FetchLocation(dealerId: any): void {
    this.ruleservice.fetchLocation({ dealerid: dealerId }).subscribe({
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


  FetchAction() {
    this.ruleservice.fetchRuleAction().subscribe({
      next: (res:any)=>{
        this.ActionList = res.data
      },
      error: (err) =>{
        console.error("error Fetching Action List",err);
        
      }
    })
  }

  trueRemark: string = ''
  falseRemark: string = ''

  CreateRule(name: any, description: any, expression: any, trueOutput: any, falseOutput: any, LocationId: any, createdBy: any, trueRemarktext: any, falseRemarktext: any,rulefor:any) {
    const payload = {
      name: name,
      description: description,
      expression: expression,
      trueOutput: trueOutput,
      falseOutput: falseOutput,
      LocationId: LocationId,
      createdBy: createdBy,
      trueRemark: trueRemarktext,
      falseRemark: falseRemarktext,
      rulefor: rulefor

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

      },
      error: (err: any) => {
        console.error("Error creating rule:", err);
      },
      complete: () => {
        console.log("CreateRule API call completed.");
      }
    });
  }

  CreateTemplateRule(name: any, tempDesc: any, template: any, createdBy: any, trueOutput: any, falseOutput: any, trueRemarktext: any, falseRemarktext: any) {
    const payload = {
      name: name,
      tempDesc: tempDesc,
      template: template,
      createdBy: createdBy,
      trueOutput: trueOutput,
      falseOutput: falseOutput,
      trueRemark: trueRemarktext,
      falseRemark: falseRemarktext

    }

    this.ruleservice.CreateRuleTemplate(payload).subscribe({
      next: (res: any) => {
        console.log("Rule created successfully:", res);
        this.visible = true;
        this.trueRemark = ''
        this.falseRemark = ''
        this.sendExpression = ''
        this.RuleName.value.NameofRule = null
        this.RuleName.value.Description = ''
        this.expression = ''
        this.Result = res.message
        this.visibleTrueFalse = false;

      },
      error: (err: any) => {
        console.error("Error creating rule:", err);
        this.visible = true;
        this.trueRemark = ''
        this.falseRemark = ''
        this.sendExpression = ''
        this.RuleName.value.NameofRule = null
        this.RuleName.value.Description = ''
        this.expression = ''
        this.Result = err
        this.visibleTrueFalse = false;
      },
      complete: () => {
        console.log("CreateRule API call completed.");
      }
    });
  }

  OnClickSaveRule() {
    if (this.SaveAsTemplate) {
      this.CreateTemplateRule(this.RuleName.value.NameofRule, this.RuleName.value.Description, this.sendExpression, this.trueFalseInput.value.trueAction, this.trueFalseInput.value.falseAction, sessionStorage.getItem('userid'), this.trueFalseInput.value.trueRemark, this.trueFalseInput.value.falseRemark)
    }
    else {
      console.log(this.trueFalseInput.value);
      
      this.CreateRule(this.RuleName.value.NameofRule, this.RuleName.value.Description, this.sendExpression, this.trueFalseInput.value.trueAction, this.trueFalseInput.value.falseAction, this.LocationSpecificName.value.location, sessionStorage.getItem('userid'), this.trueFalseInput.value.trueRemark, this.trueFalseInput.value.falseRemark,this.RuleName.value.RuleType)
    }
  }


}
