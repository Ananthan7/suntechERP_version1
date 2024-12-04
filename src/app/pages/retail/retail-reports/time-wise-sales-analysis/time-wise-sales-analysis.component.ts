import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

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
    firstInput: [''],


  });
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  @Input() content!: any; 
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  isLoading: boolean = false;
  timeWiseSaleCmprsneArr: any = [];
  dayWiseSaleCmprsneArr: any = [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;


  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private datePipe: DatePipe,
    private dataService: SuntechAPIService, private commonService: CommonServiceService,  private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.apiCallFunction();
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.timeWiseSalesAnalysisForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.timeWiseSalesAnalysisForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    this.apiCallFunction();
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.timeWiseSalesAnalysisForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.timeWiseSalesAnalysisForm.controls.templateName.setValue(null)
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

  apiCallFunction(){
    this.isLoading = true;
    let APIurl = "TimeWiseSalesAnalysis";
    let postData = {
      "parameter": {
        "noOfInvoice": this.timeWiseSalesAnalysisForm.controls.invoiceChkbox.value,
        "showAmount": this.timeWiseSalesAnalysisForm.controls.salesAmtChkbox.value,
        "isMetal": this.timeWiseSalesAnalysisForm.controls.metalChkbox.value,
        "isStone": this.timeWiseSalesAnalysisForm.controls.stoneChkbox.value,
        "type": "Time",
        "fromDate": this.dateToPass.fromDate,
        "toDate": this.dateToPass.toDate,
        "time1": 9,
        "time2": 12,
        "time3": 12,
        "time4": 14,
        "time5":14,
        "time6": 16,
        "time7": 16,
        "time8": 18,
        "time9": 18,
        "time10": 30,
        "time11": 20,
        "time12": 22
      }
    }

    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI(APIurl, postData)
    .subscribe((response: any) => {
      if(response.status == 'Failed'){
        this.toastr.error(response.message);
        this.isLoading = false;
        return
      }
      else{
        this.isLoading = false;
      }
    })
  }
  
  saveTemplate(){
    this.popupVisible = true;
    console.log(this.timeWiseSalesAnalysisForm.controls.templateName.value)
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
      this.timeWiseSalesAnalysisForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };
    }
  }
}
