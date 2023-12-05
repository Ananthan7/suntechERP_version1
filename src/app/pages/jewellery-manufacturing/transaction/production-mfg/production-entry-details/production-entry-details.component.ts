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
  @Input() content!: any;
  divisionMS: any = "ID";
  columnheadTop: any[] = [""];
  columnheadBottom: any[] = [""];
  producationSubDetailData: any[] = [];
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
    PURITY: [''],
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
    Pure_Wt: [''],
    PurityDiff: [''],
    Job_Purity: [''],
    VenderRef: [''],
    VOCDATE: [''],
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
    this.setInitialLoadValue()
  }
  setInitialLoadValue(){
    this.branchCode = this.comService.branchCode;
    let headers = this.content[0].HEADERDETAILS
    this.productiondetailsFrom.controls.VOCDATE.setValue(headers.vocDate)
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
            this.productiondetailsFrom.controls.noofpcs.setValue(data[0].JOB_PCS_TOTAL)
            this.productiondetailsFrom.controls.customer.setValue(data[0].CUSTOMER_CODE)
            this.productiondetailsFrom.controls.prefix.setValue(data[0].PREFIX)
            this.productiondetailsFrom.controls.prefixNo.setValue(data[0].PREFIX_NUMBER)

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
        'strUNQ_JOB_ID': this.productiondetailsFrom.value.subjobno,
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
    modalRef.componentInstance.content = this.productiondetailsFrom.value;

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
    // if (this.productiondetailsFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }
    

    this.close({ FORM_DATA: this.productiondetailsFrom.value, jobProducationSubDetails: [this.producationSubDetailData] });
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
