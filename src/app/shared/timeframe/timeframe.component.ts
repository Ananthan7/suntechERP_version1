import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeframe',
  templateUrl: './timeframe.component.html',
  styleUrls: ['./timeframe.component.scss']
})
export class TimeframeComponent implements OnInit {
  date = new Date();
  cdate = new Date(new Date().getFullYear(), 0, 1);
  currentDate: any =  new Date().toString().slice(4, 15);
  firstDate: any = new Date(this.cdate.getFullYear(), this.cdate.getMonth(), 1).toString().slice(4, 15);
  constructor() { }

  ngOnInit(): void {
  }

}
