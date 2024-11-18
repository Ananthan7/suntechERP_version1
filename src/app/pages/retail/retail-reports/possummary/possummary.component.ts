import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-possummary',
  templateUrl: './possummary.component.html',
  styleUrls: ['./possummary.component.scss']
})
export class POSSummaryComponent implements OnInit {
  @Input() content!: any; 
  POS_SummaryForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],

    serviceChargeBoolean: [true],

    

  });
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  pointOfSalesSummaryArr: any = [];
  receiptSummaryArr: any = [];
  isLoading: boolean = false;
  currentTab: any;
  availableStockGridDataArr: any = [];
  posCollectionGridDataArr: any = [];
  posPurchaseGridDataArr: any = [];
  accountsGridDataArr: any = [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean = false

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    private commonService: CommonServiceService, private dataService: SuntechAPIService,
    private toastr: ToastrService, private datePipe: DatePipe) { }

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
      this.POS_SummaryForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.POS_SummaryForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate = this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.POS_SummaryForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.POS_SummaryForm.controls.templateName.setValue(null)
    }
  }

  customizeSummaryContent = (data: any) => {
    // decimal point hanlder from commonService
    return this.commonService.decimalQuantityFormat(data.value, 'THREE');
  };

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
    this.POS_SummaryForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }


  onTabChange(event: any){
    this.currentTab = event.tab.textLabel
    switch(this.currentTab){
      case 'Available Stock': this.availableStockGridData(); break;
      case 'POS Collection': this.POSCollectnGridData(); break;
      case 'POS Purchase' : this.posPurchaseGridData(); break;
      case 'Accounts' : this.accountsGridData(); break;
    }
  }
  availableStockGridData(){

  }
  POSCollectnGridData(){
    this.isLoading = true;
    let API = "RptPOSSummaryShowPosNetCollectionNet";
    let postData = { 
      "Branches": this.POS_SummaryForm.controls.branch.value,
      "FromDate": this.dateToPass.fromDate,
      "ToDate": this.dateToPass.toDate,
      "Vouchers": "",
      "ShopCtrlAc": ""
    };
    this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        if (result && result.dynamicData && result.dynamicData.length > 0) {
          console.log(result)
          // this.salesmanWiseProfitArr = result.dynamicData[0];
          // this.isLoading = false;
        } else {
          // this.salesmanWiseProfitArr = [];
          // this.toastr.warning('No data available for the given criteria.');
          // this.isLoading = false;
        }
      },
      (err) => {
        // this.toastr.error(err.message || 'An error occurred while fetching the data.');
        // this.isLoading = false;
      }
    );
  }
 
  posPurchaseGridData(){

  }
  accountsGridData(){

  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.POS_SummaryForm.controls.templateName.value)
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
      this.POS_SummaryForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      // let x = this.commonService.formatYYMMDD(new Date());
      // console.log(x)
      this.dateToPass = {
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };
    }
  }
}
