import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { PrimengModuleModule } from './primeng-module/primeng-module.module';
import { AngularModuleModule } from './angular-module/angular-module.module';


@NgModule({
  declarations: [
    // your shared components, directives, or pipes
  ],
  imports: [
    // other modules here (if required)
    CommonModule,
    SharedRoutingModule,
    PrimengModuleModule,
    AngularModuleModule
  ],
  exports: [
    // shared components, directives, or pipes
  ]
})

export class SharedModule { }
