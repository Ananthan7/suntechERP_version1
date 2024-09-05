import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-retail-sales-collection',
  templateUrl: './retail-sales-collection.component.html',
  styleUrls: ['./retail-sales-collection.component.scss']
})
export class RetailSalesCollectionComponent implements OnInit {
  private cssFilePath = '/assets/scss/scheme_register_pdf.scss';
  branchDivisionControlsTooltip: any;
  tableData: any = [];
  isLoading: boolean = false;
  APIData: any[] = [];
  selectedRowKeys: number[] = [];
  selectedDatas: any[]= [];
  currentFilter: any;
  showFilterRow: boolean = true;
  popupVisible: boolean = false;
  branchDivisionData: any[] = [];
  formattedBranchDivisionData: any;
  VocTypeParam: any = [];

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
    private commonService: CommonServiceService,
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
        this.branchDivisionData.push(Bdata.BRANCH_CODE+'#')
        content += Bdata.BRANCH_CODE ? `${Bdata.BRANCH_CODE}, ` : ''
      }) 
    }

    if(data.DivisionData){
      // content2 = `Current Selected Divisions:  \n`
      data.DivisionData.forEach((Ddata: any)=>{
        this.branchDivisionData.push(Ddata.DIVISION_CODE+'#')
        content2 += Ddata.DIVISION_CODE ? `${Ddata.DIVISION_CODE}, ` : ''
      }) 
    }

    if(data.AreaData){
      // content3 = `Current Selected Area:  \n`
      data.AreaData.forEach((Adata: any)=>{
        this.branchDivisionData.push(Adata.AREA_CODE+'#')
        content3 += Adata.AREA_CODE ? `${Adata.AREA_CODE}, ` : ''
      }) 
    }

    if(data.BusinessCategData){
      // content4 = `Current Selected B category:  \n`
      data.BusinessCategData.forEach((BCdata: any)=>{
        this.branchDivisionData.push(BCdata.CATEGORY_CODE+'#')
        content4 += BCdata.CATEGORY_CODE ? `${BCdata.CATEGORY_CODE}, ` : ''
      }) 
    }

    content = content.replace(/, $/, '');
    content2 = content2.replace(/, $/, '');
    content3 = content3.replace(/, $/, '');
    content4 = content4.replace(/, $/, '');
    this.branchDivisionControlsTooltip = content +'\n'+content2 +'\n'+ content3 +'\n'+ content4
    this.retailSalesCollection.controls.branch.setValue(this.branchDivisionControlsTooltip);

    const uniqueArray = [...new Set(this.branchDivisionData)];
    const plainText = uniqueArray.join('');
    this.formattedBranchDivisionData = plainText
 
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

  formatDateToYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  okClick() {
    let postData = {
      "SPID": "0114",
      "parameter": {
          "STRBRANCHCODES": this.formattedBranchDivisionData,
          "STRVOCTYPES": this.VocTypeParam, //this.commonService.getqueryParamVocType(),
          "FROMVOCDATE": this.formatDateToYYYYMMDD(this.retailSalesCollection.value.fromDate),
          "TOVOCDATE": this.formatDateToYYYYMMDD(this.retailSalesCollection.value.toDate),
          "flag": '',
          "USERBRANCH": localStorage.getItem('userbranch'),
          "USERNAME": localStorage.getItem('username')
      }
    }
    console.log(postData)  
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result);
      let data = result.dynamicData;
      var WindowPrt = window.open(' ', ' ', 'width=900px, height=800px');
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
    });      
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
      console.log('Rsales API call data', response);
      this.APIData = response.dynamicData[0] || [];
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },(error: any) => {
      console.error('Error occurred:', error);
      this.isLoading = false;
    });
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

  saveTemplate(){
    this.popupVisible = true;
  }
  popupClosed(){
    this.popupVisible = false;
  }

}
