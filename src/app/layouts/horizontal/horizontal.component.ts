import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})

/**
 * Horizontal Component
 */
export class HorizontalComponent implements OnInit {

  isCondensed = false;
  @Input() screenName$!: Observable<string>;  
  screenName: string = '';  
  private screenNameSubscription!: Subscription;

  constructor() { }

  ngOnInit(): void {

    this.screenNameSubscription = this.screenName$.subscribe((value: string) => {
      this.screenName = value;
      console.log('Screen name updated:', this.screenName);  
    });

    document.body.setAttribute('data-layout', 'horizontal');
    document.body.removeAttribute('data-sidebar');
  }


  ngOnDestroy(): void {
    if (this.screenNameSubscription) {
      this.screenNameSubscription.unsubscribe();
    }
  }
  /**
   * Mobile Toggle Menu
   */
  onToggleMobileMenu() {
    const element = document.getElementById('topnav-menu-content');
    element?.classList.toggle('show');
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

}
