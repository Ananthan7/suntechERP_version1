import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';


@Component({
  selector: 'app-retail-grid',
  templateUrl: './retail-grid.component.html',
  styleUrls: ['./retail-grid.component.scss']
})
export class RetailGridComponent implements OnInit {
  @Input() MasterGridData!: any;
  @Output() editRowClick = new EventEmitter<any>();
  @Output() viewRowClick = new EventEmitter<any>();
  @Output() AddBtnClick = new EventEmitter<any>();

  @Input() tableName: any;
  vocType: any;
  skeltonLoading: boolean = true;
  mainVocType: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  //PAGINATION
  totalDataCount: number = 10000; // Total number of items hardcoded 10k will reassign on API call
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  nextCall: any = 0
  visibleFields = [];

  //subscription variable
  subscriptions$: Subscription[] = [];
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
    this.tableName = this.CommonService.getqueryParamTable()
  }

  ngOnInit(): void {
    this.vocType = this.CommonService.getqueryParamVocType()
    this.getGridVisibleSettings();
  }

  addButtonClick() {
    this.AddBtnClick.emit();
  }
  viewRowDetails(e: any) {
    this.viewRowClick.emit(e);
  }
  editRowDetails(e: any) {
    this.editRowClick.emit(e);
  }
  /**USE: grid on scroll event */
  onContentReady(e: any) {
    setTimeout(() => {
      let scroll = e.component.getScrollable();
      scroll.on("scroll", (event: any) => {
        // reachedTop
        //  this.orderedItems.length = 20
        if (event.reachedBottom && this.orderedItems.length == 10 * this.pageIndex) {
          this.nextPage()
          return
        }

      })
    })
  }

  // next data call
  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalDataCount) {
      this.pageIndex = this.pageIndex + 1;
      this.getMasterGridData();
    }
  }
  checkVocTypeCondition(value: any) {
    if (!value) return ''
    if (this.vocType == 'SCR') return '';
    if (this.vocType == 'SRC') return '';
    if (this.vocType == 'MASSCH') return '';
    return value
  }
  checkVocTypeReturnNumber(value: any) {
    if (!value) return 0
    if (this.vocType == 'SCR') return 0;
    if (this.vocType == 'SRC') return 0;
    if (this.vocType == 'MASSCH') return 0;
    return value
  }
  checkVocTypeTable(value: any) {
    if (!value) return 0
    if (this.vocType == 'SRC') return 'CURRENCY_RECEIPT ';
    return value
  }
  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      this.pageIndex = 1;
      this.orderedItems = [];
      this.orderedItemsHead = [];
      this.vocType = data.VOCTYPE;
      this.mainVocType = data.MAIN_VOCTYPE;
      // this.tableName = data.HEADER_TABLE;
    } else {
      // this.tableName = this.CommonService.getqueryParamTable()
      this.vocType = this.CommonService.getqueryParamVocType()
    }
    if (this.orderedItems.length == 0) {
      this.skeltonLoading = true
    } else {
      this.snackBar.open('loading...', '', {
        duration: 3000,
      });
    }
    let params
    if (data?.MENU_SUB_MODULE == 'Transaction' || this.vocType) {
      params = {
        "PAGENO": this.pageIndex,
        "RECORDS": this.pageSize,
        "TABLE_NAME": this.checkVocTypeTable(this.tableName),
        "CUSTOM_PARAM": {
          "FILTER": {
            "YEARMONTH": this.checkVocTypeReturnNumber(this.CommonService.yearSelected),
            "BRANCH_CODE": this.checkVocTypeCondition(this.CommonService.branchCode),
            "VOCTYPE": this.checkVocTypeCondition(this.vocType)
          },
          "TRANSACTION": {
            "VOCTYPE": this.CommonService.nullToString(this.vocType),
            "MAIN_VOCTYPE": this.CommonService.nullToString(this.mainVocType),
          }
        }
      }
    } else {
      params = {
        "PAGENO": this.pageIndex,
        "RECORDS": this.pageSize,
        "TABLE_NAME": this.tableName,
        "CUSTOM_PARAM": {
          // "FILTER": {
          //   "YEARMONTH": localStorage.getItem('YEAR') || '',
          //   "BRANCH_CODE": this.CommonService.branchCode,
          //   "VOCTYPE": this.vocType || ""
          // },
          "TRANSACTION": {
            // "VOCTYPE": this.vocType || "",
            "MAIN_VOCTYPE": this.CommonService.nullToString(this.mainVocType),
          }
        }
      }
    }


    let sub: Subscription = this.dataService.postDynamicAPI('TransctionMainGrid', params)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        this.skeltonLoading = false;
        if (resp.dynamicData && resp.dynamicData[0].length > 0) {
          this.totalDataCount = resp.dynamicData[0][0].COUNT || 100000

          // Replace empty object with an empty string
          resp.dynamicData[0] = this.CommonService.arrayEmptyObjectToString(resp.dynamicData[0])

          if (this.orderedItems.length > 0) {
            this.orderedItems = [...this.orderedItems, ...resp.dynamicData[0]];
          } else {
            this.orderedItems = resp.dynamicData[0];
            if (this.orderedItems.length == 10) {
              this.nextPage()
            }
          }
          // this.orderedItemsHead = Object.keys(this.orderedItems[0]);

          this.orderedItemsHead = Object.keys(this.orderedItems[0])
            .map((key) => {
              return { FIELD_NAME: key };
            });


          console.log('=================visibleFields===================');
          console.log(this.visibleFields, this.orderedItemsHead);

          console.log('====================================');
          console.log(this.visibleFields.filter((data: any) => data.VISIBLE === true).map((data: any) => data.FIELD_NAME));



          this.orderedItemsHead = this.visibleFields.filter((data: any) => {
            if (data.DATA_TYPE == 'numeric' && data.FORMAT == 'Amount') {
              data.FORMAT = { type: 'fixedPoint', precision: 2, useGrouping: true };
            }
          
            if (data.DATA_TYPE == 'datetime') {
              data.FORMAT = 'dd-MM-yyyy';
              data.DATATYPE = 'date';
            }
          
            const isSpecialField = ['BRANCH_CODE', 'VOCTYPE', 'VOCNO', 'VOCDATE'].includes(data.FIELD_NAME);
            const isVisible = data.VISIBLE == true;
          
            return isSpecialField || (isVisible && this.orderedItemsHead.some(val => data.FIELD_NAME.toString().toLowerCase() === val.FIELD_NAME.toString().toLowerCase() ));
          });

          // this.orderedItemsHead = this.visibleFields.filter((data: any, i) => {

          //   const headData = this.orderedItemsHead.some((val) => {

          //     // if (val.FIELD_NAME == 'MID') val.VISIBLE = true;
          //     // if (data.FIELD_NAME == 'VOCNO') data.DATA_TYPE = '';
          //     // if (data.ALIGNMENT == 'Near') data.ALIGNMENT = 'left';
          //     // if (data.ALIGNMENT == 'Far') data.ALIGNMENT = 'right';
          //     // if (data.ALIGNMENT == '') data.ALIGNMENT = 'center';

          //     if (data.DATA_TYPE == 'numeric' && data.FORMAT == 'Amount') data.FORMAT = { type: 'fixedPoint', precision: 2, useGrouping: true };
          //     if (data.DATA_TYPE == 'datetime') data.FORMAT = 'dd-MM-yyyy';

          //     if (data.DATA_TYPE == 'datetime') data.DATATYPE = 'date';
          //     // data.DATA_TYPE == 'numeric' ? { type: 'fixedPoint', precision: 2, useGrouping: true } : (data.FIELD_NAME.toString().toLowerCase() == 'vocdate' ? 'dd-MM-yyyy' : auto)"

          //     // if (['BRANCH_CODE', 'VOCTYPE', 'VOCNO', 'VOCDATE'].includes(data.FIELD_NAME)) {
          //     //   console.log('field ', data.FIELD_NAME);

          //     //   return true;
          //     // }
          //     // else
          //       return  ['BRANCH_CODE', 'VOCTYPE', 'VOCNO', 'VOCDATE'].includes(data.FIELD_NAME) || data.FIELD_NAME === val.FIELD_NAME && data.VISIBLE == true
          //   }
          //   )
          //   console.log('headData ', headData);

          //   return headData;
          // }


          // );

          this.orderedItemsHead = this.orderedItemsHead.sort((a, b) => a.DISPLAY_ODER - b.DISPLAY_ODER);

          console.log('==============orderedItemsHead======================');
          console.log(this.orderedItemsHead);
          console.log('====================================');
          // this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
          // this.ChangeDetector.detectChanges()
        } else {
          this.snackBar.open('Data not available!', 'Close', {
            duration: 3000,
          });
        }
      }, (err: any) => {
        this.snackBar.dismiss();
        this.skeltonLoading = false;
        this.snackBar.open(err, 'Close', {
          duration: 3000,
        });
      });
    this.subscriptions$.push(sub)
  }


  getGridVisibleSettings() {
    let sub: Subscription = this.dataService.getDynamicAPI(`TransactionListView/GetTransactionListViewDetail/${this.vocType}/${this.CommonService.branchCode}`)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        this.skeltonLoading = false;
        if (resp != null) {
          if (resp.status == 'Success') {
            this.visibleFields = resp.response;
            this.visibleFields.forEach((item: any, i) => {
              item.Id = i + 1;
            });
            this.getMasterGridData()

          }
          else {
            this.visibleFields = [];
          }
        } else {
          this.visibleFields = [];
        }

      });
    this.subscriptions$.push(sub)

  }


  //unsubscriptions of streams
  ngOnDestroy() {
    this.snackBar.dismiss();
    this.skeltonLoading = false;
    if (this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions$ = []; // Clear the array
    }
  }

}