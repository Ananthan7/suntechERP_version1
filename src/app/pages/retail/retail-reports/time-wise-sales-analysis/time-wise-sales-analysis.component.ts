import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-wise-sales-analysis',
  templateUrl: './time-wise-sales-analysis.component.html',
  styleUrls: ['./time-wise-sales-analysis.component.scss']
})
export class TimeWiseSalesAnalysisComponent implements OnInit {
  timeWiseSalesAnalysisForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],

    invoiceChkbox: [false],
    salesAmtChkbox: [false],
    quantityChkbox: [false],
    metalChkbox: [false],
    stoneChkbox: [false],
    Metal_StoneChkbox: [false],
    

  });
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  @Input() content!: any; 
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  isLoading: boolean = false;


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
      this.timeWiseSalesAnalysisForm.controls.fromdate.setValue(event.FromDate);
    }
    else if(event.ToDate){
      this.timeWiseSalesAnalysisForm.controls.todate.setValue(event.ToDate);
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
    this.timeWiseSalesAnalysisForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }



  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      //  this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.timeWiseSalesAnalysisForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };
    }
  }
}
