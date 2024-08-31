import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  currentDate = new Date();
  fromDate= new Date();
  toDate = new Date()
  constructor() { }

  ngOnInit(): void {
  }

  fromDateChange(event: MatDatepickerInputEvent<Date>): void {
    console.log('From Date changed:', event.value);
  }

  
}
