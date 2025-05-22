import { Component } from '@angular/core';
import {SharedServiceService} from '../../services/shared-service.service'
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { PageStateService } from '../../services/page-state.service';
@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {


  constructor(private globalBlockUIService:GlobalBlockUiService,
    private pageStateService:PageStateService
  ){
this.pageStateService.is404 = true;
  
  }

  ngOnInit(){
    this.globalBlockUIService.stopLoading();
  }

   ngOnDestroy(): void {
    this.pageStateService.is404 = false; // reset when navigating away
  }
}
