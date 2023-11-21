import { Component, Input, OnInit } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { NgbActiveModal, NgbModal, NgbModalRef, } from "@ng-bootstrap/ng-bootstrap";
import { ProductionStockDetailComponent } from "../production-stock-detail/production-stock-detail.component";

@Component({
  selector: "app-production-entry-details",
  templateUrl: "./production-entry-details.component.html",
  styleUrls: ["./production-entry-details.component.scss"],
})
export class ProductionEntryDetailsComponent implements OnInit {
  divisionMS: any = "ID";
  columnheadTop: any[] = [""];
  columnheadBottom: any[] = [""];
  producationSubDetailData: any[] = [''];
  @Input() content!: any;
  userName = localStorage.getItem("username");
  branchCode?: String;
  vocMaxDate = new Date();
  currentDate = new Date();

  private subscriptions: Subscription[] = [];

  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

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
  };
  productiondetailsFrom: FormGroup = this.formBuilder.group({
    jobno: [''],
    jobnoDesc: [''],
    jobDate: [''],
    subjobno: [''],
    subjobnoDesc: [''],
    customer: [''],
    customerDesc: [''],
    process: [''],
    processname: [''],
    worker: [''],
    workername: [''],
    partsName: [''],
    parts: [''],
    design: [''],
    designCode: [''],
    totalpcs: [''],
    noofpcs: [''],
    location: [''],
    lossqty: [''],
    grosswt: [''],
    stonepcs: [''],
    timetaken: [''],
    metalwt: [''],
    stonewt: [''],
    price1: [''],
    prefix: [''],
    prefixNo: [''],
    otherstone: [''],
    price2: [''],
    costcode: [''],
    setref: [''],
    price3: [''],
    karat: [''],
    venderref: [''],
    price4: [''],
    startdate: [''],
    endDate: [''],
    price5: [''],
    remarks: [''],
    prodpcs: [''],
    pndpcs: [''],
    lossone: [''],
    losswt: [''],
    fromStockCode: [''],
    fromStockCodeDesc: [''],
    toStockCode: [''],
    toStockCodeDesc: [''],
    metalpcs: [''],
    grossWt: [''],
    stoneWt: [''],
    purity: [''],
    netWt: [''],
    chargableWt: [''],
    purityPer: [''],
    pureWt: [''],
    purityDiff: [''],
    stoneDiff: [''],
    loss: [''],
    mkgRate: [''],
    lotNo: [''],
    balwt: [''],
    mkgValue: [''],
    barNo: [''],
    ticketNo: [''],
    prod: [''],
    balPcs: [''],
    jobPurity: [''],
  });

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
  }

  /**USE: jobnumber validate API call */
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strJobNumber': this.comService.nullToString(event.target.value),
        'strCurrenctUser': this.comService.nullToString(this.userName)
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            this.productiondetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.productiondetailsFrom.controls.subjobnoDesc.setValue(data[0].JOB_DESCRIPTION)
            // this.productiondetailsFrom.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.productiondetailsFrom.controls.design.setValue(data[0].DESIGN_CODE)
            this.productiondetailsFrom.controls.designCode.setValue(data[0].DESCRIPTION)
            // this.productiondetailsFrom.controls.SEQ_CODE.setValue(data[0].SEQ_CODE)
            // this.productiondetailsFrom.controls.METALLAB_TYPE.setValue(data[0].METALLAB_TYPE)
            this.subJobNumberValidate()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE: subjobnumber validate API call  this.processTransferdetailsForm.value.subjobno*/
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': '156516/4/01',
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.productiondetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.productiondetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
          this.productiondetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.productiondetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
          this.productiondetailsFrom.controls.metalwt.setValue(
            this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))
          this.productiondetailsFrom.controls.stonewt.setValue(
            this.comService.decimalQuantityFormat(data[0].STONE, 'STONE')) 
          this.productiondetailsFrom.controls.MetalPcsFrom.setValue(data[0].PCS)
          this.productiondetailsFrom.controls.GrossWeightFrom.setValue(data[0].NETWT)
          this.productiondetailsFrom.controls.StoneWeighFrom.setValue(data[0].STONE)
          this.productiondetailsFrom.controls.PUREWT.setValue(data[0].PUREWT)
          this.productiondetailsFrom.controls.PURITY.setValue(data[0].PURITY)
          this.productiondetailsFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.productiondetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.productiondetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.productiondetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
          this.productiondetailsFrom.controls.costcode.setValue(data[0].COST_CODE)
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  opennewdetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      ProductionStockDetailComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.result.then((postData) => {
      if (postData) {
        this.producationSubDetailData.push(postData);
      }
    });
  }

  jobnoCodeSelected(e: any) {
    this.productiondetailsFrom.controls.jobno.setValue(e.job_number);
    this.productiondetailsFrom.controls.jobnoDesc.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }


  locationCodeSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.location.setValue(e.COUNT);
  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.productiondetailsFrom.controls.startdate.setValue(new Date(date));
    }
  }

  removedata() {

  }
  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.productiondetailsFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "",
      "VOCDATE": this.currentDate,
      "BRANCH_CODE": this.branchCode,
      "JOB_NUMBER": this.productiondetailsFrom.value.jobno,
      "JOB_DATE": this.productiondetailsFrom.value.jobDate,
      "JOB_SO_NUMBER": this.productiondetailsFrom.value.subjobno,
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": this.productiondetailsFrom.value.subjobnoDesc,
      "UNQ_DESIGN_ID": "",
      "DESIGN_CODE": this.productiondetailsFrom.value.design,
      "DIVCODE": "",
      "PREFIX": this.productiondetailsFrom.value.prefix,
      "STOCK_CODE": "",
      "STOCK_DESCRIPTION": "",
      "SET_REF": this.productiondetailsFrom.value.setref,
      "KARAT_CODE": this.productiondetailsFrom.value.karat,
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": 0,
      "GROSS_WT": this.productiondetailsFrom.value.grosswt,
      "METAL_PCS": this.productiondetailsFrom.value.metalpcs,
      "METAL_WT": this.productiondetailsFrom.value.metalwt,
      "STONE_PCS": this.productiondetailsFrom.value.stonepcs,
      "STONE_WT": this.productiondetailsFrom.value.stonewt,
      "LOSS_WT": this.productiondetailsFrom.value.lossone,
      "NET_WT": 0,
      "PURITY": this.productiondetailsFrom.value.purity,
      "PURE_WT": this.productiondetailsFrom.value.pureWt,
      "RATE_TYPE": this.productiondetailsFrom.value.mkgRate,
      "METAL_RATE": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.productiondetailsFrom.value.process,
      "PROCESS_NAME": this.productiondetailsFrom.value.processname,
      "WORKER_CODE": this.productiondetailsFrom.value.worker,
      "WORKER_NAME": this.productiondetailsFrom.value.workername,
      "IN_DATE": this.productiondetailsFrom.value.startdate,
      "OUT_DATE": this.productiondetailsFrom.value.endDate,
      "TIME_TAKEN_HRS": this.productiondetailsFrom.value.timetaken,
      "COST_CODE": this.productiondetailsFrom.value.costcode,
      "WIP_ACCODE": "",
      "STK_ACCODE": "",
      "SOH_ACCODE": "",
      "PROD_PROC": this.productiondetailsFrom.value.prodpcs,
      "METAL_DIVISION": "",
      "PRICE1PER": this.productiondetailsFrom.value.price1,
      "PRICE2PER": this.productiondetailsFrom.value.price2,
      "PRICE3PER": this.productiondetailsFrom.value.price3,
      "PRICE4PER": this.productiondetailsFrom.value.price4,
      "PRICE5PER": this.productiondetailsFrom.value.price5,
      "LOCTYPE_CODE": this.productiondetailsFrom.value.location,
      "WASTAGE_WT": 0,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "",
      "SELLINGRATE": 0,
      "CUSTOMER_CODE": this.productiondetailsFrom.value.customer,
      "OUTSIDEJOB": true,
      "LAB_ACCODE": "",
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "",
      "SUPPLIER_REF": "",
      "TAGLINES": "",
      "SETTING_CHRG": 0,
      "POLISH_CHRG": 0,
      "RHODIUM_CHRG": 0,
      "LABOUR_CHRG": 0,
      "MISC_CHRG": 0,
      "SETTING_ACCODE": "",
      "POLISH_ACCODE": "",
      "RHODIUM_ACCODE": "",
      "LABOUR_ACCODE": "",
      "MISC_ACCODE": "",
      "WAST_ACCODE": "",
      "REPAIRJOB": 0,
      "PRICE1FC": 0,
      "PRICE2FC": 0,
      "PRICE3FC": 0,
      "PRICE4FC": 0,
      "PRICE5FC": 0,
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "YEARMONTH": "",
      "BASE_CONV_RATE": 0,
      "OTH_STONE_WT": this.productiondetailsFrom.value.otherstone,
      "OTH_STONE_AMT": 0,
      "HANDLING_ACCODE": "",
      "FROM_STOCK_CODE": this.productiondetailsFrom.value.fromStockCode,
      "TO_STOCK_CODE": this.productiondetailsFrom.value.toStockCode,
      "JOB_PURITY": this.productiondetailsFrom.value.jobPurity,
      "LOSS_PUREWT": this.productiondetailsFrom.value.loss,
      "PUDIFF": this.productiondetailsFrom.value.purityDiff,
      "STONEDIFF": this.productiondetailsFrom.value.stoneDiff,
      "CHARGABLEWT": this.productiondetailsFrom.value.chargableWt,
      "BARNO": this.productiondetailsFrom.value.barNo,
      "LOTNUMBER": this.productiondetailsFrom.value.lotNo,
      "TICKETNO": this.productiondetailsFrom.value.ticketNo,
      "PROD_PER": this.productiondetailsFrom.value.prod,
      "PURITY_PER": this.productiondetailsFrom.value.purityPer,
      "DESIGN_TYPE": this.productiondetailsFrom.value.designCode,
      "D_REMARKS": this.productiondetailsFrom.value.remarks,
      "BARCODEDQTY": 0,
      "BARCODEDPCS": 0
    }

    this.close({ postData, jobProducationSubDetails: [this.producationSubDetailData] });
  }

  setFormValues() {

  }

  update() {
    if (this.productiondetailsFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API =
      "JobProductionMaster/UpdateJobProductionMaster/";
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
                  this.productiondetailsFrom.reset();
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

  deleteRecord() {
    if (!this.content.VOCTYPE) {
      Swal.fire({
        title: "",
        text: "Please Select data to delete!",
        icon: "error",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        let API =
          "JobProductionMaster/DeleteJobProductionMaster/" +
          this.productiondetailsFrom.value.branchCode +
          this.productiondetailsFrom.value.voctype +
          this.productiondetailsFrom.value.vocno +
          this.productiondetailsFrom.value.vocdate;
        let Sub: Subscription = this.dataService
          .deleteDynamicAPI(API)
          .subscribe(
            (result) => {
              if (result) {
                if (result.status == "Success") {
                  Swal.fire({
                    title: result.message || "Success",
                    text: "",
                    icon: "success",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.productiondetailsFrom.reset();
                      this.close("reloadMainGrid");
                    }
                  });
                } else {
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.productiondetailsFrom.reset();
                      this.close();
                    }
                  });
                }
              } else {
                this.toastr.error("Not deleted");
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
