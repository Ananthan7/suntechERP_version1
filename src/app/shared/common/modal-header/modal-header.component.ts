import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {
  @Output() saveClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() continueClicked = new EventEmitter<void>();
  @Output() stockClick = new EventEmitter();
  @Output() SaveGridDataClick = new EventEmitter();
  @Output() changeJobClick = new EventEmitter();
  @Output() auditTrailClick = new EventEmitter();
  @Output() postClick = new EventEmitter();
  @Output() printClick = new EventEmitter();
  @Output() attachmentClick = new EventEmitter();
  @Input() isViewDelete: boolean = true;
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
  @Input() isloading: boolean = false;

  @Input() isViewMore: boolean = true;
  @Input() isViewPrint: boolean = false;
  @Input() isViewAttachment: boolean = false;
  @Input() isViewCopy: boolean = false;
  @Input() isViewLog: boolean = false;
  
  @Input() disableSaveBtn: boolean = false;
  @Input() disableDeleteBtn: boolean = false;
  @Input() disableAuditTrail: boolean = false;
  @Input() disablePostBtn: boolean = false;
  @Input() isSelectAll: boolean = false;
  @Input() isSelectNone: boolean = false;
  @Input() isInvert: boolean = false;
  @Input() isLock: boolean = false;
  @Input() editSaveBtnText?: string = 'Save';

  branchCode: any = localStorage.getItem('userbranch')
  userName: any = localStorage.getItem('username')
  app_version: string = environment.app_version

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
  continueClick() {
    this.continueClicked.emit();
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
    this.postClick.emit();
  }
  PrintClicked() {
    this.printClick.emit();
  }
  ExportClicked() {
  }
  AttachmentClicked(){
    this.attachmentClick.emit();
  }
  PreviewClicked() {

  }
  selectallClicked() {
  }
  selectnoneClicked() {
  }
  invertClicked() {
  }
  lockClicked() {
  }
}
