import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pos-salesman-target-analysis',
  templateUrl: './pos-salesman-target-analysis.component.html',
  styleUrls: ['./pos-salesman-target-analysis.component.scss']
})
export class PosSalesmanTargetAnalysisComponent implements OnInit {
  divisionMS: any;

  mtdcolumnhead:any[] = ['Code','Sales person','Date','M T D Target','Achieved','GP','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  ytdcolumnhead:any[] = ['Code','Sales person','Date','M T D Target','Achieved','GP','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  branchcolumnhead:any[]=['Code','Sales person','Pcs / Grms','Branch','Sales Amount','GP %'];

  private subscriptions: Subscription[] = [];

  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  fetchedBranchData: any[] =[];
  popupVisible: boolean = false;
  @Input() content!: any; 
  templateNameHasValue: boolean= false;
  logDataParam: any;
  isLoading: boolean = false;
  MasterSearchData: any = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.logDataParam =  {
      "VOCTYPE": this.comService.getqueryParamVocType() || "",
      "REFMID": "",
      "USERNAME": this.comService.userName,
      "MODE": "PRINT",
      "DATETIME": this.comService.formatDateTime(new Date()),
      "REMARKS":"",
      "SYSTEMNAME": "",
      "BRANCHCODE": this.comService.branchCode,
      "VOCNO": "",
      "VOCDATE": "",
      "YEARMONTH" : this.comService.yearSelected
    }
    this.MasterSearchData.VIEW_ICON = true;
    this.prefillScreenValues();
  }
 
  posSalesmanTargetAnalysis: FormGroup = this.formBuilder.group({
    vocDate: [new Date()],
    salesPersonCode: [''],
    divisionSelection: [''],
    showDtl_summary: [''],
    templateName: [''],
    branch: ['']
  });

  salesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  formSubmit() {
   

    if (this.posSalesmanTargetAnalysis.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = '/SalesMan'
    let postData =[
      {
        "salesPersonCode": this.posSalesmanTargetAnalysis.value.salesPersonCode,
        "Description": " "
      }
    ]
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
                this.posSalesmanTargetAnalysis.reset()
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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  setDateValue(event: any){
    console.log(event.asOnDate)
    this.posSalesmanTargetAnalysis.controls.vocDate.setValue(event.asOnDate);
    // if(event.FromDate){
    //   this.posSalesmanTargetAnalysis.controls.vocDate.setValue(event.FromDate);
    //   console.log(event.FromDate)
    // }
    // else if(event.ToDate){
    //   this.posSalesmanTargetAnalysis.controls.todate.setValue(event.ToDate);
    // }
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
    this.posSalesmanTargetAnalysis.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.posSalesmanTargetAnalysis.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.posSalesmanTargetAnalysis.controls.templateName.setValue(null)
    }
  }

  formatDateToYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.posSalesmanTargetAnalysis.controls.templateName.value)
  }
  saveTemplate_DB(){
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'INSERT',
        "CONTROLS": JSON.stringify({
            "CONTROL_HEADER": {
              "USERNAME": localStorage.getItem('username'),
              "TEMPLATEID": this.comService.getModuleName(),
              "TEMPLATENAME": this.posSalesmanTargetAnalysis.controls.templateName.value,
              "FORM_NAME": this.comService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "str_CurrFyear": localStorage.getItem('YEAR'),
              "strAsOnDate":this.formatDateToYYYYMMDD(this.posSalesmanTargetAnalysis.controls.vocDate.value),
              "StrSmanList": this.posSalesmanTargetAnalysis.controls.salesPersonCode.value,
            }
        })
      }
    };
    this.comService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', payload)
    .subscribe((result: any) => {
      console.log(result);
      let data = result.dynamicData.map((item: any) => item[0].ERRORMESSAGE);
      let Notifdata = result.dynamicData.map((item: any) => item[0].ERRORCODE);
      if (Notifdata == 1) {
        this.comService.closeSnackBarMsg()
        Swal.fire({
          title: data || 'Success',
          text: '',
          icon: 'success',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        })
        this.popupVisible = false;
        // this.activeModal.close(data);
        this.close('reloadMainGrid')
      }
      else {
        this.toastr.error(Notifdata)
      }
    });   
  }

  previewClick() {
    let postData = {
      "SPID": "155",
      "parameter": {
       "str_CurrFyear": localStorage.getItem('YEAR'),
       "strAsOnDate":this.formatDateToYYYYMMDD(this.posSalesmanTargetAnalysis.controls.vocDate.value),
       "StrSmanList": this.posSalesmanTargetAnalysis.controls.salesPersonCode.value,
      }
    }
    console.log(postData)  
    this.comService.showSnackBarMsg('MSG81447');
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
      let printContent = data[0][0].HTMLContent;
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
      this.comService.closeSnackBarMsg()
    });      
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = true;

      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.posSalesmanTargetAnalysis.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
      console.log('parsed data', paresedItem)
      this.posSalesmanTargetAnalysis.controls.salesPersonCode.setValue(paresedItem.CONTROL_DETAIL.StrSmanList);

    }
  }

  salesCodeSelected(e: any) {
    this.posSalesmanTargetAnalysis.controls.salesPersonCode.setValue(e.SALESPERSON_CODE);
  }




}
