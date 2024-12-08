import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-retail-sales-karat-wise-profit',
  templateUrl: './retail-sales-karat-wise-profit.component.html',
  styleUrls: ['./retail-sales-karat-wise-profit.component.scss']
})
export class RetailSalesKaratWiseProfitComponent implements OnInit {

  columnhead:any[]=['Branch Code','Voc Type','Voc no','Karat Code','Pos Rate','Board Rate','Sales Gold Qty','Sales Gold Amount','Sales Gold Profit' ];

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

  constructor(
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
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

    this.prefillScreenValues()
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

  setDateValue(event: any){
    if(event.FromDate){
      this.RetailKaratWiseSaleForm.controls.fromdate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.RetailKaratWiseSaleForm.controls.todate.setValue(event.ToDate);
    }
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

  formatDateToYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
              "STRFROMDATE": this.formatDateToYYYYMMDD(this.RetailKaratWiseSaleForm.value.fromdate),             
              "STRTODATE": this.formatDateToYYYYMMDD(this.RetailKaratWiseSaleForm.value.todate),                  
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

  previewClick() {
    let postData = {
      "SPID": "153",
      "parameter": {
        "STRFROMDATE": this.formatDateToYYYYMMDD(this.RetailKaratWiseSaleForm.value.fromdate),             
	      "STRTODATE": this.formatDateToYYYYMMDD(this.RetailKaratWiseSaleForm.value.todate),                  
	      "BRANCHWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.BranchWise ?0 : 1) ,    
	      "INVOICEWISE": JSON.stringify(this.RetailKaratWiseSaleForm.value.InvoiceWise ?0 : 1),  
	      "LOGDATA": JSON.stringify(this.logDataParam) 
      }
    }
    console.log(postData)  
    this.commonService.showSnackBarMsg('MSG81447');
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
      let printContent = data[0][0].Column1;
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
      this.commonService.closeSnackBarMsg()
    });      
  }

  printBtnClick(){

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
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };
    }
  }

}
