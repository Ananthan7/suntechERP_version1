import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { NgbActiveModal, NgbModal, NgbModalRef, } from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
@Component({
  selector: 'app-loss-recovery',
  templateUrl: './loss-recovery.component.html',
  styleUrls: ['./loss-recovery.component.scss']
})
export class LossRecoveryComponent implements OnInit {
  @ViewChild('overlayReceicvedBy') overlayReceicvedBy!: MasterSearchComponent;
  @ViewChild('overlayWorker') overlayWorker!: MasterSearchComponent;
  @ViewChild('overlayProcess') overlayProcess!: MasterSearchComponent;
  @ViewChild('overlayStockCode') overlayStockCode!: MasterSearchComponent;
  @ViewChild('overlayLocationTo') overlayLocationTo!: MasterSearchComponent;
  @ViewChild('overlayKaratCode') overlayKaratCode!: MasterSearchComponent;

  isloading: boolean = false;
  divisionMS: any = 'ID';
  branchCode?: string;
  yearMonth?: string;
  editMode: boolean = false;
  viewMode: boolean = false;
  isDisableSaveBtn: boolean | undefined;
  vocMaxDate = new Date();
  currentDate = new Date();
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  columnhead: any[] = ['',];
  columnheader: any[] = ['Sn No', 'Type', 'Worker Code', 'Process Code', 'Loss Qty', 'Recovery', 'Reco.Pure', 'Net Loss', 'Location To', 'Job Number', 'Job SO No', 'Design Code', 'Scrap UNQ Job'];
  tab1Label: string = 'Scrap Summary';
  tab2Label: string = 'Scrap Details';
  TypeList = [
    {
      name: 'Initial',
      value: 'Initial'
    },
    {
      name: 'Intermediate',
      value: 'Intermediate'
    },
    {
      name: 'Final',
      value: 'Final'
    },
  ];


  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: "LOCATION_CODE",
    SEARCH_HEADING: "Location",
    SEARCH_VALUE: "",
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  StockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: "STOCK_CODE",
    SEARCH_HEADING: "Stock Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  KaratCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: "KARAT_CODE",
    SEARCH_HEADING: "Karat Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: "WORKER_CODE",
    SEARCH_HEADING: "Worker Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.lossRecoveryFrom.controls.vocDate.setValue(this.currentDate)
    this.lossRecoveryFrom.controls.fromDate.setValue(this.currentDate)
    this.lossRecoveryFrom.controls.toDate.setValue(this.currentDate)

