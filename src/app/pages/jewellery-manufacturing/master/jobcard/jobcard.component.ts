import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsComponent } from './components/components.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { JobStickerPrintComponent } from './job-sticker-print/job-sticker-print.component';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrls: ['./jobcard.component.scss']
})
export class JobcardComponent implements OnInit {
  //variables
  modalReference: any;
  closeResult: any;
  pageTitle: any;
  currentFilter: any;
  showFilterRow: boolean = false;
  showHeaderFilter: boolean = false;
  divisionMS: any = 'ID';
  itemList: any[] = []
  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  columnhead: any[] = ['Sl No', 'Job Reference', 'Part Code', 'Description', 'Pcs', 'Metal Color', 'Metal Wt', 'Stone Wt', 'Gross Wt'];
  branchCode?: String;
  yearMonth?: String;
  currentDate: any = this.commonService.currentDate;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  allMode: string;
  checkBoxesMode: string;
  selectedIndexes: any = [];
  serialNo: any;
  JobNo: any;
  private subscriptions: Subscription[] = [];
  selectedValue: string = 'singleMetal';

  @ViewChild('codeInput1') codeInput1!: ElementRef;


  ngAfterViewInit() {
    // Focus on the first input
    if (this.codeInput1) {
      this.codeInput1.nativeElement.focus();
    }
  }
  lengthCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'btnOrderType',
    SEARCH_HEADING: 'Length Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'LENGTH MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ordertypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'btnOrderType',
    SEARCH_HEADING: 'Order type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'ORDERTYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  designCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 16,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design type',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESIGN_HOLD = '0'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

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
  }
  currencyMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  prefixCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix type',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat type',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR SET'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  salesmanCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman type',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subcatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sub Category type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 32,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='BRAND MASTER' AND DIV_D=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock type',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  mainmetalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Main Metal type',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Time type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  rangeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Range type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  seqCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 93,
    SEARCH_FIELD: 'SEQ_CODE',
    SEARCH_HEADING: 'Sequence type',
    SEARCH_VALUE: '',
    WHERECONDITION: "SEQ_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }





  jobCardFrom: FormGroup = this.formBuilder.group({
    orderType: ['',[Validators.required]],
    jobno: [''],
    designcode: ['',[Validators.required]],
    designtype: [''],
    customer: ['',[Validators.required]],
    customername: [''],
    salesorder: [''],
    costcode: ['',[Validators.required]],
    karat: ['',[Validators.required]],
    category: [''],
    color: ['',[Validators.required]],
    country: [''],
    comments: [''],
    size: [''],
    jobtype: [''],
    jobdate: [''],
    date: [''],
    prefix: [''],
    type: [''],
    subcat: [''],
    brand: [''],
    setref: [''],
    length: [''],
    purity: [''],
    deldate: [''],
    salesman: ['',[Validators.required]],
    stockcode: ['',[Validators.required]],
    currency: [''],
    lossbooking: [''],
    mainmetal: ['',[Validators.required]],
    time: [''],
    range: [''],
    seqcode: ['',[Validators.required]],
    totalpcs: ['1',[Validators.required]],
    pending: ['1',[Validators.required]],
    pending1: ['1',[Validators.required]],
    parts: ['1',[Validators.required]],
    srewFiled: [''],
    instruction: [''],
    picture_name: [''],
  });



  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
   
    // this.jobCardFrom.controls['date'].disable()
    console.log(this.content);
    if (this.content) {
      this.setFormValues()
      this.setInitialValues()
    }
    console.log(this.content);
    this.serialNo = this.content;
    

  }

  setInitialValues() {
    // this.branchCode = this.jobCardFrom.branchCode;
    // this.companyName = this.commonService.companyName;
    this.yearMonth = this.commonService.yearSelected;
    this.jobCardFrom.controls.jobdate.setValue(this.currentDate)
    this.jobCardFrom.controls.deldate.setValue(this.currentDate)
    this.jobCardFrom.controls.date.setValue(this.currentDate)
    //this.commonService.getqueryParamVocType()
  }

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


  openaddcomponent() {
    const modalRef: NgbModalRef = this.modalService.open(ComponentsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openaddtransactiondetails() {
    const modalRef: NgbModalRef = this.modalService.open(TransactionDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openaddstickerprint() {
    const modalRef: NgbModalRef = this.modalService.open(JobStickerPrintComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  // addTableData() {

  //   console.log(this.tableData.length);
  //   let length = this.tableData.length;
  //   let sn = length + 1;
  //   if (this.tableData.length == 0) {
  //     let data = {
  //       "SI NO": sn,
  //       "job_reference": "",
  //       "part_code": "",
  //       "Description": "",
  //       "Pcs": "",
  //       "metal_color": "",
  //       "metal_wt": "",
  //       "stone_wt": "",
  //       "gross_wt": "",
  //     };
  //     this.tableData.push(data);

  //   }
  // }

  job_referencetemp(data: any, value: any) {
    console.log(data);
    this.tableData[value.data.SINO - 1].job_reference = data.target.value;
  }

  part_codetemp(data: any, value: any) {
    this.tableData[value.data.SINO - 1].part_code = data.DESIGN_CODE;
  }

  descriptiontemp(data: any, value: any) {
    this.tableData[value.data.SINO - 1].Description = data.DESIGN_DESCRIPTION;
  }

  Pcstemp(data: any, value: any) {
    this.tableData[value.data.SINO - 1].Pcs = data.target.value;
  }

  metal_colortemp(data: any, value: any) {
    this.tableData[value.data.SINO - 1].metal_color = data.target.value;
  }

  metal_wttemp(data: any, value: any) {
    this.tableData[value.data.SINO - 1].metal_wt = data.target.value;
  }

  stone_wttemp(data: any, value: any) {
    this.tableData[value.data.SINO - 1].stone_wt = data.target.value;
  }

  gross_wttemp(data: any, value: any) {
    this.tableData[value.data.SINO - 1].gross_wt = data.target.value;
  }


  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.jobCardFrom.controls.vocdate.setValue(new Date(date))
    }
  }

  /**USE: close modal window */
  close(data?: any) {
    this.activeModal.close(data);
  }


  lengthCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.length.setValue(e.DESCRIPTION);
  }


  designCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.designcode.setValue(e.Design_Code);
    this.jobCardFrom.controls.designtype.setValue(e.Design_Description);
    this.jobCardFrom.controls.jobtype.setValue(e.Design_Description);

    let length = this.tableData.length;
    let sn = length + 1;
    if (this.tableData.length == 0) {
      let data = {
        "SINO": sn,
        "job_reference": '5/' + sn,
        "part_code": e.Design_Code,
        "Description": e.Design_Description,
        "Pcs": "",
        "metal_color": "",
        "metal_wt": "",
        "stone_wt": "",
        "gross_wt": "",
      };
      this.tableData.push(data);
    };
  }

  customerCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.customer.setValue(e.ACCODE);
    this.jobCardFrom.controls.customername.setValue(e['ACCOUNT HEAD']);
  }

  costCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.costcode.setValue(e.COST_CODE);
  }

  prefixCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.prefix.setValue(e.PREFIX_CODE);
  }

  karatCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.karat.setValue(e.KARAT_CODE);
    this.jobCardFrom.controls.purity.setValue(e.STD_PURITY);


  }

  typeCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.type.setValue(e.CODE);
  }

  categoryCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.category.setValue(e.CODE);
  }

  colorCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.color.setValue(e.CODE);
  }

  countryCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.country.setValue(e.CODE);
  }

  salesmanCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  ordertypeCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.orderType.setValue(e.CODE);
    this.jobCardFrom.controls.jobno.setValue(e.DESCRIPTION);
  }

  subcatCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.subcat.setValue(e.CODE);
  }

  brandCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.brand.setValue(e.CODE);
  }

  stockCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.stockcode.setValue(e.STOCK_CODE);
  }

  currencyCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.currency.setValue(e.CURRENCY_CODE);
  }

  mainmetalCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.mainmetal.setValue(e.STOCK_CODE);
  }

  timeCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.time.setValue(e.CODE);
  }

  rangeCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.range.setValue(e.CODE);
  }

  seqCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.seqcode.setValue(e.SEQ_CODE);
  }

  setFormValues() {
    if (!this.content) return
    this.jobCardFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.jobCardFrom.controls.jobdate.setValue(this.content.JOB_DATE)
    this.jobCardFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.jobCardFrom.controls.customer.setValue(this.content.CUSTOMER_CODE)
    this.jobCardFrom.controls.costcode.setValue(this.content.COST_CODE)
    this.jobCardFrom.controls.type.setValue(this.content.TYPE_CODE)
    this.jobCardFrom.controls.category.setValue(this.content.CATEGORY_CODE)
    this.jobCardFrom.controls.subcat.setValue(this.content.SUBCATEGORY_CODE)
    this.jobCardFrom.controls.brand.setValue(this.content.BRAND_CODE)
    this.jobCardFrom.controls.designcode.setValue(this.content.DESIGN_CODE)
    this.jobCardFrom.controls.seqcode.setValue(this.content.SEQ_CODE)
    this.jobCardFrom.controls.designcode.setValue(this.content.DESIGN_CODE)
    this.jobCardFrom.controls.picture_name.setValue(this.url)
    this.jobCardFrom.controls.setref.setValue(this.content.SET_REF)
    this.jobCardFrom.controls.totalpcs.setValue(this.content.TOTAL_PCS)
    this.jobCardFrom.controls.pending.setValue(this.content.PENDING_PCS)
    this.jobCardFrom.controls.color.setValue(this.content.METAL_COLOR)
    this.jobCardFrom.controls.karat.setValue(this.content.KARAT_CODE)
    this.jobCardFrom.controls.prefix.setValue(this.content.PREFIX)
    this.jobCardFrom.controls.deldate.setValue(this.content.DEL_DATE)
    this.jobCardFrom.controls.time.setValue(this.content.TIME_CODE)
    this.jobCardFrom.controls.range.setValue(this.content.RANGE_CODE)
    this.jobCardFrom.controls.comments.setValue(this.content.COMMENTS_CODE)
    this.jobCardFrom.controls.country.setValue(this.content.COUNTRY_CODE)
    this.jobCardFrom.controls.salesman.setValue(this.content.SALESPERSON_CODE)
    this.jobCardFrom.controls.size.setValue(this.content.SIZE)
    this.jobCardFrom.controls.length.setValue(this.content.LENGTH)
    this.jobCardFrom.controls.orderType.setValue(this.content.ORDER_TYPE)
    this.jobCardFrom.controls.designtype.setValue(this.content.DESIGN_DESC)
    this.jobCardFrom.controls.purity.setValue(this.content.JOB_PURITY)
    this.jobCardFrom.controls.customername.setValue(this.content.CUSTOMER_NAME)
    this.jobCardFrom.controls.lossbooking.setValue(this.content.LOSS_QTY_BOOKED)
    this.jobCardFrom.controls.mainmetal.setValue(this.content.mainmetal)
    this.jobCardFrom.controls.jobdate.setValue(this.content.JOB_DATE)
    this.jobCardFrom.controls.deldate.setValue(this.content.DEL_DATE)
    this.jobCardFrom.controls.type.setValue(this.content.TYPE)
  }


  formSubmit() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
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
      "DESIGN_CODE": this.jobCardFrom.value.designcode || "" ,
      "SEQ_CODE": this.jobCardFrom.value.seqcode || "",
      "PICTURE_NAME": this.url || "",
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
      "LOSS_QTY_BOOKED": this.jobCardFrom.value.lossbooking,
      "LOSS_QTY_TOTAL": 0,
      "LOSS_AMOUNT_CHARGED": 0,
      "LOSS_AMOUNT_BOOKED": 0,
      "LOSS_AMOUNT_TOTAL": 0,
      "TOTAL_PCS": this.jobCardFrom.value.totalpcs || "",
      "PENDING_PCS": this.jobCardFrom.value.pending || "",
      "FINISHED_PCS": 0,
      "OPENED_ON": "2023-10-26T05:59:21.735Z",
      "OPENED_BY": "",
      "JOB_CLOSED_ON": "2023-10-26T05:59:21.735Z",
      "MID": 0,
      "PRINTED": true,
      "HAVE_SO": true,
      "LOC_CODE": "",
      "METAL_COLOR": this.jobCardFrom.value.color || "",
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
      "DESIGN_TYPE": this.jobCardFrom.value.designtype || "",
      "SO_VOCNO": 0,
      "SO_VOCDATE": "2023-10-26T05:59:21.735Z",
      "JOB_PURITY": this.jobCardFrom.value.purity || "",
      "DESIGN_DESC": this.jobCardFrom.value.designtype || "",
      "CUSTOMER_NAME": this.jobCardFrom.value.customername || "",
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
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }


  update() {
    if (this.jobCardFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = `JobMasterDj/UpdateJobMasterDJ/${this.branchCode}/${this.jobCardFrom.value.jobno}`;
    let postData = {
      "JOB_NUMBER": this.jobCardFrom.value.jobno || "",
      "BRANCH_CODE": this.branchCode,
      "JOB_DATE": "2024-04-11T11:09:31.277Z",
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
      "DESIGN_CODE":this.commonService.nullToString(this.jobCardFrom.value.designcode),
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
      "LOSS_QTY_BOOKED": this.jobCardFrom.value.LOSS_QTY_BOOKED,
      "LOSS_QTY_TOTAL": 0,
      "LOSS_AMOUNT_CHARGED": 0,
      "LOSS_AMOUNT_BOOKED": 0,
      "LOSS_AMOUNT_TOTAL": 0,
      "TOTAL_PCS": this.jobCardFrom.value.totalpcs || "",
      "PENDING_PCS": this.jobCardFrom.value.pending || "",
      "FINISHED_PCS": 0,
      "OPENED_ON": "2023-10-26T05:59:21.735Z",
      "OPENED_BY": "",
      "JOB_CLOSED_ON": "2023-10-26T05:59:21.735Z",
      "MID": 0,
      "PRINTED": true,
      "HAVE_SO": true,
      "LOC_CODE": "",
      "METAL_COLOR": this.jobCardFrom.value.color || "",
      "KARAT_CODE": this.jobCardFrom.value.karat || "",
      "PREFIX": this.jobCardFrom.value.prefix || "",
      "JOB_PCS_TOTAL": 0,
      "JOB_PCS_PENDING": 0,
      "OUTSIDEJOB": true,
      "TREE_CODE": "",
      "DEL_DATE": "2024-04-11T11:09:31.277Z",
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
      "DESIGN_TYPE": this.jobCardFrom.value.designtype || "",
      "SO_VOCNO": 0,
      "SO_VOCDATE": "2023-10-26T05:59:21.735Z",
      "JOB_PURITY": this.jobCardFrom.value.purity || "",
      "DESIGN_DESC": "string",
      "CUSTOMER_NAME": this.jobCardFrom.value.customername || "",
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
          "JOB_NUMBER": "string",
          "JOB_DATE": "2024-04-11T11:09:31.277Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_SO_MID": 0,
          "BRANCH_CODE": "string",
          "DESIGN_CODE": "string",
          "METALSTONE": "s",
          "DIVCODE": "s",
          "PRICEID": "string",
          "KARAT_CODE": "stri",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "string",
          "CURRENCY_CODE": "stri",
          "RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "MAKINGRATE": 0,
          "MAKINGAMOUNT": 0,
          "SIEVE": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SHAPE": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "UNQ_DESIGN_ID": "string",
          "UNIQUEID": 0,
          "STOCK_CODE": "string",
          "SIEVE_SET": "string",
          "PROCESS_TYPE": "string",
          "PURITY": 0
        }
      ],
      "JOB_SALESORDER_DETAIL_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "string",
          "JOB_DATE": "2024-04-11T11:09:31.277Z",
          "JOB_SO_NUMBER": 0,
          "JOB_SO_DATE": "2024-04-11T11:09:31.277Z",
          "DELIVERY_DATE": "2024-04-11T11:09:31.277Z",
          "PARTYCODE": "string",
          "PARTYNAME": "string",
          "DESIGN_CODE": "string",
          "KARAT": "stri",
          "METAL_COLOR": "string",
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
          "SEQ_CODE": "string",
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "ACT_TIME": 0,
          "DESCRIPTION": "string",
          "UNQ_DESIGN_ID": "string",
          "UNQ_JOB_ID": "string",
          "JOB_SO_MID": 0,
          "UNIQUEID": 0,
          "PROD_DATE": "2024-04-11T11:09:31.277Z",
          "PROD_REF": 0,
          "PROD_STOCK_CODE": "string",
          "PROD_PCS": 0,
          "LOCTYPE_CODE": "string",
          "PICTURE_PATH": "string",
          "PART_CODE": "string",
          "TREE_NO": "string",
          "VOCTYPE": "str",
          "VOCNO": 0,
          "YEARMONTH": "string",
          "BRANCH_CODE": "string",
          "KARIGAR_CODE": "string",
          "WAX_STATUS": "s",
          "SIZE": "string",
          "LENGTH": "string",
          "SCREW_FIELD": "string",
          "ORDER_TYPE": "string",
          "DESIGN_TYPE": "string",
          "CLOSE_TYPE": "string",
          "JOB_PURITY": 0,
          "ADD_STEEL": true
        }
      ],
      "JOB_SALESORDER_DJ": [
        {
          "SRNO": 0,
          "JOB_NUMBER": "string",
          "JOB_DATE": "2024-04-11T11:09:31.277Z",
          "JOB_SO_NUMBER": 0,
          "JOB_SO_DATE": "2024-04-11T11:09:31.277Z",
          "JOB_SO_MID": 0,
          "PARTYCODE": "string",
          "PARTYNAME": "string",
          "PCS": 0,
          "WIP_PCS": 0,
          "FINI_PCS": 0,
          "UNIQUEID": 0,
          "SELECTED_SO": true,
          "PARTS": 0,
          "SIZE": "string",
          "LENGTH": "string",
          "SCREW_FIELD": "string",
          "ORDER_TYPE": "string"
        }
      ],
      "JOB_LABOUR_BOQ_DJ": [
        {
          "JOB_NUMBER": "string",
          "JOB_DATE": "2024-04-11T11:09:31.277Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "BRANCH_CODE": "string",
          "DESIGN_CODE": "string",
          "CODE": "string",
          "DESCRIPTION": "string",
          "UNIT": "string",
          "RATEFC": 0,
          "RATELC": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "UNQ_DESIGN_ID": "string",
          "UNIQUEID": 0,
          "JOB_SO_MID": 0
        }
      ]
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
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
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
