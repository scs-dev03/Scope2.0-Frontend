import { Component } from '@angular/core';
import {SharedServiceService} from '../../services/shared-service.service'
@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {


  constructor(private sharedService:SharedServiceService){

  
  }

  ngOnInit(){
    // this.sharedService.
  }
}