    this.generateVocNo()
  }


  close(data?: any) {
    this.activeModal.close(data);
  }

  userDataSelected(e: any) {
    console.log(e);
    this.lossRecoveryFrom.controls.receicvedBy.setValue(e.WORKER_CODE);
    // this.lossRecoveryFrom.controls.receicvedBy.setValue(value.UsersName);
  }

  // WorkerCodeSelected(e: any) {
  //   this.metalReturnForm.controls.worker.setValue(e.WORKER_CODE);
  //   this.processWorkerValidate()
  // }

  processCodeSelected(e: any) {
    console.log(e);
    this.lossRecoveryFrom.controls.process.setValue(e.Process_Code);
  }

  karatCodeSelected(e: any) {
    console.log(e);
    this.lossRecoveryFrom.controls.karatCode.setValue(e.KARAT_CODE);
    this.lossRecoveryFrom.controls.karatCodeDesc.setValue(e.Karat_desc);
  }

  stockCodeSelected(e: any) {
    this.lossRecoveryFrom.controls.stockCode.setValue(e.STOCK_CODE);
  }

  workCodeSelected(e: any) {
    this.lossRecoveryFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  locationCodeSelected(e: any) {
    console.log(e);
    this.lossRecoveryFrom.controls.locationTo.setValue(e.LOCATION_CODE);
  }


  lossRecoveryFrom: FormGroup = this.formBuilder.group({
    vocType: ['PLR', [Validators.required]],
    vocDate: [''],
    VocNo: ['', [Validators.required]],
    EnterBy: [''],
    returnType: ['Initial'],
    receicvedBy: [''],
    fromDate: [''],
    toDate: [''],
    returnDate: [''],
    remarks: [''],
    jobNo: [''],
    jobDesc: [''],
    worker: [''],
    process: [''],
    stockCode: [''],
    locationTo: [''],
    karatCode: [''],
    karatCodeDesc: [''],
    scrapReturnWt: [''],
    balanceWt: [''],
    excessLoss: [''],
    scrapPureWt: [''],
    balancePureWt: [''],
    remainBalPure: [''],
    newJobNo: [''],
    radioShowPendingJobsForScrap: true,
    radioKaratWiseFilter: true,
    radioGold: true,
    radioDiamond: true,
    radioRefinery: true,
    // radioAllowRecovery: true,
    AlloyRecovery: true,
    radioScrapReturn: true,
    radioFinalLoss: true,
    Metalsoption:["M"],

  });

  submitValidations(form: any) {
    if (this.comService.nullToString(form.vocType) == '') {
      this.comService.toastErrorByMsgId('MSG1939')// vocType  CANNOT BE EMPTY
      return true
    }
    else if (this.comService.nullToString(form.VocNo) == '') {
      this.comService.toastErrorByMsgId('MSG1940')//"VocNo cannot be empty"
      return true
    }
    return false;
  }

  istypeSelected(): boolean {
    return this.lossRecoveryFrom.get('returnType')?.value === 'Intermediate';
  }


  isrecovSelected(): boolean {
    return this.lossRecoveryFrom.get('Metalsoption')?.value === 'Y';
  }


  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.comService.branchCode}/${this.comService.yearSelected}/${this.comService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.lossRecoveryFrom.controls.VocNo.setValue(resp.newvocno);
        }
      });
  }

  ValidatingVocNo() {
    if(this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.lossRecoveryFrom.value.VocNo}`
    API += `/${this.comService.branchCode}/${this.comService.getqueryParamVocType()}`
    API += `/${this.comService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.comService.toastErrorByMsgId('MSG2007')
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  showOverleyPanel(event: any, formControlName: string) {
    if (this.lossRecoveryFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'receicvedBy':
        this.overlayReceicvedBy.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayWorker.showOverlayPanel(event);
        break;
      case 'process':
        this.overlayProcess.showOverlayPanel(event);
        break;
      case 'stockCode':
        this.overlayStockCode.showOverlayPanel(event);
        break;
      case 'locationTo':
        this.overlayLocationTo.showOverlayPanel(event);
        break;
      case 'karatCode':
        this.overlayKaratCode.showOverlayPanel(event);
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
    this.comService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.lossRecoveryFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'receicvedBy' || FORMNAME === 'worker' || FORMNAME === 'process' || FORMNAME === 'stockCode' || FORMNAME === 'locationTo' || FORMNAME === 'karatCode') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  returnType(e:any){
   
    const selectedType = e;

    if (selectedType === 'Initial') {
        this.tab1Label = 'Scrap Summary';
        this.tab2Label = 'Scrap Details';
    } else {
        this.tab1Label = 'Return Summary';
        this.tab2Label = 'Stock Details';
    }

  }

  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    // if (this.lossRecoveryFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }

    if (this.submitValidations(this.lossRecoveryFrom.value)) return;


    let API = "ProdLossRecovery/InsertProdLossRecovery";
    let postData = {
      "MID": 0,
      "VOCNO":  this.comService.emptyToZero(this.lossRecoveryFrom.value.VocNo),
      "VOCTYPE":  this.comService.nullToString(this.lossRecoveryFrom.value.vocType),
      "VOCDATE": this.comService.formatDateTime(this.lossRecoveryFrom.value.vocDate),
      "YEARMONTH": this.yearMonth,
      "BRANCH_CODE": this.branchCode,
      "SMAN": this.lossRecoveryFrom.value.EnterBy,
      "METAL_RATE_TYPE": "",
      "LOSS_UPTODATE": "2023-10-19T10:46:17.071Z",
      "TOTAL_LOSS": 0,
      "TOTAL_RECOVERY": 0,
      "NET_LOSS": 0,
      "NAVSEQNO": 0,
      "FULL_RECOVERY": true,
      "REC_TYPE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "REMARKS": this.lossRecoveryFrom.value.remarks,
      "PRINT_COUNT": 0,
      "LOSS_FRMDATE":this.comService.formatDateTime(this.lossRecoveryFrom.value.fromDate),
      "LOSS_TODATE":  this.comService.formatDateTime(this.lossRecoveryFrom.value.toDate),
      "RECOVERY_TYPE": 0,
      "SCRAP_RETURN": true,
      "TOTAL_SCRAP": 0,
      "WORKER_CODE": "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "ALLOY_RECOVERY": true,
      "HTUSERNAME": this.lossRecoveryFrom.value.receicvedBy,
      "PROD_LOSS_RECOVERY_DETAIL": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "WORKER_CODE": "",
          "WORKER_NAME": "",
          "STOCK_CODE": "",
          "DESCRIPTION": "",
          "PURITY": 0,
          "LOSS_UPTODATE": "2023-11-25T10:02:11.204Z",
          "LOSS_QTY": 0,
          "LOSS_PURE_QTY": 0,
          "RECO_QTY": 0,
          "RECO_PURE_QTY": 0,
          "NET_LOSS": 0,
          "NET_LOSS_PURE": 0,
          "DIVISION_CODE": "",
          "ADJ_WT": 0,
          "ADJ_PUREWT": 0,
          "ADJ_ACCODE": "",
          "PHY_STOCK_ACCODE": "",
          "LOCTYPE_CODE": "",
          "DT_YEARMONTH": "",
          "DT_VOCNO": 0,
          "DT_VOCTYPE": "",
          "DT_BRANCH_CODE": "",
          "PROCESS_CODE": "",
          "SCRAP_STOCK_CODE": "",
          "SCRAP_GROSS_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_JOB_NUMBER": "",
          "SCRAP_UNQ_JOB_ID": "",
          "JOB_SO_NUMBER": 0,
          "DESIGN_CODE": "",
          "NEW_JOBNO": "",
          "SRSLNO": 0
        }
      ],
      "PROD_LOSS_RECOVERY_SUBDETAIL": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "JOBNO": "",
          "WORKER_CODE": "",
          "WORKER_NAME": "",
          "PROCESS_CODE": "",
          "PROCESS_NAME": "",
          "PROC_LOSS_ACCODE": "",
          "STOCK_CODE": "",
          "PURITY": 0,
          "PHY_STOCK_ACCODE": "",
          "LOSS_UPTODATE": "2023-11-25T10:02:11.204Z",
          "TOTAL_RECOVERY": 0,
          "TOTAL_RECOVERY_PURE": 0,
          "LOSS_QTY": 0,
          "LOSS_QTY_PURE": 0,
          "RECO_QTY": 0,
          "RECO_QTY_PURE": 0,
          "NET_LOSS": 0,
          "NET_LOSS_PURE": 0,
          "DIVISION_CODE": "",
          "TRANS_MID": 0,
          "FULL_RECOVERY": 0,
          "TYPE": "",
          "SRSLNO": 0,
          "SCRAP_STOCK_CODE": "",
          "SCRAP_GROSS_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_JOB_NUMBER": "",
          "SCRAP_UNQ_JOB_ID": "",
          "JOB_SO_NUMBER": 0,
          "DESIGN_CODE": "",
          "LOSS_ACCODE": "",
          "WIP_GROSS_WT": 0,
          "WIP_LOSS_WT": 0,
          "WIP_GROSS_PUREWT": 0,
          "WIP_LOSS_PUREWT": 0,
          "PCS": 0,
          "LOSS_BOOK": "",
          "STOCK_DESC": "",
          "TRANS_VOCTYPE": ""
        }
      ],
      "PROD_LOSS_RECOVERY_SUBJOB_DETAIL": [
        {
          "REFMID": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "DT_VOCDATE": "2023-11-25T10:02:11.204Z",
          "JOBNO": "",
          "DSO_VOCNO": "",
          "PARTYCODE": "",
          "DESIGN_CODE": "",
          "KARAT": "",
          "DIVCODE": "",
          "STOCK_CODE": "",
          "PURITY": 0,
          "PCS": 0,
          "GROSS_WT": 0,
          "PURE_WT": 0,
          "SCRAP_WT": 0,
          "SIZE_CODE": "",
          "WIDTH_CODE": "",
          "METAL_COLOR": "",
          "CATEGORY_CODE": "",
          "COUNTRY_CODE": "",
          "CUT_CODE": "",
          "FINISH_CODE": "",
          "DYE_CODE": "",
          "TYPE_CODE": "",
          "BRAND_CODE": "",
          "SLNO": 0,
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "MAIN_JOBNO": ""
        }
      ]
    }
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result && result.status == "Success") {
            Swal.fire({
              title: result.message || "Success",
              text: "",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            }).then((result: any) => {
              if (result.value) {
                this.lossRecoveryFrom.reset();
                this.close("reloadMainGrid");
              }
            });
          } else {
            this.comService.toastErrorByMsgId('MSG3577')
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }
  update() {
    // if (this.lossRecoveryFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }
    if (this.submitValidations(this.lossRecoveryFrom.value)) return;


    let API = "ProdLossRecovery/UpdateProdLossRecovery/" + this.lossRecoveryFrom.value.mid;
    let postData = {

    }
    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result && result.status == "Success") {
            Swal.fire({
              title: result.message || "Success",
              text: "",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            }).then((result: any) => {
              if (result.value) {
                this.lossRecoveryFrom.reset();
                this.close("reloadMainGrid");
              }
            });
          } else {
            this.comService.toastErrorByMsgId('MSG3577')
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

}
