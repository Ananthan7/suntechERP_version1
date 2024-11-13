import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'master-grid',
  templateUrl: './master-grid.component.html',
  styleUrls: ['./master-grid.component.scss']
})
export class MasterGridComponent implements OnInit {

  @Input() MasterGridData!: any;
  @Output() editRowClick = new EventEmitter<any>();
  @Output() viewRowClick = new EventEmitter<any>();
  @Output() AddBtnClick = new EventEmitter<any>();
  @Output() deleteBtnClick = new EventEmitter<any>();
  @Input() isDisableDelete: boolean = false;
  @Input() isDisableEdit: boolean = false;
  @Input() isDisableView: boolean = false;
  @Input() tableName: any;
  vocType: any;
  skeltonLoading: boolean = true;
  // isDisableEdit: boolean = false;
  // isDisableView: boolean = false;
  // isDisableDelete: boolean = false;

  mainVocType: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  visibleFields: any[] = [];
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

  //report Dialogue modifications
  @Input() templateViewForReports: boolean = false;
  dataSource: any = [];
  dropdownDataSource: any[] = [];
  @Output() actionViewClick = new EventEmitter<any>();

  
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
    this.deleteRowDetails = this.deleteRowDetails.bind(this);
  }

  ngOnInit(): void {
    this.vocType = this.CommonService.getqueryParamVocType();
    this.mainVocType = this.CommonService.getqueryParamMainVocType();
    this.tableName = this.CommonService.getqueryParamTable()
    // this.getGridVisibleSettings();
    this.getMasterGridData()
    this.reportTemplateViewGridDataFetch()
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
    if (data.FLAG == 1) {
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
    let sub: Subscription = this.dataService.getDynamicAPICustom(API).subscribe((resp: any) => {
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
  resetGridAction() {
    this.isDisableDelete = false;
    this.isDisableEdit = false;
    this.isDisableView = false;
  }
  refreshClicked() {
    this.SEARCH_VALUE = ''
    this.getMasterGridData(1)
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any, isSearch?:any) {
    this.resetGridAction()
    if (data) {
      this.pageIndex = 1;
      this.pageSize = 10
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

    let params = {
      "PAGENO": this.pageIndex,
      "RECORDS": this.pageSize == 10 ? 10 : this.totalDataCount,
      "TABLE_NAME": this.tableName || '',
      "CUSTOM_PARAM": {
        "FILTER": this.setCustomParamFilters(),
        "TRANSACTION": this.setCustomParamTransactions(isSearch),
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
          // if (data == 1) {
          // this.orderedItems = []
          // this.SEARCH_VALUE = ''
          // }
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

          this.orderedItemsHead = Object.keys(this.orderedItems[0])
            .map((key) => {
              return { FIELD_NAME: key };
            });
          this.orderedItemsHead = this.orderedItemsHead.filter((item: any) => {
            let shouldInclude = true;
            switch (item.FIELD_NAME) {
              case 'FLAG':
              case 'COUNT':
              case 'MID':
              case 'SRNO':
                shouldInclude = false;
                break;
              default:
                shouldInclude = true;
                break;
            }
            return shouldInclude;
          });
          // this.orderedItemsHead = this.visibleFields.filter((data: any) => {
          //   if (data.DATA_TYPE == 'numeric' && data.FORMAT == 'Amount') {
          //     data.FORMAT = { type: 'fixedPoint', precision: 2, useGrouping: true };
          //   }

          //   if (data.DATA_TYPE == 'datetime') {
          //     data.FORMAT = 'dd-MM-yyyy';
          //     data.DATATYPE = 'date';
          //   }
          //   if (data.DATA_TYPE == 'bit') {
          //     data.DATATYPE = 'boolean';
          //   }

          //   const isSpecialField = ['BRANCH_CODE', 'VOCTYPE', 'VOCNO', 'VOCDATE'].includes(data.FIELD_NAME);
          //   const isVisible = data.VISIBLE == true;

          //   return isSpecialField || (isVisible && this.orderedItemsHead.some(val => data.FIELD_NAME.toString().toLowerCase() === val.FIELD_NAME.toString().toLowerCase()));
          // });

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
  validateBranchCode() {
    if (this.vocType == 'MASSCH') return '';
    return this.branchCode
  }
  setCustomParamFilters() {
    // if (this.mainVocType == 'MASDPX') {
    //   return {
    //     "YEARMONTH": this.CommonService.yearSelected,
    //     // "BRANCH_CODE": this.validateBranchCode(),
    //     "VOCTYPE": this.CommonService.nullToString(this.vocType),
    //     "DIVISION": 'M'
    //   }
    // }
    // if (this.mainVocType == 'MSDPM') {
    //   return {
    //     "YEARMONTH": this.CommonService.yearSelected,
    //     // "BRANCH_CODE": this.validateBranchCode(),
    //     "VOCTYPE": this.CommonService.nullToString(this.vocType),
    //     "DIVISION": 'S'
    //   }
    // }
    // return {
    //   "YEARMONTH": this.CommonService.yearSelected,
    //   "BRANCH_CODE": this.validateBranchCode(),
    //   "VOCTYPE": this.CommonService.nullToString(this.vocType),
    // }
    return {}
  }
  setCustomParamTransactions(isSearch?:any) {
    return {
      // "VOCTYPE": this.CommonService.nullToString(this.vocType),
      // "MAIN_VOCTYPE": this.CommonService.nullToString(this.mainVocType),
      "FILTERVAL": this.CommonService.nullToString(this.tableName),
      "MASTER": isSearch === "search" ? '0': this.CommonService.getSubmoduleType() == "Master" ? "1" : "0"
    }
  }
  getGridVisibleSettings() {
    let sub: Subscription = this.dataService.getDynamicAPICustom(`TransactionListView/GetTransactionListViewDetail/${this.vocType}/${this.CommonService.branchCode}`)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        this.skeltonLoading = false;
        if (resp != null) {
          if (resp.status == 'Success') {
            this.visibleFields = resp.response || [];
            this.visibleFields.forEach((item: any, i) => {
              item.Id = i + 1;
            });
            // this.getMasterGridData()

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

  reportTemplateViewGridDataFetch(){
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'FETCH',
        "CONTROLS": JSON.stringify({
            "CONTROL_HEADER": {
              "USERNAME": localStorage.getItem('username'),
              "TEMPLATEID": "",
              "TEMPLATENAME": '',
              "FORM_NAME": this.CommonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "STRBRANCHCODES": '',
              "STRVOCTYPES": '',
              "FROMVOCDATE": '',
              "TOVOCDATE": '',
              "USERBRANCH": '',
              "USERNAME": '',
              "SHOWDATE": '',
              "SHOWINVOICE": ''
            }
         })
      }
    };
    this.dataService.postDynamicAPI('ExecueteSPInterface', payload)
    .subscribe((result: any) => {
      this.dataSource = result.dynamicData[0]
      
      this.dataSource.forEach((item: any) => {
        console.log('data Refetch for retail template grid',item)
        let parsedData;
        try {
          parsedData = JSON.parse(item['CONTROL_LIST_JSON']);
        } catch (e) {
          return;
        }
 
        const fromVocDate = parsedData.CONTROL_DETAIL?.FROMVOCDATE || parsedData.CONTROL_DETAIL?.STRFROMDATE ||
          parsedData.CONTROL_DETAIL?.strFmDate || parsedData.CONTROL_DETAIL?.FrVocDate || parsedData.CONTROL_DETAIL?.str_FmDate
          || parsedData.CONTROL_DETAIL?.strAsOnDate || parsedData.CONTROL_DETAIL?.FRVOCDATE || parsedData.CONTROL_DETAIL?.STRFMDATE;
      
        const toVocDate = parsedData.CONTROL_DETAIL?.TOVOCDATE || parsedData.CONTROL_DETAIL?.STRTODATE ||
          parsedData.CONTROL_DETAIL?.strToDate || parsedData.CONTROL_DETAIL?.ToVocDate || parsedData.CONTROL_DETAIL?.str_ToDate
          || parsedData.CONTROL_DETAIL?.strAsOnDate || parsedData.CONTROL_DETAIL?.TOVOCDATE;
      
        item.FROMVOCDATE = this.CommonService.formatYYMMDD(fromVocDate);
        item.TOVOCDATE = this.CommonService.formatYYMMDD(toVocDate);
      });

      result.dynamicData[1].forEach((item: any)=>{ 
       this.dropdownDataSource.push(item.PeriodType) 
      })
    }); 
  }
  onSelectBoxValueChanged(e: any) {
    console.log('Selected Grid value:', e.value);
    // Add your custom logic here
  }
  printGridData(data: any) {
    let gridData= JSON.parse(data.data['CONTROL_LIST_JSON'])
    let postData = {
      "SPID": "0114",
      "parameter": {
        "STRBRANCHCODES": gridData.CONTROL_DETAIL.STRBRANCHCODES,
        "STRVOCTYPES": gridData.CONTROL_DETAIL.STRVOCTYPES,
        "FROMVOCDATE": gridData.CONTROL_DETAIL.FROMVOCDATE,
        "TOVOCDATE": gridData.CONTROL_DETAIL.TOVOCDATE,
        "flag": '',
        "USERBRANCH": localStorage.getItem('userbranch'),
        "USERNAME": localStorage.getItem('username')
      }
    }
    console.log(postData)  
    this.CommonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      this.CommonService.closeSnackBarMsg()
      console.log(result);
      let data = result.dynamicData;
      // var WindowPrt = window.open(' ', ' ', 'width=900px, height=800px');
      const screenWidth = window.screen.availWidth;
      const screenHeight = window.screen.availHeight;
      const WindowPrt = window.open('','',
        `width=${screenWidth},height=${screenHeight}`);
      if (WindowPrt === null) {
        console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
        return;
      }
      let printContent = data[0][0].HTMLINPUT;
      WindowPrt.document.write(printContent);
      WindowPrt.document.close();
      WindowPrt.focus();  
      WindowPrt.onload = function () {
        if (WindowPrt && WindowPrt.document.head) {
          let styleElement = WindowPrt.document.createElement('style');
          styleElement.textContent = `
                      @page {
                          size: A5 landscape;
                      }
                      body {
                          margin: 0mm;
                      }
                  `;
          WindowPrt.document.head.appendChild(styleElement);

          setTimeout(() => {
            if (WindowPrt) {
              WindowPrt.print();
            } else {
              console.error('Print window was closed before printing could occur.');
            }
          }, 800);
        }
      };
    }); 
  }
  viewClick(event: any){
    this.actionViewClick.emit(event)
  }


}