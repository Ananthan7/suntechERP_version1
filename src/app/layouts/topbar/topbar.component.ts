import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../core/services/language.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar Component
 */
export class TopbarComponent implements OnInit {
  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Input() arbArrowView: boolean = true;

  mode: string | undefined;
  element: any;
  flagvalue: any;
  cookieValue: any;
  countryName: any;
  valueset: any;

  loginData: any;
  LayoutMode: any;
  username: any;
  email: any;
  languageSelected: any;
  moduleHeading:any = ''
  app_version: string = environment.app_version
  constructor(
    private router: Router,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private eventService: EventService
    ) { 
      this.languageSelected = this.languageService.getLanguage()
    }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: '', lang: 'en' },
    { text: 'Spanish', flag: '', lang: 'es' },
    { text: 'German', flag: '', lang: 'de' },
    { text: 'Italian', flag: '', lang: 'it' },
    { text: 'Russian', flag: '', lang: 'ru' },
  ];

  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {
    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
    this.loginData = localStorage.getItem('username');
    this.username = this.loginData;
    // this.username = JSON.parse(this.loginData);
    // this.username = data.username;
    // this.email = data.email;
    this.getLayoutMode()
    this.getModuleHeader()
  }
  getModuleHeader(){
    this.eventService.behaviorSubscribe('moduleHeader', (moduleHeading) => {
      this.moduleHeading = moduleHeading;
      // this.moduleHeading(this.moduleHeading);
    });
  }
  getLayoutMode(){
    this.eventService.subscribe('changeMode', (mode) => {
      if(mode){
        this.LayoutMode = mode
      }
    });
  }

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    // if (environment.defaultauth === 'firebase') {
    //   this.authService.logout();
    // } else {
      this.authFackservice.logout();
    // }
    this.router.navigate(['/account/login']);
    localStorage.clear();
  }

}
