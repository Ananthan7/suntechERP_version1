import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() dateValue?: { fromDate: string; toDate: string };


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      fromDate: [null],
      toDate: [null]
    });
    
    if(this.dateValue){
      this.dateForm.controls.fromDate.setValue(this.dateValue.fromDate)
      this.dateForm.controls.toDate.setValue(this.dateValue.toDate)
    }
  }
  
  async ngAfterViewInit() {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2000 milliseconds (2 seconds)
    console.log('fetched date', this.dateValue)
    this.dateForm.controls.fromDate.setValue(this.dateValue?.fromDate, { emitEvent: false });
    this.dateForm.controls.toDate.setValue(this.dateValue?.toDate, { emitEvent: false });
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
