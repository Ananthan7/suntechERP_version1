import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-scheme-register-dev-report',
  templateUrl: './scheme-register-dev-report.component.html',
  styleUrls: ['./scheme-register-dev-report.component.scss']
})
export class SchemeRegisterDevReportComponent implements OnInit {

  schemeRegisterDevReportForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],
  
    status: ['']
  });

  fetchedBranchData: any[] =[];
  @Input() content!: any; 
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  fetchedBranchDataParam: any= [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  statuses = ['joining', 'matured', 'redeemed', 'collection', 'cancelled', 'live', 'paydue'];

  
  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private commonService: CommonServiceService,
    private datePipe: DatePipe, private toastr: ToastrService, private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.gridDataFetch();
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
    this.schemeRegisterDevReportForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.schemeRegisterDevReportForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.schemeRegisterDevReportForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate = this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    this.gridDataFetch();
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.schemeRegisterDevReportForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.schemeRegisterDevReportForm.controls.templateName.setValue(null)
    }
  }

  gridDataFetch(){
    this.schemeRegisterDevReportForm.controls.status.setValue(this.statuses[0]);;
    
    let API = "GetUspSchemeRegisterDevExpress";
    let postData = { 
      "strBRANCHES": this.schemeRegisterDevReportForm.controls.branch.value,
      "FROMDATE": this.dateToPass.fromDate,
      "TODATE": this.dateToPass.toDate,
      "Status": this.schemeRegisterDevReportForm.controls.status.value
    
    };
    this.dataService.postDynamicAPI(API, postData).subscribe((result) => {
      if (result && result.dynamicData) {
        if(result.dynamicData[0].length> 0){
          console.log(result.dynamicData[0])

          this.toastr.success(result.dynamicData.status || 'Success');
        }
        else{
          this.toastr.warning('No data available for the given criteria.');
        }
      } else {
        this.toastr.warning('No data available for the given criteria.');
        }
      },
      (err) => {
        this.toastr.error(err.message || 'An error occurred while fetching the data.');
      }
    );
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.schemeRegisterDevReportForm.controls.templateName.value)
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
      this.schemeRegisterDevReportForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };
    }
  }

  customizeMainGridSummaryContent = (data: any) => {
    // value separation handler from commonService
    return this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT');
  };
  customizeMainGridContent = (data: any) => {
    const formattedValue = this.commonService.decimalQuantityFormat(data.value, 'AMOUNT');

    return Number(formattedValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
}
