import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-festival-sales-comparison',
  templateUrl: './festival-sales-comparison.component.html',
  styleUrls: ['./festival-sales-comparison.component.scss']
})
export class FestivalSalesComparisonComponent implements OnInit {
  festivalSalesComparisonForm: FormGroup = this.formBuilder.group({
    branch: [''],
    orderType: [''],
    YearToCompareFrom: [''],
    YearToCompareTo: [''],
    fromdate: [''],
    todate: [''],
    templateName: ['']
  });
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  fetchedBranchData: any[] =[];
  @Input() content!: any; 
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;

  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  fetchedBranchDataParam: any= [];
  isLoading: boolean = false;


  constructor( private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonServiceService, private datePipe: DatePipe,
    private dataService: SuntechAPIService,   private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues()
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
      this.festivalSalesComparisonForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.festivalSalesComparisonForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
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


    // const uniqueArray = [...new Set(this.branchDivisionData)];
    // const plainText = uniqueArray.join('');
    this.formattedBranchDivisionData = branchDivisionData
    this.festivalSalesComparisonForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

 prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      //  this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.festivalSalesComparisonForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!
      };
    }
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.festivalSalesComparisonForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.festivalSalesComparisonForm.controls.templateName.setValue(null)
    }
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.festivalSalesComparisonForm.controls.templateName.value)
  }
  saveTemplate_DB(){
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'INSERT',
        "CONTROLS": JSON.stringify({
            "CONTROL_HEADER": {
              "USERNAME": localStorage.getItem('username'),
              "TEMPLATEID": this.commonService.getModuleName(),
              "TEMPLATENAME": this.festivalSalesComparisonForm.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
             
            }
        })
      }
    };
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', payload)
    .subscribe((result: any) => {
      console.log(result);
      let data = result.dynamicData.map((item: any) => item[0].ERRORMESSAGE);
      let Notifdata = result.dynamicData.map((item: any) => item[0].ERRORCODE);
      if (Notifdata == 1) {
        this.commonService.closeSnackBarMsg()
        Swal.fire({
          title: data || 'Success',
          text: '',
          icon: 'success',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        })
        this.popupVisible = false;
        this.activeModal.close(data);
      }
      else {
        this.toastr.error(Notifdata)
      }
    });   
  }

  previewClick() {
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
}
