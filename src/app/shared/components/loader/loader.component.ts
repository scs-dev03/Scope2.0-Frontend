import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared-imports/shared-module';

@Component({
  selector: 'app-loader',
  imports: [SHARED_IMPORTS ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

  @Input() isloading: any = false
}
