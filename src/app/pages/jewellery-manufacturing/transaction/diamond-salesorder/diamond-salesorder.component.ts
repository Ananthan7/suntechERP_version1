import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AddNewdetailComponent } from './add-newdetail/add-newdetail.component';

@Component({
  selector: 'app-diamond-salesorder',
  templateUrl: './diamond-salesorder.component.html',
  styleUrls: ['./diamond-salesorder.component.scss']
})
export class DiamondSalesorderComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid
  currentFilter: any;
  divisionMS: any = 'ID';
  tableData: any[] = [
    {Division: 'Division', Description: 'value'},
    {Division: 'Division', Description: 'value'},
    {Division: 'Division', Description: 'value'},
    {Division: 'Division', Description: 'value'},
  ]
  columnhead:any[] = ['Code','Div','Qty', 'Rate','Wts %','Lab type','Lab A/C','Unit','Shape','Karat'];
  column1:any[] = ['SRNO','DESIGN CODE', 'KARAT','METAL_COLOR','PCS','METAL_WT','GROSS_WT','RATEFC','RATECC'];
  checked = false;
  check = false;
  indeterminate = false;
  private subscriptions: Subscription[] = [];

  OrderTypeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Order Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='ORDERTYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  PartyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCurrencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "Currency <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  diamondSalesOrderForm: FormGroup = this.formBuilder.group({
    VoucherType: ['', [Validators.required]],
    VoucherDESC: ['', [Validators.required]],
    VoucherDate: ['', [Validators.required]],
    PartyCode: ['', [Validators.required]],
    Salesman: ['', [Validators.required]],
    SelectAll: [false, ],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
  }

  addNewDetail(){
    const modalRef: NgbModalRef = this.modalService.open(AddNewdetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    // modalRef.componentInstance.content = data;
  }
   /**USE:  final save API call*/
   formSubmit() {
    if(this.content && this.content.FLAG == 'EDIT'){
      // this.selectProcess()
      // this.updateWorkerMaster()
      return
    }
    if (this.diamondSalesOrderForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'WorkerMaster/InsertWorkerMaster'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": "str",
      "VOCNO": 0,
      "VOCDATE": "2023-09-14T14:56:43.961Z",
      "EXP_PROD_START_DATE": "2023-09-14T14:56:43.961Z",
      "DELIVERY_DATE": "2023-09-14T14:56:43.961Z",
      "YEARMONTH": "string",
      "PARTYCODE": "string",
      "PARTY_CURRENCY": "stri",
      "PARTY_CURR_RATE": 0,
      "ITEM_CURRENCY": "stri",
      "ITEM_CURR_RATE": 0,
      "VALUE_DATE": "2023-09-14T14:56:43.961Z",
      "SALESPERSON_CODE": "string",
      "METAL_RATE_TYPE": "string",
      "METAL_RATE": 0,
      "METAL_GRAM_RATE": 0,
      "TOTAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNT_FC": 0,
      "TOTAL_AMOUNT_LC": 0,
      "MARGIN_PER": 0,
      "REMARKS": "string",
      "SYSTEM_DATE": "2023-09-14T14:56:43.961Z",
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SO_STATUS": true,
      "TOTAL_AMOUNT_PRTY": 0,
      "FIX_UNFIX": true,
      "LINKID": "string",
      "OUSTATUSNEW": 0,
      "CR_DAYS": 0,
      "PARTY_ADDRESS": "string",
      "SALESPERSON_NAME": "string",
      "MARKUP_PER": 0,
      "GOLD_LOSS_PER": 0,
      "PRINT_COUNT": 0,
      "ORDER_TYPE": "string",
      "SALESORDER_REF": "string",
      "JOB_STATUS": "string",
      "APPR_REFF": "string",
      "MAIN_REFF": "string",
      "PARTY_NAME": "string",
      "SUBLEDGER_CODE": "string",
      "USERDEF1": "string",
      "USERDEF2": "string",
      "USERDEF3": "string",
      "USERDEF4": "string",
      "DELIVERYADDRESS": "string",
      "TERMSANDCONDITIONS": "string",
      "PAYMENTTERMS": "string",
      "DETAILBRANCHCODE": "strin",
      "AMCSTARTDATE": "2023-09-14T14:56:43.961Z",
      "SALESINVPENAMOUNTCC": 0,
      "PROSP_ORIGIN": "string",
      "CANCEL_SALES_ORDER": true,
      "DELIVERY_TYPE": "string",
      "DELIVERY_DAYS": 0,
      "MKG_GROSS": true,
      "ORDER_STATUS": "string",
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "AUTOPOSTING": true,
      "details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "EXP_PROD_START_DATE": "2023-09-14T14:56:43.961Z",
          "DELIVERY_DATE": "2023-09-14T14:56:43.961Z",
          "PARTYCODE": "string",
          "DESIGN_CODE": "string",
          "KARAT": "stri",
          "METAL_COLOR": "string",
          "PCS": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "GROSS_WT": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "VALUEFC": 0,
          "VALUECC": 0,
          "DISCPER": 0,
          "DISCAMTFC": 0,
          "DISCAMTCC": 0,
          "NETVALUEFC": 0,
          "NETVALUECC": 0,
          "LOCTYPE_CODE": "string",
          "JOBCARD_REF": "string",
          "JOBCARD_DATE": "2023-09-14T14:56:43.961Z",
          "JOBCARD_STATUS": "string",
          "SEQ_CODE": "string",
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "ACT_TIME": 0,
          "DESCRIPTION": "string",
          "UNQ_DESIGN_ID": "string",
          "FINISHED_PCS": 0,
          "PENDING_PCS": 0,
          "STOCK_CODE": "string",
          "SUPPLIER": "string",
          "PODPROCREF": "string",
          "REMARKS": "string",
          "DSURFACEPROPERTY": "string",
          "DREFERENCE": "string",
          "DWIDTH": 0,
          "DTHICKNESS": 0,
          "CHARGE1FC": 0,
          "CHARGE1LC": 0,
          "CHARGE2FC": 0,
          "CHARGE2LC": 0,
          "CHARGE3FC": 0,
          "CHARGE3LC": 0,
          "CHARGE4FC": 0,
          "CHARGE4LC": 0,
          "CHARGE5FC": 0,
          "CHARGE5LC": 0,
          "SONO": 0,
          "QUOT": 0,
          "SUFFIX": "string",
          "D_REMARKS": "string",
          "ENGRAVE_TEXT": "string",
          "ENGRAVE_FONT": "string",
          "DUTY_AMT": 0,
          "LOAD_PER": 0,
          "MARGIN_PER": 0,
          "DUTY_PER": 0,
          "PICTURE_NAME": "string",
          "DSO_PICTURE_NAME": "string",
          "DSO_STOCK_CODE": "string",
          "SOBALANCE_PCS": 0,
          "SORDER_CLOSE": 0,
          "SOREF": "string",
          "SO_STATUS": 0,
          "MARKUP_PER": 0,
          "MARKUP_AMTFC": 0,
          "MARKUP_AMTLC": 0,
          "MARGIN_AMTFC": 0,
          "MARGIN_AMTLC": 0,
          "GOLD_LOSS_PER": 0,
          "GOLD_LOSS_AMTFC": 0,
          "GOLD_LOSS_AMTLC": 0,
          "COSTFC": 0,
          "DT_VOCDATE": "2023-09-14T14:56:43.961Z",
          "KARIGAR_CODE": "string",
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "TOTAL_LABOUR": 0,
          "CATEGORY_CODE": "string",
          "COUNTRY_CODE": "string",
          "CUT_CODE": "string",
          "FINISH_CODE": "string",
          "DYE_CODE": "string",
          "TYPE_CODE": "string",
          "BRAND_CODE": "string",
          "RHODIUM_COLOR": "string",
          "SIZE": "string",
          "LENGTH": "string",
          "SCREW_FIELD": "string",
          "ORDER_TYPE": "string",
          "SUBCATEGORY_CODE": "string",
          "DSN_STOCK_CODE": "string",
          "JOBNO": "string",
          "ENAMEL_COLOR": "string",
          "PROD_VARIANCE": 0,
          "SERVICE_ACCCODE": "string",
          "DIVISION_CODE": "s",
          "JOB_STATUS": "string",
          "APPR_REFF": "string",
          "MAIN_REFF": "string",
          "SALESPERSON_CODE": "string",
          "METAL_SALES_REF": "string",
          "DELIVERY_TYPE": "string",
          "DELIVERY_DAYS": 0,
          "GOLD_LOSS_WT": 0,
          "PURITY": 0
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
                this.diamondSalesOrderForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }


  deleteClicked(){

  }
  OrderTypeSelected(event:any){
    console.log(event);
    
  }
  OrderTypeChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  PartyCodeSelected(event:any){
    console.log(event);
    
  }
  PartyCodeChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  SalesmanSelected(event:any){
    console.log(event);
    
  }
  SalesmanChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  close() {
    this.activeModal.close();
  }

}
