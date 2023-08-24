import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import MetisMenu from 'metismenujs';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { filter } from 'rxjs/operators';
import { LanguageService } from 'src/app/core/services/language.service';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

/**
 * Sidebar Component
 */
export class SidebarComponent implements OnInit {
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Input() arbArrowView: boolean = true;

  usertype = localStorage.getItem('userRole');
  languageSelected: string = ''
  menu: any;
  menuItems: MenuItem[] = [];
  dataOjbect: any;
  constructor(private router: Router,
    public translate: TranslateService,
    private langService: LanguageService,
    private eventService: EventService,
  ) {
    translate.setDefaultLang('en');
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
      }
    });

    this.languageSelected = this.langService.getLanguage()
    let moduleHead = localStorage.getItem('moduleHeader');
    if(moduleHead){
      this.eventService.behaviorBroadcast('moduleHeader', moduleHead);
    }
  }

  ngOnInit(): void {
    // this.menuItems = this.usertype=='USER'?MENU.filter((element:any)=>{return element.userType== 'BOTH'}) : MENU;
    // this.menuItems=MENU;
    if (this.usertype == 'USER') {
      this.menuItems = MENU.filter((element: any) => { return element.userType == 'USER' });
    } else if (this.usertype == 'ADMIN') {
      this.menuItems = MENU.filter((element: any) => { return element.userType == 'ADMIN' });
    }
    // }else{
    //   this.menuItems = MENU;
    // }
    //this.getSideMenu();
  }

  titleClicked(data: any) {
    if (data == 'OVERVIEW'|| data == 'KPI EVOLUTION' || data == 'KNOWLEDGE BASE'
    || data == 'USERS' || data == 'GROUPS' || data == 'MENU ALLOCATION'
    || data == 'THEME SETTINGS' || data == 'HOME') {
      localStorage.setItem('moduleHeader', data);
      this.eventService.behaviorBroadcast('moduleHeader', data);
    }
  }
  subtitleClicked(data: any) {
    if (data != 'OVERVIEW' || data != 'KPI EVOLUTION' || data != 'KNOWLEDGE BASE') {
      localStorage.setItem('moduleHeader', data);
      this.eventService.behaviorBroadcast('moduleHeader', data);
    }
  }
  // getSideMenu(){
  //   this.apiService.getSideMenu().then((result:any)=>{
  //       let menu = result.menus
  //       for(let i=0; i<menu.length; i++){
  //         this.dataOjbect ={
  //           id:menu[i].MID,
  //           label:menu[i].MENU_ID
  //         }

  //         this.menuItems.push(this.dataOjbect);
  //       }

  //   })
  // }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /***
   * Activate droup down set 
   */
  ngAfterViewInit() {
    this.menu = new MetisMenu('#side-menu');
    this._activateMenuDropdown();
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }
              }
            }
          }
        }
      }
    }
  }

}
