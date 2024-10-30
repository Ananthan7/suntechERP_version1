import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-posdaybook',
  templateUrl: './posdaybook.component.html',
  styleUrls: ['./posdaybook.component.scss']
})
export class POSDaybookComponent implements OnInit {
  isLoading: boolean = false;
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };

  posDayBookForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromDate : [new Date()],
    toDate : [new Date()],
    reportTo : ['preview'],

    templateName: ['']
  })
  htmlPreview: any;
  VocTypeParam: any = [];
  previewpopup: boolean = false;
  popupVisible: boolean = false;
  @Input() content!: any;  //for getting data from retail reports
  templateNameHasValue: boolean= false;
  userLoginBranch: any;

  RegisterGridData: any =[];
  RegisterGridcolumnkeys: any;

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, 
    private dataService: SuntechAPIService, private commonService: CommonServiceService, 
    private toastr: ToastrService, private sanitizer: DomSanitizer) { 

  }

  ngOnInit(): void {
    this. prefillScreenValues();
    this.gridData();
  }

  gridData(){
    this.userLoginBranch= localStorage.getItem('userbranch');
    this.commonService.showSnackBarMsg('MSG81447');
    let API = "/POSDayBook/GetPOSRegisterGrid";
    let postData = {
      "strFmDate": this.dateToPass.fromDate,
      "strToDate": this.dateToPass.toDate,
      "strBranch": this.formattedBranchDivisionData? this.formattedBranchDivisionData : this.userLoginBranch
    };
    
    this.dataService.postDynamicAPI(API, postData).subscribe((result: any) => {
      if (result.status == "Success") {
        this.toastr.success(result.status);                    
        this.RegisterGridData.push(result.dynamicData[0][0]);
        this.RegisterGridcolumnkeys = Object.keys(this.RegisterGridData[0]);
        this.RegisterGridcolumnkeys.map((key: any) => key.replace(/_/g, ' '));
       
      

        console.log(this.RegisterGridData)
        this.commonService.closeSnackBarMsg();
      }
      else{
        this.toastr.error(result.status);
        this.commonService.closeSnackBarMsg();
      }
    },(err: any) => this.toastr.error(err)); this.commonService.closeSnackBarMsg();
  }
  customizeText(data: any) {
    return Number(data).toFixed(2);
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
    this.posDayBookForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.posDayBookForm.controls.fromDate.setValue(event.FromDate);
      this.dateToPass.fromDate = event.FromDate
    }
    else if(event.ToDate){
      this.posDayBookForm.controls.toDate.setValue(event.ToDate);
      this.dateToPass.toDate = event.ToDate
    }
    this.gridData();
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
    console.log(this.posDayBookForm.controls.templateName.value)
  }
  saveTemplate_DB(){
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
    const payload = {
      "SPID": "0115",
      "parameter": {
        "FLAG": 'INSERT',
        "CONTROLS": JSON.stringify({
            "CONTROL_HEADER": {
              "USERNAME": localStorage.getItem('username'),
              "TEMPLATEID": this.commonService.getModuleName(),
              "TEMPLATENAME": this.posDayBookForm.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "STRFMDATE" : this.dateToPass.fromDate,   
              "STRTODATE" : this.dateToPass.toDate,   
              "STRBRANCH" : this.formattedBranchDivisionData,
              "USERBRANCH" : this.commonService.branchCode,
              "LOGDATA": JSON.stringify(logData)
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
    let logData =  {
      "VOCTYPE": this.commonService.getqueryParamVocType() || "",
      "REFMID": "",
      "USERNAME": this.commonService.userName,
      "MODE": "",
      "DATETIME": this.commonService.formatDateTime(new Date()),
      "REMARKS":"",
      "SYSTEMNAME": "",
      "BRANCHCODE": this.commonService.branchCode,
      "VOCNO": "",
      "VOCDATE": "",
      "YEARMONTH" : this.commonService.yearSelected
    }
    let postData = {
      "SPID": "165",
      "parameter": {
        "STRFMDATE" : this.formatDateToYYYYMMDD(this.dateToPass.fromDate),  
        "STRTODATE" : this.formatDateToYYYYMMDD(this.dateToPass.toDate),   
        "STRBRANCH" : this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "USERBRANCH" : this.commonService.branchCode,
        "LOGDATA": JSON.stringify(logData)
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result);
      this.previewpopup = true;
      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].HTMLOUT;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.commonService.closeSnackBarMsg();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
      else{
        this.toastr.error(result.message)
        return
      }
    });      
  }

  printBtnClick(){
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
      "SPID": "165",
      "parameter": {
        "STRFMDATE" : this.dateToPass.fromDate,   
        "STRTODATE" : this.dateToPass.toDate,   
        "STRBRANCH" : this.formattedBranchDivisionData,
        "USERBRANCH" : this.commonService.branchCode,
        "LOGDATA": JSON.stringify(logData)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      let printContent = data[0][0].HTMLINPUT;
      this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);

      if (result.dynamicData) {
        this.commonService.closeSnackBarMsg();
      }
    });  
   
    
    setTimeout(() => {
      const content = this.htmlPreview?.changingThisBreaksApplicationSecurity;
      
      let  userBranchDesc:any  = localStorage.getItem('BRANCH_PARAMETER')
      userBranchDesc = JSON.parse(userBranchDesc)

      if (content && Object.keys(content).length !== 0) {
        const modifiedContent = content.replace(/<title>.*?<\/title>/, `<title>${userBranchDesc.DESCRIPTION}</title>`);

        //          workout for binding title from 2nd sheet
        // const sections = content.match(/<div class="footer2">*?<\/div>/g); // Use the correct regex syntax
        // const pageCount = sections ? sections.length : 1; // Default to 1 if no sections found
        // console.log('Estimated Page content:', content);
        // console.log('Estimated Page Count:', pageCount);

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write(modifiedContent);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
        printWindow?.close();
       
      } else {
        Swal.fire('No Data!', 'There is no data to print!', 'info');
        this.commonService.closeSnackBarMsg();
        return
      }
    }, 3000); 
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.posDayBookForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.posDayBookForm.controls.templateName.setValue(null)
    }
  }

  prefillScreenValues(){ 
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = false;
      console.log('data fetched from main grid',this.content )
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON) //data from retailREPORT Component- modalRef instance
  
      this.templateNameHasValue = !!ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME;
      this.posDayBookForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
 
      this.dateToPass = {
        fromDate:  ParcedPreFetchData?.CONTROL_DETAIL.STRFMDATE,
        toDate: ParcedPreFetchData?.CONTROL_DETAIL.STRTODATE
      };
 
      this.posDayBookForm.controls.branch.setValue( ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCH? 
        ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCH : ParcedPreFetchData?.CONTROL_DETAIL.USERBRANCH+'#');
      this.fetchedBranchDataParam = ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCH+'#'
      this.fetchedBranchData= ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCH
      console.log('xxx', this.fetchedBranchDataParam)
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.posDayBookForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.commonService.formatYYMMDD(new Date()),
        toDate: this.commonService.formatYYMMDD(new Date()),
      };

    }
  }


  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
