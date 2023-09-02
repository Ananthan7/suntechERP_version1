import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { NewPosEntryComponent } from './new-pos-entry/new-pos-entry.component';
import { AddPosComponent } from './add-pos/add-pos.component';

@Component({
  selector: 'app-retail-transaction',
  templateUrl: './retail-transaction.component.html',
  styleUrls: ['./retail-transaction.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetailTransactionComponent implements OnInit {
  //variables
  menuTitle: any
  apiCtrl: any
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];

  subscriptions$!: Subscription;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
  }

  ngOnInit(): void {
    this.getMasterGridData()
    if(localStorage.getItem('AddNewFlag') && localStorage.getItem('AddNewFlag') == '1'){
      this.openMadalView()
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
      this.getMasterGridData(this.pageIndex);
    }
  }
  /**USE: to get table data from API */
  getMasterGridData(pageIndex?: number) {
    //use: to get menu title from queryparams and API endpoint
    this.menuTitle = this.CommonService.getModuleName()
    this.apiCtrl = this.CommonService.getqueryParamAPI()
    if (this.orderedItems.length == 0) {
      this.snackBar.open('loading...');
    }
    // let params: any = { "PageNumber": 1, "PageSize": 10 }
    // let API: string = `${this.apiCtrl}?strBranchCode=${this.CommonService.branchCode}&strVocType=${'POS'}&strYearMonth=${this.CommonService.yearSelected}`
    let API = 'TransctionMainGrid'
    let params = {
        "PAGENO": this.pageIndex || 1,
        "RECORDS": this.pageSize || 10,
        "TABLE_NAME": "RETAIL_SALES",
        "CUSTOM_PARAM": {
          "FILTER": {
            "YEARMONTH": localStorage.getItem('YEAR') || '',
            "BRANCHCODE":  'MOE',
            "VOCTYPE": "PCR"
          },
          "TRANSACTION": {
            "VOCTYPE": "PCR",
          }
        }
    }
    this.subscriptions$ = this.dataService.postDynamicAPI(API, params)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        if (resp.dynamicData) {
          // resp.dynamicData[0].map((s: any, i: any) => s.id = i + 1);
          resp.dynamicData[0].forEach((item: any, i: any) => {
            item.Id = i + 1;
          });
          if (this.orderedItems.length > 0) {
            this.orderedItems = [...this.orderedItems, ...resp.dynamicData[0]];
          } else {
            this.orderedItems = resp.dynamicData[0];
            this.nextPage()
          }
        } else {
          this.orderedItems = [];
        }
        // if (resp.response) {
        //   resp.response.forEach((item: any, i: any) => {
        //     item.Id = i + 1;
        //   });
        //   this.orderedItems = resp.response;
        //   this.ChangeDetector.detectChanges() //detect dom change
        // } else {
        //   this.orderedItems = [];
        // }
      }, err => {
        alert(err)
      });

  }
  //  open Jobcard in modal
  openMadalView() {
    this.modalService.open(AddPosComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width'
    });
    // const modalOptions = {
    //   windowClass: 'custom-modal', // This is the custom class you created
    // };

  }

  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }



}
