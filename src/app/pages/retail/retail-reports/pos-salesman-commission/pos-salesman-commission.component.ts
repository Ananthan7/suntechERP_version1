import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pos-salesman-commission',
  templateUrl: './pos-salesman-commission.component.html',
  styleUrls: ['./pos-salesman-commission.component.scss']
})
export class PosSalesmanCommissionComponent implements OnInit {

  columnhead: any[] = ['S.No', 'Salesman', 'Amount',];
  @Input() content!: any;
  tableData: any[] = [];
  detailData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  selectRowIndex: any;
  tableRowCount: number = 0;
  currentDate = new Date();
  viewMode: boolean = false;
  selectedKey: number[] = []
  isLoading: boolean = false;

  jewelleryaltrationdetail: any[] = [];
  SalesmanCommissionForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],
    lossaccount: [''],
    salesMan: [''],
    commissionPercentage: [''],
    amountLC: [''],

    salesManFrom: [''],
    salesManTo: [''],
    groupBySelection: ['']
  });
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  fetchedBranchData: any[] =[];
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  
  private subscriptions: Subscription[] = [];
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  fetchedBranchDataParam: any= [];
  userLoginBranch : any;
  htmlPreview: any;
  @Input() reportVouchers: any; //get Voucherdata from retailREPORT Component- GetReportVouchers API
  selectedDatas: any[]= [];
  VocTypeParam: any = [];


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private sanitizer: DomSanitizer, private datePipe: DatePipe
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
    this.SalesmanCommissionForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  prefillScreenValues(){
    this.userLoginBranch= localStorage.getItem('userbranch');

    if ( Object.keys(this.content).length > 0) {
      this.isLoading = false;
      // console.log('data fetched from main grid',this.content )
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON) //data from retailREPORT Component- modalRef instance

      this.SalesmanCommissionForm.controls.branch.setValue( ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCHES );
      this.fetchedBranchDataParam = ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCHES+'#';
      this.fetchedBranchData= ParcedPreFetchData?.CONTROL_DETAIL.STRBRANCHES;

      this.dateToPass = {
        fromDate:  ParcedPreFetchData?.CONTROL_DETAIL.FRVOCDATE,
        toDate: ParcedPreFetchData?.CONTROL_DETAIL.TOVOCDATE
      };

      this.templateNameHasValue = !!ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME;
      this.SalesmanCommissionForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)

      console.log( ParcedPreFetchData?.CONTROL_DETAIL)
      let splittedText= ParcedPreFetchData?.CONTROL_DETAIL.STRVOCTYPE1?.split("#")  
      const selectedKeys = this.reportVouchers.filter((item: any) => splittedText?.includes(item.VOCTYPE)).map((item: any) => item);;
      this.selectedKey = selectedKeys;

      this.SalesmanCommissionForm.controls.salesManFrom.setValue(ParcedPreFetchData?.CONTROL_DETAIL.STRFRSMAN)
      this.SalesmanCommissionForm.controls.salesManTo.setValue(ParcedPreFetchData?.CONTROL_DETAIL.STRTOSMAN)

      let vocTypeArr: any= []
      this.selectedKey.forEach((item: any)=>{
        vocTypeArr.push(item.VOCTYPE+'#') 
      })
      const uniqueArray = [...new Set( vocTypeArr )];
      const plainText = uniqueArray.join('');
      this.VocTypeParam = plainText
    }
    else{
      
      const formattedUserBranch = this.userLoginBranch ? `${this.userLoginBranch}#` : null;
      this.SalesmanCommissionForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };

    }
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.SalesmanCommissionForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.SalesmanCommissionForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.SalesmanCommissionForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.SalesmanCommissionForm.controls.templateName.setValue(null)
    }
  }

  onGridSelection(event: any) {
    this.selectedKey= event.selectedRowKeys;
    this.selectedDatas = event.selectedRowsData;
    let vocTypeArr: any= []
    this.selectedDatas.forEach((item: any)=>{
      vocTypeArr.push(item.VOCTYPE+'#') 
    })
    const uniqueArray = [...new Set( vocTypeArr )];
    const plainText = uniqueArray.join('');
    this.VocTypeParam = plainText
  }


  saveTemplate(){
    this.popupVisible = true;
    console.log(this.SalesmanCommissionForm.controls.templateName.value)
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
              "TEMPLATENAME": this.SalesmanCommissionForm.controls.templateName.value,
              "FORM_NAME": this.commonService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "STRVOCTYPE1" : this.VocTypeParam || '',
              "STRVOCTYPE2" : this.VocTypeParam || '',
              "STRBRANCHES" : this.formattedBranchDivisionData || this.fetchedBranchDataParam,
              "STRFRSMAN" : this.SalesmanCommissionForm.controls.salesManFrom.value,
              "STRTOSMAN" : this.SalesmanCommissionForm.controls.salesManTo.value,
              "FRVOCDATE" : this.datePipe.transform(this.dateToPass.fromDate, 'yyyy-MM-dd'),
              "TOVOCDATE" : this.datePipe.transform(this.dateToPass.toDate, 'yyyy-MM-dd'),
              "LOGINBRANCH" : this.userLoginBranch,
              "LOGDATA" : '',
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
    this.isLoading = true;
    let postData = {
      "SPID": "0159",
      "parameter": {
        "STRVOCTYPE1" : this.VocTypeParam || '',
        "STRVOCTYPE2" : this.VocTypeParam || '',
        "STRBRANCHES" : this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "STRFRSMAN" : this.SalesmanCommissionForm.controls.salesManFrom.value,
        "STRTOSMAN" : this.SalesmanCommissionForm.controls.salesManTo.value,
        "FRVOCDATE" : this.datePipe.transform(this.dateToPass.fromDate, 'yyyy-MM-dd'),
        "TOVOCDATE" : this.datePipe.transform(this.dateToPass.toDate, 'yyyy-MM-dd'),
        "LOGINBRANCH" : this.userLoginBranch,
        "LOGDATA" : '',
      }
    }
    console.log(postData)  
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      // console.log(result);
      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].HTMLOUT;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.commonService.closeSnackBarMsg();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.isLoading = false;
      }
      else{
        this.toastr.error(result.message);
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
      "SPID": "0114",
      "parameter": {
        "STRBRANCHCODES": this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "STRVOCTYPES": this.VocTypeParam, //this.commonService.getqueryParamVocType(),
        "FROMVOCDATE": this.datePipe.transform(this.dateToPass.fromDate, 'yyyy-MM-dd'),
        "TOVOCDATE": this.datePipe.transform(this.dateToPass.toDate, 'yyyy-MM-dd') ,
        "flag": '',
        "USERBRANCH": localStorage.getItem('userbranch'),
        "USERNAME": localStorage.getItem('username'),
        "Logdata": JSON.stringify(logData)
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      if(result.status == "Success"){
        let printContent = data[0][0].HTMLINPUT;
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
              printWindow?.document.close();
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
      }
      else{
        this.toastr.error(result.message);
        this.isLoading = false;
        return
      }
    });  
  }


}
