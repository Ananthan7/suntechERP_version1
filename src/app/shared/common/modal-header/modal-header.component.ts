import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {
  @Output() saveClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Input() isViewDelete: boolean = true;
  @Input() isViewMore: boolean = true;
  @Input() isViewArrow: boolean = true;

  branchCode: any = localStorage.getItem('userbranch')
  userName: any = localStorage.getItem('username')
  constructor() { }

  ngOnInit(): void {
  }

  saveClicked() {
    this.saveClick.emit();
  }
  cancelClicked() {
    this.cancelClick.emit();
  }
  deleteClicked() {
    this.deleteClick.emit();
  }

}
