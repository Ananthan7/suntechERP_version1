import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-as-on-date',
  templateUrl: './as-on-date.component.html',
  styleUrls: ['./as-on-date.component.scss']
})
export class AsOnDateComponent implements OnInit {
  dateForm!: FormGroup;
  @Output() selectedDate = new EventEmitter();
  @Input() dateValue?: { asonDate: string; };
  
  constructor(private datePipe: DatePipe, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      date: [new Date()],
    });

    if(this.dateValue){
      this.dateForm.controls.date.setValue(this.dateValue.asonDate)
    }
  }

  formatDate(event: any) {
    const inputDate = event.target.value;
    const parsedDate = new Date(inputDate);
  
    if (!isNaN(parsedDate.getTime())) {
      const formattedDate = this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
      this.selectedDate.emit({'asOnDate': formattedDate})
    } else {
      event.target.value = ''; 
      console.error('Invalid date input');
    }
  }
  
}
