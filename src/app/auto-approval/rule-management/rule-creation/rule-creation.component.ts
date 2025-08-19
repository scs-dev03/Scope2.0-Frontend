import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { SharedServiceService } from '../../../services/shared-service.service';

@Component({
  selector: 'app-rule-creation',
  imports: [PrimengModuleModule, FormsModule, CommonModule, SHARED_IMPORTS, ReactiveFormsModule, PrimengModuleModule, SharedModule],
  templateUrl: './rule-creation.component.html',
  styleUrl: './rule-creation.component.css'
})
export class RuleCreationComponent {

  ngOnInit(): void {

    this.NumericRule.disable()
    this.AlphaNumericRule.disable()
    this.onRuleTypeChange();
    this.LocationSpecificName.disable()
    this.sharedService.updateModuleName('Rule Creation');
  }

  NumericRule: FormGroup;
  AlphaNumericRule: FormGroup;
  LocationSpecificName: FormGroup;

  visible: boolean = false

  constructor(private fb: FormBuilder,private sharedService: SharedServiceService) {
    this.NumericRule = this.fb.group({
      selectedBucket: [''],
      selectedParameter: [''],
      selectedOperator: [''],
      enteredValue: ['']
    });
    this.AlphaNumericRule = this.fb.group({
      bucket: [''],
      parameter: [''],
      keyword: [''],
      operator: [''],
      enteredValue: ['']
    });
    this.LocationSpecificName = this.fb.group({
      brand: [''],
      dealer: [''],
      location: ['']
    })
  }

