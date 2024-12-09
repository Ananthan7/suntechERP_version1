import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
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
    groupByDiamond: ['']
  

  });
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  @Input() content!: any; 
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  isLoading: boolean = false;
  metalSalesGridArr: any = [];
  metalStockGridArr: any = [];
  diamondSalesGridArr: any = [];
  physicalStockGridArr: any = [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;

  options = [
    { value: 0, label: 'Sales' },
    { value: 1, label: 'Sales Returns' },
    { value: 2, label: 'Net Sales' },
  ];
  groupByMetalArr = [
    { value: 'Type', label: 'Type' },
    { value: 'Karat', label: 'Karat' },
    { value: 'Brand', label: 'Brand' },
    { value: 'Country', label: 'Country' },
    { value: 'Stock Code', label: 'Stock Code' },
    { value: 'Category', label: 'Category' },
    { value: 'Cost Code', label: 'Cost Code' },
  ]
  groupByDiamondArr = [
    { value: 'Type', label: 'Type' },
    { value: 'Category', label: 'Category' },
    { value: 'Sub Category', label: 'Sub Category' },
    { value: 'Brand', label: 'Brand' },
    { value: 'Country', label: 'Country' },
    { value: 'Design', label: 'Design' },
    { value: 'Stock Code', label: 'Stock Code' },
    { value: 'Cost Code', label: 'Cost Code' },
  ]

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private datePipe: DatePipe,
    private dataService: SuntechAPIService, private commonService: CommonServiceService,  private toastr: ToastrService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.gridAPI();
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

    if (e.rowType === 'data') {
      const column = e.column.dataField;
      if (['mkgvalue', 'QTY', 'metalvalue', 'amount'].includes(column)) {
        e.cellElement.innerText = this.commonService.setCommaSerperatedNumber(e.value, 'AMOUNT');
      }
    }

    // if (e.rowType === 'totalFooter') {
    //   const value = e.totalItem.summaryCells;
    //   value.forEach((item: any)=>{
    //     console.log(item.column)
    //     if (['mkgvalue', 'QTY', 'metalvalue', 'amount'].includes(item.column)) {
    //       console.log(item)
    //     }
    //   })
    // } 
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

  setDateValue(event: any){
    if(event.FromDate){
      this.POS_Sales_Stock_ComparisonForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.POS_Sales_Stock_ComparisonForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    this.gridAPI();
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

  gridAPI(){
    this.isLoading = true;
    let APIurl = "PosSalesAndStockComparison";

    // const branchSelectionlastElement = this.POS_Sales_Stock_ComparisonForm.controls.branch.value.split('#').pop()!.replace('#', '');
    // const formatterBranches = this.POS_Sales_Stock_ComparisonForm.controls.branch.value.slice(0, -1) + branchSelectionlastElement;

    let postData = {
        "frmDate": this.dateToPass.fromDate,
        "toDate": this.dateToPass.toDate,
        "strBranch": this.POS_Sales_Stock_ComparisonForm.controls.branch.value,
        "mtlType": this.POS_Sales_Stock_ComparisonForm.controls.groupByMetal.value,
        "diaType": this.POS_Sales_Stock_ComparisonForm.controls.groupByDiamond.value,
        "transaction": Math.floor(this.POS_Sales_Stock_ComparisonForm.controls.transaction.value || 0)
    }

    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI(APIurl, postData).pipe( 
     catchError((error) => {
      this.toastr.error('An error occurred while processing the request');
      this.isLoading = false;
      return [];
    }),)
    .subscribe((response: any) => {
      if(response.status == 'Failed'){
        this.toastr.error(response.message);
        this.isLoading = false;
        return
      }
      else{
        this.metalSalesGridArr = response.dtMtlSales;
        this.metalSalesGridArr?.forEach((item: any)=>{
          if (Object.keys(item.type).length === 0 && item.type.constructor === Object) {
            item.type = null;
          }
          item.mkgvalue = this.commonService.setCommaSerperatedNumber(item.mkgvalue, 'AMOUNT');
          item.QTY = this.commonService.setCommaSerperatedNumber(item.QTY, 'AMOUNT');
          item.metalvalue = this.commonService.setCommaSerperatedNumber(item.metalvalue, 'AMOUNT');
          item.amount = this.commonService.setCommaSerperatedNumber(item.amount, 'AMOUNT');
        })

        this.metalStockGridArr = response.dtMtlStock;
        this.metalStockGridArr.forEach((item: any)=>{
          if (Object.keys(item.type).length === 0 && item.type.constructor === Object) {
            item.type = null;
          }
        })

        this.diamondSalesGridArr = response.dtDiaSales;


        this.physicalStockGridArr = response.dtDiaStock;
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


  excelExport(){
    console.log('Metal Division- Salex', this.metalSalesGridArr)
    console.log('Metal Division- Stock', this.metalStockGridArr)
    this.commonService.exportExcel(this.metalStockGridArr, "Metal Division- Stock Details");
    console.log('Diamond Division- Sales', this.diamondSalesGridArr)
    console.log('Diamond Division- Physical stock', this.physicalStockGridArr)
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
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };

      this.POS_Sales_Stock_ComparisonForm.controls.transaction.setValue(this.options[0].value);
      this.POS_Sales_Stock_ComparisonForm.controls.groupByMetal.setValue(this.groupByMetalArr[0].value);
      this.POS_Sales_Stock_ComparisonForm.controls.groupByDiamond.setValue(this.groupByDiamondArr[0].value);
    }
  }

}
