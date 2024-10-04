import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-report-screen-buttons',
  templateUrl: './report-screen-buttons.component.html',
  styleUrls: ['./report-screen-buttons.component.scss']
})
export class ReportScreenButtonsComponent implements OnInit {
  @Output() saveTemplateClick = new EventEmitter();
  @Output() previewClicked = new EventEmitter();
  @Output() printClicked = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  saveTemplate(){
    this.saveTemplateClick.emit();
  }

  previewClick(){
    this.previewClicked.emit();
  }

  printClick(){
    this.printClicked.emit();
  }
}
