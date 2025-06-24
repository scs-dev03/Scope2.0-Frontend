import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { ExportComponent } from './export/export.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path:'app-upload',component:UploadComponent,
   //  canActivate:[authGuard]
  },
  {
    path:'app-export',component:ExportComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadTimeRoutingModule { }
