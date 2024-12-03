import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-credit-sale-report',
  templateUrl: './credit-sale-report.component.html',
  styleUrls: ['./credit-sale-report.component.scss']
})
export class CreditSaleReportComponent implements OnInit {
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
  approvedbyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Approved By',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  creditSaleReportForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],

    customerCode: [''],
    customer: [''],
    approvedby: [''],
  

  });
  fetchedBranchData: any[] =[];
  @Input() content!: any; 
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  fetchedBranchDataParam: any= [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  isLoading: boolean = false;


  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private commonService: CommonServiceService,
    private datePipe: DatePipe, private dataService: SuntechAPIService, private toastr: ToastrService,
    
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.apiGridDataFetch();
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  apiGridDataFetch(){
    this.isLoading = true;
    const apiUrl = 'CreditSaleReport'
    let postData = {
      "frmDate": this.dateToPass.fromDate,
      "toDate": this.dateToPass.toDate,
      "brList": "",
      "vocType": "",
      "customer": this.creditSaleReportForm.controls.customer.value,
      "approvedBy": this.creditSaleReportForm.controls.approvedby.value,
      "crAccode": this.creditSaleReportForm.controls.customerCode.value
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


  customerCodeSelected(e: any) {
    this.creditSaleReportForm.controls.customerCode.setValue(e.ACCODE);
    this.creditSaleReportForm.controls.customer.setValue(e.ACCOUNT_HEAD);
  }

  ApprovedbyCodeSelected(e: any) {
    console.log(e);
    if (this.checkPriceCode()) return
    this.creditSaleReportForm.controls.approvedby.setValue(e.UsersName);
  }

  checkPriceCode(): boolean {
    if (this.creditSaleReportForm.value.pricecode == '') {
      this.commonService.toastErrorByMsgId('please enter pricecode')
      return true
    }
    return false
  }

  onCellPrepared(e: any) {
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
    }
  } 

  setDateValue(event: any){
    if(event.FromDate){
      this.creditSaleReportForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.creditSaleReportForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    this.apiGridDataFetch();
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.creditSaleReportForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.creditSaleReportForm.controls.templateName.setValue(null)
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
    this.creditSaleReportForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.creditSaleReportForm.controls.templateName.value)
  }
  saveTemplate_DB(){

  }

  previewClick(){
    
  }

  printBtnClick(){

  }


  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      //  this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.creditSaleReportForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!
      };
    }
  }

}
