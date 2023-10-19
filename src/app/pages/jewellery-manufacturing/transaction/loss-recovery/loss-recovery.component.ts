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
  columnhead:any[] = ['',];
  columnheader:any[] = ['Sn No','Type','Worker Code','Process Code','Loss Qty','Recovery','Reco.Pure','Net Loss','Location To','Job Number','Job SO No','Design Code','Scrap UNQ Job'];



  lossRecoveryFrom: FormGroup = this.formBuilder.group({
    vocType : [''],
    vocDate : [''],
    VocNo : [''],
    EnterBy : [''],
    returnType : [''],   
    receicvedBy : [''],   
    fromDate : [''],
    toDate : [''],
    returnDate : [''],
    remarks : [''],
    radioGold : [true],
    radioDiamond : [true],
    radioRefinery : [true],
    radioAllowRecovery : [true],
    radioScrapReturn : [true],
    radioFinalLoss : [true],
  });
  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.lossRecoveryFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

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
          "WORKER_CODE": "",
          "WORKER_NAME": "",
          "STOCK_CODE": "",
          "DESCRIPTION": "",
          "PURITY": 0,
          "LOSS_UPTODATE": "2023-10-19T10:46:17.071Z",
          "LOSS_QTY": 0,
          "LOSS_PURE_QTY": 0,
          "RECO_QTY": 0,
          "RECO_PURE_QTY": 0,
          "NET_LOSS": 0,
          "NET_LOSS_PURE": 0,
          "DIVISION_CODE": "s",
          "ADJ_WT": 0,
          "ADJ_PUREWT": 0,
          "ADJ_ACCODE": "",
          "PHY_STOCK_ACCODE": "",
          "LOCTYPE_CODE": "",
          "DT_YEARMONTH": "",
          "DT_VOCNO": 0,
          "DT_VOCTYPE": "str",
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
          "LOSS_UPTODATE": "2023-10-19T10:46:17.071Z",
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
          "LOSS_BOOK": "s",
          "STOCK_DESC": "",
          "TRANS_VOCTYPE": "str"
        }
      ],
      "PROD_LOSS_RECOVERY_SUBJOB_DETAIL": [
        {
          "REFMID": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "DT_VOCDATE": "2023-10-19T10:46:17.071Z",
          "JOBNO": "",
          "DSO_VOCNO": "",
          "PARTYCODE": "",
          "DESIGN_CODE": "",
          "KARAT": "stri",
          "DIVCODE": "s",
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
        if (result.response) {
          if (result.status == "Success") {
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
          }
        } else {
          this.toastr.error("Not saved");
        }
      },
      (err) => alert(err)
    );
  this.subscriptions.push(Sub);
  }
  update() {
    if (this.lossRecoveryFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API ="ProdLossRecovery/UpdateProdLossRecovery/" + this.lossRecoveryFrom.value.mid;
      let postData = {

      }
        let Sub: Subscription = this.dataService
        .putDynamicAPI(API, postData)
        .subscribe(
          (result) => {
            if (result.response) {
              if (result.status == "Success") {
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
              }
            } else {
              this.toastr.error("Not saved");
            }
          },
          (err) => alert(err)
        );
      this.subscriptions.push(Sub);
     }
        
}
