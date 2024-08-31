import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  currentDate = new Date();
  fromDate= new Date();
  toDate = new Date();
  @Output() selectedDate = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  fromDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate.emit({'FromDate': event})
    // console.log('From Date changed:', event.value);
  }

  ToDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate.emit({'ToDate': event})
    // console.log('To Date changed:', event.value);
  }

}
