import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-retail-sales-collection',
  templateUrl: './retail-sales-collection.component.html',
  styleUrls: ['./retail-sales-collection.component.scss']
})
export class RetailSalesCollectionComponent implements OnInit {
  private cssFilePath = '/assets/scss/scheme_register_pdf.scss';
  branchDivisionControls: any;
  tableData: any = [];
  isLoading: boolean = false;
  APIData: any[] = [];
  selectedKeys: any[] = [];
  selectedRowKeys: number[] = [];
  selectedDatas: any[]= [];
  currentFilter: any;
  showFilterRow: boolean = true;


  retailSalesCollection: FormGroup = this.formBuilder.group({
    branch : [''],
    fromDate : [new Date()],
    toDate : [new Date()],
    reportTo : ['preview'],
    showDateCheckbox: [false],
    showInvoiceCheckbox: [false],
    showSalesCheckbox: [false],
    showSalesReturnCheckbox: [false],
    showExbSalesCheckbox: [false],
    showExbSalesReturnCheckbox: [false],
    showAdvanceReceiptCheckbox: [false],
    showSalesRegisterCheckbox: [false],
    showOnlySummaryCheckbox: [false],
    landscapeFormat: [false],
    OutpuGridView: [false],

  })
  constructor(  private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private dataService: SuntechAPIService,  private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.getAPIData()
  }

  selectedData(data: any) {
    console.log(data)
    // let content= ``, content2 =``,  content3 =``, content4 =``
    let content = `Current Selected Branches:  \n`
    let content2 = `Current Selected Divisions:  \n`
    let content3 = `Current Selected Area:  \n`
    let content4 = `Current Selected B category:  \n`
    if(data.BranchData){
      // content = `Current Selected Branches:  \n`
      data.BranchData.forEach((Bdata: any)=>{
        content += Bdata.BRANCH_CODE ? `${Bdata.BRANCH_CODE}, ` : ''
      }) 
    }

    if(data.DivisionData){
      // content2 = `Current Selected Divisions:  \n`
      data.DivisionData.forEach((Ddata: any)=>{
        content2 += Ddata.DIVISION_CODE ? `${Ddata.DIVISION_CODE}, ` : ''
      }) 
    }

    if(data.AreaData){
      // content3 = `Current Selected Area:  \n`
      data.AreaData.forEach((Adata: any)=>{
        content3 += Adata.AREA_CODE ? `${Adata.AREA_CODE}, ` : ''
      }) 
    }

    if(data.BusinessCategData){
      // content4 = `Current Selected B category:  \n`
      data.BusinessCategData.forEach((BCdata: any)=>{
        content4 += BCdata.CATEGORY_CODE ? `${BCdata.CATEGORY_CODE}, ` : ''
      }) 
    }

    content = content.replace(/, $/, '');
    content2 = content2.replace(/, $/, '');
    content3 = content3.replace(/, $/, '');
    content4 = content4.replace(/, $/, '');
    this.branchDivisionControls = content +'\n'+content2 +'\n'+ content3 +'\n'+ content4
    // console.log(this.branchDivisionControls);
    this.retailSalesCollection.controls.branch.setValue(this.branchDivisionControls);
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.retailSalesCollection.controls.fromDate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.retailSalesCollection.controls.toDate.setValue(event.ToDate);
      console.log(this.retailSalesCollection)
      this.toDateValitation()
    }
  }

  toDateValitation(){
    if (this.retailSalesCollection.value.fromDate > this.retailSalesCollection.value.toDate) {
      alert('To Date cannot be less than From Date');
    }
  }

  setValueFromCommon(event: any){
    this.retailSalesCollection.controls.reportTo.setValue(event.value);
    console.log(this.retailSalesCollection.controls.reportTo.value)
  }

  savePdf() {
    console.log(this.retailSalesCollection)

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

  getAPIData() {
    
    const payload = {
      // strLoginBranch: localStorage.getItem('userbranch')
      "strReportName": "POS_COLLECTION_A",
      "strMainVouchers": "" , // this.comService.getqueryParamMainVocType(),
      "strExcludeVouchers": "",
      "strWhereCond": "",
      "strLoginBranch": "", //this.comService.branchCode
    };

    this.isLoading = true;

    this.dataService.postDynamicAPI('GetReportVouchers', payload).subscribe((response) => {
      this.isLoading = false;
      console.log('Rsales API call data', response);
      this.APIData = response.dynamicData[0] || [];
    },(error: any) => {
        console.error('Error occurred:', error);
    });
  }

  onGridSelection(event: any) {
    this.selectedRowKeys= event.selectedRowKeys;
    this.selectedDatas = event.selectedRowsData;
    console.log(this.selectedDatas)
  }

  saveTemplate(){

  }


}
