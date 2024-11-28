import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    asonDate : [''],
    showSelection: [''],
    diamondSelection: [''],
    
    POSTargetAnalysis: [''],
    templateName: [''],

  });
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  fetchedBranchData: any[] =[];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  logDataParam: any;
  dateToPass: { asonDate: string; } = { asonDate: '' };

  fetchedBranchDataParam: any = [];
  isLoading: boolean = false;
  htmlPreview: any;

  ytdStatusArr: any = [];
  mtdStatusArr: any = [];
  prefetchedYearValue: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private datePipe: DatePipe,  private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.gridDataFetch();

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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  setDateValue(event: any){
    if(event.asOnDate){
      this.POSTargetStatusForm.controls.asonDate.setValue(event.asOnDate);
      this.dateToPass.asonDate = this.datePipe.transform(event.asOnDate, 'yyyy-MM-dd')!
    }
    this.gridDataFetch();
  }

  headerCellFormatting(e: any) {
    // to make grid header center aligned
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
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
              "str_CurrFyear": this.prefetchedYearValue? this.prefetchedYearValue : localStorage.getItem('YEAR'),
              "strAsOnDate": this.dateToPass.asonDate,
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

  previewClick(){
    this.isLoading = true;
    let logData =  {
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
    let postData = {
      "SPID": "0154",
      "parameter": { 
        "str_CurrFyear": this.prefetchedYearValue? this.prefetchedYearValue : localStorage.getItem('YEAR'),
        "strAsOnDate": this.dateToPass.asonDate,
        "StrBranchList": this.POSTargetStatusForm.controls.branch.value,
        "intShowSummary": this.POSTargetStatusForm.controls.showSelection.value,
        "LOGDATA ": JSON.stringify(logData)
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].Column1;
        if (printContent && Object.keys(printContent).length > 0) {
          this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
          const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
          this.commonService.closeSnackBarMsg();
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          this.isLoading = false;
        } else {
          Swal.fire('No Data!', 'There is no data!', 'info');
          this.commonService.closeSnackBarMsg();
          this.isLoading = false;
        }
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
    let logData =  {
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
    let postData = {
      "SPID": "0154",
      "parameter": { 
        "str_CurrFyear": this.prefetchedYearValue? this.prefetchedYearValue : localStorage.getItem('YEAR'),
        "strAsOnDate": this.dateToPass.asonDate,
        "StrBranchList": this.POSTargetStatusForm.controls.branch.value,
        "intShowSummary": this.POSTargetStatusForm.controls.showSelection.value,
        "LOGDATA ": JSON.stringify(logData)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      if(result.status == "Success"){
        
        let printContent = data[0][0].Column1;
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
              this.isLoading = false;
            } else {
              Swal.fire('No Data!', 'There is no data to print!', 'info');
              this.commonService.closeSnackBarMsg();
              this.isLoading = false;
              return
            }
          }, 1500); 
        }
        else{
          Swal.fire('No Data!', 'There is no data to print!', 'info');
          this.commonService.closeSnackBarMsg();
          this.isLoading = false;
          return
        }
      }
      else{
        this.toastr.error(result.message);
        this.isLoading = false;
        return
      }
    });  
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
      this.POSTargetStatusForm.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.StrBranchList);
      this.POSTargetStatusForm.controls.asonDate.setValue(paresedItem?.CONTROL_DETAIL.strAsOnDate);
      this.dateToPass.asonDate = paresedItem?.CONTROL_DETAIL.strAsOnDate;
      this.prefetchedYearValue = paresedItem?.CONTROL_DETAIL.str_CurrFyear;
      this.POSTargetStatusForm.controls.showSelection.setValue(paresedItem?.CONTROL_DETAIL.intShowSummary)

      this.templateNameHasValue = !!paresedItem.CONTROL_HEADER.TEMPLATENAME;
      this.POSTargetStatusForm.controls.templateName.setValue(paresedItem?.CONTROL_HEADER.TEMPLATENAME);
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.POSTargetStatusForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        asonDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };
    }
  }

  gridDataFetch(){
    this.isLoading = true;
    this.ytdStatusArr = [];
    this.mtdStatusArr = [];

    let API1 = "UspPOSTargetYTD";
    let postData1 = { 
      "str_CurrFyear": this.datePipe.transform(this.dateToPass.asonDate, 'yyyy'),
      "strAsOnDate": this.dateToPass.asonDate,
      "StrBranchList": this.POSTargetStatusForm.controls.branch.value,
      "intShowSummary": true
    };

    let API2 = "UspPosTargetMTD"
    let postData2 = { 
      "str_CurrFyear": this.datePipe.transform(this.dateToPass.asonDate, 'yyyy'),
      "strAsOnDate": this.dateToPass.asonDate,
      "StrBranchList": this.POSTargetStatusForm.controls.branch.value, 
      "intShowSummary": true 
    };

    forkJoin({
      YTDstatusData: this.dataService.postDynamicAPI(API1, postData1),
      MTDstatusData: this.dataService.postDynamicAPI(API2, postData2),
    }).subscribe({
        next: (result) => {
          this.ytdStatusArr.push(result.YTDstatusData.dynamicData[0][0])
          this.mtdStatusArr.push(result.MTDstatusData.dynamicData[0][0])

          if(result.YTDstatusData.dynamicData[0][0].length>0 ||  result.MTDstatusData.dynamicData[0][0].length>0){
            this.commonService.showSnackBarMsg('data loaded successfully!');
            this.isLoading = false;
          }
          else{
            this.commonService.showSnackBarMsg('No Data!');
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.commonService.showSnackBarMsg('Error loading data.');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
    });
  }


  customizeContent= (data: any) => {
    if (typeof data.value === 'object' && Object.keys(data.value).length === 0) {
      return data.value = null;
    } else if (typeof data.value === 'number') {
      return this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT');
    }
    return
  };
}


