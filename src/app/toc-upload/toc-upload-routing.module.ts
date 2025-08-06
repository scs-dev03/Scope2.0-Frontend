import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleLocationComponent } from './SPM/single-location/single-location.component';
import { MultiLocationComponent } from './SPM/multi-location/multi-location.component';
import { BulkUploadComponent } from './SPM/bulk-upload/bulk-upload.component';
import { SingleUploadComponent } from './Admin/single-upload/single-upload.component';
import { MultiUploadComponent } from './Admin/multi-upload/multi-upload.component';
import { AdminBulkUploadComponent } from './Admin/admin-bulk-upload/admin-bulk-upload.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [

  {
    path:'spm-sl',component: SingleLocationComponent,
    //canActivate:[authGuard]
  },
   {
    path:'spm-ml',component: MultiLocationComponent,
     //canActivate:[authGuard]
  },
   {
    path:'spm-bl',component: BulkUploadComponent,
     //canActivate:[authGuard]
  },
   {
    path:'admin-sl',component: SingleUploadComponent,
     //canActivate:[authGuard]
  },
   {
    path:'admin-ml',component: MultiUploadComponent,
     //canActivate:[authGuard]
  },
   {
    path:'admin-bl',component: AdminBulkUploadComponent,
     //canActivate:[authGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TOCUploadRoutingModule { }
