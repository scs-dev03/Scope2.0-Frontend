import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bucket-management',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './bucket-management.component.html',
  styleUrl: './bucket-management.component.css'
})
export class BucketManagementComponent {

  BucketForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.BucketForm = this.fb.group({
      BucketName: (''),
      ParameterName: ('')
    })
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  first: number = 0;

  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }



}
