import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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


  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.prefillScreenValues();
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
  setDateValue(event: any){
    if(event.FromDate){
      this.dailyClosingSummary_WatchForm.controls.fromdate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.dailyClosingSummary_WatchForm.controls.todate.setValue(event.ToDate);
    }
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

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.dailyClosingSummary_WatchForm.controls.templateName.value)
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
      this.dailyClosingSummary_WatchForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };
    }
  }

}
