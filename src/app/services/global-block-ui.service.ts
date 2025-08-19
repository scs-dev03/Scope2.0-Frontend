import { Injectable } from '@angular/core';
// import { BlockUI ,BlockUIService} from 'primeng/blockui';
import { BlockUI } from 'primeng/blockui'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GlobalBlockUiService {


  private blockUIRef: BlockUI | undefined;  // Reference to the BlockUI component

  constructor() {}
  private loadingSubject = new BehaviorSubject<boolean>(false);  // Initial value is false
  loading$ = this.loadingSubject.asObservable();  // Observable to subscribe to
  loadercount = 0;

  // Method to start loading (set isLoading to true)
  startLoading() {
    this.loadercount++
    this.loadingSubject.next(true);
  }

  // Method to stop loading (set isLoading to false)
  stopLoading() {
    this.loadercount--;
    this.loadingSubject.next(false);
  }
}
