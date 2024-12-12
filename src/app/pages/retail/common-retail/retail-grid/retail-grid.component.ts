import { DatePipe } from '@angular/common';
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
  @Output() deleteBtnClick = new EventEmitter<any>();
  @Output() viewRowClick = new EventEmitter<any>();
  @Output() AddBtnClick = new EventEmitter<any>();
  @Output() AuditTrailClick = new EventEmitter<any>();

  @Input() tableName: any;
  @Input() showAuditTrail:boolean = false;

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


  @Input() templateViewForReports: boolean = false;
  dataSource: any = [];
  @Output() actionViewClick = new EventEmitter<any>();
  dropdownDataSource: any[] = [];
  
  printPreviewFlag: boolean = false;
  screenName: any;
  PermissionArray: any[] = [];
  templateFetched_Data: any;

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar, private datePipe: DatePipe
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
    this.deleteRowDetails = this.deleteRowDetails.bind(this);
    this.onClickAuditTrail = this.onClickAuditTrail.bind(this);
    this.tableName = this.CommonService.getqueryParamTable()
  }
  ngOnInit(): void {
    this.vocType = this.CommonService.getqueryParamVocType()
    this.getGridVisibleSettings();
    this.templateGridDataFetch()
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
  onClickAuditTrail(e: any) {
    this.AuditTrailClick.emit(e);
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
    // if (this.vocType == 'SCR') return 0;
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
    if (data?.refresh) {
      this.pageIndex = 1;
      this.orderedItems = [];
      this.orderedItemsHead = [];
      this.tableName = this.CommonService.getqueryParamTable()
      this.vocType = this.CommonService.getqueryParamVocType()
    } else if (data) {
        this.pageIndex = 1;
        this.orderedItems = [];
        this.orderedItemsHead = [];
        this.vocType = data.VOCTYPE;
        this.mainVocType = data.MAIN_VOCTYPE;
        this.tableName = data.HEADER_TABLE;
      }
      else {
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
    let params
    if (data?.MENU_SUB_MODULE == 'Transaction' || this.vocType) {
      params = {
        "PAGENO": this.pageIndex,
        "RECORDS": this.pageSize,
        "TABLE_NAME": this.checkVocTypeTable(this.tableName),
        "CUSTOM_PARAM": {
          "FILTER": {
            "YEARMONTH": this.checkVocTypeReturnNumber(this.CommonService.yearSelected),
            "BRANCH_CODE": this.CommonService.branchCode,
            "VOCTYPE": this.vocType
          },
          "TRANSACTION": {
            "VOCTYPE": this.CommonService.nullToString(this.vocType),
            "MAIN_VOCTYPE": this.CommonService.nullToString(this.mainVocType),
            "MASTER":this.CommonService.getSubmoduleType() == "Master" ? "1":"0"
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


      



          // this.orderedItemsHead = this.visibleFields.filter((data: any) => {
          //   if (data.DATA_TYPE == 'numeric' && data.FORMAT == 'Amount') {
          //     data.FORMAT = { type: 'fixedPoint', precision: 2, useGrouping: true };
          //   }

          //   // if (data.DATA_TYPE == 'datetime') {
          //   //   data.FORMAT = 'dd-MM-yyyy';
          //   //   data.DATATYPE = 'date';
          //   // }
          //   if (data.DATA_TYPE == 'bit') {
          //     data.DATATYPE = 'boolean';
          //   }

          //   const isSpecialField = ['BRANCH_CODE', 'VOCTYPE', 'VOCNO', 'VOCDATE'].includes(data.FIELD_NAME);
          //   const isVisible = data.VISIBLE == true;

          //   return isSpecialField || (isVisible && this.orderedItemsHead.some(val => data.FIELD_NAME.toString().toLowerCase() === val.FIELD_NAME.toString().toLowerCase()));
          // });

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

  templateGridDataFetch(){
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
        this.templateFetched_Data = item;
        let parsedData;
        try {
          parsedData = JSON.parse(item['CONTROL_LIST_JSON']);
        } catch (e) {
          return;
        }
 
        const fromVocDate = this.datePipe.transform(parsedData.CONTROL_DETAIL?.FROMVOCDATE || parsedData.CONTROL_DETAIL?.STRFROMDATE ||
          parsedData.CONTROL_DETAIL?.strFmDate || parsedData.CONTROL_DETAIL?.FrVocDate || parsedData.CONTROL_DETAIL?.str_FmDate
          || parsedData.CONTROL_DETAIL?.strAsOnDate || parsedData.CONTROL_DETAIL?.FRVOCDATE || parsedData.CONTROL_DETAIL?.STRFMDATE
          || parsedData.CONTROL_DETAIL?.frmDate,  'yyyy-MM-dd')!
        
      
        const toVocDate = this.datePipe.transform(parsedData.CONTROL_DETAIL?.TOVOCDATE || parsedData.CONTROL_DETAIL?.STRTODATE ||
          parsedData.CONTROL_DETAIL?.strToDate || parsedData.CONTROL_DETAIL?.ToVocDate || parsedData.CONTROL_DETAIL?.str_ToDate
          || parsedData.CONTROL_DETAIL?.strAsOnDate || parsedData.CONTROL_DETAIL?.TOVOCDATE
          || parsedData.CONTROL_DETAIL?.toDate, 'yyyy-MM-dd')!
      
        item.FROMVOCDATE = fromVocDate;
        item.TOVOCDATE = toVocDate;
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

  screenWisePayload(screenName: any, gridData: any){
    let payloadData;

    switch (screenName) {
        case 'POS Salesman Wise Profit Analysis':
          let logData =  {
            "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
            "REFMID": "",
            "USERNAME": this.CommonService.userName,
            "MODE": "PRINT",
            "DATETIME": this.CommonService.formatDateTime(new Date()),
            "REMARKS":"",
            "SYSTEMNAME": "",
            "BRANCHCODE": this.CommonService.branchCode,
            "VOCNO": "",
            "VOCDATE": "",
            "YEARMONTH" : this.CommonService.yearSelected
          }
          payloadData = {
            "SPID": "181",
            "parameter": {
              "STRFMDATE": gridData.CONTROL_DETAIL.STRFMDATE,
              "STRTODATE": gridData.CONTROL_DETAIL.STRTODATE,
              "INTVALUE": gridData.CONTROL_DETAIL.INTVALUE,
              "STRBRANCHES": gridData.CONTROL_DETAIL.STRBRANCHES,
              "LOGDATA": JSON.stringify(logData)
            }  
          };
        break;

        case 'Pos Collections' :
          let POSCollectionlogData =  {
            "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
            "REFMID": "",
            "USERNAME": this.CommonService.userName,
            "MODE": "PRINT",
            "DATETIME": this.CommonService.formatDateTime(new Date()),
            "REMARKS":"",
            "SYSTEMNAME": "",
            "BRANCHCODE": this.CommonService.branchCode,
            "VOCNO": "",
            "VOCDATE": "",
            "YEARMONTH" : this.CommonService.yearSelected
          }
          payloadData = {
            "SPID": "0114",
            "parameter": {
              "STRBRANCHCODES": gridData.CONTROL_DETAIL.STRBRANCHCODES,
              "STRVOCTYPES": gridData.CONTROL_DETAIL.STRVOCTYPES,
              "FROMVOCDATE": gridData.CONTROL_DETAIL.FROMVOCDATE,
              "TOVOCDATE": gridData.CONTROL_DETAIL.TOVOCDATE,
              "flag": '',
              "USERBRANCH": localStorage.getItem('userbranch'),
              "USERNAME": localStorage.getItem('username'),
              "Logdata": JSON.stringify(POSCollectionlogData)
            } 
          };
        break;

        case 'POS Summary':
          let SummaryLogData =  {
            "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
            "REFMID": "",
            "USERNAME": this.CommonService.userName,
            "MODE": "PRINT",
            "DATETIME": this.CommonService.formatDateTime(new Date()),
            "REMARKS":"",
            "SYSTEMNAME": "",
            "BRANCHCODE": this.CommonService.branchCode,
            "VOCNO": "",
            "VOCDATE": "",
            "YEARMONTH" : this.CommonService.yearSelected
          }
          payloadData = {
            "SPID": "0182",
            "parameter": {
             "Branches ": gridData.CONTROL_DETAIL.USERBRANCH,
             "FromDate ": gridData.CONTROL_DETAIL.STRFMDATE, 
             "ToDate ": gridData.CONTROL_DETAIL.STRTODATE, 
             "Vouchers ": '',
             "VocTypeWise ": 0,
            }
          }
        break;
  
        case 'Scheme Register Dev Report':
          let schemRegDevRpt =  {
            "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
            "REFMID": "",
            "USERNAME": this.CommonService.userName,
            "MODE": "PRINT",
            "DATETIME": this.CommonService.formatDateTime(new Date()),
            "REMARKS":"",
            "SYSTEMNAME": "",
            "BRANCHCODE": this.CommonService.branchCode,
            "VOCNO": "",
            "VOCDATE": "",
            "YEARMONTH" : this.CommonService.yearSelected
          }
          payloadData = {
            "SPID": "203",
            "parameter": {
              "strBRANCHES": gridData.CONTROL_DETAIL.strBRANCHES,
              "FrVocDate": gridData.CONTROL_DETAIL.FrVocDate,
              "ToVocDate": gridData.CONTROL_DETAIL.ToVocDate,
              "Status": gridData.CONTROL_DETAIL.Status,
              "TillToVocDate": gridData.CONTROL_DETAIL.TillToVocDate,
              "LOGDATA" : JSON.stringify(schemRegDevRpt)
            }
          }
        break;

        case 'POS Target Dashboard':
        let targetDasboardRPT =  {
          "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
          "REFMID": "",
          "USERNAME": this.CommonService.userName,
          "MODE": "PRINT",
          "DATETIME": this.CommonService.formatDateTime(new Date()),
          "REMARKS":"",
          "SYSTEMNAME": "",
          "BRANCHCODE": this.CommonService.branchCode,
          "VOCNO": "",
          "VOCDATE": "",
          "YEARMONTH" : this.CommonService.yearSelected
        }
        payloadData = {
          "SPID": "0154",
          "parameter": {
            "str_CurrFyear": gridData.CONTROL_DETAIL.str_CurrFyear,
            "strAsOnDate": gridData.CONTROL_DETAIL.strAsOnDate,
            "StrBranchList": gridData.CONTROL_DETAIL.StrBranchList,
            "intShowSummary": gridData.CONTROL_DETAIL.intShowSummary,
            "LOGDATA ": JSON.stringify(targetDasboardRPT)
          }
        }
      break;


  


        case 'Retail Customer Enquiry' :
        let CustomerEnquirylogData =  {
          "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
          "REFMID": "",
          "USERNAME": this.CommonService.userName,
          "MODE": "PRINT",
          "DATETIME": this.CommonService.formatDateTime(new Date()),
          "REMARKS":"",
          "SYSTEMNAME": "",
          "BRANCHCODE": this.CommonService.branchCode,
          "VOCNO": "",
          "VOCDATE": "",
          "YEARMONTH" : this.CommonService.yearSelected
        }
        payloadData = {
          "SPID": "",
          "parameter": {
          
            "Logdata": JSON.stringify(CustomerEnquirylogData)
          } 
        };
      break;

    
        
      case ' ' :
      break;
    }
    return payloadData
  }
  printGridData(data: any) {
    let gridData= JSON.parse(data.data['CONTROL_LIST_JSON'])

    this.CommonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', this.screenWisePayload(this.templateFetched_Data.FORM_NAME, gridData))
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
      let printContent = data[0][0].HTMLINPUT || data[0][0].HTMLOUT || data[0][0].POS_Summary_HTML || data[0][0].HTML || data[0][0].Column1;
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

  ngAfterViewInit(){
    this.screenName = this.CommonService.getModuleName();
  }

}