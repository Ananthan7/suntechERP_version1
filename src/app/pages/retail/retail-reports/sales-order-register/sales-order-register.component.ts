import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales-order-register',
  templateUrl: './sales-order-register.component.html',
  styleUrls: ['./sales-order-register.component.scss']
})
export class SalesOrderRegisterComponent implements OnInit {
  private cssFilePath = '/assets/scss/scheme_register_pdf.scss';
  salesOrderRegisterForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromDate : [new Date()],
    toDate : [new Date()],
    showValue: [0],
    typeValue: [''],
    posChkBox: [false],
    showDtlChkBox: [false],
    salesman: [''],
    comments: [''],
    karat: [''],
    purity: [''],


    templateName: ['']
  })
  formattedBranchDivisionData: any;
  fetchedBranchDataParam: any= [];
  branchDivisionControlsTooltip: any;
  fetchedBranchData: any[] =[];

  viewMode: boolean = false;
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
  mainmetalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Main Metal type',
    SEARCH_VALUE: '',
    WHERECONDITION: `kARAT_CODE = '${this.salesOrderRegisterForm.value.karat}' and PURITY = '${this.salesOrderRegisterForm.value.purity}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
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
  isDisableSaveBtn: boolean = false;
  editMode: boolean = false;
  private subscriptions: Subscription[] = [];
  jobMaterialBOQ: any = [];
  jobsalesorderdetailDJ: any = [];

  showValuesArr:any =[{label:'All', value: 0}, {label:'Pending', value: 1}, {label:'Finished', value: 2}, 
    {label:'Cancelled', value: 3}];
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  templateNameHasValue: boolean= false;
  isLoading: boolean = false;
  @Input() content!: any; 
  popupVisible: boolean =false;


  constructor( private activeModal: NgbActiveModal,  private formBuilder: FormBuilder, private datePipe: DatePipe,
    private dataService: SuntechAPIService, private toastr: ToastrService, private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.apiGridDataFetch();
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.salesOrderRegisterForm.controls.fromDate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.salesOrderRegisterForm.controls.toDate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    console.log('ssss')
    this.apiGridDataFetch();
  }

  selectedData(data: any) {
    console.log(data)
    // let content= ``, content2 =``,  content3 =``, content4 =``
    let content = `Current Selected Branches:  \n`
    let content2 = `Current Selected Divisions:  \n`
    let content3 = `Current Selected Area:  \n`
    let content4 = `Current Selected B category:  \n`
    let branchDivisionData = '';
    if(data.BranchData){
      // content = `Current Selected Branches:  \n`
      data.BranchData.forEach((Bdata: any)=>{
        branchDivisionData += Bdata.BRANCH_CODE+'#'
        content += Bdata.BRANCH_CODE ? `${Bdata.BRANCH_CODE}, ` : ''
      }) 
    }

    if(data.DivisionData){
      // content2 = `Current Selected Divisions:  \n`
      data.DivisionData.forEach((Ddata: any)=>{
        branchDivisionData += Ddata.DIVISION_CODE+'#'
        content2 += Ddata.DIVISION_CODE ? `${Ddata.DIVISION_CODE}, ` : ''
      }) 
    }

    if(data.AreaData){
      // content3 = `Current Selected Area:  \n`
      data.AreaData.forEach((Adata: any)=>{
        branchDivisionData += Adata.AREA_CODE+'#'
        content3 += Adata.AREA_CODE ? `${Adata.AREA_CODE}, ` : ''
      }) 
    }

    if(data.BusinessCategData){
      // content4 = `Current Selected B category:  \n`
      data.BusinessCategData.forEach((BCdata: any)=>{
        branchDivisionData += BCdata.CATEGORY_CODE+'#'
        content4 += BCdata.CATEGORY_CODE ? `${BCdata.CATEGORY_CODE}, ` : ''
      }) 
    }

    content = content.replace(/, $/, '');
    content2 = content2.replace(/, $/, '');
    content3 = content3.replace(/, $/, '');
    content4 = content4.replace(/, $/, '');
    this.branchDivisionControlsTooltip = content +'\n'+content2 +'\n'+ content3 +'\n'+ content4


    // const uniqueArray = [...new Set(this.branchDivisionData)];
    // const plainText = uniqueArray.join('');
    this.formattedBranchDivisionData = branchDivisionData
    this.salesOrderRegisterForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  checkboxChange(value: boolean, data: any){
    console.log(value, data)
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.salesOrderRegisterForm.controls.templateName.value)
  }
  saveTemplate_DB(){
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'INSERT',
        "CONTROLS": JSON.stringify({
            // "CONTROL_HEADER": {
            //   "USERNAME": localStorage.getItem('username'),
            //   "TEMPLATEID": this.comService.getModuleName(),
            //   "TEMPLATENAME": this.retailSalesCollection.controls.templateName.value,
            //   "FORM_NAME": this.comService.getModuleName(),
            //   "ISDEFAULT": 1
            // },
            // "CONTROL_DETAIL": {
            //   "STRBRANCHCODES": this.formattedBranchDivisionData,
            //   "STRVOCTYPES": this.VocTypeParam,
            //   "FROMVOCDATE": this.formatDateToYYYYMMDD(this.retailSalesCollection.value.fromDate),
            //   "TOVOCDATE": this.formatDateToYYYYMMDD(this.retailSalesCollection.value.toDate),
            //   "USERBRANCH": localStorage.getItem('userbranch'),
            //   "USERNAME": localStorage.getItem('username'),
            //   "SHOWDATE": this.retailSalesCollection.value.showDateCheckbox ? 0 : 1,
            //   "SHOWINVOICE": this.retailSalesCollection.value.showInvoiceCheckbox ? 0 : 1
            // }
         })
      }
    };

    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', payload)
    .subscribe((result: any) => {
      console.log(result);
      let data = result.dynamicData.map((item: any) => item[0].ERRORMESSAGE);
      let Notifdata = result.dynamicData.map((item: any) => item[0].ERRORCODE);
      if (Notifdata == 1) {
        this.commonService.closeSnackBarMsg()
        Swal.fire({
          title: data || 'Success',
          text: '',
          icon: 'success',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        })
        this.popupVisible = false;
        this.activeModal.close(data);
      }
      else {
        this.toastr.error(Notifdata)
      }
    }); 
  }

  apiGridDataFetch(){
    this.isLoading = true;
    const apiUrl = 'SalesOrderRegister'
    let postData = {
      "brList": this.salesOrderRegisterForm.controls.branch.value, 
      "show": this.salesOrderRegisterForm.controls.showValue.value,
      "type": this.salesOrderRegisterForm.controls.typeValue.value,
      "isShowDetails": this.salesOrderRegisterForm.controls.showDtlChkBox.value,
      "isPosDetails": this.salesOrderRegisterForm.controls.posChkBox.value,
      "frmDate":  this.dateToPass.fromDate,
      "toDate": this.dateToPass.toDate,
    }
    this.dataService.postDynamicAPI(apiUrl, postData).pipe( 
      catchError((error) => {
       this.toastr.error('An error occurred while processing the request');
       this.isLoading = false;
       return [];
     }),
    ).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        console.log( resp )
        this.isLoading = false;
        this.toastr.success(resp.status);
      }
      else{
        this.isLoading = false;
        this.toastr.error(resp.message);
      }
    });    
  }






  savePdf() {
    const printContent: any = document.getElementById('pdf_container');
    var WindowPrt: any = window.open(
      '',
      '_blank',
      // `height=${window.innerHeight / 1.5}, width=${window.innerWidth / 1.5}`
    );
    WindowPrt.document.write(
      '<html><head><title>SunTech - POS ' +
      new Date().toISOString() +
      '</title></head><body><div>'
    );
    const linkElement = WindowPrt.document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    linkElement.setAttribute('href', this.cssFilePath);
    WindowPrt.document.head.appendChild(linkElement);

    const bootstrapPdfLinkElement = WindowPrt.document.createElement('link');
    bootstrapPdfLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapPdfLinkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-print-css/css/bootstrap-print.min.css');
    bootstrapPdfLinkElement.setAttribute('media', 'print');
    WindowPrt.document.head.appendChild(bootstrapPdfLinkElement);

    const bootstrapLinkElement = WindowPrt.document.createElement('link');
    bootstrapLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapLinkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css');
    bootstrapLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapLinkElement.setAttribute('integrity', 'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC');
    bootstrapLinkElement.setAttribute('crossorigin', 'anonymous');
    WindowPrt.document.head.appendChild(bootstrapLinkElement);

    const bootstrapScriptLinkElement = WindowPrt.document.createElement('script');
    bootstrapScriptLinkElement.setAttribute('src', 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js');
    bootstrapScriptLinkElement.setAttribute('integrity', 'sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM');
    bootstrapScriptLinkElement.setAttribute('crossorigin', 'anonymous');
    WindowPrt.document.head.appendChild(bootstrapScriptLinkElement);

    const fontFamilyLinkElement = WindowPrt.document.createElement('link');
    fontFamilyLinkElement.setAttribute('rel', 'preconnect');
    fontFamilyLinkElement.setAttribute('href', 'https://fonts.googleapis.com');
    WindowPrt.document.head.appendChild(fontFamilyLinkElement);

    const fontFamilyLinkTwoElement = WindowPrt.document.createElement('link');
    fontFamilyLinkTwoElement.setAttribute('rel', 'preconnect');
    fontFamilyLinkTwoElement.setAttribute('href', 'https://fonts.gstatic.com');
    fontFamilyLinkTwoElement.setAttribute('crossorigin','');
    WindowPrt.document.head.appendChild(fontFamilyLinkTwoElement);

    const fontFamilyLinkThreeElement = WindowPrt.document.createElement('link');
    fontFamilyLinkThreeElement.setAttribute('rel', 'stylesheet');
    fontFamilyLinkThreeElement.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    WindowPrt.document.head.appendChild(fontFamilyLinkThreeElement);
 
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.write('</div></body></html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
    }, 800);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  salesmanCodeSelected(e: any) {
    this.salesOrderRegisterForm.controls.salesman.setValue(e.SALESPERSON_CODE);
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

  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
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
          console.log( this.commonService.toastErrorByMsgId('MSG1531'));
          this.salesOrderRegisterForm.controls[FORMNAME].setValue('');
          this.salesOrderRegisterForm.controls.customername.setValue('');
          this.salesOrderRegisterForm.controls.designtype.setValue('');
          // this.renderer.selectRootElement(FORMNAME).focus();
          LOOKUPDATA.SEARCH_VALUE = '';
          // if (alertMsg == null || alertMsg == undefined ) {
          //   return "NOT FOUND";
          // }
          return this.ErrorMessageFounder(alertMsg) && console.log("data and error message fetched succesdsfully");
        }

        if (data == '') {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.salesOrderRegisterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''

          if (FORMNAME === 'customer') {
            console.log(FORMNAME)
            this.salesOrderRegisterForm.controls.customername.setValue('');
          }
          if (FORMNAME === 'comments') {
            console.log(FORMNAME)
            this.salesOrderRegisterForm.controls.comments.setValue('');
          }
          return
        }

        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.salesOrderRegisterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'comments') {
            console.log(FORMNAME)
            this.salesOrderRegisterForm.controls.comments.setValue('');
          }
          return
        }

        const matchedItem2 = data.find((item: any) => item.DESIGN_CODE.toUpperCase() === inputValue);
        console.log(matchedItem2,'data')
        if (matchedItem2) {
          this.salesOrderRegisterForm.controls[FORMNAME].setValue(matchedItem2.DESIGN_CODE);
          if (FORMNAME === 'designcode') {
            this.salesOrderRegisterForm.controls.designtype.setValue(matchedItem2.DESIGN_DESCRIPTION);
            this.salesOrderRegisterForm.controls.color.setValue(matchedItem2.COLOR);
            this.salesOrderRegisterForm.controls.karat.setValue(matchedItem2.KARAT_CODE);
            this.salesOrderRegisterForm.controls.subcat.setValue(matchedItem2.SUBCATEGORY_CODE);
            this.salesOrderRegisterForm.controls.prefix.setValue(matchedItem2.JOB_PREFIX);
            this.salesOrderRegisterForm.controls.brand.setValue(matchedItem2.BRAND_CODE);
            this.salesOrderRegisterForm.controls.jobtype.setValue(matchedItem2.DESIGN_TYPE);
            this.salesOrderRegisterForm.controls.type.setValue(matchedItem2.TYPE_CODE);
            this.salesOrderRegisterForm.controls.purity.setValue(matchedItem2.PURITY);
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
    this.salesOrderRegisterForm.controls[FORMNAME].setValue('');
    LOOKUPDATA.SEARCH_VALUE = '';
    if (FORMNAME === 'designcode') {
      this.salesOrderRegisterForm.controls.designtype.setValue('');
    }
  }

  setFromProcessWhereCondition() {
    //${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}
    this.commentsCodeData.WHERECONDITION =`@strAcCode='${this.commonService.nullToString(this.salesOrderRegisterForm.value.comments)}'`
    
  }

  ErrorMessageFounder(alertMsg : any) {
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

  getDesigncode() {
    let API = 'DesignMaster/GetDesignMasterDetails/' + this.salesOrderRegisterForm.value.designcode;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        let formattedPurity = parseFloat(result.response.PURITY).toFixed(6);
        console.log(result.response,'data')
        this.salesOrderRegisterForm.controls['purity'].setValue(formattedPurity);
        this.salesOrderRegisterForm.controls['color'].setValue(result.response.COLOR);
        this.salesOrderRegisterForm.controls['karat'].setValue(result.response.KARAT_CODE);
        this.salesOrderRegisterForm.controls['subcat'].setValue(result.response.SUBCATEGORY_CODE);
        this.salesOrderRegisterForm.controls['prefix'].setValue(result.response.JOB_PREFIX);
        this.salesOrderRegisterForm.controls['brand'].setValue(result.response.BRAND_CODE);
        this.salesOrderRegisterForm.controls['jobtype'].setValue(result.response.DESIGN_TYPE);
        this.salesOrderRegisterForm.controls['type'].setValue(result.response.TYPE_CODE);
        this.salesOrderRegisterForm.controls['costcode'].setValue(result.response.COST_CODE);
        this.salesOrderRegisterForm.controls['seqcode'].setValue(result.response.SEQ_CODE);
        this.salesOrderRegisterForm.controls['category'].setValue(result.response.CATEGORY_CODE);
        this.salesOrderRegisterForm.controls['setref'].setValue(result.response.SET_REF);
        console.log(result.response.PICTURE_NAME,'picyure')
        this.salesOrderRegisterForm.controls['picture_name'].setValue(result.response.PICTURE_NAME);
     

        this.mainmetalCodeData.WHERECONDITION = `kARAT_CODE = '${this.salesOrderRegisterForm.value.karat}' and PURITY = '${this.salesOrderRegisterForm.value.purity}'`;
        // this.tableData[0].Pcs = result.response.PCS;
        // this.tableData[0].metal_color = result.response.COLOR;
        // this.tableData[0].metal_wt = result.response.METAL_WT;
        // this.tableData[0].stone_wt = result.response.STONE_WT;
        // this.tableData[0].gross_wt = result.response.GROSS_WT;

        // Get the first object from DESIGN_STNMTL_DETAIL array

        const firstDetail = result.response.DESIGN_STNMTL_DETAIL;
        if (firstDetail) {
          firstDetail.forEach((element: any) => {
            let obj =
            {
              SRNO: element.SRNO,
              JOB_NUMBER: String(this.salesOrderRegisterForm.value.jobno) + '/' + element.SRNO,
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
        //        JOB_NUMBER: String(this.salesOrderRegisterForm.value.jobno) + '/' + element.SRNO,
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
              JOB_NUMBER: `${this.salesOrderRegisterForm.value.jobno}/${index + 1}`,
              JOB_DATE: new Date().toISOString(),
              JOB_SO_NUMBER: 0,
              UNQ_JOB_ID: String(this.salesOrderRegisterForm.value.jobno),
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

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.salesOrderRegisterForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.salesOrderRegisterForm.controls.templateName.setValue(null)
    }
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = true;

      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.salesOrderRegisterForm.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
      console.log('parsed data', paresedItem)
      this.dateToPass = {
        fromDate:  paresedItem?.CONTROL_DETAIL.STRFROMDATE,
        toDate: paresedItem?.CONTROL_DETAIL.STRTODATE
      };
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.salesOrderRegisterForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = { 
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };
    }
  }



}
