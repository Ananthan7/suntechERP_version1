import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MeltingProcessDetailsComponent } from './melting-process-details/melting-process-details.component';
import { JobAllocationComponent } from '../job-allocation/job-allocation.component';
import { JobAllocationMeltingComponent } from './job-allocation-melting/job-allocation-melting.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';


@Component({
  selector: 'app-melting-process',
  templateUrl: './melting-process.component.html',
  styleUrls: ['./melting-process.component.scss']
})
export class MeltingProcessComponent implements OnInit {
  @ViewChild('meltingissueDetailScreen') public meltingissueDetailScreen!: NgbModal;
  @ViewChild('overlayllocationScp') overlayllocationScp!: MasterSearchComponent;
  @ViewChild('overlaylstockCodeScp') overlaylstockCodeScp!: MasterSearchComponent;
  @ViewChild('overlaylocationRet') overlaylocationRet!: MasterSearchComponent;
  @ViewChild('overlaystockcodeRet') overlaystockcodeRet!: MasterSearchComponent;
  @ViewChild('overlayprocesscode') overlayprocesscode!: MasterSearchComponent;
  @ViewChild('overlaywokercode') overlaywokercode!: MasterSearchComponent;
  @ViewChild('overlaymeltingTypecode') overlaymeltingTypecode!: MasterSearchComponent;
  @Input() content!: any;
  tableData: any[] = [];
  detailData: any[] = [];
  dataToParent: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  voctype?: String;
  tableRowCount: number = 0;
  vocMaxDate = new Date();
  selectRowIndex: any;
  currentDate = new Date();
  viewMode: boolean = false;
  isSaved: boolean = false;
  isloading: boolean = false;
  sequenceDetails: any[] = []
  meltingprocessDetailsData: any[] = [];
   isDisableSaveBtn: boolean = false;
   isJobNumberSearchVisible: boolean = false;
  editMode: boolean = false;
  private subscriptions: Subscription[] = [];
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];

  columnhead: any[] = ['SRNO', 'Div', 'jobno', 'stockcode', 'stockcodedes', 'process', 'worker', 'pcs', 'grossweight', 'stoneweight', 'netweight', 'purity', 'pureweight', 'lossweight', 'purediff'];
  // columnhead: any[] = ['Sr #', 'Div', 'Job No', 'Stock Code', 'Stock Desc', 'Process', 'Worker', 'Pcs', 'Gross Wt', 'Stone Wt', 'Net Wt', 'Purity', 'Pure Wt', 'Balance Wt', 'Balance Pure'];
  columnhead1: any[] = ['R to Stock', 'Stock Code', 'Gross Wt', 'Purity', 'Pure Wt', 'Location'];
  columnhead2: any[] = ['R to Scrap', 'Stock Code', 'Gross Wt', 'Purity', 'Pure Wt', 'Location', 'Loss', 'Pure Wt', 'Bal Gross', 'Bal Pure'];
  column: any[] = ['Sr', 'So No', 'Party Code', 'Party Name', 'Job No', 'job Desc', 'Design Code', 'UNQ Design ID', 'Process', 'Worker', ' Req Metal', 'Stone Wt', 'Recd Gross Wt', 'Metal Allocated', 'Allocated Pure Wt', 'Job Pcs'];


  MeltingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 94,
    SEARCH_FIELD: 'MELTYPE_CODE',
    SEARCH_HEADING: 'Melting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,

  }


  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'PROCESS_CODE',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Time',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 254,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "@strProcess='',@blnActive=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.voctype = this.comService.getqueryParamVocType()
    this.yearMonth = this.comService.yearSelected;
    // this.meltingProcessFrom.controls.vocdate.setValue(this.currentDate)
    // this.meltingProcessFrom.controls.vocType.setValue(this.comService.getqueryParamVocType())
    // console.log(this.meltingProcessFrom.value.vocType, 'this is voctype')
    // this.setAllInitialValues = this.dataToParent;
    // this.setAllInitialValues();
    // this.setvalues();
    //this.setCompanyCurrency();


    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.LOCKVOUCHERNO = true;
      }
      this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.deleteRecord()
      }
      this.meltingProcessFrom.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.generateVocNo()
      this.setvalues()
      this.setvoucherTypeMaster()
    }
  }

  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobMeltingProcessDJ/GetJobMeltingProcessDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data)
          this.meltingprocessDetailsData = data.Details
          data.Details.forEach((element: any) => {
            this.tableData.push({
              jobno: element.JOB_NUMBER,
              stockcode: element.STOCK_CODE,
              process: element.PROCESS_CODE,
              worker: element.WORKER_CODE,
              pcs: element.PCS,
              grossweight: element.GROSS_WT,
              purity: element.PURITY,
              pureweight: element.PUREWT,
              SRNO: element.SRNO,
              Rate: element.RATE,
              Amount: element.Amount,


            })
          });

          this.meltingProcessFrom.controls.vocType.setValue(data.VOCTYPE)
          this.meltingProcessFrom.controls.vocNo.setValue(data.VOCNO)
          this.meltingProcessFrom.controls.vocDate.setValue(data.VOCDATE)
          this.meltingProcessFrom.controls.process.setValue(data.PROCESS_CODE)
          this.meltingProcessFrom.controls.worker.setValue(data.WORKER_CODE)
          this.meltingProcessFrom.controls.workerDesc.setValue(data.WORKER_DESC)
          this.meltingProcessFrom.controls.processDesc.setValue(data.PROCESS_DESC)
          // this.meltingProcessFrom.controls.jobno.setValue(data.JOB_NUMBER)
          // this.meltingProcessFrom.controls.jobdes.setValue(data.Details[0].JOB_DESCRIPTION)
          this.meltingProcessFrom.controls.color.setValue(data.COLOR)
          this.meltingProcessFrom.controls.TotalgrossWt.setValue(data.TOTAL_GROSSWT)
          this.meltingProcessFrom.controls.TotalpureWt.setValue(data.TOTAL_PUREWT)
          // this.meltingProcessFrom.controls.pcs.setValue(data.PCS)
          this.meltingProcessFrom.controls.stockcodeRet.setValue(data.STOCK_CODE)
          this.meltingProcessFrom.controls.purity.setValue(data.PURITY)


        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }
  stockCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.stockcodeRet.setValue(e.STOCK_CODE);
  }

  stockCodeScpSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.stockCodeScp.setValue(e.DESCRIPTION);
  }

  processCodeScpSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.process.setValue(e.Process_Code);
    this.meltingProcessFrom.controls.processDesc.setValue(e.Description);
  }



  MeltingCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.meltingType.setValue(e['Melting Type']);
    this.meltingProcessFrom.controls.meltingType.setValue(e.MELTYPE_CODE);
    this.meltingTypeValidate()
  }
  
  meltingTypeValidate(event?: any) {
    const meltingTypeValue = this.meltingProcessFrom.value.meltingType;
    console.log('Melting Type:', meltingTypeValue);

    if (!meltingTypeValue) {
      // this.commonService.toastErrorByMsgId('MSG1531');
      return;
    }

    const API = `MeltingType/GetMeltingTypeList/${meltingTypeValue}`;

    const sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result: any) => {
        this.commonService.closeSnackBarMsg();
        if (result.response) {
          const data = result.response;
          console.log(data, 'data')
          this.meltingProcessFrom.controls.color.setValue(data.COLOR);
          this.meltingProcessFrom.controls.jobpurity.setValue(data.PURITY);
          // this.meltingProcessFrom.controls.Karat.setValue(data.KARAT_CODE)//KARAT_CODE
          this.setValueWithDecimal('jobpurity', data.PURITY, 'PURITY')
      
        } else {
       
          this.commonService.toastErrorByMsgId('MSG1531');
          this.meltingProcessFrom.controls.meltingtype.setValue('')
          this.showOverleyPanel(event, 'meltingtype')

        }
      },
      (err: any) => {
        console.error('API Call Error:', err);
        this.isJobNumberSearchVisible = false;
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531');
      }
    );

    this.subscriptions.push(sub);
  }

  locationCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.locationRet.setValue(e.LOCATION_CODE);
  }

  locationCodeScpSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.locationScp.setValue(e.DESCRIPTION);
  }

  timeCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.time.setValue(e.CODE);
  }

  workerCodeSelected(e: any) {
    this.meltingProcessFrom.controls.worker.setValue(e.WORKER_CODE);
    this.meltingProcessFrom.controls.workerDesc.setValue(e.DESCRIPTION);
  }
  // setCompanyCurrency() {
  //   let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
  //   this.meltingProcessFrom.controls.currency.setValue(CURRENCY_CODE);
  //   this.setCurrencyRate()
  // }
  // /**USE: to set currency from branch currency master */
  // setCurrencyRate() {
  //   const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.meltingProcessFrom.value.currency);
  //   if (CURRENCY_RATE.length > 0) {
  //     this.meltingProcessFrom.controls.currencyrate.setValue(
  //       this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
  //     );
  //   } else {
  //     this.meltingProcessFrom.controls.currency.setValue('')
  //     this.meltingProcessFrom.controls.currencyrate.setValue('')
  //     this.commonService.toastErrorByMsgId('MSG1531')
  //   }
  // }


  meltingProcessFrom: FormGroup = this.formBuilder.group({
    vocType: ['', [Validators.required]],
    vocNo: ['', [Validators.required]],
    vocDate: [new Date()],
    meltingType: [''],
    process: [''],
    processDesc: [''],
    worker: [''],
    workerDesc: [''],
    color: [''],
    time: [''],
    stoneStockCode: [''],
    stoneStockCodeNo: [''],
    stoneStockCodeDesc: [''],
    stoneStockCodeValue: [''],
    stoneWeight: [''],
    rate: [''],
    stoneAmount: [''],
    stockcodeRet: [''],
    stockCodeScp: [''],
    purityRET: [''],
    purity: [''],
    TotalpureWt: [''],
    RETpureWt: [''],
    TotalgrossWt: [''],
    RETgrossWt: [''],
    locationRet: [''],
    locationScp: [''],
    loss: [''],
    balGross: [''],
    balPure: [''],
    currencyCode: [''],
    currencyRate: [''],
    remarks: [''],
    balance: [''],
    allocated: [''],
    required: [''],
    issued: [''],
    MAIN_VOCTYPE: [''],
    FLAG: [null],
    jobpurity: ['']
  });


  setvalues() {
    this.meltingProcessFrom.controls.vocType.setValue(this.commonService.getqueryParamVocType())
    this.meltingProcessFrom.controls.vocDate.setValue(this.comService.currentDate)
    this.meltingProcessFrom.controls.MAIN_VOCTYPE.setValue(
      this.comService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.meltingProcessFrom.value
    const vocTypeMaster = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.meltingProcessFrom.value.vocNo}`
    API += `/${this.comService.branchCode}/${this.comService.getqueryParamVocType()}`
    API += `/${this.comService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.comService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.comService.branchCode}/${this.comService.yearSelected}/${this.comService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.meltingProcessFrom.controls.vocNo.setValue(resp.newvocno);
        }
      });
  }


  openaddmeltingprocess(data?: any) {
    if (data) {
      data[0] = this.meltingProcessFrom.value;
    } else {
      data = [{ HEADERDETAILS: this.meltingProcessFrom.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(JobAllocationMeltingComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    modalRef.result.then((postData) => {
      console.log(postData);
      if (postData) {
        console.log('Data from modal:', postData);
        this.meltingprocessDetailsData.push(postData.POSTDATA[0]);
        console.log(this.meltingprocessDetailsData);
        this.setValuesToHeaderGrid(postData);

      }
    });

  }
  onRowClickHandler(event: any) {

    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
    this.openaddmeltingprocess(selectedData)
    console.log(event)

  }
  // onRowDoubleClick(event: any) {
  //   let selectedData = event.data
  //   let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
  //   let allDataSelected = [detailRow[0].DATA]
  //   this.openaddmeltingprocess(allDataSelected)
  //   console.log(event)
  // }
  setValuesToHeaderGrid(detailDataToParent: any) {
    let PROCESS_FORMDETAILS = detailDataToParent.PROCESS_FORMDETAILS
    if (PROCESS_FORMDETAILS.SRNO) {
      this.swapObjects(this.tableData, [PROCESS_FORMDETAILS], (PROCESS_FORMDETAILS.SRNO - 1))
    } else {
      this.tableRowCount += 1
      PROCESS_FORMDETAILS.SRNO = this.tableRowCount
    }

    this.tableData.push(PROCESS_FORMDETAILS)

    if (detailDataToParent) {
      this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
    }
    // this.getSequenceDetailData(PROCESS_FORMDETAILS);

  }
  resetAllocation() { }
  swapObjects(array1: any, array2: any, index: number) {
    // Check if the index is valid
    if (index >= 0 && index < array1.length) {
      array1[index] = array2[0];
    } else {
      console.error('Invalid index');
    }
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.meltingProcessFrom.value[formControlName] != '') return;
    switch (formControlName) {
      case 'meltingType':
        this.overlaymeltingTypecode.showOverlayPanel(event);
        break;
      case 'process':
        this.overlayprocesscode.showOverlayPanel(event);
        break;
      case 'stockcodeRet':
        this.overlaystockcodeRet.showOverlayPanel(event);
        break;
      case 'locationRet':
        this.overlaylocationRet.showOverlayPanel(event);
        break;
      case 'stockCodeScp':
        this.overlaylstockCodeScp.showOverlayPanel(event);
        break;
      case 'locationScp':
        this.overlayllocationScp.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlaywokercode.showOverlayPanel(event);
        break;
      default:
    }
  }

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.meltingProcessFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'meltingType' || FORMNAME === 'process' || FORMNAME === "stockcodeRet" || FORMNAME === "locationRet" || FORMNAME === "stockCodeScp" ||FORMNAME === "locationScp") {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  // deleteTableData(): void {
  //   this.tableRowCount = 0;
  //   console.log(this.selectRowIndex)

  //     this.tableData.splice(this.selectRowIndex ,1)

  // }
  deleteTableData(): void {
    if (!this.selectRowIndex) {
      Swal.fire({
        title: '',
        text: 'Please select row to remove from grid!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.meltingprocessDetailsData = this.meltingprocessDetailsData.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
        this.reCalculateSRNO()
      }
    }
    )
  }
  reCalculateSRNO(): void {
    this.meltingprocessDetailsData.forEach((element: any, index: any) => {
      element.SRNO = index + 1
      element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
    })
  }
  setPostData() {
    let form = this.meltingProcessFrom.value
    console.log(form, 'form');
    return {
      "MID": 0,
      "BRANCH_CODE": this.comService.nullToString(this.branchCode),
      "VOCTYPE": this.comService.nullToString(this.meltingProcessFrom.value.vocType),
      "VOCNO": 0,
      "VOCDATE": this.comService.formatDateTime(this.currentDate),
      "YEARMONTH": this.yearMonth,
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingProcessFrom.value.worker,
      "WORKER_DESC": this.meltingProcessFrom.value.workerDesc,
      "SALESPERSON_CODE": "",
      "SALESPERSON_NAME": "",
      "DOCTIME": "2023-10-30T13:03:04.859Z",
      "TOTAL_GROSSWT": (this.meltingProcessFrom.value.TotalgrossWt),
      "TOTAL_PUREWT": this.commonService.emptyToZero(this.meltingProcessFrom.value.TotalpureWt),
      "TOTAL_STONEWT": this.meltingProcessFrom.value.TOTAL_STONEWT,
      "TOTAL_NETWT": 0,
      "TOTAL_WAXWT": 0,
      "TOTAL_IRONWT": 0,
      "TOTAL_MKGVALUEFC": 0,
      "TOTAL_MKGVALUECC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_ISSUED_QTY": 0,
      "TOTAL_REQUIRED_QTY": 0,
      "TOTAL_ALLOCATED_QTY": 0,
      "CURRENCY_CODE": this.meltingProcessFrom.value.currencyCode,
      "CURRENCY_RATE": this.commonService.emptyToZero(this.meltingProcessFrom.value.CURRENCY_RATE),
      "TRAY_WEIGHT": 0,
      "REMARKS": "",
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "BASE_CURRENCY": this.meltingProcessFrom.value.currencyCode,
      "BASE_CURR_RATE": this.commonService.emptyToZero(this.meltingProcessFrom.value.CURRENCY_RATE),
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.meltingProcessFrom.value.process,
      "PROCESS_DESC": this.meltingProcessFrom.value.processDesc,
      "PRINT_COUNT": 0,
      "MELTING_TYPE": this.meltingProcessFrom.value.meltingType,
      "COLOR": this.meltingProcessFrom.value.color,
      "RET_STOCK_CODE": this.meltingProcessFrom.value.stockcodeRet,
      "RET_GROSS_WT": this.meltingProcessFrom.value.RETgrossWt,
      "RET_PURITY": this.meltingProcessFrom.value.purityRET,
      "RET_PURE_WT": this.meltingProcessFrom.value.RETpureWt,
      "RET_LOCATION_CODE": this.meltingProcessFrom.value.locationRet,
      "SCP_STOCK_CODE": this.commonService.nullToString(this.meltingProcessFrom.value.SCP_STOCK_CODE),
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": this.commonService.nullToString(this.meltingProcessFrom.value.SCP_LOCATION_CODE),
      "LOSS_QTY": this.meltingProcessFrom.value.loss,
      "LOSS_PURE_WT": 0,
      "BALANCE_WT": this.meltingProcessFrom.value.balGross,
      "BALANCE_PURE_WT": this.meltingProcessFrom.value.balPure,
      "PURITY": this.meltingProcessFrom.value.purity,
      "PUDIFF": 0,
      "SCP_PUDIFF": 0,
      "SYSTEM_DATE": "2023-10-30T13:03:04.860Z",
      "Details": this.meltingprocessDetailsData

    }
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.vocType) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// vocType  CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.vocNo) == '') {
      this.commonService.toastErrorByMsgId('MSG1940')//"vocNo cannot be empty"
      return true
    }
    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.submitValidations(this.meltingProcessFrom.value)) return;


    // if (this.meltingProcessFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }


    let API = 'JobMeltingProcessDJ/InsertJobMeltingProcessDJ'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status.trim() == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.meltingProcessFrom.reset()
              this.isSaved = true;
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }

  // setNewFormValues() {
  //   this.meltingProcessFrom.controls.VOCTYPE.setValue(this.comService.getqueryParamVocType())
  //   this.meltingProcessFrom.controls.vocdate.setValue(this.comService.currentDate)
  //   this.meltingProcessFrom.controls.YEARMONTH.setValue(this.comService.yearSelected)
  //   this.meltingProcessFrom.controls.BRANCH_CODE.setValue(this.comService.branchCode)

  // }

  update() {
    if (this.submitValidations(this.meltingProcessFrom.value)) return;


    let form = this.meltingProcessFrom.value
    let API = `JobMeltingProcessDJ/UpdateJobMeltingProcessDJ/${this.branchCode}/${this.meltingProcessFrom.value.vocType}/${this.meltingProcessFrom.value.vocNo}/${this.commonService.yearSelected}`
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status == "Success") {
          this.isSaved = true;
          Swal.fire({
            title: this.comService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.meltingProcessFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }


  getSequenceDetailData(formData: any) {
    let API = `SequenceMasterDJ/GetSequenceMasterDJDetail/${formData.SEQ_CODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.sequenceDetails = data.sequenceDetails

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }


  deleteRecord() {
    if (!this.content.MID) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'CostCenterMaster/DeleteCostCenterMaster/' + this.meltingProcessFrom.value.costcode
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.meltingProcessFrom.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.meltingProcessFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted

            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  addSalesOrder() {
    const modalRef: NgbModalRef = this.modalService.open(JobAllocationMeltingComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.meltingProcessFrom.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
  }

}


