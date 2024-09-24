import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
  fetchedBranchDataParam: any[]= [];
  festivalArr: any[] = [];
  divisionsArr: any[] = [];
  diamondSectionArr: any[] = [];
  metalSectionArr: any[] =[];
  logDataParam: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };

  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

 posCRMdasbordFrom: FormGroup = this.formBuilder.group({
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
    showBuyingPatternBln: [false]
  });

  ngOnInit(): void {
    this.initAPI()

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
  }

  initAPI(){
    const apiUrl = '/UspGetPosCRMDashboardFilterFields/GetUspPosCRMDashboardFilter/'
  
    this.dataService.getDynamicAPI(apiUrl).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        console.log( resp.dynamicData )
        this.festivalArr = resp.dynamicData[0]
        this.divisionsArr = resp.dynamicData[1]
        this.diamondSectionArr = resp.dynamicData[2]
        this.metalSectionArr = resp.dynamicData[3]
      }
     
    });
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.posCRMdasbordFrom.invalid) {
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
                this.posCRMdasbordFrom.reset()
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
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
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
      this.posCRMdasbordFrom.controls.fromDate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.posCRMdasbordFrom.controls.toDate.setValue(event.ToDate);
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
    this.posCRMdasbordFrom.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.posCRMdasbordFrom.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.posCRMdasbordFrom.controls.templateName.setValue(null)
    }
  }

  previewClick() {
    let postData = {
      "SPID": "152",
      "parameter": {
        "strFmDate" : this.formatDateToYYYYMMDD(this.posCRMdasbordFrom.value.fromDate),
        "strToDate" : this.formatDateToYYYYMMDD(this.posCRMdasbordFrom.value.toDate),
        "bln_ShowBuyingPattern": JSON.stringify(this.posCRMdasbordFrom.controls.showBuyingPatternBln.value? 0 : 1),
        "str_DiaBuyPatternField": this.posCRMdasbordFrom.controls.diamondsection.value,
        "str_MtlBuyPatternField": this.posCRMdasbordFrom.controls.metal.value,
        "str_Divisions": this.posCRMdasbordFrom.controls.divisions.value,
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
      let data = result.dynamicData;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const windowFeatures = `width=${width},height=${height},fullscreen=yes`;
      var WindowPrt = window.open(' ', ' ', windowFeatures);
      if (WindowPrt === null) {
        console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
        return;
      }
      let printContent = data[0][0].HTMLINPUT;
      WindowPrt.document.write(printContent);
      WindowPrt.document.close();
      WindowPrt.focus();  
      WindowPrt.onload = function () {
        if (WindowPrt && WindowPrt.document.head) {
          let styleElement = WindowPrt.document.createElement('style');
          styleElement.textContent = `
                      @page {
                          size: A5 landscape;
                      }
                      body {
                          margin: 0mm;
                      }
                  `;
          WindowPrt.document.head.appendChild(styleElement);

          setTimeout(() => {
            if (WindowPrt) {
              WindowPrt.print();
            } else {
              console.error('Print window was closed before printing could occur.');
            }
          }, 800);
        }
      };
      this.commonService.closeSnackBarMsg()
    });      
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.posCRMdasbordFrom.controls.templateName.value)
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
              "TEMPLATENAME": this.posCRMdasbordFrom.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              // "STRBRANCHCODES": this.formattedBranchDivisionData,
              // "STRVOCTYPES": this.VocTypeParam,
              // "FROMVOCDATE": this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.fromDate),
              // "TOVOCDATE": this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.toDate),
              // "USERBRANCH": localStorage.getItem('userbranch'),
              // "USERNAME": localStorage.getItem('username'),
              // "SHOWDATE": this.posDailyClosingSummaryForm.value.showDateCheckbox ? 0 : 1,
              // "SHOWINVOICE": this.posDailyClosingSummaryForm.value.showInvoiceCheckbox ? 0 : 1
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


}