  onRuleTypeChange() {
    if (this.selectedRuleType === 'numeric') {
      this.NumericRule.enable();
      this.AlphaNumericRule.disable();
    } else if (this.selectedRuleType === 'alphanumeric') {
      this.AlphaNumericRule.enable();
      this.NumericRule.disable();
    }
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

  parametersNumeric = [
    { label: 'Days Allowed for Stock Upload', value: 'p1' },
    { label: 'Value Difference Allowed in Uploaded Stock ', value: 'p2' },
    { label: 'Ordered Qty ', value: 'p3' },
    { label: 'Allowed Price for Party', value: 'p3' },
    { label: 'Max Qty', value: 'p3' },
    { label: 'Buffer Days for SOQ', value: 'p3' },
    { label: 'Buffer Days for OOQ', value: 'p3' },
    { label: 'Open Jobline /Reserved for Vehicle', value: 'p3' },
    { label: 'Stock Qty', value: 'p3' },
    { label: 'Substitution Stock ', value: 'p3' },
    { label: 'OOQ', value: 'p3' },
    { label: 'pLast order suggested Qty3', value: 'p3' },
    { label: 'Group Stock Quantity', value: 'p3' },
    { label: 'Group Excess Stock ', value: 'p3' },
    { label: 'Gainer Free Stock ', value: 'p3' },
    { label: 'Allowed Discount ', value: 'p3' },
    { label: 'Cluster Free Stock ', value: 'p3' },
    { label: 'Requested Quantity ', value: 'p3' },
    { label: 'Qty Per Vehicle', value: 'p3' },
    { label: '6 Month Workshop sale', value: 'p3' },
    { label: '6 Month Counter sale', value: 'p3' },
    { label: '6 Month brand Workshop sale', value: 'p3' },
    { label: '6 Month Brand Counter sale', value: 'p3' },
    { label: 'Non Moving Stock on Part Number', value: 'p3' },
    { label: 'MOQ', value: 'p3' },
    { label: 'Price', value: 'p3' },
    { label: 'Brandid', value: 'p3' },
    { label: 'Dealerid', value: 'p3' },
    { label: 'Locationid', value: 'p3' },
    { label: 'Stock upload date', value: 'p3' },
    { label: 'SOQ', value: 'p3' },
    { label: 'Ordervalue', value: 'p3' },
    { label: 'Advancevalue', value: 'p3' },
    { label: 'NDP', value: 'p3' },
    { label: 'Allowed Price for Stockable ', value: 'p3' },
    { label: 'Allowed Price for Non-Stockable', value: 'p3' },
    { label: 'Allowed Price for Non-Moving', value: 'p3' },
    { label: 'Cluster Discount', value: 'p3' },
    { label: 'Cluster Price Threshold', value: 'p3' },
    { label: 'Gainer stock ', value: 'p3' },
    { label: 'TAT', value: 'p3' },
    { label: 'Count of location in brand', value: 'p3' },
    { label: 'Order day', value: 'p3' }
  ];

  operators = [
    { label: '+', value: '+' },
    { label: '-', value: '-' },
    { label: '*', value: '*' },
    { label: '/', value: '/' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '<=', value: '<=' },
    { label: '>=', value: '>=' },
    { label: '<', value: '<' },
    { label: '>', value: '>' },
    { label: '%', value: '%' },
    { label: 'Contain', value: 'Contain' },
    { label: 'in', value: 'in' }
  ];


  parametersAN = [
    { label: 'Days Allowed for Stock Upload', value: 'p1' },
    { label: 'Value Difference Allowed in Uploaded Stock ', value: 'p2' },
    { label: 'Ordered Qty ', value: 'p3' },
    { label: 'Allowed Price for Party', value: 'p3' },
    { label: 'Max Qty', value: 'p3' },
    { label: 'Buffer Days for SOQ', value: 'p3' },
    { label: 'Buffer Days for OOQ', value: 'p3' },
    { label: 'Open Jobline /Reserved for Vehicle', value: 'p3' },
    { label: 'Stock Qty', value: 'p3' },
    { label: 'Substitution Stock ', value: 'p3' },
    { label: 'OOQ', value: 'p3' },
    { label: 'pLast order suggested Qty3', value: 'p3' },
    { label: 'Group Stock Quantity', value: 'p3' },
    { label: 'Group Excess Stock ', value: 'p3' },
    { label: 'Gainer Free Stock ', value: 'p3' },
    { label: 'Allowed Discount ', value: 'p3' },
    { label: 'Cluster Free Stock ', value: 'p3' },
    { label: 'Requested Quantity ', value: 'p3' },
    { label: 'Qty Per Vehicle', value: 'p3' },
    { label: '6 Month Workshop sale', value: 'p3' },
    { label: '6 Month Counter sale', value: 'p3' },
    { label: '6 Month brand Workshop sale', value: 'p3' },
    { label: '6 Month Brand Counter sale', value: 'p3' },
    { label: 'Non Moving Stock on Part Number', value: 'p3' },
    { label: 'MOQ', value: 'p3' },
    { label: 'Price', value: 'p3' },
    { label: 'Brandid', value: 'p3' },
    { label: 'Dealerid', value: 'p3' },
    { label: 'Locationid', value: 'p3' },
    { label: 'Stock upload date', value: 'p3' },
    { label: 'SOQ', value: 'p3' },
    { label: 'Ordervalue', value: 'p3' },
    { label: 'Advancevalue', value: 'p3' },
    { label: 'NDP', value: 'p3' },
    { label: 'Days for which open job line to be considered to calculate free stock for self or for trasnfer', value: 'p3' },
    { label: 'Allowed Price for Stockable ', value: 'p3' },
    { label: 'Allowed Price for Non-Stockable', value: 'p3' },
    { label: 'Allowed Price for Non-Moving', value: 'p3' },
    { label: 'Cluster Discount', value: 'p3' },
    { label: 'Cluster Price Threshold', value: 'p3' },
    { label: 'Gainer stock ', value: 'p3' },
    { label: 'TAT', value: 'p3' },
    { label: 'Count of location in brand', value: 'p3' },
    { label: 'Order day', value: 'p3' },
    { label: 'Part Number', value: 'p1' },
    { label: 'Part Category ', value: 'p2' },
    { label: 'Order Type', value: 'p3' },
    { label: 'Job Card Type', value: 'p4' },
    { label: 'Part Master', value: 'p5' },
    { label: 'Part Block List Dealer Level', value: 'p6' },
    { label: 'Part Block List Brand Level', value: 'p7' },
    { label: 'Part Block List Location Level', value: 'p8' },
    { label: 'Party Name', value: 'p9' },
    { label: 'Consignee type ', value: 'p10' },
    { label: 'Sender Location ', value: 'p11' },
    { label: 'Reciever Location ', value: 'p12' },
    { label: 'Part Stockability ', value: 'p13' },
    { label: 'Gainer Setting', value: 'p14' },
    { label: 'Cluster Setting', value: 'p15' },
    { label: 'Dealer side Remarks', value: 'p16' },
    { label: 'Sale Type', value: 'p17' },
    { label: 'MODEL', value: 'p18' },
    { label: 'Part specification ', value: 'p19' },
    { label: 'Warranty type', value: 'p20' },
    { label: 'Job card Status (Open & close)', value: 'p21' },
    { label: 'Cluster Name', value: 'p22' },
    { label: 'Rule Name', value: 'p23' },
    { label: '', value: 'p24' }
  ]

  ActionList = [
    { label: "Submit", Value: '1' },
    { label: "Manual Intervension", Value: '1' },
    { label: "Actionable", Value: '1' },
    { label: "Reject", Value: '1' },
  ]


  // selectedBucket: any = null  
  // selectedParameter: any = null;
  // selectedOperator: any = null;
  enteredValue: string = '';

  expression = '';
  ruleChunks: string[] = []; // this will store each small expression added

  appendToRuleNumeric() {
    const param = this.NumericRule.get('selectedParameter')?.value;
    const operator = this.NumericRule.get('selectedOperator')?.value;
    const value = this.NumericRule.get('enteredValue')?.value;

    // Add param, operator, and value separately
    if (param) {
      this.ruleChunks.push(`${param} `);
      this.expression += `${param} `;
    }

    if (operator) {
      this.ruleChunks.push(`${operator} `);
      this.expression += `${operator} `;
    }

    if (value) {
      this.ruleChunks.push(`${value} `);
      this.expression += `${value} `;
    }

    // Reset form
    this.NumericRule.get('enteredValue')?.setValue(null);
    this.NumericRule.get('selectedOperator')?.setValue(null);
    this.NumericRule.get('selectedParameter')?.setValue(null);
  }




  removeLastChunk() {
    if (this.ruleChunks.length > 0) {
      this.ruleChunks.pop();                        // 🗑 remove last added piece
      this.expression = this.ruleChunks.join('');   // 🔄 rebuild expression
    }
  }

  // Updated to use objects for tags + expression2
  ruleChunks2: { value: string, type: string }[] = [];
  expression2: string = '';

  appendToRuleAlphaNumeric() {
    const param = this.AlphaNumericRule.get('parameter')?.value;
    const keyword = this.AlphaNumericRule.get('keyword')?.value;
    const operator = this.AlphaNumericRule.get('operator')?.value;
    const value = this.AlphaNumericRule.get('enteredValue')?.value;

    if (param) {
      // Don't add param to expression2; just push it as a tag
      this.ruleChunks2.push({ value: param, type: 'param' });
    }

    if (keyword) {
      const part = `${keyword} `;
      this.ruleChunks2.push({ value: keyword, type: 'keyword' });
      this.expression2 += part;
    }

    if (operator) {
      const part = `${operator} `;
      this.ruleChunks2.push({ value: operator, type: 'operator' });
      this.expression2 += part;
    }

    if (value) {
      const part = `${value} `;
      this.ruleChunks2.push({ value: value, type: 'value' });
      this.expression2 += part;
    }

    // Reset fields
    this.AlphaNumericRule.get('parameter')?.setValue(null);
    this.AlphaNumericRule.get('keyword')?.setValue(null);
    this.AlphaNumericRule.get('operator')?.setValue(null);
    this.AlphaNumericRule.get('enteredValue')?.setValue(null);
  }



  removeLastAlphaChunk() {
    if (this.ruleChunks2.length > 0) {
      this.ruleChunks2.pop();
      this.expression2 = this.ruleChunks2.join('');
    }
  }

  showDialogForfinalCondition() {
    this.visible = true
  }

}
