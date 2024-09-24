import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-retail-advance-receipt-register',
  templateUrl: './retail-advance-receipt-register.component.html',
  styleUrls: ['./retail-advance-receipt-register.component.scss']
})
export class RetailAdvanceReceiptRegisterComponent implements OnInit {

  toDateMaxDate = new Date();
  currentDate = new Date();
  branchOptions:any[] =[];
  branchCode?: String;
  // selected = 'all';
  selectedBranchCode = this.branchCode
  selected: string = 'all'; 
 
  public modeselect = this.branchCode;
  retailAdvanceReceiptRegisterForm: FormGroup = this.formBuilder.group({
    branch : [''],
    show : ['all'],
    fromDate : [new Date()],
    toDate : [new Date()],
    salesman : [''],
    salesmanCode : [''],
    reportTo : ['preview'],
    templateName: ['']
  })

  salesmanCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  salesmanSelected(e: any) {
    console.log(e);    
    this.retailAdvanceReceiptRegisterForm.controls.salesman.setValue(e.SALESPERSON_CODE);
    this.retailAdvanceReceiptRegisterForm.controls.salesmanCode.setValue(e.DESCRIPTION);
  }

  private cssFilePath = '/assets/scss/scheme_register_pdf.scss';
  // private cssFilePath = 'assets/scheme_register_pdf.scss';
  branchDivisionControls: any;
  popupVisible: boolean =false;
  @Input() content!: any; 
  templateNameHasValue: boolean= false;
  formattedBranchDivisionData: any;
  fetchedBranchDataParam: any[]= [];
  branchDivisionControlsTooltip: any;
  fetchedBranchData: any[] =[];
  isLoading: boolean = false;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private datePipe: DatePipe,
    private comService: CommonServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();

    this.branchCode = this.comService.branchCode;
    
    // const apiUrl = '/UseBranchNetMaster/ADMIN';
    //   let sub: Subscription = this.dataService.getDynamicAPI(apiUrl).subscribe((resp: any) => {
    //     if (resp.status == 'Success') {
    //       this.branchOptions = resp.response;
    //       // console.log(this.branchOptions);
    //     }
       
