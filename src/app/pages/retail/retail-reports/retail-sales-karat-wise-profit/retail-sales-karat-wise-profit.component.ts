import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debug, error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-retail-sales-karat-wise-profit',
  templateUrl: './retail-sales-karat-wise-profit.component.html',
  styleUrls: ['./retail-sales-karat-wise-profit.component.scss']
})
export class RetailSalesKaratWiseProfitComponent implements OnInit {
  RetailKaratWiseSaleForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    BranchWise: [false],
    InvoiceWise: [false],
    templateName: ['']
  });
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  fetchedBranchData: any[] =[];
  
  @Input() content!: any; 
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  logDataParam: any;
  isLoading: boolean = false;

  fetchedBranchDataParam: any= [];
  SalesKaratWprofitArr: any = [];
  htmlPreview: any;

  constructor(
    private toastr: ToastrService, private commonService: CommonServiceService, private dataService: SuntechAPIService,
    private activeModal: NgbActiveModal, private modalService: NgbModal, private formBuilder: FormBuilder,
    private datePipe: DatePipe,  private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.logDataParam =  {
      "VOCTYPE": this.commonService.getqueryParamVocType() || "",
      "REFMID": "",
      "USERNAME": this.commonService.userName,
      "MODE": "PRINT",
      "DATETIME": this.commonService.formatDateTime(new Date()),
      "REMARKS":"",
      "SYSTEMNAME": "",
      "BRANCHCODE": this.commonService.branchCode,
      "VOCNO": "",
      "VOCDATE": "",
      "YEARMONTH" : this.commonService.yearSelected
    }
    this.prefillScreenValues();
    this.gridDataFetch();
  }

  headerCellFormatting(e: any) {
    // to make grid header center aligned
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
    }
  } 
