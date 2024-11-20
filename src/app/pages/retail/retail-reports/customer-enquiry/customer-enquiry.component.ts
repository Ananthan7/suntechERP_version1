import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { control } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-enquiry',
  templateUrl: './customer-enquiry.component.html',
  styleUrls: ['./customer-enquiry.component.scss']
})
export class CustomerEnquiryComponent implements OnInit {
  isLoading: boolean = false;
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };

  customerEnquiryForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromDate : [new Date()],
    toDate : [new Date()],

    Name: [''],
    Spouse: [''],
    Email: [''],
    customerfrom: [''],
    customerto: [''],
    birthMonth: [''],
    birthDate: [''],
    DOBValue:[new Date()],
    birthMonth2: [''],
    birthDate2: [''],
    DOBValue2: [new Date()],
    weddingMonth: [''],
    weddingDate: [''],
    WeddingDateValue: [new Date()],
    weddingMonth2: [''],
    WeddingDate2: [''],
    WeddingDateValue2: [new Date()],
    telephoneContact: [''],
    mobileContact: [''],
    MaritalStatusSelection: [''],
    GenderSelection: [''],
    country: [''],
    type: [''],
    nationality: [''],
    category: [''],
    city: [''],
    cust: [''],
    religion: [''],
    division: [''],
    state: [''],
    loyalty: [''],
    saleDateFrom: [''],
    dateTo: [''],
    showPicture : [false],
    outputTo: [''],


    templateName: ['']
  })
  currentDate: Date = new Date();
  maritalStatusArr = [
    { value: 'S', label: 'Single' },
    { value: 'M', label: 'Married' },
    { value: 'W', label: 'Widow' },
    { value: 'D', label: 'Divorced' }
  ];
  GridData: any = [];
  selectedRowKeys: any[] = [];
  showFilterRow: boolean = true;
  selectedDatas: any[]= [];
  VocTypeParam: any = [];
  popupVisible: boolean = false;
  htmlPreview: any;
  @Input() content!: any; 
  isDisableSaveBtn: boolean =false;
  templateNameHasValue: boolean= false;

  viewMode: boolean = false;
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
  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  nationalityCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Nationality",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='NATIONALITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Category Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  cityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'City Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='REGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  religionCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Religions",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='RELIGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };
  stateCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 27,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "State",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };
  customerTypeCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 29,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  LoyaltyMasterFindData: MasterSearchModel = {
    VIEW_INPUT: true,
    VIEW_ICON:false,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    API_VALUE: 'LoyaltyCardMaster/GetLoyaltyCardMasterList'
  };
  LoyaltyMasterFindData_2: MasterSearchModel = {
    VIEW_INPUT: true,
    VIEW_ICON:false,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    API_VALUE: 'LoyaltyCardMaster/GetLoyaltyCardMaster/{CODE}'
  };
  loyaltyMasterSearch(event: any) {
    let SEARCH_VALUE = event.target.value;
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = `LoyaltyCardMaster/GetLoyaltyCardMaster/${SEARCH_VALUE}`;
    this.dataService.getDynamicAPI(API).subscribe((data) => {
      console.log(data)
    }, err => {
      this.commonService.toastErrorByMsgId('MSG2272')
    })
  }
  
  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, 
    private dataService: SuntechAPIService, private commonService: CommonServiceService, 
    private toastr: ToastrService, private sanitizer: DomSanitizer,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.prefillScreenValues();
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  
  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.customerEnquiryForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.customerEnquiryForm.controls.templateName.setValue(null)
    }
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

    this.formattedBranchDivisionData = branchDivisionData
    this.customerEnquiryForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  onDateChange(controlName: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const formattedDate = this.datePipe.transform(event.value, 'MMMM, d');

      if (typeof formattedDate === 'string') {
        const [month, day] = formattedDate.split(', ').map(part => part.trim());
        let shortMonthValue = this.getShortMonth(month);

        if(controlName == 'bdayPicker1'){
          this.customerEnquiryForm.controls.birthMonth.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.birthDate.setValue(day);
        }
        else if(controlName == 'bdayPicker2'){
          this.customerEnquiryForm.controls.birthMonth2.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.birthDate2.setValue(day);
        }
        else if(controlName == 'weddingDataPicker1'){
          this.customerEnquiryForm.controls.weddingMonth.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.weddingDate.setValue(day);
        }
        else if(controlName == 'weddingDayPicker2'){
          this.customerEnquiryForm.controls.weddingMonth2.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.WeddingDate2.setValue(day);
        }
      }
      else{
        console.log('no Formatted Date:', formattedDate);
      }
    }
  }
  getShortMonth(month: string): string {
    switch (month) {
        case 'January': return 'Jan';
        case 'February': return 'Feb';
        case 'March': return 'Mar';
        case 'April': return 'Apr';
        case 'May': return 'May';
        case 'June': return 'Jun';
        case 'July': return 'Jul';
        case 'August': return 'Aug';
        case 'September': return 'Sep';
        case 'October': return 'Oct';
        case 'November': return 'Nov';
        case 'December': return 'Dec';
        default: return month;
    }
  }

  onGridSelection(event: any) {
    this.selectedRowKeys= event.selectedRowKeys;
    this.selectedDatas = event.selectedRowsData;
    let vocTypeArr: any= []
    this.selectedDatas.forEach((item: any)=>{
      vocTypeArr.push(item.VOCTYPE+'#') 
    })
    const uniqueArray = [...new Set( vocTypeArr )];
    const plainText = uniqueArray.join('');
    this.VocTypeParam = plainText
  }

  customerSelection(){
    this.isLoading = true;
    let postData = {
      "SPID": "171",
      "parameter": {
        "NAME" : this.customerEnquiryForm.controls.Name.value,
        "SPOUSE" : this.customerEnquiryForm.controls.Spouse.value,
        "CODEFROM" : this.customerEnquiryForm.controls.customerfrom.value,
        "CODETO" : this.customerEnquiryForm.controls.customerto.value,
        "COUNTRY" : this.customerEnquiryForm.controls.country.value,
        "NATIONALITY" : this.customerEnquiryForm.controls.nationality.value,
        "CITY" : this.customerEnquiryForm.controls.city.value,
        "RELIGION" : this.customerEnquiryForm.controls.religion.value,
        "TYPE" : this.customerEnquiryForm.controls.type.value,
        "LOYALTYCODE" : this.customerEnquiryForm.controls.loyalty.value,
        "CATEGORY" : this.customerEnquiryForm.controls.category.value,
        "MARITALSTATUS" : this.customerEnquiryForm.controls.MaritalStatusSelection.value,
        "GENDER" : this.customerEnquiryForm.controls.GenderSelection.value,
        "MOBILE" : this.customerEnquiryForm.controls.mobileContact.value,
        "TELRES" : this.customerEnquiryForm.controls.telephoneContact.value,
        "EMAIL" : this.customerEnquiryForm.controls.Email.value,
        "BIRTHFROMDATE" : this.commonService.formatYYMMDD(this.customerEnquiryForm.controls.DOBValue.value),
        "BIRTHTODATE" : this.commonService.formatYYMMDD(this.customerEnquiryForm.controls.DOBValue2.value),
        "WEDDINGFROMDATE" : this.commonService.formatYYMMDD(this.customerEnquiryForm.controls.WeddingDateValue.value),
        "WEDDINGTODATE" : this.commonService.formatYYMMDD(this.customerEnquiryForm.controls.WeddingDateValue2.value),
        "STATE" : this.customerEnquiryForm.controls.state.value,
        "SALDATEFROM" : this.commonService.formatYYMMDD(this.customerEnquiryForm.controls.saleDateFrom.value),
        "SALDATETO" : this.commonService.formatYYMMDD(this.customerEnquiryForm.controls.dateTo.value),
        "DIVISION" : null, //this.customerEnquiryForm.controls.division.value,
        "BRANCHLIST": this.customerEnquiryForm.controls.branch.value,
        "USERBRANCH" : localStorage.getItem('userbranch')

        //Grid Data visibility
        // "NAME" : '',  
        // "SPOUSE" : null,  
        // "CODEFROM" : null,  
        // "CODETO" : null,   
        // "COUNTRY" : null,   
        // "NATIONALITY": null,  
        // "CITY" : null, 
        // "RELIGION" :null,   
        // "TYPE" : null,  
        // "LOYALTYCODE" : null,   
        // "CATEGORY" : null,  
        // "MARITALSTATUS" : null, 
        // "GENDER" : null,  
        // "MOBILE" : null,  
        // "TELRES" : null,   
        // "EMAIL" : null,  
        // "BIRTHFROMDATE" : null,  
        // "BIRTHTODATE" : null,   
        // "WEDDINGFROMDATE" : null,  
        // "WEDDINGTODATE" : null, 
        // "STATE" : null,   
        // "SALDATEFROM" : null,   
        // "SALDATETO" : null,   
        // "DIVISION" : null, 
        // "BRANCHLIST" : '',  
        // "USERBRANCH" : localStorage.getItem('userbranch')
      },
    }
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      this.GridData = result.dynamicData[0];

      if (result.dynamicData) {
        this.commonService.closeSnackBarMsg();
      }
      this.isLoading = false;
    },
    (err) => {
      this.toastr.error(err.message || 'An error occurred while fetching the data.');
      this.isLoading = false;
    });  
  }


  customerCodeSelected(e: any) {
    this.customerEnquiryForm.controls.customerfrom.setValue(e.ACCODE);
    this.customerEnquiryForm.controls.customerto.setValue(e.ACCOUNT_HEAD);
  }

  countryCodeSelected(e:any){
    this.customerEnquiryForm.controls.country.setValue(e.CODE);
  }

  nationalitySelected(e: any) {
    this.customerEnquiryForm.controls.nationality.setValue(e.CODE);
  }

  categorySelected(value: any) {
    this.customerEnquiryForm.controls.category.setValue(value.CODE);
  }

  citySelected(e: any) {
    this.customerEnquiryForm.controls.city.setValue(e.CODE);
  }

  religionSelected(e: any){
    this.customerEnquiryForm.controls.religion.setValue(e.CODE);
  }

  stateSelected(e: any){
    this.customerEnquiryForm.controls.state.setValue(e.CODE);
  }

  customerTypeSelected(e: any){
    this.customerEnquiryForm.controls.type.setValue(e.CODE);
  }

  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  saveTemplate(){
    this.popupVisible = true;
  }
  saveTemplate_DB(){
    let postData = this.switchOutputTo(this.customerEnquiryForm.controls.outputTo.value)
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'INSERT',
        "CONTROLS": JSON.stringify({
            "CONTROL_HEADER": {
              "USERNAME": localStorage.getItem('username'),
              "TEMPLATEID": this.commonService.getModuleName(),
              "TEMPLATENAME": this.customerEnquiryForm.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              postData
            }
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

  switchOutputTo(outputToValue: any){
    let logData =  {
      "VOCTYPE": this.commonService.getqueryParamVocType() || "",
      "REFMID": "",
      "USERNAME": this.commonService.userName,
      "MODE": "",
      "DATETIME": this.commonService.formatDateTime(new Date()),
      "REMARKS":"",
      "SYSTEMNAME": "",
      "BRANCHCODE": this.commonService.branchCode,
      "VOCNO": "",
      "VOCDATE": "",
      "YEARMONTH" : this.commonService.yearSelected
    }
    let payloadData;
    switch (outputToValue) {
      case 'Customer Log':
        payloadData = {
          "SPID": "163",
          "parameter": {
            "USP_ID" : '',
            "STRBRANCHES" : this.customerEnquiryForm.controls.branch.value,
            "STRDATEFROM" : this.datePipe.transform(this.customerEnquiryForm.controls.saleDateFrom.value, 'yyyy-MM-dd'),
            "STRDATETO" : this.datePipe.transform(this.customerEnquiryForm.controls.dateTo.value, 'yyyy-MM-dd'),
            "LOGDATA" : logData,
            "USERBRANCH" : localStorage.getItem('userbranch'),
          }  
        };
      break;  

      case 'Sales Register':
        this.isLoading = false;
        payloadData = {
          "SPID": "",
          "parameter": {
            "strCertCode ": ''    
          }  
        };
      break;

      case 'Address Label':
      this.isLoading = false; 
      payloadData = {
        "SPID": "",
        "parameter": {
          "strCertCode ": ''    
        }  
      };
      break;

      case 'Previlage Card':
        payloadData = {
          "SPID": "162",
          "parameter": {
            "strCertCode ": this.customerEnquiryForm.controls.customerfrom.value  //1344         
          }  
        };
      break;

      case 'Send Email':
      this.isLoading = false;
      payloadData = {
        "SPID": "",
        "parameter": {
          "strCertCode ": ''    
        }  
      };
      break;

      case 'Send Card':
      this.isLoading = false;
      payloadData = {
        "SPID": "",
        "parameter": {
          "strCertCode ": ''    
        }  
      };
      break;

      case 'Send SMS': 
      this.isLoading = false; 
      payloadData = {
        "SPID": "",
        "parameter": {
          "strCertCode ": ''    
        }  
      };
      break;
    }
    return payloadData;
  }
  previewClick() {
    this.isLoading = true;
    let postData = this.switchOutputTo(this.customerEnquiryForm.controls.outputTo.value)
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result);
      let data = result.dynamicData;
      let printContent = data[0][0].HTMLOUT;
      if (printContent && Object.keys(printContent).length > 0) {
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.commonService.closeSnackBarMsg();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.isLoading = false;
      } else {
        if(data[0][0].ERRORCODE == 1){
          Swal.fire('No Data!', data[0][0].ERRMSG, 'error');
          this.isLoading = false;
        }
        else{
          Swal.fire('No Data!', 'There is no data!', 'info');
          this.commonService.closeSnackBarMsg();
          this.isLoading = false;
        }
      }
    });      
  }

  printBtnClick(){
    this.isLoading = true;
    let postData = this.switchOutputTo(this.customerEnquiryForm.controls.outputTo.value)
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      let printContent = data[0][0].HTMLOUT;
      this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);

      if (result.dynamicData) {
        this.commonService.closeSnackBarMsg();
      }
    });  
   
    
    setTimeout(() => {
      const content = this.htmlPreview?.changingThisBreaksApplicationSecurity;
      
      let  userBranchDesc:any  = localStorage.getItem('BRANCH_PARAMETER')
      userBranchDesc = JSON.parse(userBranchDesc)

      if (content && Object.keys(content).length !== 0) {
        const modifiedContent = content.replace(/<title>.*?<\/title>/, `<title>${userBranchDesc.DESCRIPTION}</title>`);

        const printWindow = window.open('', '', 'height=600,width=1000');
        printWindow?.document.write(modifiedContent);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
        this.isLoading = false;
      } else {
        Swal.fire('No Data!', 'There is no data to print!', 'info');
        this.commonService.closeSnackBarMsg();
        this.isLoading = false;
        return
      }
    }, 3000); 
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = true;
      console.log('data to prefill', this.content)   
      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      // this.retailAdvanceReceiptRegisterForm.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      // var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
       
      // this.dateToPass = {
      //   fromDate:  paresedItem?.CONTROL_DETAIL.FrVocDate,
      //   toDate: paresedItem?.CONTROL_DETAIL.ToVocDate
      // };
      // this.dateToPass.fromDate? this.retailAdvanceReceiptRegisterForm.controls.fromDate.setValue(this.dateToPass.fromDate) : null
      // this.dateToPass.toDate? this.retailAdvanceReceiptRegisterForm.controls.toDate.setValue(this.dateToPass.toDate) : null

      // this.retailAdvanceReceiptRegisterForm.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.strBRANCHES);
      // this.fetchedBranchData= paresedItem?.CONTROL_DETAIL.strBRANCHES.split("#")
      // this.fetchedBranchDataParam = paresedItem?.CONTROL_DETAIL.strBRANCHES

    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.customerEnquiryForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")

      this.customerEnquiryForm.controls.MaritalStatusSelection.setValue(this.maritalStatusArr[0].value);
      this.customerEnquiryForm.controls.GenderSelection.setValue('M');
      this.customerEnquiryForm.controls.outputTo.setValue('Customer Log')

      const startDate_Year = new Date(new Date().getFullYear(), 0, 1);
      const endDate_Year = new Date(new Date().getFullYear(), 11, 31);
      this.customerEnquiryForm.controls.saleDateFrom.setValue(startDate_Year)
      this.customerEnquiryForm.controls.dateTo.setValue(endDate_Year)

    }
  }



  customizeSummaryContent = (data: any) => {
    // value separation handler from commonService
    return this.commonService.setCommaSerperatedNumber(data.value, 'THREE');
  };
  customizeContent = (data: any) => {
    // decimal point handler from commonService
    return this.commonService.decimalQuantityFormat(data.value, 'THREE');
  };
  customizeDateValue = (data: any) => {
    // decimal point handler from commonService
    return this.commonService.formatDDMMYY(data.value)
  };
}
