import { Component, EventEmitter, HostListener, Input, Output, output, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { TieredMenu } from 'primeng/tieredmenu';
import { SidebarService } from '../../services/sidebar.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { take } from 'rxjs';
import { environment } from '../../../../environments/environment'

interface SidebarItem {
  id: string;
  label: string;
  type: 'header' | 'divider' | 'group' | 'link';
  icon?: string;
  route?: string;
  exact?: boolean;
  order?: number;
  external?: boolean;
  roles?: string[];
  badge?: {
    text: string | number;
    variant: 'success' | 'warning' | 'info' | 'danger';
    api?: string;
    pollMs?: number;
  };
  children?: SidebarItem[];
  featureFlags?: string[];
}


@Component({
  selector: 'app-sidebar',
  imports: [PrimengModuleModule, SharedModule, FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  providers: [],
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {



  constructor(private sidebarservice: SidebarService) {
  }


  get compact(): boolean {
    if (this.collapsed) {
      return this.collapsed || this.isMobile
    }
    return this.collapsed && this.isMobile;

  }


  isMobile = window.innerWidth < 640;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 640;
  }

  @Input() collapsed = false; // <-- NEW

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  trackById = (_: number, item: any) => item.id ?? item.label;

  toggleGroup(item: any) {
    item.expanded = !item.expanded;
  }


  ngOnInit(): void {
    console.log('hello from sidebar');

    const savedMenu = sessionStorage.getItem('sidebarMenu');

    if (savedMenu) {
      this.menu = JSON.parse(savedMenu);
      this.menu = this.sortMenu(this.menu);
    } else {
      const checkMenu = setInterval(() => {
        const menuData = sessionStorage.getItem('sidebarMenu');
        if (menuData) {
          console.log('Sidebar menu found in sessionStorage');
          this.menu = JSON.parse(menuData);
          this.menu = this.sortMenu(this.menu);
          clearInterval(checkMenu);
        }
      }, 500); 
    }
  }


  sortMenu(menu: any[]) {
    return menu
      .sort((a, b) => a.order - b.order)
      .map(item => {
        if (item.type === 'group' && item.children) {
          item.children = this.sortMenu(item.children);
          item.expanded = false; // default collapsed
        }
        return item;
      });
  }


  permission: any;

  getSidebarModuleData() {
    this.sidebarservice.getModules().subscribe((res: any) => {
      this.menu = res.tree;
      this.permission = res.accessibleRoutes;
    })
  }


  @Input() menu: any[] = []
}
