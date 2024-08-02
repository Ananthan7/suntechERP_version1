import { Component, Input, OnInit } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import {  NgbActiveModal,  NgbModal,  NgbModalRef,} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-loss-recovery',
  templateUrl: './loss-recovery.component.html',
  styleUrls: ['./loss-recovery.component.scss']
})
export class LossRecoveryComponent implements OnInit {
  divisionMS: any = 'ID';
  branchCode?: string;
  yearMonth?: string;
  vocMaxDate = new Date();
  currentDate = new Date();
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  columnhead:any[] = ['',];
  columnheader:any[] = ['Sn No','Type','Worker Code','Process Code','Loss Qty','Recovery','Reco.Pure','Net Loss','Location To','Job Number','Job SO No','Design Code','Scrap UNQ Job'];
 
  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "User",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

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
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }


  close(data?: any) {
    this.activeModal.close(data);
  }
  
  userDataSelected(value: any) {
    console.log(value);
       this.lossRecoveryFrom.controls.receicvedBy.setValue(value.UsersName);
  }

  processCodeSelected(e:any){
    console.log(e);
    this.lossRecoveryFrom.controls.process.setValue(e.Process_Code);
  }

  karatCodeSelected(e:any){
    console.log(e);
    this.lossRecoveryFrom.controls.karatCode.setValue(e['Karat Code']);
    this.lossRecoveryFrom.controls.karatCodeDesc.setValue(e['Karat Description']);
  }

  stockCodeSelected(e:any){
    this.lossRecoveryFrom.controls.process.setValue(e.STOCK_CODE);
  }

  workCodeSelected(e:any){
    this.lossRecoveryFrom.controls.process.setValue(e.WORKER_CODE);
  }

  locationCodeSelected(e:any){
    console.log(e);
    this.lossRecoveryFrom.controls.locationTo.setValue(e.LOCATION_CODE);
  }


  lossRecoveryFrom: FormGroup = this.formBuilder.group({
    vocType : ['',[Validators.required]],
    vocDate : [''],
    VocNo : ['',[Validators.required]],
    EnterBy : [''],
    returnType : [''],   
    receicvedBy : [''],   
    fromDate : [''],
    toDate : [''],
    returnDate : [''],
    remarks : [''],
    jobNo : [''],
    jobDesc : [''],
    worker : [''],
    process : [''],
    stockCode :[''],
    locationTo : [''],
    karatCode : [''],
    karatCodeDesc : [''],
    scrapReturnWt : [''],
    balanceWt : [''],
    excessLoss : [''],
    scrapPureWt : [''],
    balancePureWt : [''],
    remainBalPure : [''],
    newJobNo :[''],
    radioShowPendingJobsForScrap : true,
    radioKaratWiseFilter : true,
    radioGold : true,
    radioDiamond : true,
    radioRefinery : true,
    radioAllowRecovery : true,
    radioScrapReturn : true,
    radioFinalLoss : true,
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
      "VOCNO": this.lossRecoveryFrom.value.VocNo,
      "VOCTYPE": this.lossRecoveryFrom.value.vocType,
      "VOCDATE": this.lossRecoveryFrom.value.vocDate,
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
      "REMARKS":  this.lossRecoveryFrom.value.remarks,
      "PRINT_COUNT": 0,
      "LOSS_FRMDATE": this.lossRecoveryFrom.value.fromDate,
      "LOSS_TODATE": this.lossRecoveryFrom.value.toDate,
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
          "WORKER_CODE": "string",
          "WORKER_NAME": "string",
          "STOCK_CODE": "string",
          "DESCRIPTION": "string",
          "PURITY": 0,
          "LOSS_UPTODATE": "2023-11-25T10:02:11.204Z",
          "LOSS_QTY": 0,
          "LOSS_PURE_QTY": 0,
          "RECO_QTY": 0,
          "RECO_PURE_QTY": 0,
          "NET_LOSS": 0,
          "NET_LOSS_PURE": 0,
          "DIVISION_CODE": "s",
          "ADJ_WT": 0,
          "ADJ_PUREWT": 0,
          "ADJ_ACCODE": "string",
          "PHY_STOCK_ACCODE": "string",
          "LOCTYPE_CODE": "string",
          "DT_YEARMONTH": "string",
          "DT_VOCNO": 0,
          "DT_VOCTYPE": "str",
          "DT_BRANCH_CODE": "string",
          "PROCESS_CODE": "string",
          "SCRAP_STOCK_CODE": "string",
          "SCRAP_GROSS_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_JOB_NUMBER": "string",
          "SCRAP_UNQ_JOB_ID": "string",
          "JOB_SO_NUMBER": 0,
          "DESIGN_CODE": "string",
          "NEW_JOBNO": "string",
          "SRSLNO": 0
        }
      ],
      "PROD_LOSS_RECOVERY_SUBDETAIL": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "JOBNO": "string",
          "WORKER_CODE": "string",
          "WORKER_NAME": "string",
          "PROCESS_CODE": "string",
          "PROCESS_NAME": "string",
          "PROC_LOSS_ACCODE": "string",
          "STOCK_CODE": "string",
          "PURITY": 0,
          "PHY_STOCK_ACCODE": "string",
          "LOSS_UPTODATE": "2023-11-25T10:02:11.204Z",
          "TOTAL_RECOVERY": 0,
          "TOTAL_RECOVERY_PURE": 0,
          "LOSS_QTY": 0,
          "LOSS_QTY_PURE": 0,
          "RECO_QTY": 0,
          "RECO_QTY_PURE": 0,
          "NET_LOSS": 0,
          "NET_LOSS_PURE": 0,
          "DIVISION_CODE": "s",
          "TRANS_MID": 0,
          "FULL_RECOVERY": 0,
          "TYPE": "s",
          "SRSLNO": 0,
          "SCRAP_STOCK_CODE": "string",
          "SCRAP_GROSS_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_JOB_NUMBER": "string",
          "SCRAP_UNQ_JOB_ID": "string",
          "JOB_SO_NUMBER": 0,
          "DESIGN_CODE": "string",
          "LOSS_ACCODE": "string",
          "WIP_GROSS_WT": 0,
          "WIP_LOSS_WT": 0,
          "WIP_GROSS_PUREWT": 0,
          "WIP_LOSS_PUREWT": 0,
          "PCS": 0,
          "LOSS_BOOK": "s",
          "STOCK_DESC": "string",
          "TRANS_VOCTYPE": "str"
        }
      ],
      "PROD_LOSS_RECOVERY_SUBJOB_DETAIL": [
        {
          "REFMID": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "DT_VOCDATE": "2023-11-25T10:02:11.204Z",
          "JOBNO": "string",
          "DSO_VOCNO": "string",
          "PARTYCODE": "string",
          "DESIGN_CODE": "string",
          "KARAT": "stri",
          "DIVCODE": "s",
          "STOCK_CODE": "string",
          "PURITY": 0,
          "PCS": 0,
          "GROSS_WT": 0,
          "PURE_WT": 0,
          "SCRAP_WT": 0,
          "SIZE_CODE": "string",
          "WIDTH_CODE": "string",
          "METAL_COLOR": "string",
          "CATEGORY_CODE": "string",
          "COUNTRY_CODE": "string",
          "CUT_CODE": "string",
          "FINISH_CODE": "string",
          "DYE_CODE": "string",
          "TYPE_CODE": "string",
          "BRAND_CODE": "string",
          "SLNO": 0,
          "PROCESS_CODE": "string",
          "WORKER_CODE": "string",
          "MAIN_JOBNO": "string"
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
          }else {
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


    let API ="ProdLossRecovery/UpdateProdLossRecovery/" + this.lossRecoveryFrom.value.mid;
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
              }else {
                this.comService.toastErrorByMsgId('MSG3577')
              } 
          },
          (err) => alert(err)
        );
      this.subscriptions.push(Sub);
     }
        
}
