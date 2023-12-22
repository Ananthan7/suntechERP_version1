import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrls: ['./jobcard.component.scss']
})
export class JobcardComponent implements OnInit {
  //variables
  modalReference:any;
  closeResult:any;
  pageTitle: any;
  currentFilter: any;
  showFilterRow: boolean = false;
  showHeaderFilter: boolean = false;
  divisionMS: any = 'ID';
  itemList: any[] = []
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  columnhead:any[] = ['Sl No','Job Reference','Part Code','Description','Pcs','Metal Color','Metal Wt','Stone Wt','Gross Wt' ];
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];

  lengthCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'DESCRIPTION',
    SEARCH_HEADING: 'Length Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESCRIPTION<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ordertypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'DESCRIPTION',
    SEARCH_HEADING: 'Ordertype Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESCRIPTION<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  jobCardFrom: FormGroup = this.formBuilder.group({
    orderType : [''],
    jobno : ['53528'],
    designcode : [''],
    designtype : [''],
    customer : [''],
    customername : [''],
    salesorder : [''],
    costcode : [''],
    karat : [''],
    category : [''],
    color : [''],
    country : [''],
    comments : [''],
    size : [''],
    jobtype : [''],
    jobdate :  [this.getCurrentDate(), Validators.required],
    date : [''],
    prefix : [''],
    type : [''],
    subcat : [''],
    brand : [''],
    setref : [''],
    length : [''],
    purity : [''],
    deldate :  [this.getCurrentDate(), Validators.required],
    salesman : [''],
    stockcode : [''],
    currency : [''],
    lossbooking : [''],
    mainmetal : [''],
    time : [''],
    range : [''],
    seqcode : [''],
    totalpcs : [''],
    pending : [''],
    parts : [''],
    srewFiled : [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  /**USE: close modal window */
  close(data?: any) {
    this.activeModal.close(data);
  }

  
  lengthCodeSelected(e:any){
    console.log(e);
    this.jobCardFrom.controls.length.setValue(e.DESCRIPTION);
  }

    
  ordertypeCodeSelected(e:any){
    console.log(e);
    this.jobCardFrom.controls.orderType.setValue(e.DESCRIPTION);
  }

  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.jobCardFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMasterDj/InsertJobMasterDJ'
    let postData = {
      "JOB_NUMBER": this.jobCardFrom.value.jobno || "",
      "BRANCH_CODE": this.branchCode,
      "JOB_DATE": this.jobCardFrom.value.jobdate || "",
      "JOB_DESCRIPTION": "",
      "JOB_PREFIX": "",
      "CURRENCY_CODE": this.jobCardFrom.value.currency || "",
      "CC_RATE": 0,
      "CUSTOMER_CODE": this.jobCardFrom.value.customer || "",
      "COST_CODE": this.jobCardFrom.value.costcode || "",
      "TYPE_CODE": this.jobCardFrom.value.type || "",
      "CATEGORY_CODE": this.jobCardFrom.value.category || "",
      "SUBCATEGORY_CODE": this.jobCardFrom.value.subcat || "",
      "BRAND_CODE": this.jobCardFrom.value.brand || "",
      "DESIGN_CODE": this.jobCardFrom.value.designcode || "",
      "SEQ_CODE": this.jobCardFrom.value.seqcode || "",
      "PICTURE_NAME": "",
      "DEPARTMENT_CODE": "",
      "JOB_INSTRUCTION": "",
      "SET_REF": this.jobCardFrom.value.setref || "",
      "TOTAL_FCCOST": 0,
      "TOTAL_LCCOST": 0,
      "METAL_WT": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "STONE_WT": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LABOUR_AMOUNTFC": 0,
      "LABOUR_AMOUNTLC": 0,
      "LOSS_QTY_CHARGED": 0,
      "LOSS_QTY_BOOKED": 0,
      "LOSS_QTY_TOTAL": 0,
      "LOSS_AMOUNT_CHARGED": 0,
      "LOSS_AMOUNT_BOOKED": 0,
      "LOSS_AMOUNT_TOTAL": 0,
      "TOTAL_PCS":this.jobCardFrom.value.totalpcs || "",
      "PENDING_PCS": this.jobCardFrom.value.pending || "",
      "FINISHED_PCS": 0,
      "OPENED_ON": "2023-10-26T05:59:21.735Z",
      "OPENED_BY": "",
      "JOB_CLOSED_ON": "2023-10-26T05:59:21.735Z",
      "MID": 0,
      "PRINTED": true,
      "HAVE_SO": true,
      "LOC_CODE": "",
      "METAL_COLOR": this.jobCardFrom.value.color  || "",
      "KARAT_CODE": this.jobCardFrom.value.karat || "",
      "PREFIX": this.jobCardFrom.value.prefix || "",
      "JOB_PCS_TOTAL": 0,
      "JOB_PCS_PENDING": 0,
      "OUTSIDEJOB": true,
      "TREE_CODE": "",
      "DEL_DATE": this.jobCardFrom.value.deldate || "",
      "REP_STOCK_CODE": "",
      "REPAIRJOB": 0,
      "METAL_STOCK_CODE": "",
      "METALLAB_TYPE": 0,
      "TIME_CODE": this.jobCardFrom.value.time || "",
      "RANGE_CODE": this.jobCardFrom.value.range || "",
      "COMMENTS_CODE": this.jobCardFrom.value.comments || "",
      "COUNTRY_CODE": this.jobCardFrom.value.country || "",
      "SALESPERSON_CODE": this.jobCardFrom.value.salesman || "",
      "SIZE": this.jobCardFrom.value.size || "",
      "LENGTH": this.jobCardFrom.value.length || "",
      "SCREW_FIELD": "string",
      "ORDER_TYPE": this.jobCardFrom.value.orderType || "",
      "DESIGN_TYPE": this.jobCardFrom.value.designtype  || "",
      "SO_VOCNO": 0,
      "SO_VOCDATE": "2023-10-26T05:59:21.735Z",
      "JOB_PURITY":this.jobCardFrom.value.purity || "",
      "DESIGN_DESC": "string",
      "CUSTOMER_NAME": this.jobCardFrom.value.customername  || "",
      "COST_CENTER_DESC": "",
      "KARAT_DESC": "",
      "SEQ_DESC": "",
      "SALESPERSON_NAME": "",
      "REP_STOCK_DESC": "",
      "METAL_STOCK_DESC": "",
      "CATEGORY_DESC": "",
      "SUBCATEGORY_DESC": "",
      "TYPE_DESC": "",
      "METAL_COLOR_DESC": "",
      "BRAND_DESC": "",
      "COUNTRY_DESC": "",
      "SIZE_DESC": "",
      "LENGTH_DESC": "",
      "TIME_DESC": "",
      "RANGE_DESC": "",
      "JOB_MATERIAL_BOQ_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_SO_MID": 0,
          "BRANCH_CODE": "",
          "DESIGN_CODE": "",
          "METALSTONE": "",
          "DIVCODE": "",
          "PRICEID": "",
          "KARAT_CODE": "",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "",
          "CURRENCY_CODE": "",
          "RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "MAKINGRATE": 0,
          "MAKINGAMOUNT": 0,
          "SIEVE": "",
          "COLOR": "",
          "CLARITY": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "UNQ_DESIGN_ID": "",
          "UNIQUEID": 0,
          "STOCK_CODE": "",
          "SIEVE_SET": "",
          "PROCESS_TYPE": "",
          "PURITY": 0
        }
      ],
      "JOB_SALESORDER_DETAIL_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "JOB_SO_DATE": "2023-10-26T05:59:21.735Z",
          "DELIVERY_DATE": "2023-10-26T05:59:21.735Z",
          "PARTYCODE": "",
          "PARTYNAME": "",
          "DESIGN_CODE": "",
          "KARAT": "",
          "METAL_COLOR": "",
          "PCS": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "GROSS_WT": 0,
          "METAL_WT_PCS": 0,
          "STONE_PC_PCS": 0,
          "STONE_WT_PCS": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "VALUEFC": 0,
          "VALUECC": 0,
          "SEQ_CODE": "",
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "ACT_TIME": 0,
          "DESCRIPTION": "",
          "UNQ_DESIGN_ID": "",
          "UNQ_JOB_ID": "",
          "JOB_SO_MID": 0,
          "UNIQUEID": 0,
          "PROD_DATE": "2023-10-26T05:59:21.735Z",
          "PROD_REF": 0,
          "PROD_STOCK_CODE": "",
          "PROD_PCS": 0,
          "LOCTYPE_CODE": "",
          "PICTURE_PATH": "",
          "PART_CODE": "",
          "TREE_NO": "",
          "VOCTYPE": "",
          "VOCNO": 0,
          "YEARMONTH": "",
          "BRANCH_CODE": "",
          "KARIGAR_CODE": "",
          "WAX_STATUS": "",
          "SIZE": "",
          "LENGTH": "",
          "SCREW_FIELD": "",
          "ORDER_TYPE": "",
          "DESIGN_TYPE": "",
          "CLOSE_TYPE": "",
          "JOB_PURITY": 0,
          "ADD_STEEL": true
        }
      ],
      "JOB_SALESORDER_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "JOB_SO_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_MID": 0,
          "PARTYCODE": "",
          "PARTYNAME": "",
          "PCS": 0,
          "WIP_PCS": 0,
          "FINI_PCS": 0,
          "UNIQUEID": 0,
          "SELECTED_SO": true,
          "PARTS": 0,
          "SIZE": "",
          "LENGTH": "",
          "SCREW_FIELD": "",
          "ORDER_TYPE": ""
        }
      ],
      "JOB_LABOUR_BOQ_DJ": [
        {
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "",
          "BRANCH_CODE": "",
          "DESIGN_CODE": "",
          "CODE": "",
          "DESCRIPTION": "",
          "UNIT": "",
          "RATEFC": 0,
          "RATELC": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "UNQ_DESIGN_ID": "",
          "UNIQUEID": 0,
          "JOB_SO_MID": 0
        }
      ]
    }
  
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.jobCardFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

 
  update(){
    if (this.jobCardFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMasterDj/UpdateJobMasterDJ/'+ this.jobCardFrom.value.branchCode + this.jobCardFrom.value.jobno 
    let postData = {
      "JOB_NUMBER": this.jobCardFrom.value.jobno || "",
      "BRANCH_CODE": this.branchCode,
      "JOB_DATE": this.jobCardFrom.value.jobdate || "",
      "JOB_DESCRIPTION": "",
      "JOB_PREFIX": "",
      "CURRENCY_CODE": this.jobCardFrom.value.currency || "",
      "CC_RATE": 0,
      "CUSTOMER_CODE": this.jobCardFrom.value.customer || "",
      "COST_CODE": this.jobCardFrom.value.costcode || "",
      "TYPE_CODE": this.jobCardFrom.value.type || "",
      "CATEGORY_CODE": this.jobCardFrom.value.category || "",
      "SUBCATEGORY_CODE": this.jobCardFrom.value.subcat || "",
      "BRAND_CODE": this.jobCardFrom.value.brand || "",
      "DESIGN_CODE": this.jobCardFrom.value.designcode || "",
      "SEQ_CODE": this.jobCardFrom.value.seqcode || "",
      "PICTURE_NAME": "",
      "DEPARTMENT_CODE": "",
      "JOB_INSTRUCTION": "",
      "SET_REF": this.jobCardFrom.value.setref || "",
      "TOTAL_FCCOST": 0,
      "TOTAL_LCCOST": 0,
      "METAL_WT": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "STONE_WT": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LABOUR_AMOUNTFC": 0,
      "LABOUR_AMOUNTLC": 0,
      "LOSS_QTY_CHARGED": 0,
      "LOSS_QTY_BOOKED": this.jobCardFrom.value.lossbooking || "",
      "LOSS_QTY_TOTAL": 0,
      "LOSS_AMOUNT_CHARGED": 0,
      "LOSS_AMOUNT_BOOKED": 0,
      "LOSS_AMOUNT_TOTAL": 0,
      "TOTAL_PCS":this.jobCardFrom.value.totalpcs || "",
      "PENDING_PCS": this.jobCardFrom.value.pending || "",
      "FINISHED_PCS": 0,
      "OPENED_ON": "2023-10-26T05:59:21.735Z",
      "OPENED_BY": "",
      "JOB_CLOSED_ON": "2023-10-26T05:59:21.735Z",
      "MID": 0,
      "PRINTED": true,
      "HAVE_SO": true,
      "LOC_CODE": "",
      "METAL_COLOR": this.jobCardFrom.value.color  || "",
      "KARAT_CODE": this.jobCardFrom.value.karat || "",
      "PREFIX": this.jobCardFrom.value.prefix || "",
      "JOB_PCS_TOTAL": 0,
      "JOB_PCS_PENDING": 0,
      "OUTSIDEJOB": true,
      "TREE_CODE": "",
      "DEL_DATE": this.jobCardFrom.value.deldate || "",
      "REP_STOCK_CODE": "",
      "REPAIRJOB": 0,
      "METAL_STOCK_CODE": "",
      "METALLAB_TYPE": 0,
      "TIME_CODE": this.jobCardFrom.value.time || "",
      "RANGE_CODE": this.jobCardFrom.value.range || "",
      "COMMENTS_CODE": this.jobCardFrom.value.comments || "",
      "COUNTRY_CODE": this.jobCardFrom.value.country || "",
      "SALESPERSON_CODE": this.jobCardFrom.value.salesman || "",
      "SIZE": this.jobCardFrom.value.size || "",
      "LENGTH": this.jobCardFrom.value.length || "",
      "SCREW_FIELD": "string",
      "ORDER_TYPE": this.jobCardFrom.value.orderType || "",
      "DESIGN_TYPE": this.jobCardFrom.value.designtype  || "",
      "SO_VOCNO": 0,
      "SO_VOCDATE": "2023-10-26T05:59:21.735Z",
      "JOB_PURITY":this.jobCardFrom.value.purity || "",
      "DESIGN_DESC": "string",
      "CUSTOMER_NAME": this.jobCardFrom.value.customername  || "",
      "COST_CENTER_DESC": "",
      "KARAT_DESC": "",
      "SEQ_DESC": "",
      "SALESPERSON_NAME": "",
      "REP_STOCK_DESC": "",
      "METAL_STOCK_DESC": "",
      "CATEGORY_DESC": "",
      "SUBCATEGORY_DESC": "",
      "TYPE_DESC": "",
      "METAL_COLOR_DESC": "",
      "BRAND_DESC": "",
      "COUNTRY_DESC": "",
      "SIZE_DESC": "",
      "LENGTH_DESC": "",
      "TIME_DESC": "",
      "RANGE_DESC": "",
      "JOB_MATERIAL_BOQ_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_SO_MID": 0,
          "BRANCH_CODE": "",
          "DESIGN_CODE": "",
          "METALSTONE": "",
          "DIVCODE": "",
          "PRICEID": "",
          "KARAT_CODE": "",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "",
          "CURRENCY_CODE": "",
          "RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "MAKINGRATE": 0,
          "MAKINGAMOUNT": 0,
          "SIEVE": "",
          "COLOR": "",
          "CLARITY": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "UNQ_DESIGN_ID": "",
          "UNIQUEID": 0,
          "STOCK_CODE": "",
          "SIEVE_SET": "",
          "PROCESS_TYPE": "",
          "PURITY": 0
        }
      ],
      "JOB_SALESORDER_DETAIL_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "JOB_SO_DATE": "2023-10-26T05:59:21.735Z",
          "DELIVERY_DATE": "2023-10-26T05:59:21.735Z",
          "PARTYCODE": "",
          "PARTYNAME": "",
          "DESIGN_CODE": "",
          "KARAT": "",
          "METAL_COLOR": "",
          "PCS": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "GROSS_WT": 0,
          "METAL_WT_PCS": 0,
          "STONE_PC_PCS": 0,
          "STONE_WT_PCS": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "VALUEFC": 0,
          "VALUECC": 0,
          "SEQ_CODE": "",
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "ACT_TIME": 0,
          "DESCRIPTION": "",
          "UNQ_DESIGN_ID": "",
          "UNQ_JOB_ID": "",
          "JOB_SO_MID": 0,
          "UNIQUEID": 0,
          "PROD_DATE": "2023-10-26T05:59:21.735Z",
          "PROD_REF": 0,
          "PROD_STOCK_CODE": "",
          "PROD_PCS": 0,
          "LOCTYPE_CODE": "",
          "PICTURE_PATH": "",
          "PART_CODE": "",
          "TREE_NO": "",
          "VOCTYPE": "",
          "VOCNO": 0,
          "YEARMONTH": "",
          "BRANCH_CODE": "",
          "KARIGAR_CODE": "",
          "WAX_STATUS": "",
          "SIZE": "",
          "LENGTH": "",
          "SCREW_FIELD": "",
          "ORDER_TYPE": "",
          "DESIGN_TYPE": "",
          "CLOSE_TYPE": "",
          "JOB_PURITY": 0,
          "ADD_STEEL": true
        }
      ],
      "JOB_SALESORDER_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "JOB_SO_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_MID": 0,
          "PARTYCODE": "",
          "PARTYNAME": "",
          "PCS": 0,
          "WIP_PCS": 0,
          "FINI_PCS": 0,
          "UNIQUEID": 0,
          "SELECTED_SO": true,
          "PARTS": 0,
          "SIZE": "",
          "LENGTH": "",
          "SCREW_FIELD": "",
          "ORDER_TYPE": ""
        }
      ],
      "JOB_LABOUR_BOQ_DJ": [
        {
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-26T05:59:21.735Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "",
          "BRANCH_CODE": "",
          "DESIGN_CODE": "",
          "CODE": "",
          "DESCRIPTION": "",
          "UNIT": "",
          "RATEFC": 0,
          "RATELC": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "UNQ_DESIGN_ID": "",
          "UNIQUEID": 0,
          "JOB_SO_MID": 0
        }
      ]
    }
  
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.jobCardFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  
  deleteRecord() {
    if (!this.content.VOCTYPE) {
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
        let API = 'JobMasterDj/DeleteJobMasterDJ/' + this.jobCardFrom.value.branchCode + this.jobCardFrom.value.jobno 
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
                    this.jobCardFrom.reset()
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
                    this.jobCardFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
 
  }
