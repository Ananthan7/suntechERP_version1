import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-to-control',
  templateUrl: './report-to-control.component.html',
  styleUrls: ['./report-to-control.component.scss']
})
export class ReportToControlComponent implements OnInit {
  selectedReport:string ='preview'
  constructor() { }

  ngOnInit(): void {
  }

}
