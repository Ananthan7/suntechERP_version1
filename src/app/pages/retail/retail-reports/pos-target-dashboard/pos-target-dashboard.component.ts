import { DatePipe } from '@angular/common';
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
  selector: 'app-pos-target-dashboard',
  templateUrl: './pos-target-dashboard.component.html',
  styleUrls: ['./pos-target-dashboard.component.scss']
})


export class PosTargetDashboardComponent implements OnInit {
  divisionMS: any;

  mtdcolumnhead:any[] = ['Branch','Branch Name','Date','MTD Target','Achieved','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  ytdcolumnhead:any[] = ['Branch','Branch Name','Date','MTD Target','Achieved','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  currentDate = new Date(); 

  POSTargetStatusForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromdate : [''],
    todate : [''],
    POSTargetAnalysis: [''],
    templateName: [''],
    showSelection: ['']
  });
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  fetchedBranchData: any[] =[];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  logDataParam: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };

  fetchedBranchDataParam: any = [];
  

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues()

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

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchCodeSelected(e: any) {
    console.log(e);
    this.POSTargetStatusForm.controls.branch.setValue(e.BRANCH_CODE);
    
  }

  formatDate(event: any) {
    const inputDate = event.target.value;
    const parsedDate = new Date(inputDate);
  
    if (!isNaN(parsedDate.getTime())) {
      const formattedDate = this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
      event.target.value = formattedDate;
    } else {
      event.target.value = ''; 
      console.error('Invalid date input');
    }
  }

  formSubmit(){
    

    if (this.POSTargetStatusForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'UspPOSTargetYTD'
    let postData = {
    
        "str_CurrFyear": this.POSTargetStatusForm.value.POSTargetAnalysis,
        "strAsOnDate":  this.datePipe.transform(this.POSTargetStatusForm.value.date, 'dd/MM/yyyy'),
        "StrBranchList":  this.POSTargetStatusForm.value.branch,
        "intShowSummary": true
   
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
                this.close('reloadMainGrid')
              }
            });
            this.POSTargetStatusForm.reset()
            this.tableData = []
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
    if(event.FromDate){
      this.POSTargetStatusForm.controls.fromdate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.POSTargetStatusForm.controls.todate.setValue(event.ToDate);
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
    this.POSTargetStatusForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.POSTargetStatusForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.POSTargetStatusForm.controls.templateName.setValue(null)
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
    console.log(this.POSTargetStatusForm.controls.templateName.value)
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
              "TEMPLATENAME": this.POSTargetStatusForm.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "str_CurrFyear": localStorage.getItem('YEAR'),
              "strAsOnDate": this.formatDateToYYYYMMDD(this.POSTargetStatusForm.controls.todate.value),
              "StrBranchList": this.POSTargetStatusForm.controls.branch.value,
              "intShowSummary": this.POSTargetStatusForm.controls.showSelection.value,
              "LOGDATA ": JSON.stringify(this.logDataParam)
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
    debugger
    let postData = {
      "SPID": "0154",
      "parameter": {
        "str_CurrFyear": localStorage.getItem('YEAR'),
        "strAsOnDate": this.formatDateToYYYYMMDD(this.POSTargetStatusForm.controls.todate.value),
        "StrBranchList": this.POSTargetStatusForm.controls.branch.value,
        "intShowSummary": this.POSTargetStatusForm.controls.showSelection.value,
        "LOGDATA ": JSON.stringify(this.logDataParam)
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
      let printContent = data[0][0].Column1;
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

  printBtnClick(){

  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      // console.log(' pREfECTHED VALUES FOR THE SCREEN', this.content)
      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.POSTargetStatusForm.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
      this.POSTargetStatusForm.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.StrBranchList);

      this.dateToPass = {
        fromDate:  paresedItem?.CONTROL_DETAIL.strAsOnDate,
        toDate: paresedItem?.CONTROL_DETAIL.strAsOnDate
      };

      this.POSTargetStatusForm.controls.showSelection.setValue(paresedItem?.CONTROL_DETAIL.intShowSummary);
      console.log('parsed data', paresedItem?.CONTROL_DETAIL )
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.POSTargetStatusForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };
    }
  }


}


