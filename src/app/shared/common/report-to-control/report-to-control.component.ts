import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-report-to-control',
  templateUrl: './report-to-control.component.html',
  styleUrls: ['./report-to-control.component.scss']
})
export class ReportToControlComponent implements OnInit {
  selectedReport:string ='preview'
  reportTo: any;
  @Output() selectedvalue = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSelectionChange(event: any){
    this.selectedvalue.emit(event)
  }
  
}
