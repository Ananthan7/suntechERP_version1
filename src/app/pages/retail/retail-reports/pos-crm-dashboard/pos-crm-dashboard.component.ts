import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { forkJoin, of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectChange } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pos-crm-dashboard',
  templateUrl: './pos-crm-dashboard.component.html',
  styleUrls: ['./pos-crm-dashboard.component.scss']
})
export class PosCrmDashboardComponent implements OnInit {
  @Input() content!: any; 
  tableData: any[] = [];
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  isReadOnly:boolean=true;
  vocMaxDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];

  branchDivisionControlsTooltip: any;
  fetchedBranchData: any[] =[];
  formattedBranchDivisionData: any;
  templateNameHasValue: boolean= false;
  popupVisible: boolean = false;
  fetchedBranchDataParam: any= [];
  festivalArr: any[] = [];
  divisionsArr: any[] = [];
  diamondSectionArr: any[] = [];
  metalSectionArr: any[] =[];
  logDataParam: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  isLoading: boolean = false;
  buyingPatternBoolean: boolean = false;

  htmlPreview: any;
  posCRMdasbordForm: FormGroup;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService, private datePipe: DatePipe,
    private toastr: ToastrService, private sanitizer: DomSanitizer,
    private commonService: CommonServiceService,
  ) { 
    this.posCRMdasbordForm = this.formBuilder.group({
      festival: ['',[Validators.required]],
      daterange: ['',[Validators.required]],
      divisions: ['',[Validators.required]],
      metal: ['',[Validators.required]],
      diamondsection: ['',[Validators.required]],
      branch: [''],
      templateName: [''],
      jobno: [''],
      fromDate: [''],
      toDate: [''],
      showBuyingPatternBln: [false],
      TotPurchaseValue: [''],
      lastPurchaseValue: [''],
      avgPurchaseValue: [''],
    });
  }


  ngOnInit(): void {
    this.initAPI()
    this.prefillScreenValues();

    this.logDataParam =  {
      "VOCTYPE": this.commonService.getqueryParamVocType() || "",
      "REFMID": "",
      "USERNAME": this.commonService.userName,
      "MODE": "PRINT",
      "DATETIME": this.commonService.formatDateTime(new Date()),
      "REMARKS":"",
      "SYSTEMNAME": "",
      "BRANCHCODE": this.commonService.branchCode,
      "VOCNO": "",
      "VOCDATE": "",
      "YEARMONTH" : this.commonService.yearSelected
    }
    this.performPostRequests();
  }

  initAPI(){
    this.isLoading = true;

    const apiUrl = '/UspGetPosCRMDashboardFilterFields/GetUspPosCRMDashboardFilter/'
    this.dataService.getDynamicAPI(apiUrl).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        console.log( resp.dynamicData )
        this.festivalArr = resp.dynamicData[0];
        this.festivalArr.forEach((item: any,index: any)=>{
          item.srno = index+1;
        })
        this.divisionsArr = resp.dynamicData[1];
        this.diamondSectionArr = resp.dynamicData[2];
        this.metalSectionArr = resp.dynamicData[3];

        this.isLoading = false;
      }
    });
  }

  performPostRequests() {
    const apiUrl1 = 'UspPosCrmInvoiceDetails'
    const apiUrl2 = 'UspSuggestNewDIaJewCRMDBoard';
    const apiUrl3 = 'UspSuggestNewMtlJewCRMDBoard';


    const postData1 = { 
       "str_SqlId": ""
    };
    const postData2 = { 
      "str_FilterField": "",
      "str_FilterValues": "",
      "str_PriceField": "",
      "str_PriceFm": this.dateToPass.fromDate,
      "str_PriceTo": this.dateToPass.toDate
    };
    const postData3 = {  
      "str_FilterField": "",
      "str_FilterValues": "",
      "str_QtyFm": this.dateToPass.fromDate,
      "str_QtyTo": this.dateToPass.toDate
    };

    // Perform POST requests in parallel using forkJoin
    forkJoin({
      request1: this.dataService.postDynamicAPI(apiUrl1, postData1),
      request2: this.dataService.postDynamicAPI(apiUrl2, postData2),
      request3: this.dataService.postDynamicAPI(apiUrl3, postData3),
    }).pipe(
      // Handling errors globally using catchError
      catchError(error => {
        this.toastr.error('An error occurred while making requests');
        this.isLoading = false;
        return of({ request1: null, request2: null, request3: null });
      }),

      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (responses: any) => {
        if (responses.request1) {
          console.log('Response from request1:', responses.request1);
        } else {
          console.log('Request 1 failed');
        }

        if (responses.request2) {
          console.log('Response from request2:', responses.request2);
        } else {
          console.log('Request 2 failed');
        }

        if (responses.request3) {
          console.log('Response from request3:', responses.request3);
        } else {
          console.log('Request 3 failed');
        }
      },
      error: (err: any) => {
        console.error('Error in any of the requests:', err);
      }
    });
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.posCRMdasbordForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'UspSuggestNewDIaJewCRMDBoard'
    let postData = {

      "str_FilterField": "string",
      "str_FilterValues": "string",
      "str_PriceField": "string",
      "str_PriceFm": "string",
      "str_PriceTo": "string"
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.posCRMdasbordForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

 

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = [];
    }
  }
  
  headerCellFormatting(e: any) {
    // to make grid header center aligned
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
    }
  } 

  setDateValue(event: any){
    if(event.FromDate){
      this.posCRMdasbordForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.posCRMdasbordForm.controls.todate.setValue(event.ToDate);
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
    this.posCRMdasbordForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.posCRMdasbordForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.posCRMdasbordForm.controls.templateName.setValue(null)
    }
  }

  previewClick() {
    this.isLoading = true;
    let postData = {
      "SPID": "152",
      "parameter": {
        "str_FmDate" : this.datePipe.transform(this.posCRMdasbordForm.value.fromDate, 'yyyy-MM-dd'),
        "str_ToDate" : this.datePipe.transform(this.posCRMdasbordForm.value.toDate, 'yyyy-MM-dd'),
        "bln_ShowBuyingPattern": JSON.stringify(this.posCRMdasbordForm.controls.showBuyingPatternBln.value? 0 : 1),
        "str_DiaBuyPatternField": this.posCRMdasbordForm.controls.diamondsection.value,
        "str_MtlBuyPatternField": this.posCRMdasbordForm.controls.metal.value,
        "str_Divisions": this.posCRMdasbordForm.controls.divisions.value,
        "str_BranchList": this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "str_SqlId": '',
        "LOGDATA": JSON.stringify(this.logDataParam)
      }
    }
    console.log(postData)  
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result);
      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].HTMLResult;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.commonService.closeSnackBarMsg();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.isLoading = false;
      }
      else{
        this.toastr.error(result.message)
        this.isLoading = false;
        return
      }
    });      
  }

  printBtnClick(){
    this.isLoading = true;
    let postData = {
      "SPID": "152",
      "parameter": { 
        "str_FmDate" : this.datePipe.transform(this.posCRMdasbordForm.value.fromDate, 'yyyy-MM-dd'),
        "str_ToDate" : this.datePipe.transform(this.posCRMdasbordForm.value.toDate, 'yyyy-MM-dd'),
        "bln_ShowBuyingPattern": JSON.stringify(this.posCRMdasbordForm.controls.showBuyingPatternBln.value? 0 : 1),
        "str_DiaBuyPatternField": this.posCRMdasbordForm.controls.diamondsection.value,
        "str_MtlBuyPatternField": this.posCRMdasbordForm.controls.metal.value,
        "str_Divisions": this.posCRMdasbordForm.controls.divisions.value,
        "str_BranchList": this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "str_SqlId": '',
        "LOGDATA": JSON.stringify(this.logDataParam)
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      if(result.status == "Success"){
        let printContent = data[0][0].HTMLResult;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        if(this.htmlPreview.changingThisBreaksApplicationSecurity){

          setTimeout(() => {
            const content = this.htmlPreview?.changingThisBreaksApplicationSecurity;

            let  userBranchDesc:any  = localStorage.getItem('BRANCH_PARAMETER')
            userBranchDesc = JSON.parse(userBranchDesc)
      
            if (content && Object.keys(content).length !== 0) {
              const modifiedContent = content.replace(/<title>.*?<\/title>/, `<title>${userBranchDesc.DESCRIPTION}</title>`);
              const printWindow = window.open('', '', 'height=600,width=800');
              printWindow?.document.write(modifiedContent);
              printWindow?.focus();
              printWindow?.print();
              printWindow?.close();
              this.isLoading = false;
            } else {
              Swal.fire('No Data!', 'There is no data to print!', 'info');
              this.commonService.closeSnackBarMsg();
              this.isLoading = false;
              return
            }
          }, 1500); 

        }
      }
      else{
        this.toastr.error(result.message);
        this.isLoading = false;
        return
      }
    });  
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.posCRMdasbordForm.controls.templateName.value)
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
              "TEMPLATENAME": this.posCRMdasbordForm.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "str_FmDate" :  this.datePipe.transform(this.posCRMdasbordForm.value.fromDate, 'yyyy-MM-dd'),
              "str_ToDate" : this.datePipe.transform(this.posCRMdasbordForm.value.toDate, 'yyyy-MM-dd'),
              "bln_ShowBuyingPattern": JSON.stringify(this.posCRMdasbordForm.controls.showBuyingPatternBln.value? 0 : 1),
              "str_DiaBuyPatternField": this.posCRMdasbordForm.controls.diamondsection.value,
              "str_MtlBuyPatternField": this.posCRMdasbordForm.controls.metal.value,
              "str_Divisions": this.posCRMdasbordForm.controls.divisions.value,
              "str_BranchList": this.formattedBranchDivisionData || this.fetchedBranchDataParam,
              "str_SqlId": '',
              "LOGDATA": JSON.stringify(this.logDataParam)
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

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = true;
      console.log('data to prefill', this.content)   
      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.posCRMdasbordForm.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
      this.dateToPass = {
        fromDate:  paresedItem?.CONTROL_DETAIL.str_FmDate,
        toDate: paresedItem?.CONTROL_DETAIL.str_ToDate
      };
      this.dateToPass.fromDate? this.posCRMdasbordForm.controls.fromDate.setValue(this.dateToPass.fromDate) : null
      this.dateToPass.toDate? this.posCRMdasbordForm.controls.toDate.setValue(this.dateToPass.toDate) : null


      this.posCRMdasbordForm.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.str_BranchList);
      this.fetchedBranchData= paresedItem?.CONTROL_DETAIL.str_BranchList.split("#")
      this.fetchedBranchDataParam = paresedItem?.CONTROL_DETAIL.str_BranchList

      this.posCRMdasbordForm.controls.diamondsection.setValue(paresedItem?.CONTROL_DETAIL.str_DiaBuyPatternField)
      this.posCRMdasbordForm.controls.divisions.setValue(paresedItem?.CONTROL_DETAIL.str_Divisions)
      this.posCRMdasbordForm.controls.metal.setValue(paresedItem?.CONTROL_DETAIL.str_MtlBuyPatternField)

      this.buyingPatternBoolean = paresedItem?.CONTROL_DETAIL.bln_ShowBuyingPattern === 1 ? false : true;
      console.log(this.buyingPatternBoolean)
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.posCRMdasbordForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!
      };

      this.posCRMdasbordForm.controls.festival.setValue(1)
      this.posCRMdasbordForm.controls.diamondsection.setValue(this.diamondSectionArr[0]?.MASFIELD);
      this.posCRMdasbordForm.controls.divisions.setValue(this.divisionsArr[0]?.Code);
      this.posCRMdasbordForm.controls.metal.setValue(this.metalSectionArr[0]?.MASFIELD);
      
    }
  }

  onFestivalChange(event: any) {
    console.log('Selected Festival:', event.value);
    this.posCRMdasbordForm.controls.festival.setValue(event.value)
  }



}
