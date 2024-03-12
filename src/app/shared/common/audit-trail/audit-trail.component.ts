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

  showDialog() {
    const modalRef: NgbModalRef = this.modalService.open(this.content, {
      size: "lg",
      backdrop: true, //'static'
      backdropClass: 'backdrop',
      keyboard: false,
      windowClass: "modal-full-width",
    });
    modalRef.componentInstance.content = this.dataToEditrow;
    modalRef.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {
        // Handle modal dismissal (if needed)
      }
    );
  }

  currencyCodeChange(value: string) {
    if (value == '') return
    let API = `CurrencyMaster/GetCurrencyMasterDetail/${value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
        
        } else {
          this.commonService.toastErrorByMsgId('Currency rate not Found')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('Currency rate not Found')
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