chkboxBoolean: boolean = false;
  checkboxEvent(event: any, controlName: any){
    if (controlName === 'BranchWise') {
      this.RetailKaratWiseSaleForm.controls.BranchWise.setValue(event.checked);
    } else if (controlName === 'InvoiceWise') {
      this.RetailKaratWiseSaleForm.controls.InvoiceWise.setValue(event.checked);
    }

    if (this.RetailKaratWiseSaleForm.controls.BranchWise.value && this.RetailKaratWiseSaleForm.controls.InvoiceWise.value) {
      this.chkboxBoolean = true;
      this.gridDataFetch();
    } else if (!this.RetailKaratWiseSaleForm.controls.BranchWise.value && !this.RetailKaratWiseSaleForm.controls.InvoiceWise.value) {
      this.chkboxBoolean = false;
      this.gridDataFetch();
    }
  }

  gridDataFetch(){
    this.isLoading = true;
    let APIurl = 'RetailSalesKaratWiseProfit'
    let PostData = {
      "frmDate": this.dateToPass.fromDate,
      "toDate": this.dateToPass.toDate,
      "isBranchWise": this.RetailKaratWiseSaleForm.controls.BranchWise.value,
      "isInvoiceWise": this.RetailKaratWiseSaleForm.controls.InvoiceWise.value
    }

    this.dataService.postDynamicAPI(APIurl, PostData).pipe(
      catchError(error =>{
        this.toastr.error('An error occurred while processing the request');
        this.isLoading = false;
        return [];
      }),
    ).subscribe((response: any) => {
      console.log(response)
      if(response.status == 'Success'){
        if(response.dynamicData[0].length == 0){
          this.isLoading = false;
          this.toastr.warning('No data available !')
        }
        else{
          //this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT')
          this.SalesKaratWprofitArr = response.dynamicData[0];
          this.SalesKaratWprofitArr.forEach((item: any)=>{
            item.SALESGOLDAMOUNT = this.commonService.setCommaSerperatedNumber(item.SALESGOLDAMOUNT, 'AMOUNT')

            item.POS_RATE = this.commonService.setCommaSerperatedNumber(item.POS_RATE, 'AMOUNT')
            item.BOARD_RATE = this.commonService.setCommaSerperatedNumber(item.BOARD_RATE, 'AMOUNT')
            item.SALESGOLDQTY = this.commonService.setCommaSerperatedNumber(item.SALESGOLDQTY, 'AMOUNT')
            item.SALESGOLDAMOUNT = this.commonService.setCommaSerperatedNumber(item.SALESGOLDAMOUNT, 'AMOUNT')
            item.WSCOSTGOLDAMOUNT = this.commonService.setCommaSerperatedNumber(item.WSCOSTGOLDAMOUNT, 'AMOUNT')
            item.WSGPGOLDAMOUNT = this.commonService.setCommaSerperatedNumber(item.WSGPGOLDAMOUNT, 'AMOUNT')
          })
          this.isLoading = false;
          this.toastr.success(response.status || 'success')
        }
      }
      else{
        this.SalesKaratWprofitArr = [];
        this.isLoading = false;
        this.toastr.error(response.status)
      }
    })
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.RetailKaratWiseSaleForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.RetailKaratWiseSaleForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    this.gridDataFetch();
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.RetailKaratWiseSaleForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.RetailKaratWiseSaleForm.controls.templateName.setValue(null)
    }
  }

  formSubmit(){
    
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
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
    this.RetailKaratWiseSaleForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }


  saveTemplate(){
    this.popupVisible = true;
    console.log(this.RetailKaratWiseSaleForm.controls.templateName.value)
  }
  saveTemplate_DB(){
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'INSERT',
        "CONTROLS": JSON.stringify({
            "CONTROL_HEADER": {
              "USERNAME": localStorage.getItem('username'),
              "TEMPLATEID": this.commonService.getModuleName(),
              "TEMPLATENAME": this.RetailKaratWiseSaleForm.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "STRFROMDATE": this.datePipe.transform(this.RetailKaratWiseSaleForm.value.fromdate, 'yyyy-MM-dd'),             
              "STRTODATE": this.datePipe.transform(this.RetailKaratWiseSaleForm.value.todate, 'yyyy-MM-dd'),                  
              "BRANCHWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.BranchWise ?0 : 1) ,    
              "INVOICEWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.InvoiceWise ?0 : 1),  
              "LOGDATA": JSON.stringify(this.logDataParam) 
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
  previewClick(){
    this.isLoading = true;
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
    let postData = {
      "SPID": "153",
      "parameter": {
        "STRFROMDATE": this.datePipe.transform(this.RetailKaratWiseSaleForm.value.fromdate, 'yyyy-MM-dd'),             
	      "STRTODATE": this.datePipe.transform(this.RetailKaratWiseSaleForm.value.todate, 'yyyy-MM-dd'),                  
	      "BRANCHWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.BranchWise ?0 : 1) ,    
	      "INVOICEWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.InvoiceWise ?0 : 1),  
	      "LOGDATA": JSON.stringify(this.logDataParam) 
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result);
      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].Column1;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.commonService.closeSnackBarMsg();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.isLoading = false;
      }
      else{
        this.toastr.error(result.message);
        this.isLoading = false;
        return
      }
    });      
  }

  printBtnClick(){
    this.isLoading = true;
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
    let postData = {
      "SPID": "153",
      "parameter": {
        "STRFROMDATE": this.datePipe.transform(this.RetailKaratWiseSaleForm.value.fromdate, 'yyyy-MM-dd'),             
	      "STRTODATE": this.datePipe.transform(this.RetailKaratWiseSaleForm.value.todate, 'yyyy-MM-dd'),                  
	      "BRANCHWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.BranchWise ?0 : 1) ,    
	      "INVOICEWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.InvoiceWise ?0 : 1),  
	      "LOGDATA": JSON.stringify(this.logDataParam) 
      }
    }
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      let printContent = data[0][0].Column1;
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

        const printWindow = window.open('', '', 'height=600,width=800');
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

      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.RetailKaratWiseSaleForm.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
      console.log('parsed data', paresedItem)
      this.dateToPass = {
        fromDate:  paresedItem?.CONTROL_DETAIL.STRFROMDATE,
        toDate: paresedItem?.CONTROL_DETAIL.STRTODATE
      };

      const branchWiseValue= paresedItem.CONTROL_DETAIL.BRANCHWISE  === '0'?true:false;
      const invoiceWiseValue = paresedItem.CONTROL_DETAIL.INVOICEWISE === '0'?true:false;
      this.RetailKaratWiseSaleForm.controls.BranchWise.setValue(branchWiseValue);
      this.RetailKaratWiseSaleForm.controls.InvoiceWise.setValue(invoiceWiseValue);

    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.RetailKaratWiseSaleForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = { 
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };
    }
  }


  
}
function subscribe(arg0: (response: any) => void): import("rxjs").OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}

