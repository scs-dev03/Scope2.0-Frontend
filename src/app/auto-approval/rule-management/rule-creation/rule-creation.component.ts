import { Component } from '@angular/core';

import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
   parameters = [
    { label: 'p1', value: 'p1' },
    { label: 'p2', value: 'p2' },
    { label: 'p3', value: 'p3' },
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
    { label: '=', value: '=' },
  ];

  selectedParameter: any = null;
  selectedOperator: any = null;
  enteredValue: string = '';

  expression: string = '';

 appendToRule() {
  let chunk = '';

  const param = this.selectedParameter;
  const operator = this.selectedOperator;
  const value = this.enteredValue;

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
  this.selectedParameter = null;
  this.selectedOperator = null;
  this.enteredValue = '';
}

clearRule(){
  this.enteredValue = ''
  console.log("hellow world ");
  
  
}



}
