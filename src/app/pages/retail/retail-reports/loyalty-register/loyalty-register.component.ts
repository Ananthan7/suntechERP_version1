import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-loyalty-register',
  templateUrl: './loyalty-register.component.html',
  styleUrls: ['./loyalty-register.component.scss']
})
export class LoyaltyRegisterComponent implements OnInit {

  // subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  isReadOnly:boolean=true;
  vocMaxDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  branchDivisionControls: any;
  VocTypeParam: any = [];
  formattedBranchDivisionData: any;
  fetchedBranchDataParam: any= [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  isLoading: boolean = false;
  branchDivisionControlsTooltip: any;
  fetchedBranchData: any[] =[];
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
 


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService, private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues()
  }

  loyaltyregisterFrom: FormGroup = this.formBuilder.group({
    branch: [''],
    customerfrom: ['',[Validators.required]],
    customerto: ['',[Validators.required]],
    fromdate: ['',[Validators.required]],
    todate: ['',[Validators.required]],
    reportto: [''],
    pointsfrom: ['',[Validators.required]],
    pointsto: ['',[Validators.required]],
    templateName: ['']
  });


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.loyaltyregisterFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'RptLoyaltyRegisterCurrencyNet'
    let postData = {

      "strFromDate": this.loyaltyregisterFrom.value.fromdate,
      "strToDate": this.loyaltyregisterFrom.value.todate,
      "strCustcodeFrom": this.loyaltyregisterFrom.value.voctype,
      "strCustcodeTo":this.loyaltyregisterFrom.value.voctype,
      "strPointsFrom": this.loyaltyregisterFrom.value.voctype,
      "strPointsTo": this.loyaltyregisterFrom.value.voctype,
      "strBranches": this.loyaltyregisterFrom.value.branch,
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
                this.loyaltyregisterFrom.reset()
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
    this.loyaltyregisterFrom.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  formatDateToYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  previewClick() {
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
      "SPID": "0118",
      "parameter": {
        "STRFROMDATE": this.formatDateToYYYYMMDD(this.loyaltyregisterFrom.value.fromdate),
        "STRTODATE": this.formatDateToYYYYMMDD(this.loyaltyregisterFrom.value.todate),
        "STRCUSTCODEFROM": this.loyaltyregisterFrom.value.customerfrom,
        "STRCUSTCODETO": this.loyaltyregisterFrom.value.customerto,
        "STRPOINTSFROM": JSON.stringify(this.loyaltyregisterFrom.value.pointsfrom),
        "STRPOINTSTO":  JSON.stringify(this.loyaltyregisterFrom.value.pointsto),
        "STRBRANCHES": this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "Logdata": JSON.stringify(logData)
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

  printBtnClick(){

  }
  
  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.loyaltyregisterFrom.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.loyaltyregisterFrom.controls.templateName.setValue(null)
    }
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.loyaltyregisterFrom.controls.templateName.value)
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
              "TEMPLATENAME": this.loyaltyregisterFrom.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "STRFROMDATE": this.formatDateToYYYYMMDD(this.loyaltyregisterFrom.value.fromdate),
              "STRTODATE": this.formatDateToYYYYMMDD(this.loyaltyregisterFrom.value.todate),
              "STRCUSTCODEFROM": this.loyaltyregisterFrom.value.customerfrom,
              "STRCUSTCODETO": this.loyaltyregisterFrom.value.customerto,
              "STRPOINTSFROM": JSON.stringify(this.loyaltyregisterFrom.value.pointsfrom),
              "STRPOINTSTO":  JSON.stringify(this.loyaltyregisterFrom.value.pointsto),
              "STRBRANCHES": this.formattedBranchDivisionData || this.fetchedBranchDataParam
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

  setDateValue(event: any){
    if(event.FromDate){
      this.loyaltyregisterFrom.controls.fromdate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.loyaltyregisterFrom.controls.todate.setValue(event.ToDate);
    }
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = true;
      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.loyaltyregisterFrom.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);

      this.dateToPass = {
        fromDate: this.datePipe.transform(paresedItem?.CONTROL_DETAIL.STRFROMDATE, 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(paresedItem?.CONTROL_DETAIL.STRTODATE, 'yyyy-MM-dd')!
      };
      this.dateToPass.fromDate? this.loyaltyregisterFrom.controls.fromdate.setValue(this.dateToPass.fromDate) : null
      this.dateToPass.toDate? this.loyaltyregisterFrom.controls.todate.setValue(this.dateToPass.toDate) : null

      // this.loyaltyregisterFrom.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.STRBRANCHES);

      this.loyaltyregisterFrom.controls.customerfrom.setValue(paresedItem?.CONTROL_DETAIL.STRCUSTCODEFROM);
      this.loyaltyregisterFrom.controls.customerto.setValue(paresedItem?.CONTROL_DETAIL.STRCUSTCODETO);

      this.loyaltyregisterFrom.controls.pointsfrom.setValue(paresedItem?.CONTROL_DETAIL.STRPOINTSFROM);
      this.loyaltyregisterFrom.controls.pointsto.setValue(paresedItem?.CONTROL_DETAIL.STRPOINTSTO);

      this.loyaltyregisterFrom.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.STRBRANCHES);
      this.fetchedBranchData= paresedItem?.CONTROL_DETAIL.STRBRANCHES.split("#")
      this.fetchedBranchDataParam = paresedItem?.CONTROL_DETAIL.STRBRANCHES
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.loyaltyregisterFrom.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };
    }
  }




  
}
