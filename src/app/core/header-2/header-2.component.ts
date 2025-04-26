import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-header-2',
  imports: [PrimengModuleModule,SharedModule],
  templateUrl: './header-2.component.html',
  styleUrl: './header-2.component.css'
})
export class Header2Component {
  items: any;

  ngOnInit() {
      this.items = [
          {
              label: 'Log Out',
              icon: 'pi pi-sign-out'
          },
          {
              separator: true
          },
        ]
      }
}
