import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { NewPosEntryComponent } from './new-pos-entry/new-pos-entry.component';
import { AddPosComponent } from './add-pos/add-pos.component';
import { PosCurrencyReceiptComponent } from './pos-currency-receipt/pos-currency-receipt.component';

@Component({
  selector: 'app-retail-transaction',
  templateUrl: './retail-transaction.component.html',
  styleUrls: ['./retail-transaction.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetailTransactionComponent implements OnInit {
  //variables
  menuTitle: string = '';
  apiCtrl: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  tableName: any;
  PERMISSIONS: any

  subscriptions$!: Subscription;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
  }

  ngOnInit(): void {
    this.getMasterGridData()
    if (localStorage.getItem('AddNewFlag') && localStorage.getItem('AddNewFlag') == '1') {
      this.openModalView('Sale')
      localStorage.removeItem('AddNewFlag')
    }
  }

  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      if (this.orderedItems.length > 10) {
        this.orderedItems.splice(this.orderedItems.length - this.pageSize, this.pageSize);
      }
    }
  }
  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.pageIndex = this.pageIndex + 1;
      this.getMasterGridData();
    }
  }
  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      this.pageIndex = 1;
      this.orderedItems = [];
      this.orderedItemsHead = [];
      this.menuTitle = data.MENU_CAPTION_ENG;
      this.tableName = data.HEADER_TABLE;
      this.PERMISSIONS = data.PERMISSION;
    } else {
      this.menuTitle = this.CommonService.getModuleName()
      this.tableName = this.CommonService.getqueryParamTable()
    }

    if (this.orderedItems.length == 0) {
      this.snackBar.open('loading...');
    }

    this.apiCtrl = 'TransctionMainGrid'
    let params = {
      "PAGENO": this.pageIndex || 1,
      "RECORDS": this.pageSize || 10,
      "TABLE_NAME": this.tableName,
      "CUSTOM_PARAM": {
        // "FILTER": {
        //   "YEARMONTH": localStorage.getItem('YEAR') || '',
        //   "BRANCHCODE": this.CommonService.branchCode,
        //   "VOCTYPE": ""
        // },
        "TRANSACTION": {
          "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
        }
      }
    }

    this.subscriptions$ = this.dataService.postDynamicAPI(this.apiCtrl, params)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        if (resp.dynamicData) {
          // resp.dynamicData[0].map((s: any, i: any) => s.id = i + 1);
          resp.dynamicData[0].forEach((obj: any, i: any) => {
            obj.Id = i + 1;
            for (const prop in obj) {
              if (typeof obj[prop] === 'object' && Object.keys(obj[prop]).length === 0) {
                // Replace empty object with an empty string
                obj[prop] = '';
              }
            }
          });
          if (this.orderedItems.length > 0) {
            this.orderedItems = [...this.orderedItems, ...resp.dynamicData[0]];
          } else {
            this.orderedItems = resp.dynamicData[0];
            this.nextPage()
          }
          this.orderedItemsHead = Object.keys(this.orderedItems[0]);
          this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
          //change detector code
          // this.ChangeDetector.detectChanges()
        } else {
          this.snackBar.open('No Response Found!', 'Close', {
            duration: 3000,
          });
        }

      }, err => {
        alert(err)
      });

  }
  viewRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'VIEW'
    this.openModalView(str)
  }
  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openModalView(str)
  }
  //  open Jobcard in modal
  openModalView(data?: any) {
    if (data && data == 'Sale') {
      this.menuTitle = data
    }
    let contents: any;
    switch (this.menuTitle) {
      case 'Sale':
        contents = AddPosComponent
        break;
      case 'POINT OF SALE CURRENCY RECEIPT':
        contents = PosCurrencyReceiptComponent
        break;
      //continue adding components using case then break
      default:
        this.snackBar.open('No Response Found!', 'Close', {
          duration: 3000,
        });
        return;
    }
    const modalRef: NgbModalRef = this.modalService.open(contents, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width'
    });
    modalRef.componentInstance.content = data;
  }

  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }



}
