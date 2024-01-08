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
  @Output() continueClick = new EventEmitter();
  @Output() ChangeJobClick = new EventEmitter();
  @Output() SaveGridDataClick = new EventEmitter();
  @Input() isViewDelete: boolean = true;
  @Input() isViewMore: boolean = true;
  @Input() isViewArrow: boolean = true;
  @Input() isViewContinue: boolean = false;
  @Input() isViewSaveGridData: boolean = false;
  @Input() isViewChangeJob: boolean = false;
  @Input() isViewCancel: boolean = true;
  @Input() editSaveBtnText?: string = '';

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
  continueClicked() {
    this.continueClick.emit();
  }
  saveGridDataClicked() {
    this.SaveGridDataClick.emit();
  }
  changeJobClicked() {
    this.ChangeJobClick.emit();
  }

}
