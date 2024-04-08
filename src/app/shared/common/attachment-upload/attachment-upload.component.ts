import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'attachment-upload',
  templateUrl: './attachment-upload.component.html',
  styleUrls: ['./attachment-upload.component.scss']
})
export class AttachmentUploadComponent implements OnInit {
  @Input() viewMode: boolean = false;
  @Input() gridData: any[] = [];
  @Output() uploadSubmit = new EventEmitter();
  @ViewChild('content') public content!: NgbModal;
  private subscriptions: Subscription[] = [];
  modalRef!: NgbModalRef;
  Remarks: any;
  Attachedfile: any[] = [];
  @Input() savedAttachment: any[] = [];

  constructor(
    private modalService: NgbModal,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
  }
  openAttachment(e: any) {
    console.log(e.data, 'e');
    window.open(e.data.file, '_blank'); // <- This is what makes it open in a new window.
  }
  onFileChange(input: any) {
    if (input.target.files.length > 0) {
      const file: File = input.target.files[0];
      for (let x = 0; x < input.target.files.length; x++) {
        this.Attachedfile.push(file);
      }
    }
  }
  onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    // Add a class to indicate the drag over state
    if (event) event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Remove the class for drag over state
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Remove the class for drag over state
    const files: any = event.dataTransfer?.files;
    if (files.length > 0) {
      // Handle the dropped files
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Do something with each file
      this.Attachedfile.push(file);
    }
  }
  uploadSubmited() {
    this.uploadSubmit.emit(this.Attachedfile)
    this.modalRef.close()
  }
  showDialog() {
    this.modalRef = this.modalService.open(this.content, {
      size: "lg",
      backdrop: true, //'static'
      backdropClass: 'backdrop',
      keyboard: false,
      windowClass: "modal-full-width",
    });
    // modalRef.componentInstance.content = this.dataToEditrow;
    this.modalRef.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {
        // Handle modal dismissal (if needed)
      }
    );
  }
  openAttchments(e: any) {
    const columnName = e.column?.dataField;
    const cellValue = e.data[columnName];

    // Handle the cell click event based on the column and value
    if (columnName === "IS_ATTACHMENT_PRESENT") {
      let API = ``;
      this.dataService.getDynamicAPI(API).subscribe((result: any) => {
        if (result.fileCount > 0) {
          for (let j = 0; j < result.file.length; j++) {
            window.open(
              result.file[j],
              "_blank" // <- This is what makes it open in a new window.
            );
          }
        }
      });
    }
  }
  getPostedData(formData: any) {
    let API = `SchemeCurrencyReceipt/GetAuditTrial` +
      `/${formData.BRANCH_CODE}` +
      `/${formData.VOCTYPE}/${formData.VOCNO}` +
      `/${formData.MID}/${formData.YEARMONTH}` +
      `/n`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.dynamicData) {
          this.gridData = result.dynamicData[0]
          if (this.gridData.length > 0) {
            this.gridData.forEach((item: any) => {
              item.AMOUNTCC_DEBIT = this.commonService.decimalQuantityFormat(item.AMOUNTCC_DEBIT, 'AMOUNT')
              item.AMOUNTCC_CREDIT = this.commonService.decimalQuantityFormat(item.AMOUNTCC_CREDIT, 'AMOUNT')
            })
          }
        } else {
          this.commonService.toastErrorByMsgId('not found')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('not Found')
      })
    this.subscriptions.push(Sub)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }
}