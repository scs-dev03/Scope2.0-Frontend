import { Component } from '@angular/core';

import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-rule-creation',
  imports: [PrimengModuleModule,FormsModule,CommonModule,SHARED_IMPORTS,ReactiveFormsModule,PrimengModuleModule,SharedModule],
  templateUrl: './rule-creation.component.html',
  styleUrl: './rule-creation.component.css'
})
export class RuleCreationComponent {

  NumericRule: FormGroup;
  AlphaNumericRule: FormGroup;

   constructor(private fb: FormBuilder) {
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
  }

   selectedRuleType: string = 'numeric';


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
    { label: 'Days for which open job line to be considered to calculate free stock for self or for trasnfer', value: 'p3' },
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
    { label: '<', value: '=' },
    { label: '>', value: '=' },
    { label: '%', value: '=' }
    ];


     parametersAlphaNumeric = [
    { label: 'Part Number', value: 'p1' },
    { label: 'Part Category ', value: 'p1' },
    { label: 'Order Type', value: 'p1' },
    { label: 'Job Card Type', value: 'p1' },
    { label: 'Part Master', value: 'p1' },
    { label: 'Part Block List Dealer Level', value: 'p1' },
    { label: 'Part Block List Brand Level', value: 'p1' },
    { label: 'Part Block List Location Level', value: 'p1' },
    { label: 'Party Name', value: 'p1' },
    { label: 'Consignee type ', value: 'p1' },
    { label: 'Sender Location ', value: 'p1' },
    { label: 'Reciever Location ', value: 'p1' },
    { label: 'Part Stockability ', value: 'p1' },
    { label: 'Gainer Setting', value: 'p1' },
    { label: 'Cluster Setting', value: 'p1' },
    { label: 'Dealer side Remarks', value: 'p1' },
    { label: 'Sale Type', value: 'p1' },
    { label: 'MODEL', value: 'p1' },
    { label: 'Part specification ', value: 'p1' },
    { label: 'Warranty type', value: 'p1' },
    { label: 'Job card Status (Open & close)', value: 'p1' },
    { label: 'Cluster Name', value: 'p1' },
    { label: 'Rule Name', value: 'p1' },
    { label: '', value: 'p1' }
    ]
  
  
  // selectedBucket: any = null  
  // selectedParameter: any = null;
  // selectedOperator: any = null;
  enteredValue: string = '';

  expression: string = '';

 appendToRuleNumeric() {
  let chunk = '';
  const param = this.NumericRule.get('selectedParameter')?.value
  const operator = this.NumericRule.get('selectedOperator')?.value
  const value = this.NumericRule.get('enteredValue')?.value

  if (param) {
    chunk += `${param} `;
  }

  if (operator) {
    // If operator is ( or ), space it properly
    chunk += (operator === '(' || operator === ')') ? `${operator} ` : `${operator} `;
  }

  if (value) {
    chunk += `${value} `;
  }

  this.expression += chunk;

  // Reset inputs
  this.NumericRule.get('enteredValue')?.setValue(null);
  this.NumericRule.get('selectedOperator')?.setValue(null);

  this.NumericRule.get('selectedParameter')?.setValue(null);

  this.enteredValue = '';
}


appendToRuleAlphaNumeric(){


   let chunk = '';
  const param = this.AlphaNumericRule.get('bucket')?.value
  const Keyword = this.AlphaNumericRule.get('keyword')?.value
  const operator = this.AlphaNumericRule.get('parameter')?.value
  const value = this.AlphaNumericRule.get('enteredValue')?.value

  if (param) {
    chunk += `${param} `;
  }

  if (Keyword) {
    chunk += `${Keyword} `;
  }

  if (operator) {
    // If operator is ( or ), space it properly
    chunk += (operator === '(' || operator === ')') ? `${operator} ` : `${operator} `;
  }

  if (value) {
    chunk += `${value} `;
  }

  this.expression += chunk;

  // Reset inputs
  //this.AlphaNumericRule.get('bucket')?.setValue(null);
  this.AlphaNumericRule.get('parameter')?.setValue(null);
  this.AlphaNumericRule.get('keyword')?.setValue(null);
  this.AlphaNumericRule.get('enteredValue')?.setValue(null);

  this.enteredValue = '';

}




}
