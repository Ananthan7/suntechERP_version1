import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  @Input() display: boolean = false;
  @Input() dataToEditrow: any;
  @Input() gridData: any[] = [];
  @ViewChild('content') public content!: NgbModal;
  private subscriptions: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    
  }

  showDialog(formData:any) {
    const modalRef: NgbModalRef = this.modalService.open(this.content, {
      size: "lg",
      backdrop: true, //'static'
      backdropClass: 'backdrop',
      keyboard: false,
      windowClass: "modal-full-width",
    });
    // modalRef.componentInstance.content = this.dataToEditrow;
    modalRef.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {
        // Handle modal dismissal (if needed)
      }
    );
    this.getPostedData(formData)
  }

  getPostedData(formData:any) {
    let API = `SchemeCurrencyReceipt/GetAuditTrial`+
    `/${formData.BRANCH_CODE}`+
    `/${formData.VOCTYPE}/${formData.VOCNO}`+
    `/${formData.MID}/${formData.YEARMONTH}`+
    `/n`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.dynamicData) {
          this.gridData = result.dynamicData[0]
          if(this.gridData.length>0){
            this.gridData.forEach((item:any)=>{
              item.AMOUNTCC_DEBIT = this.commonService.decimalQuantityFormat(item.AMOUNTCC_DEBIT,'AMOUNT')
              item.AMOUNTCC_CREDIT = this.commonService.decimalQuantityFormat(item.AMOUNTCC_CREDIT,'AMOUNT')
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
