import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-common-buttons',
  templateUrl: './common-buttons.component.html',
  styleUrls: ['./common-buttons.component.scss']
})

//CMMON BUTTON COMPONENT FOR REPORT SCREENS

export class CommonButtonsComponent implements OnInit {
  @Output() saveClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  close(){

  }

  saveClicked(){
    this.saveClick.emit();
  }

  cancelClicked() {
    this.cancelClick.emit();
  }
  
}
