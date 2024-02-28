import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'menu-buttons',
  templateUrl: './menu-buttons.component.html',
  styleUrls: ['./menu-buttons.component.scss']
})
export class MenuButtonsComponent implements OnInit {
  @Output() importClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() addClick = new EventEmitter<any>();
  @Input() viewAddBtn: boolean = true;
  @Input() viewDeleteBtn: boolean = true;
  @Input() viewImportBtn: boolean = true;
  @Input() disableAddBtn: boolean = false;
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
