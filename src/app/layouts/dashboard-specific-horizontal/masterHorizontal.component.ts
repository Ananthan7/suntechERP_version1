import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-masterHorizontal',
  templateUrl: './masterHorizontal.component.html',
  styleUrls: ['./masterHorizontal.component.scss']
})

/**
 * Horizontal Component
 */
export class MasterHorizontalComponent implements OnInit {

  isCondensed = false;
  constructor() {}

  ngOnInit(): void {
    document.body.setAttribute('data-layout', 'horizontal');
    document.body.removeAttribute('data-sidebar');
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
