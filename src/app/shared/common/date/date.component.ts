import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  dateForm!: FormGroup;
  currentDate: Date = new Date();
  @Output() selectedDate = new EventEmitter();
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      fromDate: [null],
      toDate: [null]
    });
  }

  fromDateChange(event: MatDatepickerInputEvent<Date>): void {
    const fromDate = event.value;
    this.dateForm.get('fromDate')?.setValue(fromDate, { emitEvent: false });
    this.selectedDate.emit({'FromDate': fromDate})
    console.log('From Date changed:', fromDate);
  }

  toDateChange(event: MatDatepickerInputEvent<Date>): void {
    const toDate = event.value;
    this.dateForm.get('toDate')?.setValue(toDate, { emitEvent: false });
    this.selectedDate.emit({'ToDate': toDate})
    console.log('To Date changed:', toDate);
  }
}
