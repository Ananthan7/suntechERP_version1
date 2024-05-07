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
import { SavedataModel } from "../savedata-model";

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
  viewMode: boolean = false;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  HEADERDETAILS: any;
  StockDetailData: SavedataModel = {
    DETAIL_FORM_DATA: {},
    DETAIL_METAL_DATA: [],
    STOCK_FORM_DETAILS: [],
    STOCKCODE_MAIN_GRID: [],
    STOCK_COMPONENT_GRID: [],
    STOCK_GROUPED_GRID: [],
  }
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
  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'CUSTOMER_CODE',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "account_mode in ('B','R','P')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
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
  };
  costCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost type',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  prefixCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  price1CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price2CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price3CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price4CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price5CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  priceSchemeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 177,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Scheme',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  designCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: "DESIGN_CODE",
    SEARCH_HEADING: "Design Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "DESIGN_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  onFileChanged(event: any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result;
      };
    }
  }
  productiondetailsFrom: FormGroup = this.formBuilder.group({
    VOCNO: [0],
    jobno: [''],
    jobnoDesc: [''],
    JOB_DATE: [''],
    subjobno: [''],
    subjobnoDesc: [''],
    customer: [''],
    customerDesc: [''],
    process: [''],
    processname: [''],
    worker: [''],
    workername: [''],
    partsName: [''],
    PART_CODE: [''],
    DESIGN_CODE: [''],
    DESIGN_DESCRIPTION: [''],
    totalpcs: [''],
    JOB_PCS: [''],
    location: [''],
    LOSS_WT: [''],
    GROSS_WT: [''],
    STONE_PCS: [''],
    timetaken: [''],
    METAL_WT: [''],
    STONE_WT: [''],
    price1: [''],
    PREFIX: [''],
    PREFIXNO: [''],
    otherstone: [''],
    price2: [''],
    costcode: [''],
    SETREF: [''],
    price3: [''],
    KARAT: [''],
    venderref: [''],
    price4: [''],
    START_DATE: [''],
    END_DATE: [''],
    endDate: [''],
    price5: [''],
    remarks: [''],
    prodpcs: [''],
    pndpcs: [''],
    lossone: [''],
    fromStockCode: [''],
    fromStockCodeDesc: [''],
    toStockCode: [''],
    toStockCodeDesc: [''],
    metalpcs: [''],
    stoneWt: [''],
    PURITY: [''],
    netWt: [''],
    chargableWt: [''],
    purityPer: [''],
    PUREWT: [''],
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
    PURE_WT: [''],
    PurityDiff: [''],
    Job_Purity: [''],
    VenderRef: [''],
    VOCDATE: [''],
    METALSTONE: [''],
    DIVCODE: [''],
    STOCK_CODE: [''],
    STOCK_DESCRIPTION: [''],
    JOB_SO_NUMBER: [''],
    pricescheme:[''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.setInitialLoadValue()
  }
  setInitialLoadValue(){
    this.branchCode = this.commonService.branchCode;
    this.HEADERDETAILS = this.content[0].HEADERDETAILS
    this.productiondetailsFrom.controls.VOCDATE.setValue(this.HEADERDETAILS.vocDate)
  }
  customerCodeScpSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.customer.setValue(e.ACCODE);
    this.productiondetailsFrom.controls.customerDesc.setValue(e['ACCOUNT HEAD']);
  }
  karatCodeSelected(e:any){
    console.log(e);
    this.productiondetailsFrom.controls.KARAT.setValue(e.KARAT_CODE);
  }
  costCodeSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.costcode.setValue(e.COST_CODE);
  }
  prefixCodeSelected(e:any){
    console.log(e);
    this.productiondetailsFrom.controls.PREFIX.setValue(e.PREFIX_CODE);
  }
  price1CodeSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.price1.setValue(e.PRICE_CODE);
  }

  price2CodeSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.price2.setValue(e.PRICE_CODE);
  }

  price3CodeSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.price3.setValue(e.PRICE_CODE);
  }

  price4CodeSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.price4.setValue(e.PRICE_CODE);
  }

  price5CodeSelected(e: any) {
    console.log(e);
    this.productiondetailsFrom.controls.price5.setValue(e.PRICE_CODE);
  }
  
  designSelected(value: any) {
    console.log(value);
    this.productiondetailsFrom.controls.DESIGN_CODE.setValue(value.DESIGN_CODE);
  }
  priceSchemeValidate(e: any) {
    console.log('yap')
    this.productiondetailsFrom.controls.pricescheme.setValue(e.PRICE_CODE)
    let API = 'PriceSchemeMaster/GetPriceSchemeMasterList/' + this.productiondetailsFrom.value.pricescheme
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {

          let data = result.response;
          this.productiondetailsFrom.controls.price1.setValue(data.PRICE1)
          this.productiondetailsFrom.controls.price2.setValue(data.PRICE2)
          this.productiondetailsFrom.controls.price3.setValue(data.PRICE3)
          this.productiondetailsFrom.controls.price4.setValue(data.PRICE4)
          this.productiondetailsFrom.controls.price5.setValue(data.PRICE5)
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  /**USE: jobnumber validate API call */
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strJobNumber': this.commonService.nullToString(event.target.value),
        'strCurrenctUser': this.commonService.nullToString(this.userName)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            this.productiondetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.productiondetailsFrom.controls.subjobnoDesc.setValue(data[0].JOB_DESCRIPTION)
            // this.productiondetailsFrom.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.productiondetailsFrom.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
            this.productiondetailsFrom.controls.DESIGN_DESCRIPTION.setValue(data[0].DESCRIPTION)
            this.productiondetailsFrom.controls.JOB_PCS.setValue(data[0].JOB_PCS_TOTAL)
            this.productiondetailsFrom.controls.customer.setValue(data[0].CUSTOMER_CODE)
            this.productiondetailsFrom.controls.PREFIX.setValue(data[0].PREFIX)
            this.productiondetailsFrom.controls.PREFIXNO.setValue(data[0].PREFIX_NUMBER)
            this.productiondetailsFrom.controls.costcode.setValue(data[0].COST_CODE)
            // this.productiondetailsFrom.controls.SEQ_CODE.setValue(data[0].SEQ_CODE)
            // this.productiondetailsFrom.controls.METALLAB_TYPE.setValue(data[0].METALLAB_TYPE)
            this.subJobNumberValidate()
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE: subjobnumber validate API call*/
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.productiondetailsFrom.value.subjobno,
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')//loading msg
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          console.log(data[0],'data[0]');
          
          this.productiondetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.productiondetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
          this.productiondetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.productiondetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
          this.productiondetailsFrom.controls.METAL_WT.setValue(
            this.commonService.decimalQuantityFormat(data[0].METAL, 'METAL'))
          this.productiondetailsFrom.controls.stonewt.setValue(
            this.commonService.decimalQuantityFormat(data[0].STONE, 'STONE'))
          this.productiondetailsFrom.controls.GROSS_WT.setValue(
            this.commonService.decimalQuantityFormat(Number(data[0].NETWT), 'METAL'))
          this.productiondetailsFrom.controls.PUREWT.setValue(data[0].PUREWT)
          this.productiondetailsFrom.controls.PURITY.setValue(
            this.commonService.decimalQuantityFormat(data[0].PURITY,'PURITY'))
          this.productiondetailsFrom.controls.Job_Purity.setValue(
            this.commonService.decimalQuantityFormat(data[0].PURITY,'PURITY'))
          this.productiondetailsFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.productiondetailsFrom.controls.STOCK_CODE.setValue(data[0].STOCK_CODE)
          this.productiondetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.productiondetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
          this.productiondetailsFrom.controls.PURE_WT.setValue(data[0].PURE_WT)
          this.productiondetailsFrom.controls.KARAT.setValue(data[0].KARAT)
          this.productiondetailsFrom.controls.totalpcs.setValue(data[0].PCS)
        } else {
          this.commonService.toastErrorByMsgId('MSG1747');
        }
      }, err => {
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531');
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
    this.content[0].DETAILSCREEN_DATA = this.productiondetailsFrom.value
    modalRef.componentInstance.content = this.content;

    modalRef.result.then((dataFromStockScreen) => {
      if (dataFromStockScreen) {
        console.log(dataFromStockScreen,'data comming from stock detail screen');
        
        this.StockDetailData.STOCK_FORM_DETAILS = dataFromStockScreen.STOCK_FORM_DETAILS;
        this.StockDetailData.STOCK_COMPONENT_GRID = dataFromStockScreen.STOCK_COMPONENT_GRID;
      }
    });
  }

  jobnoCodeSelected(e: any) {
    this.productiondetailsFrom.controls.jobno.setValue(e.job_number);
    this.productiondetailsFrom.controls.jobnoDesc.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }


  locationCodeSelected(e: any) {
    this.productiondetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.productiondetailsFrom.controls.START_DATE.setValue(new Date(date));
      this.productiondetailsFrom.controls.END_DATE.setValue(new Date(date));
    }
  }
  formDetailCount: number = 0;
  formSubmit() {
    this.formDetailCount+=1
    

    this.StockDetailData.DETAIL_FORM_DATA = this.productiondetailsFrom.value
    this.close(this.StockDetailData);
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