    //   });
  }

  toDateValitation(){
    if (this.retailAdvanceReceiptRegisterForm.value.fromDate > this.retailAdvanceReceiptRegisterForm.value.toDate) {
      alert('To Date cannot be less than From Date');
    }
  }

  savePdf() {
       
    console.log(this.retailAdvanceReceiptRegisterForm.value.branch);
    
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


  formatDateToYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    this.retailAdvanceReceiptRegisterForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  setValueFromCommon(event: any){
    this.retailAdvanceReceiptRegisterForm.controls.reportTo.setValue(event.value);
    console.log(this.retailAdvanceReceiptRegisterForm.controls.reportTo.value)
  }
  setDateValue(event: any){
    if(event.FromDate){
      this.retailAdvanceReceiptRegisterForm.controls.fromDate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.retailAdvanceReceiptRegisterForm.controls.toDate.setValue(event.ToDate);
      console.log(this.retailAdvanceReceiptRegisterForm)
      this.toDateValitation()
    }
  }

  previewClick() {
    console.log(this.retailAdvanceReceiptRegisterForm)
    let logData =  {
      "VOCTYPE": this.comService.getqueryParamVocType() || "",
      "REFMID": "",
      "USERNAME": this.comService.userName,
      "MODE": "PRINT",
      "DATETIME": this.comService.formatDateTime(new Date()),
      "REMARKS":"",
      "SYSTEMNAME": "",
      "BRANCHCODE": this.comService.branchCode,
      "VOCNO": "",
      "VOCDATE": "",
      "YEARMONTH" : this.comService.yearSelected
    }

    let postData = {
      "SPID": "0151",
      "parameter": {
        "strBRANCHES": this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "FrVocDate": this.retailAdvanceReceiptRegisterForm.controls.fromDate,
        "ToVocDate": this.retailAdvanceReceiptRegisterForm.controls.toDate,
        "Pending": this.retailAdvanceReceiptRegisterForm.controls.show,
        "Logdata": logData
      },
    }
    console.log(postData)  
    this.comService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result);
      let data = result.dynamicData;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const windowFeatures = `width=${width},height=${height},fullscreen=yes`;
      var WindowPrt = window.open(' ', ' ', windowFeatures);
      if (WindowPrt === null) {
        console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
        return;
      }
      let printContent = data[0][0].HTMLINPUT;
      WindowPrt.document.write(printContent);
      WindowPrt.document.close();
      WindowPrt.focus();  
      WindowPrt.onload = function () {
        if (WindowPrt && WindowPrt.document.head) {
          let styleElement = WindowPrt.document.createElement('style');
          styleElement.textContent = `
                      @page {
                          size: A5 landscape;
                      }
                      body {
                          margin: 0mm;
                      }
                  `;
          WindowPrt.document.head.appendChild(styleElement);

          setTimeout(() => {
            if (WindowPrt) {
              WindowPrt.print();
            } else {
              console.error('Print window was closed before printing could occur.');
            }
          }, 800);
        }
      };
      this.comService.closeSnackBarMsg()
    });      
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.retailAdvanceReceiptRegisterForm.controls.templateName.value)
  }
  saveTemplate_DB(){
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'INSERT',
        "CONTROLS": JSON.stringify({
            "CONTROL_HEADER": {
              "USERNAME": localStorage.getItem('username'),
              "TEMPLATEID": this.comService.getModuleName(),
              "TEMPLATENAME": this.retailAdvanceReceiptRegisterForm.controls.templateName.value,
              "FORM_NAME": this.comService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              
            }
        })
      }
    };
    this.comService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', payload)
    .subscribe((result: any) => {
      console.log(result);
      let data = result.dynamicData.map((item: any) => item[0].ERRORMESSAGE);
      let Notifdata = result.dynamicData.map((item: any) => item[0].ERRORCODE);
      if (Notifdata == 1) {
        this.comService.closeSnackBarMsg()
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

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.retailAdvanceReceiptRegisterForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.retailAdvanceReceiptRegisterForm.controls.templateName.setValue(null)
    }
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = true;
      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.retailAdvanceReceiptRegisterForm.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);

      this.dateToPass = {
        fromDate:  paresedItem?.CONTROL_DETAIL.STRFROMDATE,
        toDate: paresedItem?.CONTROL_DETAIL.STRTODATE
      };
      this.dateToPass.fromDate? this.retailAdvanceReceiptRegisterForm.controls.fromdate.setValue(this.dateToPass.fromDate) : null
      this.dateToPass.toDate? this.retailAdvanceReceiptRegisterForm.controls.todate.setValue(this.dateToPass.toDate) : null

      // this.loyaltyregisterFrom.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.STRBRANCHES);

      this.retailAdvanceReceiptRegisterForm.controls.customerfrom.setValue(paresedItem?.CONTROL_DETAIL.STRCUSTCODEFROM);
      this.retailAdvanceReceiptRegisterForm.controls.customerto.setValue(paresedItem?.CONTROL_DETAIL.STRCUSTCODETO);

      this.retailAdvanceReceiptRegisterForm.controls.pointsfrom.setValue(paresedItem?.CONTROL_DETAIL.STRPOINTSFROM);
      this.retailAdvanceReceiptRegisterForm.controls.pointsto.setValue(paresedItem?.CONTROL_DETAIL.STRPOINTSTO);

      this.retailAdvanceReceiptRegisterForm.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.STRBRANCHES);
      this.fetchedBranchData= paresedItem?.CONTROL_DETAIL.STRBRANCHES.split("#")
      this.fetchedBranchDataParam = paresedItem?.CONTROL_DETAIL.STRBRANCHES
    }
  }


}
