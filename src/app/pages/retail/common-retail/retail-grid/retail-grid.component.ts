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
  @Output() deleteBtnClick = new EventEmitter<any>();

  @Input() tableName: any;
  vocType: any;
  skeltonLoading: boolean = true;
  mainVocType: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  SEARCH_VALUE: string = ''
  //PAGINATION
  totalDataCount: number = 10000; // Total number of items hardcoded 10k will reassign on API call
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index
  yearSelected = localStorage.getItem('CURRENTYEAR');
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
    this.deleteRowDetails = this.deleteRowDetails.bind(this);
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
  deleteRowDetails(e: any) {
    console.log(e.row.data);
    let data = e.row.data
    if(data.FLAG == 1){
      this.CommonService.toastErrorByMsgId('Cannot delete data in use')
      return
    }
    this.deleteBtnClick.emit(e);
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
      this.pageIndex = this.pageIndex + 1;
      this.getMasterGridData();
    }
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
      if(this.SEARCH_VALUE != '') {
        this.pageIndex = 1 
        this.pageSize = 10
      }
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

    if (this.vocType == 'GEN') {
      this.getSchemeMaturedAPI()
      return
    }
    let params = {
      "PAGENO": this.pageIndex,
      "RECORDS": this.pageSize == 10 ? 10 : this.totalDataCount,
      "TABLE_NAME": this.tableName || '',
      "CUSTOM_PARAM": {
        "FILTER": {
          "YEARMONTH": this.CommonService.nullToString(this.yearSelected),
          "BRANCH_CODE": this.branchCode,
          "VOCTYPE": this.CommonService.nullToString(this.vocType),
        },
        "TRANSACTION": {
          "VOCTYPE": this.CommonService.nullToString(this.vocType),
          "MAIN_VOCTYPE": this.CommonService.nullToString(this.mainVocType),
          "FILTERVAL": this.CommonService.nullToString(this.vocType),
        },
        "SEARCH": {
          "SEARCH_VALUE": this.CommonService.nullToString(this.SEARCH_VALUE)
        }
      }
    }
    let sub: Subscription = this.dataService.postDynamicAPI('TransctionMainGrid', params)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        this.skeltonLoading = false;
        if (resp.dynamicData && resp.dynamicData[0].length > 0) {
          if(this.SEARCH_VALUE != '') {
            this.orderedItems = []
            this.SEARCH_VALUE = ''
          }
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

          if (this.vocType == 'MASSCH') {
            this.orderedItems = this.changeKeyName(this.orderedItems, 'SCHEME_METALCURRENCY', 'DEPOSIT_IN')
            this.orderedItems = this.removeKeyValueFromArray(this.orderedItems, 'SCHEME_CURRENCY_CODE')
            this.orderedItems = this.removeKeyValueFromArray(this.orderedItems, 'SCHEME_METALCURRENCY')
            this.orderedItems = this.removeKeyValueFromArray(this.orderedItems, 'SCHEME_UNIT')
          }
          if (this.vocType == 'SCR') {
            this.orderedItems = this.changeKeyName(this.orderedItems, 'SCH_METALCURRENCY', 'DEPOSIT_IN')
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
  removeKeyValueFromArray(arrayOfObjects: any, keyToRemove: any) {
    return arrayOfObjects.map((obj: any) => {
      const newObj = { ...obj };
      delete newObj[keyToRemove];
      return newObj;
    });
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