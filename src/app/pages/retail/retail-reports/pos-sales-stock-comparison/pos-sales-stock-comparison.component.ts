import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-pos-sales-stock-comparison',
  templateUrl: './pos-sales-stock-comparison.component.html',
  styleUrls: ['./pos-sales-stock-comparison.component.scss']
})
export class POSSales_Stock_ComparisonComponent implements OnInit {
  POS_Sales_Stock_ComparisonForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],

    transaction: [''],
    groupByMetal: [''],

  

  });
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  @Input() content!: any; 
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  isLoading: boolean = false;
  salesGridArr: any = [];
  stockGridArr: any = [];
  diamonSalesGridArr: any = [];
  physicalStockGridArr: any = [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder,
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

  headerCellFormatting(e: any) {
    // to make grid header center aligned
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
    }
  } 

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.POS_Sales_Stock_ComparisonForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.POS_Sales_Stock_ComparisonForm.controls.templateName.setValue(null)
    }
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
      this.POS_Sales_Stock_ComparisonForm.controls.fromdate.setValue(event.FromDate);
    }
    else if(event.ToDate){
      this.POS_Sales_Stock_ComparisonForm.controls.todate.setValue(event.ToDate);
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
    this.POS_Sales_Stock_ComparisonForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }


  onTabChange(event: any){

  }

  apiCallFunction(){
    this.isLoading = true;
    let APIurl = "PosSalesAndStockComparison";
    let postData = {
      "parameter": {
        "frmDate": "2024-11-30",
        "toDate": "2024-11-30",
        "strBranch": "ALL",
        "mtlType": "Type",
        "diaType": "Type",
        "transaction": 0
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
    console.log(this.POS_Sales_Stock_ComparisonForm.controls.templateName.value)
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
      this.POS_Sales_Stock_ComparisonForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };
    }
  }

}
