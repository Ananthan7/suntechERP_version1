import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { settings } from 'cluster';
import { ToastrService } from 'ngx-toastr';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-daily-closing-summary-watch',
  templateUrl: './daily-closing-summary-watch.component.html',
  styleUrls: ['./daily-closing-summary-watch.component.scss']
})
export class DailyClosingSummaryWatchComponent implements OnInit {
  dailyClosingSummary_WatchForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],

    transactionValue: [''],
    groupBySelection: ['']
  

  });

  fetchedBranchData: any[] =[];
  @Input() content!: any; 
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  fetchedBranchDataParam: any= [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  pendingSalesOrderSummaryArr: any =[];
  transactionWiseSummaryArr: any =[];
  isLoading: boolean = false;

  TransactionValueArr: any = [
    {key: 0, value: 'Sales'},  {key: 1, value: 'Sales Returns'}, {key: 3, value: 'Net Sales'}
  ]
  groupByArr: any = [
    { value: 'Type'},  { value: 'Category'}, { value: 'Sub Category'}, { value: 'Brand'}, { value: 'Country'},
    { value: 'Design'}, { value: 'Stock Code'}, { value: 'Cost Code'}
  ]
  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private datePipe: DatePipe,
    private dataService: SuntechAPIService,  private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.apiGridDataFetch();
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  headerCellFormatting(e: any) {
    // to make grid header center aligned
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
    }
  } 

  setDateValue(event: any){
    if(event.FromDate){
      this.dailyClosingSummary_WatchForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.dailyClosingSummary_WatchForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    this.apiGridDataFetch();
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.dailyClosingSummary_WatchForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.dailyClosingSummary_WatchForm.controls.templateName.setValue(null)
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
    this.dailyClosingSummary_WatchForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  apiGridDataFetch(){
    this.isLoading = true;
    const apiUrl = 'POSDailyClosingSummaryWatch'
    let postData = {
      "frmDate":  this.dateToPass.fromDate,
      "toDate": this.dateToPass.toDate,
      "strBranch": this.dailyClosingSummary_WatchForm.controls.branch.value,
      "GrpBy": this.dailyClosingSummary_WatchForm.controls.groupBySelection.value,
      "transaction": 0,
      "companyCode": "BD0001"
    }
    this.dataService.postDynamicAPI(apiUrl, postData).subscribe((resp: any) => {
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

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.dailyClosingSummary_WatchForm.controls.templateName.value)
  }
  saveTemplate_DB(){

  }

  previewClick(){
    this.isLoading = true

    let postData = {
      "SPID": "",
      "parameter": {
        
      }
    }
    console.log(postData) 
    setTimeout(()=>{
      this.isLoading = false;
    }, 300)  
  }

  printBtnClick(){
    this.isLoading = true

    let postData = {
      "SPID": "",
      "parameter": {
        
      }
    }
    console.log(postData) 
    setTimeout(()=>{
      this.isLoading = false;
    }, 300)  
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      //  this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.dailyClosingSummary_WatchForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!
      };

      this.dailyClosingSummary_WatchForm.controls.transactionValue.setValue(this.TransactionValueArr[0].key);
      this.dailyClosingSummary_WatchForm.controls.groupBySelection.setValue(this.groupByArr[0].value)
    }
  }

}
