import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-scheme-register',
  templateUrl: './scheme-register.component.html',
  styleUrls: ['./scheme-register.component.scss']
})
export class SchemeRegisterComponent implements OnInit {
  schemeRegisterForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],

    customercode: ['', [Validators.required]],
    desc: [''],
  });

  fetchedBranchData: any[] =[];
  @Input() content!: any; 
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  fetchedBranchDataParam: any= [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "account_mode in ('B','R','P')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
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

    this.formattedBranchDivisionData = branchDivisionData
    this.schemeRegisterForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.schemeRegisterForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.schemeRegisterForm.controls.templateName.setValue(null)
    }
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.schemeRegisterForm.controls.fromdate.setValue(event.FromDate);
    }
    else if(event.ToDate){
      this.schemeRegisterForm.controls.todate.setValue(event.ToDate);
    }
  }

  customerCodeScpSelected(e: any) {
    console.log(e);
    this.schemeRegisterForm.controls.customercode.setValue(e.ACCODE);
    this.schemeRegisterForm.controls.desc.setValue(e.ACCOUNT_HEAD);
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.schemeRegisterForm.controls.templateName.value)
  }
  saveTemplate_DB(){

  }

  previewClick(){
    
  }

  printBtnClick(){

  }




  prefillScreenValues(){
    if (this.content == null || Object.keys(this.content).length === 0) {
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.schemeRegisterForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")

      this.dateToPass = {
        fromDate:  this.commonService.formatYYMMDD(new Date()),
        toDate: this.commonService.formatYYMMDD(new Date()),
      };
    } else {
      //  this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
    }
  }

}
