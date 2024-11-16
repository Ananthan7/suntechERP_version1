import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

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
  selectedRowKeys: any[] = [];
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
    templateName: ['']
  })

  @Input() content: any = {}; //get data from retailREPORT Component- modalRef instance
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  templateNameHasValue: boolean= false;
  @Input() reportVouchers: any; //get Voucherdata from retailREPORT Component- GetReportVouchers API
  voucherData = localStorage.getItem('strMainVouchers');

  htmlPreview: any;
  previewpopup: boolean = false;
  outputInGridBoolean: boolean = false;
  outputGridDataSource: any;
  OutputGridColumns: any;
  
  constructor(  private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private dataService: SuntechAPIService,  private comService: CommonServiceService,
    private commonService: CommonServiceService,   private toastr: ToastrService, private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // console.log('data from report component',this.reportVouchers)
    this.prefillScreenValues();
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
    this.retailSalesCollection.controls.branch.setValue(this.formattedBranchDivisionData);
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

  // getAPIData(data?: any) {
  //   let payload: any
  //   if(data){
  //     payload = {
  //       "strReportName": "POS_COLLECTION_A",
  //       "strMainVouchers": this.voucherData,
  //       "strExcludeVouchers": "",
  //       "strWhereCond": "",
  //       "strLoginBranch": "", //this.comService.branchCode
  //     };
  //   } else{
  //     payload = {
  //       "strReportName": "POS_COLLECTION_A",
  //       "strMainVouchers": this.voucherData,
  //       "strExcludeVouchers": "",
  //       "strWhereCond": "",
  //       "strLoginBranch": "", //this.comService.branchCode
  //     };
  //   }
  //   this.isLoading = true;
  //   this.dataService.postDynamicAPI('GetReportVouchers', payload).subscribe((response) => {
  //     console.log('Retailsales API call data', response);
  //     this.APIData = response.dynamicData[0] || [];
  //     this.prefillScreenValues()
  //     setTimeout(() => {
  //       this.isLoading = false;
  //     }, 1000);
  //   },(error: any) => {
  //     console.error('Error occurred:', error);
  //     this.isLoading = false;
  //   });
  // }

  onSalesCheckboxChange(value: boolean){
    if(value){
      const salesData = this.reportVouchers.filter((item: any) => {
        return item.MAIN_VOCTYPE === 'POS' || item.MAIN_VOCTYPE === 'RIN';
      });
      this.APIData = [...salesData, ...this.APIData]
      this.selectedRowKeys = [...salesData, ...this.selectedRowKeys]
    }
    else{
      this.APIData = this.APIData.filter((item: any) => {
        return item.MAIN_VOCTYPE !== 'POS' && item.MAIN_VOCTYPE !== 'RIN';
      });
    }
  }
  onSalesReturnCheckboxChange(value: boolean){
    if(value){
      const SalesReturnData = this.reportVouchers.filter((item: any) => {
        return item.MAIN_VOCTYPE === 'PSR'
      });
      this.APIData = [...SalesReturnData, ...this.APIData]
      this.selectedRowKeys = [...SalesReturnData, ...this.selectedRowKeys]
    }
    else{
      this.APIData = this.APIData.filter((item: any) => {
        return item.MAIN_VOCTYPE !== 'PSR'
      });
    }
  }
  onExbSalesCheckboxChange(value: boolean){
    if(value){
      const ExbSalesData = this.reportVouchers.filter((item: any) => {
        return item.MAIN_VOCTYPE === 'POSEX'
      });
      this.APIData = [...ExbSalesData, ...this.APIData]
      this.selectedRowKeys = [...ExbSalesData, ...this.selectedRowKeys]
    }
    else{
      this.APIData = this.APIData.filter((item: any) => {
        return item.MAIN_VOCTYPE !== 'POSEX'
      });
    }
  }
  onExbSalesReturnCheckboxChange(value: boolean){
    if(value){
      const ExbSalesReturnData = this.reportVouchers.filter((item: any) => {
        return item.MAIN_VOCTYPE === 'POSER'
      });
      this.APIData = [...ExbSalesReturnData, ...this.APIData]
      this.selectedRowKeys = [...ExbSalesReturnData, ...this.selectedRowKeys]
    }
    else{
      this.APIData = this.APIData.filter((item: any) => {
        return item.MAIN_VOCTYPE !== 'POSER'
      });
    }
  }
  onAdvanceReceiptCheckboxChange(value: boolean) {
    if(value){
      const AdvanceReceiptData = this.reportVouchers.filter((item: any) => {
        return item.MAIN_VOCTYPE === 'PCR'
      });
      this.APIData = [...AdvanceReceiptData, ...this.APIData]
      this.selectedRowKeys = [...AdvanceReceiptData, ...this.selectedRowKeys]
    }
    else{
      this.APIData = this.APIData.filter((item: any) => {
        return item.MAIN_VOCTYPE !== 'PCR'
      });
    }
  }
  onSalesRegisterCheckboxChange(value: boolean) {
    if(value){
      this.retailSalesCollection.controls.showSalesReturnCheckbox?.setValue(false);
      this.retailSalesCollection.controls.showExbSalesReturnCheckbox?.setValue(false);
      this.APIData = this.APIData.filter((item: any) => {
        return item.MAIN_VOCTYPE !== 'PSR' && item.MAIN_VOCTYPE !== 'POSER'
      });
    }
    else{
      this.retailSalesCollection.controls.showSalesReturnCheckbox?.setValue(true);
      this.retailSalesCollection.controls.showExbSalesReturnCheckbox?.setValue(true);
  
      const SalesRegisterData = this.reportVouchers.filter((item: any) => {
        return item.MAIN_VOCTYPE === 'POSER' || item.MAIN_VOCTYPE === 'PSR'
      });
      this.APIData = [...SalesRegisterData, ...this.APIData]
      this.selectedRowKeys = [...SalesRegisterData, ...this.selectedRowKeys]
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

  afterSave(value: any) {
    if (value) {
      this.retailSalesCollection.reset();
      this.tableData = [];
      this.close('reloadMainGrid');
    }
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.retailSalesCollection.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.retailSalesCollection.controls.templateName.setValue(null)
    }
  }




  prefillScreenValues(){ 
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = false;
      console.log('data fetched from main grid',this.content )
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON) //data from retailREPORT Component- modalRef instance
  
      this.retailSalesCollection.controls.showDateCheckbox?.setValue(
        ParcedPreFetchData?.CONTROL_DETAIL.SHOWDATE === 0 ? true :  false
      );
 
      this.retailSalesCollection.controls.showInvoiceCheckbox?.setValue(
       ParcedPreFetchData?.CONTROL_DETAIL.SHOWINVOICE === 0 ? true :  false
      );
 
      this.templateNameHasValue = !!ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME;
      this.retailSalesCollection.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
 
      this.dateToPass = {
        fromDate:  ParcedPreFetchData?.CONTROL_DETAIL.FROMVOCDATE,
        toDate: ParcedPreFetchData?.CONTROL_DETAIL.TOVOCDATE
      };


      let splittedText= ParcedPreFetchData?.CONTROL_DETAIL.STRVOCTYPES.split("#")  
      const selectedKeys = this.reportVouchers.filter((item: any) => splittedText?.includes(item.VOCTYPE)).map((item: any) => item);
      this.APIData = selectedKeys;
      this.selectedRowKeys = selectedKeys;
 
      this.APIData.forEach((item: any)=>{
        if(item.MAIN_VOCTYPE.includes('PCR') ){
          this.retailSalesCollection.controls.showAdvanceReceiptCheckbox.setValue(true);
        }
        else if(item.MAIN_VOCTYPE.includes('PSR') ){
          this.retailSalesCollection.controls.showSalesReturnCheckbox.setValue(true);
        }
        else if(item.MAIN_VOCTYPE.includes('POSEX') ){
          this.retailSalesCollection.controls.showExbSalesCheckbox.setValue(true);
        }
        else if(item.MAIN_VOCTYPE.includes('POSER') ){
          this.retailSalesCollection.controls.showExbSalesReturnCheckbox.setValue(true);
        }
        else if(item.MAIN_VOCTYPE.includes('POS','POSC','RIN') ){
          this.retailSalesCollection.controls.showSalesCheckbox.setValue(true);
        }    
      })
      
      // const selectedSet = new Set(this.selectedRowKeys.map(item => item.SRNO));
      // this.APIData.sort((a, b) => {
      //   const aIsSelected = selectedSet.has(a.SRNO) ? 1 : 0;
      //   const bIsSelected = selectedSet.has(b.SRNO) ? 1 : 0;
      //   return bIsSelected - aIsSelected;
      // });
      
      let vocTypeArr: any= []
      this.selectedRowKeys.forEach((item: any)=>{
        vocTypeArr.push(item.VOCTYPE+'#') 
      })
      const uniqueArray = [...new Set( vocTypeArr )];
      const plainText = uniqueArray.join('');
      this.VocTypeParam = plainText
 
  
      console.log(ParcedPreFetchData?.CONTROL_DETAIL.USERBRANCH)
      this.retailSalesCollection.controls.branch.setValue( ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCHCODES? 
        ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCHCODES : ParcedPreFetchData?.CONTROL_DETAIL.USERBRANCH+'#');
      this.fetchedBranchDataParam = ParcedPreFetchData?.CONTROL_DETAIL.USERBRANCH+'#'
      this.fetchedBranchData= ParcedPreFetchData?.CONTROL_DETAIL.USERBRANCH
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.retailSalesCollection.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };

      this.retailSalesCollection.controls.showDateCheckbox?.setValue(true);
      this.retailSalesCollection.controls.showInvoiceCheckbox?.setValue(true);

      this.retailSalesCollection.controls.showSalesCheckbox?.setValue(true);
      if(this.retailSalesCollection.controls.showSalesCheckbox.value == true){
        this.APIData = this.reportVouchers.filter((item: any) => {
          return item.MAIN_VOCTYPE === 'POS' || item.MAIN_VOCTYPE === 'RIN';
        });
      }
      this.retailSalesCollection.controls.showSalesReturnCheckbox?.setValue(true);
      if(this.retailSalesCollection.controls.showSalesReturnCheckbox.value == true){
        const psrData = this.reportVouchers.filter((item: any) => {
          return item.MAIN_VOCTYPE === 'PSR';
        });
        this.APIData = [...this.APIData, ...psrData];
      }
      this.retailSalesCollection.controls.showExbSalesCheckbox?.setValue(true);
      if(this.retailSalesCollection.controls.showExbSalesCheckbox.value == true){
        const posexData = this.reportVouchers.filter((item: any) => {
          return item.MAIN_VOCTYPE === 'POSEX';
        });
        this.APIData = [...this.APIData, ...posexData];
      }
      this.retailSalesCollection.controls.showExbSalesReturnCheckbox?.setValue(true);
      if(this.retailSalesCollection.controls.showExbSalesReturnCheckbox.value == true){
        const poserData = this.reportVouchers.filter((item: any) => {
          return item.MAIN_VOCTYPE === 'POSER';
        });
        this.APIData = [...this.APIData, ...poserData];
      }
      this.selectedRowKeys = this.APIData
 
      let vocTypeArr: any= []
      this.selectedRowKeys.forEach((item: any)=>{
        vocTypeArr.push(item.VOCTYPE+'#') 
      })
      const uniqueArray = [...new Set( vocTypeArr )];
      const plainText = uniqueArray.join('');
      this.VocTypeParam = plainText

    //   // let defaultVoctype = ['POS','RIN','PSR', 'POSC','POSEX','POSER', PCR]
    //   const selectedKeys = this.APIData.filter(item => item.MAIN_VOCTYPE!== 'PCR').map(item => item);
    //   this.selectedRowKeys = selectedKeys;
    //   const selectedSet = new Set(this.selectedRowKeys.map(item => item.SRNO));
    //   this.APIData.sort((a, b) => {
    //     const aIsSelected = selectedSet.has(a.SRNO) ? 1 : 0;
    //     const bIsSelected = selectedSet.has(b.SRNO) ? 1 : 0;
    //     return bIsSelected - aIsSelected;
    //   });
    }
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.retailSalesCollection.controls.templateName.value)
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
              "TEMPLATENAME": this.retailSalesCollection.controls.templateName.value,
              "FORM_NAME": this.comService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "STRBRANCHCODES": this.formattedBranchDivisionData,
              "STRVOCTYPES": this.VocTypeParam,
              "FROMVOCDATE": this.formatDateToYYYYMMDD(this.retailSalesCollection.value.fromDate),
              "TOVOCDATE": this.formatDateToYYYYMMDD(this.retailSalesCollection.value.toDate),
              "USERBRANCH": localStorage.getItem('userbranch'),
              "USERNAME": localStorage.getItem('username'),
              "SHOWDATE": this.retailSalesCollection.value.showDateCheckbox ? 0 : 1,
              "SHOWINVOICE": this.retailSalesCollection.value.showInvoiceCheckbox ? 0 : 1
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

  setDateValue(event: any){
    if(event.FromDate){
      this.retailSalesCollection.controls.fromDate.setValue(event.FromDate);
      this.dateToPass.fromDate = event.FromDate
    }
    else if(event.ToDate){
      this.retailSalesCollection.controls.toDate.setValue(event.ToDate);
      this.dateToPass.toDate = event.ToDate
      this.toDateValitation()
    }
  }

  formatDateToYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  previewClick() {
    this.isLoading = true;
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
      "SPID": "0114",
      "parameter": {
        "STRBRANCHCODES": this.retailSalesCollection.controls.branch.value,
        "STRVOCTYPES": this.VocTypeParam, //this.commonService.getqueryParamVocType(),
        "FROMVOCDATE": this.formatDateToYYYYMMDD(this.dateToPass.fromDate),
        "TOVOCDATE": this.formatDateToYYYYMMDD(this.dateToPass.toDate) ,
        "flag": this.retailSalesCollection.controls.OutpuGridView.value == true? 'GRID' : '',
        "USERBRANCH": localStorage.getItem('userbranch'),
        "USERNAME": localStorage.getItem('username'),
        "Logdata": JSON.stringify(logData)
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result);
      this.previewpopup = true;
      if(result.status != "Failed"){
        if(this.retailSalesCollection.controls.OutpuGridView.value == true){
          this.outputInGridBoolean = true;
          this.outputGridDataSource = result.dynamicData[0];

          this.OutputGridColumns = Object.keys(this.outputGridDataSource[0] || {}).map(key => {
            return {
              dataField: key,
              caption: key,
              width: key === 'Branch Name' ? 400 : 120,
              alignment: key === 'Branch Name' ? 'left' : key === 'Voc No' ? 'right' : 'center'
            };
          });
          this.isLoading = false;
        }
        else{
          this.outputInGridBoolean = false;
          let data = result.dynamicData;
          let printContent = data[0][0].HTMLINPUT;
          if (Object.keys(printContent).length === 0) {
            Swal.fire('No Data!', 'There is no data!', 'info');
            this.commonService.closeSnackBarMsg();
            this.isLoading = false;
            return
          } else {
            this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
            const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
            this.commonService.closeSnackBarMsg();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            this.isLoading = false;
          }
        }
      }
      else{
        this.toastr.error(result.message);
        this.isLoading = false;
        return
      }
    });      


    // this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    // .subscribe((result: any) => {
    //   console.log(result);
    //   let data = result.dynamicData;
    //   this.commonService.closeSnackBarMsg()
    //   var WindowPrt = window.open(' ', ' ', 'width=900px, height=800px');
    //   if (WindowPrt === null) {
    //     console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
    //     return;
    //   }
    //   let printContent = data[0][0].HTMLINPUT;
    //   WindowPrt.document.write(printContent);
    //   WindowPrt.document.close();
    //   WindowPrt.focus();  
    //   WindowPrt.onload = function () {
    //     if (WindowPrt && WindowPrt.document.head) {
    //       let styleElement = WindowPrt.document.createElement('style');
    //       styleElement.textContent = `
    //                   @page {
    //                       size: A5 landscape;
    //                   }
    //                   body {
    //                       margin: 0mm;
    //                   }
    //               `;
    //       WindowPrt.document.head.appendChild(styleElement);

    //       setTimeout(() => {
    //         if (WindowPrt) {
    //           WindowPrt.print();
    //         } else {
    //           console.error('Print window was closed before printing could occur.');
    //         }
    //       }, 800);
    //     }
    //   };
    // });   
  }
  
  printBtnClick(){
    this.isLoading = true;
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
      "SPID": "0114",
      "parameter": {
        "STRBRANCHCODES": this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "STRVOCTYPES": this.VocTypeParam, //this.commonService.getqueryParamVocType(),
        "FROMVOCDATE": this.formatDateToYYYYMMDD(this.dateToPass.fromDate),
        "TOVOCDATE": this.formatDateToYYYYMMDD(this.dateToPass.toDate) ,
        "flag": '',
        "USERBRANCH": localStorage.getItem('userbranch'),
        "USERNAME": localStorage.getItem('username'),
        "Logdata": JSON.stringify(logData)
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      let printContent = data[0][0].HTMLINPUT;
      this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);

      if (result.dynamicData) {
        this.commonService.closeSnackBarMsg();
        this.isLoading = false;
      }
    });  
   
    
    setTimeout(() => {
      const content = this.htmlPreview?.changingThisBreaksApplicationSecurity;
      
      let  userBranchDesc:any  = localStorage.getItem('BRANCH_PARAMETER')
      userBranchDesc = JSON.parse(userBranchDesc)

      if (content && Object.keys(content).length !== 0) {
        const modifiedContent = content.replace(/<title>.*?<\/title>/, `<title>${userBranchDesc.DESCRIPTION}</title>`);

        //          workout for binding title from 2nd sheet
        // const sections = content.match(/<div class="footer2">*?<\/div>/g); // Use the correct regex syntax
        // const pageCount = sections ? sections.length : 1; // Default to 1 if no sections found
        // console.log('Estimated Page content:', content);
        // console.log('Estimated Page Count:', pageCount);

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write(modifiedContent);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
        // printWindow?.close();
        this.isLoading = false;
      } else {
        Swal.fire('No Data!', 'There is no data to print!', 'info');
        this.commonService.closeSnackBarMsg();
        this.isLoading = false;
        return
      }
    }, 3000); 
  }

  onOutputInGridPopupHidden(){
    this.outputInGridBoolean = !this.outputInGridBoolean;
  }
}
