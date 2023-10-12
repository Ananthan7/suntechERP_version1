import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'menu-buttons',
  templateUrl: './menu-buttons.component.html',
  styleUrls: ['./menu-buttons.component.scss']
})
export class MenuButtonsComponent implements OnInit {
  @Output() importClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() addClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  AddBtnClicked(){
    this.addClick.emit()
  }
  deleteBtnClicked(){
    this.deleteClick.emit()
  }
  importBtnClicked(){
    this.importClick.emit()
  }

}
