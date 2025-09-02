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
  { label: 'Days Allowed for Stock Upload', value: 'Days Allowed for Stock Upload' },
  { label: 'Value Difference Allowed in Uploaded Stock ', value: 'Value Difference Allowed in Uploaded Stock ' },
  { label: 'Ordered Qty ', value: 'Ordered Qty ' },
  { label: 'Allowed Price for Party', value: 'Allowed Price for Party' },
  { label: 'Max Qty', value: 'Max Qty' },
  { label: 'Buffer Days for SOQ', value: 'Buffer Days for SOQ' },
  { label: 'Buffer Days for OOQ', value: 'Buffer Days for OOQ' },
  { label: 'Open Jobline /Reserved for Vehicle', value: 'Open Jobline /Reserved for Vehicle' },
  { label: 'Stock Qty', value: 'Stock Qty' },
  { label: 'Substitution Stock ', value: 'Substitution Stock ' },
  { label: 'OOQ', value: 'OOQ' },
  { label: 'pLast order suggested Qty3', value: 'pLast order suggested Qty3' },
  { label: 'Group Stock Quantity', value: 'Group Stock Quantity' },
  { label: 'Group Excess Stock ', value: 'Group Excess Stock ' },
  { label: 'Gainer Free Stock ', value: 'Gainer Free Stock ' },
  { label: 'Allowed Discount ', value: 'Allowed Discount ' },
  { label: 'Cluster Free Stock ', value: 'Cluster Free Stock ' },
  { label: 'Requested Quantity ', value: 'Requested Quantity ' },
  { label: 'Qty Per Vehicle', value: 'Qty Per Vehicle' },
  { label: '6 Month Workshop sale', value: '6 Month Workshop sale' },
  { label: '6 Month Counter sale', value: '6 Month Counter sale' },
  { label: '6 Month brand Workshop sale', value: '6 Month brand Workshop sale' },
  { label: '6 Month Brand Counter sale', value: '6 Month Brand Counter sale' },
  { label: 'Non Moving Stock on Part Number', value: 'Non Moving Stock on Part Number' },
  { label: 'MOQ', value: 'MOQ' },
  { label: 'Price', value: 'Price' },
  { label: 'Brandid', value: 'Brandid' },
  { label: 'Dealerid', value: 'Dealerid' },
  { label: 'Locationid', value: 'Locationid' },
  { label: 'Stock upload date', value: 'Stock upload date' },
  { label: 'SOQ', value: 'SOQ' },
  { label: 'Ordervalue', value: 'Ordervalue' },
  { label: 'Advancevalue', value: 'Advancevalue' },
  { label: 'NDP', value: 'NDP' },
  { label: 'Days for which open job line to be considered to calculate free stock for self or for trasnfer', value: 'Days for which open job line to be considered to calculate free stock for self or for trasnfer' },
  { label: 'Allowed Price for Stockable ', value: 'Allowed Price for Stockable ' },
  { label: 'Allowed Price for Non-Stockable', value: 'Allowed Price for Non-Stockable' },
  { label: 'Allowed Price for Non-Moving', value: 'Allowed Price for Non-Moving' },
  { label: 'Cluster Discount', value: 'Cluster Discount' },
  { label: 'Cluster Price Threshold', value: 'Cluster Price Threshold' },
  { label: 'Gainer stock ', value: 'Gainer stock ' },
  { label: 'TAT', value: 'TAT' },
  { label: 'Count of location in brand', value: 'Count of location in brand' },
  { label: 'Order day', value: 'Order day' },
  { label: 'Part Number', value: 'Part Number' },
  { label: 'Part Category ', value: 'Part Category ' },
  { label: 'Order Type', value: 'Order Type' },
  { label: 'Job Card Type', value: 'Job Card Type' },
  { label: 'Part Master', value: 'Part Master' },
  { label: 'Part Block List Dealer Level', value: 'Part Block List Dealer Level' },
  { label: 'Part Block List Brand Level', value: 'Part Block List Brand Level' },
  { label: 'Part Block List Location Level', value: 'Part Block List Location Level' },
  { label: 'Party Name', value: 'Party Name' },
  { label: 'Consignee type ', value: 'Consignee type ' },
  { label: 'Sender Location ', value: 'Sender Location ' },
  { label: 'Reciever Location ', value: 'Reciever Location ' },
  { label: 'Part Stockability ', value: 'Part Stockability ' },
  { label: 'Gainer Setting', value: 'Gainer Setting' },
  { label: 'Cluster Setting', value: 'Cluster Setting' },
  { label: 'Dealer side Remarks', value: 'Dealer side Remarks' },
  { label: 'Sale Type', value: 'Sale Type' },
  { label: 'MODEL', value: 'MODEL' },
  { label: 'Part specification ', value: 'Part specification ' },
  { label: 'Warranty type', value: 'Warranty type' },
  { label: 'Job card Status (Open & close)', value: 'Job card Status (Open & close)' },
  { label: 'Cluster Name', value: 'Cluster Name' },
  { label: 'Rule Name', value: 'Rule Name' },
  { label: 'Vehicle Order', value: 'Vehicle Order' },
  { label: 'Except Warranty', value: 'Except Warranty' },
  { label: 'Stock Order', value: 'Stock Order' },
  { label: 'Workshop Sale', value: 'Workshop Sale' },
  { label: 'Counter Sale', value: 'Counter Sale' },
  { label: 'Allowed Category for Approval', value: 'Allowed Category for Approval' },
  { label: 'In Block List', value: 'In Block List' },
  { label: 'In Master', value: 'In Master' },
  
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
    { label: '&&', value: '&&' },
    { label: '||', value: '||' },
    { label: '==', value: '==' },
    { label: '>', value: '>' },
    { label: '%', value: '%' },
    { label: 'Contain', value: 'Contain' },
    { label: 'in', value: 'in' }
  ];


  parametersAN = [
  { label: 'Days Allowed for Stock Upload', value: 'Days Allowed for Stock Upload' },
  { label: 'Value Difference Allowed in Uploaded Stock ', value: 'Value Difference Allowed in Uploaded Stock ' },
  { label: 'Ordered Qty ', value: 'Ordered Qty ' },
  { label: 'Allowed Price for Party', value: 'Allowed Price for Party' },
  { label: 'Max Qty', value: 'Max Qty' },
  { label: 'Buffer Days for SOQ', value: 'Buffer Days for SOQ' },
  { label: 'Buffer Days for OOQ', value: 'Buffer Days for OOQ' },
  { label: 'Open Jobline /Reserved for Vehicle', value: 'Open Jobline /Reserved for Vehicle' },
  { label: 'Stock Qty', value: 'Stock Qty' },
  { label: 'Substitution Stock ', value: 'Substitution Stock ' },
  { label: 'OOQ', value: 'OOQ' },
  { label: 'pLast order suggested Qty3', value: 'pLast order suggested Qty3' },
  { label: 'Group Stock Quantity', value: 'Group Stock Quantity' },
  { label: 'Group Excess Stock ', value: 'Group Excess Stock ' },
  { label: 'Gainer Free Stock ', value: 'Gainer Free Stock ' },
  { label: 'Allowed Discount ', value: 'Allowed Discount ' },
  { label: 'Cluster Free Stock ', value: 'Cluster Free Stock ' },
  { label: 'Requested Quantity ', value: 'Requested Quantity ' },
  { label: 'Qty Per Vehicle', value: 'Qty Per Vehicle' },
  { label: '6 Month Workshop sale', value: '6 Month Workshop sale' },
  { label: '6 Month Counter sale', value: '6 Month Counter sale' },
  { label: '6 Month brand Workshop sale', value: '6 Month brand Workshop sale' },
  { label: '6 Month Brand Counter sale', value: '6 Month Brand Counter sale' },
  { label: 'Non Moving Stock on Part Number', value: 'Non Moving Stock on Part Number' },
  { label: 'MOQ', value: 'MOQ' },
  { label: 'Price', value: 'Price' },
  { label: 'Brandid', value: 'Brandid' },
  { label: 'Dealerid', value: 'Dealerid' },
  { label: 'Locationid', value: 'Locationid' },
  { label: 'Stock upload date', value: 'Stock upload date' },
  { label: 'SOQ', value: 'SOQ' },
  { label: 'Ordervalue', value: 'Ordervalue' },
  { label: 'Advancevalue', value: 'Advancevalue' },
  { label: 'NDP', value: 'NDP' },
  { label: 'Days for which open job line to be considered to calculate free stock for self or for trasnfer', value: 'Days for which open job line to be considered to calculate free stock for self or for trasnfer' },
  { label: 'Allowed Price for Stockable ', value: 'Allowed Price for Stockable ' },
  { label: 'Allowed Price for Non-Stockable', value: 'Allowed Price for Non-Stockable' },
  { label: 'Allowed Price for Non-Moving', value: 'Allowed Price for Non-Moving' },
  { label: 'Cluster Discount', value: 'Cluster Discount' },
  { label: 'Cluster Price Threshold', value: 'Cluster Price Threshold' },
  { label: 'Gainer stock ', value: 'Gainer stock ' },
  { label: 'TAT', value: 'TAT' },
  { label: 'Count of location in brand', value: 'Count of location in brand' },
  { label: 'Order day', value: 'Order day' },
  { label: 'Part Number', value: 'Part Number' },
  { label: 'Part Category ', value: 'Part Category ' },
  { label: 'Order Type', value: 'Order Type' },
  { label: 'Job Card Type', value: 'Job Card Type' },
  { label: 'Part Master', value: 'Part Master' },
  { label: 'Part Block List Dealer Level', value: 'Part Block List Dealer Level' },
  { label: 'Part Block List Brand Level', value: 'Part Block List Brand Level' },
  { label: 'Part Block List Location Level', value: 'Part Block List Location Level' },
  { label: 'Party Name', value: 'Party Name' },
  { label: 'Consignee type ', value: 'Consignee type ' },
  { label: 'Sender Location ', value: 'Sender Location ' },
  { label: 'Reciever Location ', value: 'Reciever Location ' },
  { label: 'Part Stockability ', value: 'Part Stockability ' },
  { label: 'Gainer Setting', value: 'Gainer Setting' },
  { label: 'Cluster Setting', value: 'Cluster Setting' },
  { label: 'Dealer side Remarks', value: 'Dealer side Remarks' },
  { label: 'Sale Type', value: 'Sale Type' },
  { label: 'MODEL', value: 'MODEL' },
  { label: 'Part specification ', value: 'Part specification ' },
  { label: 'Warranty type', value: 'Warranty type' },
  { label: 'Job card Status (Open & close)', value: 'Job card Status (Open & close)' },
  { label: 'Cluster Name', value: 'Cluster Name' },
  { label: 'Rule Name', value: 'Rule Name' },
  { label: 'Vehicle Order', value: 'Vehicle Order' },
  { label: 'Except Warranty', value: 'Except Warranty' },
  { label: 'Stock Order', value: 'Stock Order' },
  { label: 'Workshop Sale', value: 'Workshop Sale' },
  { label: 'Counter Sale', value: 'Counter Sale' },
  { label: 'Allowed Category for Approval', value: 'Allowed Category for Approval' },
  { label: 'In Block List', value: 'In Block List' },
  { label: 'In Master', value: 'In Master' },
  
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
