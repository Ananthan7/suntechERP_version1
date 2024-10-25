import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-posdaybook',
  templateUrl: './posdaybook.component.html',
  styleUrls: ['./posdaybook.component.scss']
})
export class POSDaybookComponent implements OnInit {
  isLoading: boolean = false;
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };

  posDayBookForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromDate : [new Date()],
    toDate : [new Date()],
    reportTo : ['preview'],

    templateName: ['']
  })

  

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, 
    private dataService: SuntechAPIService, private commonService: CommonServiceService, 
    private toastr: ToastrService, private sanitizer: DomSanitizer) { 

  }

  ngOnInit(): void {
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
    this.posDayBookForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.posDayBookForm.controls.fromDate.setValue(event.FromDate);
      this.dateToPass.fromDate = event.FromDate
    }
    else if(event.ToDate){
      this.posDayBookForm.controls.toDate.setValue(event.ToDate);
      this.dateToPass.toDate = event.ToDate
    }
  }

  saveTemplate(){

  }

  previewClick(){

  }

  printBtnClick(){

  }




  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
