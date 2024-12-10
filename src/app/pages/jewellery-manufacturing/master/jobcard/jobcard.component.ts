import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrls: ['./jobcard.component.scss']
})
export class JobcardComponent implements OnInit {
  @ViewChild('overlayorderTypeSearch') overlayorderTypeSearch!: MasterSearchComponent;
  @ViewChild('overlaydesigncodeSearch') overlaydesigncodeSearch!: MasterSearchComponent;
  @ViewChild('overlaycustomerSearch') overlaycustomerSearch!: MasterSearchComponent;
  @ViewChild('overlaycostcodeSearch') overlaycostcodeSearch!: MasterSearchComponent;
  @ViewChild('overlayprefixSearch') overlayprefixSearch!: MasterSearchComponent;
  @ViewChild('overlaykaratSearch') overlaykaratSearch!: MasterSearchComponent;
  @ViewChild('overlaytypeSearch') overlaytypeSearch!: MasterSearchComponent;
  @ViewChild('overlaycategorySearch') overlaycategorySearch!: MasterSearchComponent;
  @ViewChild('overlaysubcatSearch') overlaysubcatSearch!: MasterSearchComponent;
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild('overlaybrandSearch') overlaybrandSearch!: MasterSearchComponent;
  @ViewChild('overlaycountrySearch') overlaycountrySearch!: MasterSearchComponent;
  @ViewChild('overlaycommentsSearch') overlaycommentsSearch!: MasterSearchComponent;
  @ViewChild('overlaysizeSearch') overlaysizeSearch!: MasterSearchComponent;
  @ViewChild('overlaylengthSearch') overlaylengthSearch!: MasterSearchComponent;
  @ViewChild('overlaysalesmanSearch') overlaysalesmanSearch!: MasterSearchComponent;
  @ViewChild('overlaycurrencySearch') overlaycurrencySearch!: MasterSearchComponent;
  @ViewChild('overlaymainmetalSearch') overlaymainmetalSearch!: MasterSearchComponent;
  @ViewChild('overlaytimeSearch') overlaytimeSearch!: MasterSearchComponent;
  @ViewChild('overlayrangeSearch') overlayrangeSearch!: MasterSearchComponent;
  @ViewChild('overlayseqcodeSearch') overlayseqcodeSearch!: MasterSearchComponent;
  @Input() content!: any;
  @ViewChild('codeInput1') codeInput1!: ElementRef;

  //variables
  jobnumber: any[] = []
  viewMode: boolean = false;
  editMode: boolean = false;
  modalReference: any;
  imageData: any;
  closeResult: any;
  pageTitle: any;
  currentFilter: any;
  showFilterRow: boolean = false;
  isSaved: boolean = true;
  showHeaderFilter: boolean = false;
  divisionMS: any = 'ID';
  itemList: any[] = []

  tableData: any[] = [];
  isDisableSaveBtn: boolean = false;
  userName = localStorage.getItem('username');
  columnhead: any[] = ['Sl No', 'Job Reference', 'Part Code', 'Description', 'Pcs', 'Metal Color', 'Metal Wt', 'Stone Wt', 'Gross Wt'];
  branchCode?: String;
  yearMonth?: String;
  currentDate: any = this.commonService.currentDate;
  UpdatetDate = this.formatDateToDDMMYYYY(new Date());


  urls: string | ArrayBuffer | null | undefined;
  url: any;
  allMode: string;
  checkBoxesMode: string;
  selectedIndexes: any = [];
  JobNo: any;
  private subscriptions: Subscription[] = [];
  selectedValue: string = 'singleMetal';
  currencyDt: any;
  jobMaterialBOQ: any = [];
  jobsalesorderdetailDJ: any = [];

  commentsCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 267,
    SEARCH_FIELD: 'Account Description',
    SEARCH_HEADING: 'Account Description',
    // WHERECONDITION:`@strAcCode=''`,
    SEARCH_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  lengthCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'DESCRIPTION',
    SEARCH_HEADING: 'Length Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESCRIPTION<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ordertypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'CODE',
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
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
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
  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Time type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='TIME MASTER' AND DIV_D=1",
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
    WHERECONDITION: "types = 'RANGE MASTER' AND DIV_D=1",
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
    orderType: ['', [Validators.required]],
    jobno: [''],
    designcode: ['', [Validators.required]],
    designtype: [''],
    customer: ['', [Validators.required]],
    customername: [''],
    salesorder: [''],
    costcode: ['', [Validators.required]],
    karat: ['', [Validators.required]],
    category: [''],
    color: ['', [Validators.required]],
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
    salesman: ['', [Validators.required]],
    stockcode: [''],
    currency: [''],
    lossbooking: [''],
    mainmetal: [''],
    time: [''],
    range: [''],
    seqcode: ['', [Validators.required]],
    totalpcs: ['1', [Validators.required]],
    pending: ['1', [Validators.required]],
    pending1: ['1', [Validators.required]],
    parts: ['1', [Validators.required]],
    srewFiled: [''],
    instruction: [''],
    picture_name: [''],

  });
  mainmetalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Main Metal type',
    SEARCH_VALUE: '',
    WHERECONDITION: `kARAT_CODE = '${this.jobCardFrom.value.karat}' and PURITY = '${this.jobCardFrom.value.purity}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 89,
    SEARCH_FIELD: 'COMPSIZE_CODE',
    SEARCH_HEADING: 'Size ',
    SEARCH_VALUE: '',
    WHERECONDITION: "COMPSIZE_CODE<>''",
    // WHERECONDITION: `kARAT_CODE = '${this.jobCardFrom.value.karat}' and PURITY = '${this.jobCardFrom.value.purity}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
    this.currencyDt = this.commonService.compCurrency;
  }

  ngOnInit(): void {
    this.setInitialValues();
    if (this.content) {
      this.setLoadFormValues();
      this.getSavedDetails()
      switch (this.content.FLAG) {
        case 'VIEW':
          this.viewMode = true;
          this.setLoadFormValues();
          break;
        case 'EDIT':
          this.editMode = true;
          break;
        case 'DELETE':
          this.viewMode = true;
          break;
        default:
          break;
      }
    } else {
      this.priceSchemeValidate();
    }

  }
  ngAfterViewInit() {
    // Focus on the first input
    if (this.codeInput1) {
      this.codeInput1.nativeElement.focus();
    }
  }

  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.yearMonth = this.commonService.yearSelected;
    this.jobCardFrom.controls.jobdate.setValue(this.UpdatetDate)
    this.jobCardFrom.controls.deldate.setValue(this.UpdatetDate)
    this.jobCardFrom.controls.date.setValue(this.currentDate)
    let CURRENCY_CODE = this.commonService.compCurrency;
    this.jobCardFrom.controls.currency.setValue(CURRENCY_CODE);
  }
  getSavedDetails() {
    let API = `JobMasterDj/GetJobMasterDjHeaderDetail/${this.commonService.branchCode}/${this.jobCardFrom.value.jobno}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.jobsalesorderdetailDJ = data.JOB_SALESORDER_DETAIL_DJ|| []
          if(this.jobsalesorderdetailDJ.length>0){
            this.jobsalesorderdetailDJ.forEach((item:any) => {
              item.GROSS_WT = this.commonService.setCommaSerperatedNumber(item.GROSS_WT,'METAL')
              item.METAL_WT = this.commonService.setCommaSerperatedNumber(item.GROSS_WT,'METAL')
              item.STONE_WT = this.commonService.setCommaSerperatedNumber(item.GROSS_WT,'STONE')
            });
          }
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
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
    modalRef.componentInstance.content = this.jobCardFrom.value.jobno;

  }

  openaddstickerprint() {
    console.log(this.content);
    const modalRef: NgbModalRef = this.modalService.open(JobStickerPrintComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = this.jobCardFrom.value.jobno;
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
    let deldate = new Date(inputValue)
    let jobdate = new Date(inputValue)
    let yr = date.getFullYear() || deldate.getFullYear() || jobdate.getFullYear()
    let dt = date.getDate()  || deldate.getDate() || jobdate.getDate()
    let dy = date.getMonth() || deldate.getMonth() || jobdate.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      let deldate = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      let jobdate = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.jobCardFrom.controls.vocdate.setValue(new Date(date || deldate || jobdate))
    }
  }

  /**USE: close modal window */
  // close(data?: any) {
  //   this.activeModal.close(data);
  // }

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


  lengthCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.length.setValue(e.DESCRIPTION);
  }

  commentsCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.comments.setValue(e['Account Description']);
  }

  sizeCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.size.setValue(e.COMPSIZE_CODE);
  }



  designCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.designcode.setValue(e.Design_Code);
    this.jobCardFrom.controls.designtype.setValue(e.Design_Description);
    //this.jobCardFrom.controls.jobtype.setValue(e.Design_Description);

    let length = this.tableData.length;
    let sn = length + 1;
    if (this.tableData.length == 0) {
      let data = {
        "SINO": sn,
        "job_reference": this.jobCardFrom.value.jobno + '/' + sn,
        "part_code": e.Design_Code,
        "Description": e.Design_Description,
        "Pcs": e.Pcs,
        "metal_color": e.metal_color,
        "metal_wt": e.metal_wt,
        "stone_wt": e.stone_wt,
        "gross_wt": e.gross_wt,
      };
      this.tableData.push(data);
      console.log(data, 'tabledate')
    };

    this.getDesigncode();
    this.getDesignimagecode();

  }

  getDesignimagecode() {

    let API = `ImageforJobCad/${this.jobCardFrom.value.designcode}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data, 'pic')
          this.urls = data.map((item: any) => item.imagepath)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  // getDesigncode() {

  //   let API = 'DesignMaster/GetDesignMasterDetails/' + this.jobCardFrom.value.designcode;
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {

  //       let formattedPurity = parseFloat(result.response.PURITY).toFixed(6);
  //       this.jobCardFrom.controls['purity'].setValue(formattedPurity);
  //       this.jobCardFrom.controls['color'].setValue(result.response.COLOR);
  //       this.jobCardFrom.controls['karat'].setValue(result.response.KARAT_CODE);
  //       this.jobCardFrom.controls['subcat'].setValue(result.response.SUBCATEGORY_CODE);
  //       this.jobCardFrom.controls['prefix'].setValue(result.response.JOB_PREFIX);
  //       this.jobCardFrom.controls['brand'].setValue(result.response.BRAND_CODE);
  //       this.jobCardFrom.controls['jobtype'].setValue(result.response.DESIGN_TYPE);
  //       this.jobCardFrom.controls['type'].setValue(result.response.TYPE_CODE);
  //       this.jobCardFrom.controls['costcode'].setValue(result.response.COST_CODE);
  //       this.jobCardFrom.controls['seqcode'].setValue(result.response.SEQ_CODE);



  //       this.mainmetalCodeData.WHERECONDITION = `kARAT_CODE = '${this.jobCardFrom.value.karat}' and PURITY = '${this.jobCardFrom.value.purity}'`;

  //       this.tableData[0].Pcs = result.response.PCS
  //       this.tableData[0].metal_color = result.response.COLOR
  //       this.tableData[0].metal_wt = result.response.METAL_WT
  //       this.tableData[0].stone_wt = result.response.STONE_WT
  //       this.tableData[0].gross_wt = result.response.GROSS_WT



  //     }, err => {
  //       this.commonService.toastErrorByMsgId('Server Error')
  //     })
  //   this.subscriptions.push(Sub)

  // }

  getDesigncode() {
    let API = 'DesignMaster/GetDesignMasterDetails/' + this.jobCardFrom.value.designcode;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        let formattedPurity = parseFloat(result.response.PURITY).toFixed(6);
        console.log(result.response, 'data')
        this.jobCardFrom.controls['purity'].setValue(formattedPurity);
        this.jobCardFrom.controls['color'].setValue(result.response.COLOR);
        this.jobCardFrom.controls['karat'].setValue(result.response.KARAT_CODE);
        this.jobCardFrom.controls['subcat'].setValue(result.response.SUBCATEGORY_CODE);
        this.jobCardFrom.controls['prefix'].setValue(result.response.JOB_PREFIX);
        this.jobCardFrom.controls['brand'].setValue(result.response.BRAND_CODE);
        this.jobCardFrom.controls['jobtype'].setValue(result.response.DESIGN_TYPE);
        this.jobCardFrom.controls['type'].setValue(result.response.TYPE_CODE);
        this.jobCardFrom.controls['costcode'].setValue(result.response.COST_CODE);
        this.jobCardFrom.controls['seqcode'].setValue(result.response.SEQ_CODE);
        this.jobCardFrom.controls['category'].setValue(result.response.CATEGORY_CODE);
        this.jobCardFrom.controls['setref'].setValue(result.response.SET_REF);
        console.log(result.response.PICTURE_NAME, 'picyure')
        this.jobCardFrom.controls['picture_name'].setValue(result.response.PICTURE_NAME);


        this.mainmetalCodeData.WHERECONDITION = `kARAT_CODE = '${this.jobCardFrom.value.karat}' and PURITY = '${this.jobCardFrom.value.purity}'`;
        // this.tableData[0].Pcs = result.response.PCS;
        console.log(this.tableData[0],'content')
        this.tableData[0].metal_color = result.response.COLOR;
        this.tableData[0].metal_wt = result.response.METAL_WT;
        this.tableData[0].stone_wt = result.response.STONE_WT;
        this.tableData[0].gross_wt = result.response.GROSS_WT;
        this.tableData[0].part_code = result.response.PART_CODE;

        // Get the first object from DESIGN_STNMTL_DETAIL array

        const firstDetail = result.response.DESIGN_STNMTL_DETAIL;
        console.log(result.response.DESIGN_STNMTL_DETAIL,'response')
        if (firstDetail) {
          firstDetail.forEach((element: any) => {
            let obj =
            {
              SRNO: element.SRNO,
              JOB_NUMBER: String(this.jobCardFrom.value.jobno) + '/' + element.SRNO,
              JOB_DATE: new Date().toISOString(),
              JOB_SO_NUMBER: 0, // Adjust as necessary
              UNQ_JOB_ID: "", // Provide a unique ID if available
              JOB_SO_MID: 0, // Adjust as necessary
              BRANCH_CODE: "DMCC", // Adjust if needed
              DESIGN_CODE: element.DESIGN_CODE,
              METALSTONE: element.METALSTONE,
              DIVCODE: element.DIVCODE,
              PRICEID: element.PRICEID || "", // Adjust if PRICEID is available
              KARAT_CODE: element.KARAT_CODE,
              CARAT: element.CARAT,
              GROSS_WT: element.GROSS_WT,
              PCS: element.PCS,
              RATE_TYPE: element.RATE_TYPE,
              CURRENCY_CODE: element.CURRENCY_CODE,
              RATE: element.RATE,
              AMOUNTFC: element.AMOUNTFC,
              AMOUNTLC: element.AMOUNTLC,
              MAKINGRATE: element.MAKINGRATE,
              MAKINGAMOUNT: element.MAKINGAMOUNT,
              SIEVE: element.SIEVE,
              COLOR: element.COLOR,
              CLARITY: element.CLARITY,
              SHAPE: element.SHAPE,
              SIZE_FROM: element.SIZE_FROM,
              SIZE_TO: element.SIZE_TO,
              UNQ_DESIGN_ID: "", // Provide a unique ID if available
              UNIQUEID: element.UNIQUEID,
              STOCK_CODE: element.STOCK_CODE,
              SIEVE_SET: element.SIEVE_SET,
              PROCESS_TYPE: element.PROCESS_TYPE,
              PURITY: element.PURITY
            }
            this.jobMaterialBOQ.push(obj)
            //this.tableData.push(obj)
          })
        }

        // Get the first object from DESIGN_STNMTL_DETAIL array

        //  const firstDetail1 = result.response.DESIGN_STNMTL_DETAIL;
        //  if (firstDetail1) {
        //    firstDetail1.forEach((element:any)=>{
        //      let obj = 
        //      {
        //        SRNO: element.SRNO,
        //        JOB_NUMBER: String(this.jobCardFrom.value.jobno) + '/' + element.SRNO,
        //        JOB_DATE: new Date().toISOString(),
        //        JOB_SO_NUMBER: 0, // Adjust as necessary
        //        UNQ_JOB_ID: result.NewUnqDesignId, // Provide a unique ID if available
        //        JOB_SO_MID: 0, // Adjust as necessary
        //        BRANCH_CODE: "DMCC", // Adjust if needed
        //        DESIGN_CODE: element.DESIGN_CODE,
        //        METALSTONE: element.METALSTONE,
        //        DIVCODE: element.DIVCODE,
        //        PRICEID: element.PRICEID || "", // Adjust if PRICEID is available
        //        KARAT_CODE: element.KARAT_CODE,
        //        CARAT: element.CARAT,
        //        GROSS_WT: element.GROSS_WT,
        //        PCS: element.PCS,
        //        RATE_TYPE: element.RATE_TYPE,
        //        CURRENCY_CODE: element.CURRENCY_CODE,
        //        RATE: element.RATE,
        //        AMOUNTFC: element.AMOUNTFC,
        //        AMOUNTLC: element.AMOUNTLC,
        //        MAKINGRATE: element.MAKINGRATE,
        //        MAKINGAMOUNT: element.MAKINGAMOUNT,
        //        SIEVE: element.SIEVE,
        //        COLOR: element.COLOR,
        //        CLARITY: element.CLARITY,
        //        SHAPE: element.SHAPE,
        //        SIZE_FROM: element.SIZE_FROM,
        //        SIZE_TO: element.SIZE_TO,
        //        UNQ_DESIGN_ID: "", // Provide a unique ID if available
        //        UNIQUEID: element.UNIQUEID,
        //        STOCK_CODE: element.STOCK_CODE,
        //        SIEVE_SET: element.SIEVE_SET,
        //        PROCESS_TYPE: element.PROCESS_TYPE,
        //        PURITY: element.PURITY
        //      }
        //      this.jobsalesorderdetailDJ.push(obj)
        //      //this.tableData.push(obj)
        //    })
        //  }

        const firstDetail1 = result.response.DESIGN_STNMTL_DETAIL;
        if (firstDetail1) {
          firstDetail1.forEach((element: any, index: number) => {

            let metalWt = 0;
            let stoneWt = 0;
            if (element.METALSTONE === 'M') {
              metalWt = parseFloat(element.GROSS_WT) || 0;
            } else {
              stoneWt = parseFloat(element.GROSS_WT) || 0;
            }


            let obj = {
              SRNO: index + 1,
              JOB_NUMBER: `${this.jobCardFrom.value.jobno}/${index + 1}`,
              JOB_DATE: new Date().toISOString(),
              JOB_SO_NUMBER: 0,
              UNQ_JOB_ID: String(this.jobCardFrom.value.jobno),
              JOB_SO_MID: 0,
              BRANCH_CODE: "DMCC",
              DESIGN_CODE: element.DESIGN_CODE,
              METALSTONE: element.METALSTONE,
              DIVCODE: element.DIVCODE,
              PRICEID: element.PRICEID || "",
              KARAT_CODE: element.KARAT_CODE,
              CARAT: element.CARAT,
              GROSS_WT: element.GROSS_WT,
              PCS: element.PCS,
              RATE_TYPE: element.RATE_TYPE,
              CURRENCY_CODE: element.CURRENCY_CODE,
              RATE: element.RATE,
              AMOUNTFC: element.AMOUNTFC,
              AMOUNTLC: element.AMOUNTLC,
              MAKINGRATE: element.MAKINGRATE,
              MAKINGAMOUNT: element.MAKINGAMOUNT,
              SIEVE: element.SIEVE,
              COLOR: element.COLOR,
              CLARITY: element.CLARITY,
              SHAPE: element.SHAPE,
              SIZE_FROM: element.SIZE_FROM,
              SIZE_TO: element.SIZE_TO,
              UNQ_DESIGN_ID: result.NewUnqDesignId, // Assign as needed
              UNIQUEID: element.UNIQUEID,
              STOCK_CODE: element.STOCK_CODE,
              SIEVE_SET: element.SIEVE_SET,
              PROCESS_TYPE: element.PROCESS_TYPE,
              PURITY: element.PURITY,
              metal_wt: metalWt.toString(),
              stone_wt: stoneWt.toString(),
              part_code: result.response.DESIGN_CODE,
              Description: result.response.DESIGN_DESCRIPTION,
              SIZE: result.response.SIZE || "",
              LENGTH: result.response.LENGTH || "",
              CLOSE_TYPE: element.CLOSE_TYPE || "",
              ORDER_TYPE: element.ORDER_TYPE || "",
              WAX_STATUS: element.WAX_STATUS || "",
              DESIGN_TYPE: element.DESIGN_TYPE || "",
              SCREW_FIELD: element.SCREW_FIELD || "",
            };

            this.jobsalesorderdetailDJ.push(obj);
          });
        }



      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')//Server Error
      });
    this.subscriptions.push(Sub);
  }


  customerCodeSelected(e: any) {
    console.log(e);
    this.jobCardFrom.controls.customer.setValue(e.ACCODE);
    this.jobCardFrom.controls.customername.setValue(e.ACCOUNT_HEAD);
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
    this.mainmetalCodeData.WHERECONDITION = `kARAT_CODE = '${e.KARAT_CODE}' and PURITY = '${e.STD_PURITY}'`;
    this.jobCardFrom.controls.karat.setValue(e.KARAT_CODE);
    // this.jobCardFrom.controls.purity.setValue(e.STD_PURITY);

    this.jobCardFrom.controls.purity.setValue(
      this.commonService.transformDecimalVB(6, e.STD_PURITY));
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
    //this.jobCardFrom.controls.jobno.setValue(e.DESCRIPTION);
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
    this.mainmetalCodeData.WHERECONDITION = `kARAT_CODE = '${this.jobCardFrom.value.karat}' and PURITY = '${this.jobCardFrom.value.purity}'`;
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

  setLoadFormValues() {
    if (!this.content) return
    this.mainmetalCodeData.WHERECONDITION = `kARAT_CODE  = '${this.jobCardFrom.value.karat}' and PURITY = '${this.jobCardFrom.value.purity}'`;



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
    this.jobCardFrom.controls.picture_name.setValue(this.content.PICTURE_NAME)
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

    this.jobCardFrom.controls.customername.setValue(this.content.CUSTOMER_NAME)
    this.jobCardFrom.controls.lossbooking.setValue(this.content.METAL_STOCK_CODE)
    this.jobCardFrom.controls.mainmetal.setValue(this.content.COST_CENTER_DESC)
    this.jobCardFrom.controls.jobdate.setValue(this.content.JOB_DATE)
    this.jobCardFrom.controls.deldate.setValue(this.content.DEL_DATE)
    this.jobCardFrom.controls.type.setValue(this.content.TYPE)
    this.jobCardFrom.controls.jobtype.setValue(this.content.DESIGN_TYPE)

    this.jobCardFrom.controls.purity.setValue(
      this.commonService.transformDecimalVB(6, this.content.JOB_PURITY));

    this.urls = this.content.PICTURE_NAME
    this.getDesignimagecode()

  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.orderType) == '') {
      this.commonService.toastErrorByMsgId('MSG1535') //"orderType cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.designcode) == '') {
      this.commonService.toastErrorByMsgId('MSG1197')//"designcode cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.customer) == '') {
      this.commonService.toastErrorByMsgId('MSG7822')//"customer cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.costcode) == '') {
      this.commonService.toastErrorByMsgId('MSG1151')//"costcode cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.karat) == '') {
      this.commonService.toastErrorByMsgId('MSG1362')//"karat cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.color) == '') {
      this.commonService.toastErrorByMsgId('MSG1125')//"color cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.salesman) == '') {
      this.commonService.toastErrorByMsgId('MSG3652')//"salesman cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.seqcode) == '') {
      this.commonService.toastErrorByMsgId('MSG3571')//"seqcode cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.totalpcs) == '') {
      this.commonService.toastErrorByMsgId('MSG1563')//"totalpcs cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.pending) == '') {
      this.commonService.toastErrorByMsgId('MSG1572')//"pending cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.pending1) == '') {
      this.commonService.toastErrorByMsgId('MSG1572')//"pending1 cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.parts) == '') {
      this.commonService.toastErrorByMsgId('MSG7997')//"parts cannot be empty"
      return true
    }
    return false;
  }


  formSubmit() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.jobCardFrom.value)) return;
    // if (this.jobCardFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'JobMasterDj/InsertJobMasterDJ'
    let postData = {
      "JOB_NUMBER": this.commonService.nullToString(this.jobCardFrom.value.jobno) || "",
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
      "PICTURE_NAME": this.commonService.nullToString(this.jobCardFrom.value.picture_name),
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
      "METAL_STOCK_CODE": this.jobCardFrom.value.lossbooking || "",
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
      "DESIGN_TYPE": this.jobCardFrom.value.jobtype || "",
      "SO_VOCNO": 0,
      "SO_VOCDATE": "2023-10-26T05:59:21.735Z",
      "JOB_PURITY": this.jobCardFrom.value.purity || "",
      "DESIGN_DESC": this.jobCardFrom.value.designtype || "",
      "CUSTOMER_NAME": this.jobCardFrom.value.customername || "",
      "COST_CENTER_DESC": this.jobCardFrom.value.mainmetal || "",
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
      "JOB_MATERIAL_BOQ_DJ": this.jobMaterialBOQ,
      "JOB_SALESORDER_DETAIL_DJ": this.jobsalesorderdetailDJ,
      // [
      // //grid
      //         {
      //           "SRNO": 0,
      //           "JOB_NUMBER": "",
      //           "JOB_DATE": "2023-10-26T05:59:21.735Z",
      //           "JOB_SO_NUMBER": 0,
      //           "JOB_SO_DATE": "2023-10-26T05:59:21.735Z",
      //           "DELIVERY_DATE": "2023-10-26T05:59:21.735Z",
      //           "PARTYCODE": "",
      //           "PARTYNAME": "",
      //           "DESIGN_CODE": "",
      //           "KARAT": "",
      //           "METAL_COLOR": "",
      //           "PCS": 0,
      //           "METAL_WT": 0,
      //           "STONE_WT": 0,
      //           "GROSS_WT": 0,
      //           "METAL_WT_PCS": 0,
      //           "STONE_PC_PCS": 0,
      //           "STONE_WT_PCS": 0,
      //           "RATEFC": 0,
      //           "RATECC": 0,
      //           "VALUEFC": 0,
      //           "VALUECC": 0,
      //           "SEQ_CODE": "",
      //           "STD_TIME": 0,
      //           "MAX_TIME": 0,
      //           "ACT_TIME": 0,
      //           "DESCRIPTION": "",
      //           "UNQ_DESIGN_ID": "",
      //           "UNQ_JOB_ID": "",
      //           "JOB_SO_MID": 0,
      //           "UNIQUEID": 0,
      //           "PROD_DATE": "2023-10-26T05:59:21.735Z",
      //           "PROD_REF": 0,
      //           "PROD_STOCK_CODE": "",
      //           "PROD_PCS": 0,
      //           "LOCTYPE_CODE": "",
      //           "PICTURE_PATH": "",
      //           "PART_CODE": "",

      //           // "SINO": sn,
      //           // "job_reference": this.jobCardFrom.value.jobno + '/' + sn,
      //           // "part_code": e.Design_Code,
      //           // "Description": e.Design_Description,
      //           // "Pcs": "",
      //           // "metal_color": "",
      //           // "metal_wt": "",
      //           // "stone_wt": "",
      //           // "gross_wt": "",


      //           "TREE_NO": "",
      //           "VOCTYPE": "",
      //           "VOCNO": 0,
      //           "YEARMONTH": "",
      //           "BRANCH_CODE": "",
      //           "KARIGAR_CODE": "",
      //           "WAX_STATUS": "",
      //           "SIZE": "",
      //           "LENGTH": "",
      //           "SCREW_FIELD": "",
      //           "ORDER_TYPE": "",
      //           "DESIGN_TYPE": "",
      //           "CLOSE_TYPE": "",
      //           "JOB_PURITY": 0,
      //           "ADD_STEEL": true
      //         }
      //       ],
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
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }


  update() {
    // if (this.jobCardFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = `JobMasterDj/UpdateJobMasterDJ/${this.branchCode}/${this.jobCardFrom.value.jobno}`;
    let postData = {
      "JOB_NUMBER": this.commonService.nullToString(this.jobCardFrom.value.jobno) || "",
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
      "PICTURE_NAME":this.commonService.nullToString(this.jobCardFrom.value.picture_name),
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
      "METAL_STOCK_CODE": this.jobCardFrom.value.lossbooking || "",
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
      "DESIGN_TYPE": this.jobCardFrom.value.jobtype || "",
      "SO_VOCNO": 0,
      "SO_VOCDATE": "2023-10-26T05:59:21.735Z",
      "JOB_PURITY": this.jobCardFrom.value.purity || "",
      "DESIGN_DESC": this.jobCardFrom.value.designtype || "",
      "CUSTOMER_NAME": this.jobCardFrom.value.customername || "",
      "COST_CENTER_DESC": this.jobCardFrom.value.mainmetal || "",
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

          // "SINO": sn,
          // "job_reference": this.jobCardFrom.value.jobno + '/' + sn,
          // "part_code": e.Design_Code,
          // "Description": e.Design_Description,
          // "Pcs": "",
          // "metal_color": "",
          // "metal_wt": "",
          // "stone_wt": "",
          // "gross_wt": "",


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
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
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
              this.commonService.toastErrorByMsgId('MSG1880')//Not deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  priceSchemeValidate() {

    // this.jobCardFrom.controls.jobCardFrom.setValue(e.PRICE_CODE)
    let postData = {
      "SPID": "096",
      "parameter": {
        STRBRANCHCODE: this.branchCode
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          //this.jobnumber = result.dynamicData[0][0].JOB_NO || []
          this.jobCardFrom.controls.jobno.setValue(result.dynamicData[0][0].JOB_NO)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')//Server Error
      })
    this.subscriptions.push(Sub)
  }

  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {

  //   // if (event && event.target.value == '') {
  //   //   this.showOverleyPanel(event, FORMNAME)
  //   //   return
  //   // }

  //   // this.showOverleyPanel(event, FORMNAME)


  //   const inputValue = event.target.value.toUpperCase();
  //   //  this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value


  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   }
  //   this.commonService.showSnackBarMsg('MSG81447');
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       this.isDisableSaveBtn = false;
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531');
  //         this.jobCardFrom.controls[FORMNAME].setValue('');
  //         this.jobCardFrom.controls.customername.setValue('');
  //         this.jobCardFrom.controls.designtype.setValue('');
  //         this.renderer.selectRootElement(FORMNAME).focus();
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }

  //       if (data == '') {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.jobCardFrom.controls[FORMNAME].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         if (FORMNAME === 'customer') {
  //           if (FORMNAME === 'customer') {
  //             console.log(FORMNAME)
  //             this.jobCardFrom.controls.customername.setValue('');
  //           }
  //         }
  //         return
  //       }

  //       const matchedItem2 = data.find((item: any) => item.DESIGN_CODE.toUpperCase() === inputValue);
  //       if (matchedItem2) {
  //         this.jobCardFrom.controls[FORMNAME].setValue(matchedItem2.DESIGN_CODE);
  //         if (FORMNAME === 'designcode') {
  //           this.jobCardFrom.controls.designtype.setValue(matchedItem2.DESIGN_DESCRIPTION);
  //           this.jobCardFrom.controls.color.setValue(matchedItem2.COLOR);
  //           this.jobCardFrom.controls.karat.setValue(matchedItem2.KARAT_CODE);
  //           this.jobCardFrom.controls.subcat.setValue(matchedItem2.SUBCATEGORY_CODE);
  //           this.jobCardFrom.controls.prefix.setValue(matchedItem2.JOB_PREFIX);
  //           this.jobCardFrom.controls.brand.setValue(matchedItem2.BRAND_CODE);
  //           this.jobCardFrom.controls.jobtype.setValue(matchedItem2.DESIGN_TYPE);
  //           this.jobCardFrom.controls.type.setValue(matchedItem2.TYPE_CODE);
  //           this.jobCardFrom.controls.purity.setValue(matchedItem2.PURITY);
  //         }
  //       } else {
  //         this.handleLookupError(FORMNAME, LOOKUPDATA);
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found')
  //     })
  //   this.subscriptions.push(Sub)
  // }

  /**use: validate all lookups to check data exists in db */




  ErrorMessageFounder(alertMsg: any) {
    if (alertMsg == null) {
      Swal.fire({
        title: "Not Found",
        text: '',
        icon: 'warning',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      });
    } else {
      return alertMsg
    }

  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    const inputValue = event.target.value.toUpperCase();
    LOOKUPDATA.SEARCH_VALUE = event.target.value

    if (FORMNAME == 'comments') {
      console.log(FORMNAME)
      this.setFromProcessWhereCondition()
    }

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
          let alertMsg = this.commonService.toastErrorByMsgId('MSG1531');
          console.log(this.commonService.toastErrorByMsgId('MSG1531'));
          this.jobCardFrom.controls[FORMNAME].setValue('');
          this.jobCardFrom.controls.customername.setValue('');
          this.jobCardFrom.controls.designtype.setValue('');
          // this.renderer.selectRootElement(FORMNAME).focus();
          LOOKUPDATA.SEARCH_VALUE = '';
          // if (alertMsg == null || alertMsg == undefined ) {
          //   return "NOT FOUND";
          // }
          return this.ErrorMessageFounder(alertMsg) && console.log("data and error message fetched succesdsfully");


        }

        if (data == '') {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.jobCardFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''

          if (FORMNAME === 'customer') {
            console.log(FORMNAME)
            this.jobCardFrom.controls.customername.setValue('');
          }
          if (FORMNAME === 'comments') {
            console.log(FORMNAME)
            this.jobCardFrom.controls.comments.setValue('');
          }
          return
        }

        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.jobCardFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'comments') {
            console.log(FORMNAME)
            this.jobCardFrom.controls.comments.setValue('');
          }
          return
        }



        const matchedItem2 = data.find((item: any) => item.DESIGN_CODE.toUpperCase() === inputValue);
        console.log(matchedItem2, 'data')
        if (matchedItem2) {
          this.jobCardFrom.controls[FORMNAME].setValue(matchedItem2.DESIGN_CODE);
          if (FORMNAME === 'designcode') {
            this.jobCardFrom.controls.designtype.setValue(matchedItem2.DESIGN_DESCRIPTION);
            this.jobCardFrom.controls.color.setValue(matchedItem2.COLOR);
            this.jobCardFrom.controls.karat.setValue(matchedItem2.KARAT_CODE);
            this.jobCardFrom.controls.subcat.setValue(matchedItem2.SUBCATEGORY_CODE);
            this.jobCardFrom.controls.prefix.setValue(matchedItem2.JOB_PREFIX);
            this.jobCardFrom.controls.brand.setValue(matchedItem2.BRAND_CODE);
            this.jobCardFrom.controls.jobtype.setValue(matchedItem2.DESIGN_TYPE);
            this.jobCardFrom.controls.type.setValue(matchedItem2.TYPE_CODE);
            this.jobCardFrom.controls.purity.setValue(matchedItem2.PURITY);
            this.getDesigncode()
          }
        } else {
          this.handleLookupError(FORMNAME, LOOKUPDATA);
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  handleLookupError(FORMNAME: string, LOOKUPDATA: MasterSearchModel) {
    this.commonService.toastErrorByMsgId('MSG1531');
    this.jobCardFrom.controls[FORMNAME].setValue('');
    LOOKUPDATA.SEARCH_VALUE = '';
    if (FORMNAME === 'designcode') {
      this.jobCardFrom.controls.designtype.setValue('');
    }
  }

  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }


  SPvalidateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (FORMNAME == 'comments') {
      console.log(FORMNAME)
      this.setFromProcessWhereCondition()
    }

    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      "PAGENO": LOOKUPDATA.PAGENO,
      "RECORDS": LOOKUPDATA.RECORDS,
      "LOOKUPID": LOOKUPDATA.LOOKUPID,
      "ORDER_TYPE": 0,
      "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
      "searchField": LOOKUPDATA.SEARCH_FIELD,
      "searchValue": LOOKUPDATA.SEARCH_VALUE
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = result.dynamicData[0]
        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE != '') {
            let result = this.commonService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE)
            if (result && result.length == 0) {
              this.commonService.toastErrorByMsgId('MSG1460')
              this.jobCardFrom.controls[FORMNAME].setValue('')
              LOOKUPDATA.SEARCH_VALUE = ''
            }
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG1460')
          this.jobCardFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  setFromProcessWhereCondition() {
    //${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}
    this.commentsCodeData.WHERECONDITION = `@strAcCode='${this.commonService.nullToString(this.jobCardFrom.value.comments)}'`

  }

  showOverleyPanel(event: any, formControlName: string) {
    if (event.target.value != '') return;

    switch (formControlName) {
      case 'orderType':
        this.overlayorderTypeSearch.showOverlayPanel(event);
        break;
      case 'designcode':
        this.overlaydesigncodeSearch.showOverlayPanel(event);
        break;
      case 'customer':
        this.overlaycustomerSearch.showOverlayPanel(event);
        break;
      case 'costcode':
        this.overlaycostcodeSearch.showOverlayPanel(event);
        break;
      case 'prefix':
        this.overlayprefixSearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.overlaykaratSearch.showOverlayPanel(event);
        break;
      case 'type':
        this.overlaytypeSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.overlaycategorySearch.showOverlayPanel(event);
        break;
      case 'subcat':
        this.overlaysubcatSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.overlaybrandSearch.showOverlayPanel(event);
        break;
      case 'country':
        this.overlaycountrySearch.showOverlayPanel(event);
        break;
      case 'comments':
        this.overlaycommentsSearch.showOverlayPanel(event);
        break;
      case 'size':
        this.overlaysizeSearch.showOverlayPanel(event);
        break;
      case 'length':
        this.overlaylengthSearch.showOverlayPanel(event);
        break;
      case 'salesman':
        this.overlaysalesmanSearch.showOverlayPanel(event);
        break;
      case 'currency':
        this.overlaycurrencySearch.showOverlayPanel(event);
        break;
      case 'mainmetal':
        this.overlaymainmetalSearch.showOverlayPanel(event);
        break;
      case 'time':
        this.overlaytimeSearch.showOverlayPanel(event);
        break;
      case 'range':
        this.overlayrangeSearch.showOverlayPanel(event);
        break;
      case 'seqcode':
        this.overlayseqcodeSearch.showOverlayPanel(event);
        break;
      default:

    }
  }


  // showOverleyPanel(event: any, formControlName: string) {
  //   if (event.target.value != '') return

  //   if (formControlName == 'orderType') {

  //     this.overlayorderTypeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'designcode') {
  //     this.overlaydesigncodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'customer') {
  //     this.overlaycustomerSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'costcode') {
  //     this.overlaycostcodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'prefix') {
  //     this.overlayprefixSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'karat') {
  //     this.overlaykaratSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'type') {
  //     this.overlaytypeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'category') {
  //     this.overlaycategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'subcat') {
  //     this.overlaysubcatSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'color') {
  //     this.overlaycolorearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'brand') {
  //     this.overlaybrandSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'country') {
  //     this.overlaycountrySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'comments') {
  //     this.overlaycommentsSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'size') {
  //     this.overlaysizeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'length') {
  //     this.overlaylengthSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'salesman') {
  //     this.overlaysalesmanSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'currency') {
  //     this.overlaycurrencySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'mainmetal') {
  //     this.overlaymainmetalSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'time') {
  //     this.overlaytimeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'range') {
  //     this.overlayrangeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'seqcode') {
  //     this.overlayseqcodeSearch.showOverlayPanel(event)
  //   }

  // }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
