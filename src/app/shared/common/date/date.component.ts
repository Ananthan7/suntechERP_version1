import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  currentDate = new Date();
  toDate = new Date();
  fromDate: Date | null = new Date();
  minToDate: Date | null = null;
  
  @Output() selectedDate = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  fromDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.fromDate = event.value;
    this.minToDate = this.fromDate;
    this.selectedDate.emit({'FromDate': event.value});
  }

  ToDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate.emit({'ToDate': event.value});
  }
}
