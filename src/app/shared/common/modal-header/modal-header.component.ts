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
  @Output() stockClick = new EventEmitter();
  @Output() SaveGridDataClick = new EventEmitter();
  @Output() changeJobClick = new EventEmitter();
  @Output() auditTrailClick = new EventEmitter();
  @Output() PostClick = new EventEmitter();
  @Input() isViewDelete: boolean = true;
  @Input() isViewMore: boolean = true;
  @Input() isViewArrow: boolean = true;
  @Input() isViewContinue: boolean = false;
  @Input() isViewSaveGridData: boolean = false;
  @Input() isViewChangeJob: boolean = false;
  @Input() isViewStock: boolean = false;
  @Input() isViewCancel: boolean = true;
  @Input() isViewSave: boolean = true;
  @Input() isViewAuditTrail: boolean = false;
  @Input() isViewPost: boolean = false;
  @Input() isViewPreview: boolean = false;
  @Input() isViewExport: boolean = false;
  @Input() isSelectAll: boolean = false;
  @Input() isSelectNone: boolean = false;
  @Input() isInvert: boolean = false;
  @Input() isLock: boolean = false;
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
    this.changeJobClick.emit();
  }
  stockClicked() {
    this.stockClick.emit();
  }
  auditTrailClicked() {
    this.auditTrailClick.emit();
  }
  PostClicked() {
    this.PostClick.emit();
  }
  ExportClicked(){
    this.PostClick.emit();
  }
  PreviewClicked(){
    this.PostClick.emit();

  }
  selectallClicked(){
    this.PostClick.emit();

  }
  selectnoneClicked(){
    this.PostClick.emit();

  }
  invertClicked(){
    this.PostClick.emit();

  }
  lockClicked(){
    this.PostClick.emit();

  }
}
