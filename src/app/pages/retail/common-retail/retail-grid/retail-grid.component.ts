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
  yearSelected = this.CommonService.yearSelected
  branchCode = this.CommonService.branchCode
  nextCall: any = 0
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
    this.getMasterGridData()
  }

  ngOnInit(): void {
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
    if (this.pageSize <= this.totalDataCount) {
      console.log('fored');
      
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
    if (!value) return ''
    if (this.vocType == 'SRC') return 'CURRENCY_RECEIPT ';
    return value
  }
  getSchemeMaturedAPI() {
    let API = 'SchemeMatured/' + this.CommonService.branchCode
    let sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((resp: any) => {
      this.skeltonLoading = false;
      if (resp.schemeMatureds && resp.schemeMatureds[0].length > 0) {
        this.totalDataCount = resp.schemeMatureds[0].length

        if (this.orderedItems.length > 0) {
          this.orderedItems = [...this.orderedItems, ...resp.schemeMatureds[0]];
        } else {
          this.orderedItems = resp.schemeMatureds[0];
          if (this.orderedItems.length == 10) this.nextPage()
        }

        this.orderedItemsHead = Object.keys(this.orderedItems[0]);
        // this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
        // this.ChangeDetector.detectChanges()
        // this.orderedItems = this.orderedItems.sort((a, b) => b.MID - a.MID);
      } else {
        this.snackBar.open('Data not available!', 'Close', {
          duration: 3000,
        });
      }
    });
  }
  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      this.pageIndex = 1;
      this.orderedItems = [];
      this.orderedItemsHead = [];
      this.vocType = data.VOCTYPE || this.CommonService.getqueryParamVocType()
      this.mainVocType = data.MAIN_VOCTYPE || this.CommonService.getqueryParamMainVocType();
      this.tableName = data.HEADER_TABLE || this.CommonService.getqueryParamTable()
    } else {
      this.tableName = this.CommonService.getqueryParamTable()
      this.vocType = this.CommonService.getqueryParamVocType()
    }
    if (this.orderedItems.length == 0) {
      this.skeltonLoading = true
    } else {
      this.snackBar.open('loading...', '', {
        duration: 3000,
      });
    }
    console.log(this.vocType, 'this.vocType');

    if (this.vocType == 'GEN') {
      this.getSchemeMaturedAPI()
      return
    }
    let params
    // if (data?.MENU_SUB_MODULE == 'Transaction' || this.vocType) {
    params = {
      "PAGENO": this.pageIndex,
      "RECORDS": this.pageSize == 10 ? 10 : this.totalDataCount,
      "TABLE_NAME": this.checkVocTypeTable(this.tableName),
      "CUSTOM_PARAM": {
        "FILTER": {
          "YEARMONTH": this.yearSelected,
          "BRANCH_CODE": this.branchCode,
          "VOCTYPE": this.vocType
        },
        "TRANSACTION": {
          "VOCTYPE": this.CommonService.nullToString(this.vocType),
          "MAIN_VOCTYPE": this.CommonService.nullToString(this.mainVocType),
        }
      }
    }
    // } else {
    //   params = {
    //     "PAGENO": this.pageIndex,
    //     "RECORDS": this.pageSize,
    //     "TABLE_NAME": this.tableName,
    //     "CUSTOM_PARAM": {
    //       // "FILTER": {
    //       //   "YEARMONTH": localStorage.getItem('YEAR') || '',
    //       //   "BRANCH_CODE": this.CommonService.branchCode,
    //       //   "VOCTYPE": this.vocType || ""
    //       // },
    //       "TRANSACTION": {
    //         // "VOCTYPE": this.vocType || "",
    //         "MAIN_VOCTYPE": this.CommonService.nullToString(this.mainVocType),
    //       }
    //     }
    //   }
    // }


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
              console.log('fired');
              this.nextPage()
            }
          }

          if (this.vocType == 'MASSCH') {
            this.orderedItems = this.changeKeyName(this.orderedItems, 'SCHEME_METALCURRENCY', 'DEPOSIT_IN')
            let headers = Object.keys(this.orderedItems[0]);
            this.orderedItemsHead = this.filterArrayValues(headers, 'SCHEME_UNIT')
            this.orderedItemsHead = this.filterArrayValues(headers, 'SCHEME_CURRENCY_CODE')
            this.orderedItemsHead = this.filterArrayValues(headers, 'SCHEME_METALCURRENCY')
          }
          let headers = Object.keys(this.orderedItems[0]);
          this.orderedItemsHead = this.filterArrayValues(headers, 'MID')

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
  filterArrayValues(array: any, keyName: any) {
    return array.filter((item: any) => item != keyName)
  }
  changeKeyName(array: any, oldKey: any, newKey: any) {
    return array.map((obj: any) => {
      // Create a new object with all properties of the original object
      const newObj = { ...obj };
      // If the oldKey exists in the object, delete it and add a new property with the newKey
      if (newObj.hasOwnProperty(oldKey)) {
        newObj[newKey] = newObj[oldKey];
        delete newObj[oldKey];
      }
      return newObj;
    });
  }
  changeValuesToYN(array: any) {
    return array.map((obj: any) => {
      const newObj = { ...obj };
      for (let key in newObj) {
        if (typeof newObj[key] === 'boolean') {
          newObj[key] = newObj[key] ? 'Y' : 'N';
        }
      }
      return newObj;
    });
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