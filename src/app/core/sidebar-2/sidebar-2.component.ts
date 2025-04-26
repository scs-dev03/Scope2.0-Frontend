import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-sidebar-2',
  imports: [PrimengModuleModule,SharedModule],
  templateUrl: './sidebar-2.component.html',
  styleUrl: './sidebar-2.component.css'
})
export class Sidebar2Component {

  @ViewChild('drawerRef') drawerRef!: Drawer;

  @Input() sidebarvisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  items: MenuItem[] = [];
  username: any = localStorage.getItem('username');

  ngOnInit() {

    if(localStorage.getItem('usertype') == 'U'){

      this.items = [
        {
          label: 'Home',
          expanded: false,
          icon: 'pi pi-home',
           routerLink: '/home'
        },
        {
          label: 'VON',
          expanded: true,
          icon: 'pi pi-file',
          items: [
            {
              label: 'Dealer VON',
              icon: 'pi pi-file',
              expanded: false,
              routerLink: '/dvon'
            },
            
          ]
        }
      ];
    }
    else if(localStorage.getItem('usertype') == 'A'){
      this.items = [
        {
          label: 'Home',
          expanded: false,
          icon: 'pi pi-home',
           routerLink: '/home'
        },
        {
          label: 'VON',
          expanded: true,
          icon: 'pi pi-file',
          items: [
            {
              label: 'VON Pending Count',
              icon: 'pi pi-image',
              routerLink: '/pcount'
            },
            {
              label: 'Admin VON',
              icon: 'pi pi-image',
              routerLink: '/avon'
            },
            {
              label: 'VON Remark Creation',
              icon: 'pi pi-file',
              routerLink: '/armk'
            }
          ]
        }
      ];
      
    }
    
  }

  ngAfterViewInit(): void {
    this.setupBackdropClickHandler();
  }

  setupBackdropClickHandler(): void {
    const observer = new MutationObserver(() => {
      const backdrop = document.querySelector('.p-drawer-mask');
      if (backdrop) {
        backdrop.addEventListener('click', this.handleBackdropClick.bind(this));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  handleBackdropClick(): void {
    this.sidebarvisible = false;
    this.close.emit(); // Notify parent that sidebar is closed
  }

  closeCallback(event: any): void {
    this.sidebarvisible = false;
    this.close.emit();
  }
}
