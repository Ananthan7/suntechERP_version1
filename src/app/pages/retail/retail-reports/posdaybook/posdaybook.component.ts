import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
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
  currentTab: any;
  Collectn_GoldPurchaseGrid: any =[];
  GoldSum_collection: any = [];
  accountBalanceGrid: any =[];
  acccountMovementGrid: any= [];
  salesOrderSumaryGrid: any = [];
  salesmanSummaryGridArr: any = [];
  cashCreditSmryGrid: any = [];


  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, 
    private dataService: SuntechAPIService, private commonService: CommonServiceService, 
    private toastr: ToastrService, private sanitizer: DomSanitizer) { 

  }

  ngOnInit(): void {
    this. prefillScreenValues();
    this.currentTab = 'POS Register';
    this.POSRegisterGridData();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
    switch(this.currentTab){
      case this.currentTab = 'POS Register': this.POSRegisterGridData(); break;
      case this.currentTab = 'POS Collection & Old Gold Purchase': this.POSCollectn_GoldPurchaseGridData(); break;
      case this.currentTab = 'Movements' : this.POSMovementTabGridData(); break;
      case this.currentTab = 'Others' : this.OthersGridData(); break;
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
        fromDate:  this.formatDateToYYYYMMDD(new Date()),
        toDate: this.formatDateToYYYYMMDD(new Date()),
      };

    }
  }

  onTabChange(event: any){
    this.currentTab = event.tab.textLabel
    switch(this.currentTab){
      case 'POS Register': this.POSRegisterGridData(); break;
      case 'POS Collection & Old Gold Purchase': this.POSCollectn_GoldPurchaseGridData(); break;
      case 'Movements' : this.POSMovementTabGridData(); break;
      case 'Others' : this.OthersGridData(); break;
    }
  }

  POSRegisterGridData(){
    this.isLoading = true;
    this.commonService.showSnackBarMsg('MSG81447');
    this.userLoginBranch= localStorage.getItem('userbranch');
 
    let API = "POSDayBook/GetPOSRegisterGrid";
    let postData = {
      "strFmDate": this.dateToPass.fromDate,
      "strToDate": this.dateToPass.toDate,
      "strBranch": this.formattedBranchDivisionData? this.formattedBranchDivisionData : this.userLoginBranch
    };
    this.RegisterGridData = [];
    this.RegisterGridcolumnkeys = [];
    this.dataService.postDynamicAPI(API, postData).subscribe((result: any) => {
      if (result.status == "Success") {
        this.isLoading = false;
        if(result.dynamicData.length>0){
          this.commonService.showSnackBarMsg('data loaded successfully!');
        }
        else{
          this.commonService.showSnackBarMsg('No Data!');
        }
        // const newFilteredItem = { ...result.dynamicData[0] };
        // delete newFilteredItem.mid; // Removing the mid property
        // this.RegisterGridData.push(newFilteredItem);                 
        // this.RegisterGridcolumnkeys = Object.keys(this.RegisterGridData);
        // this.RegisterGridcolumnkeys.map((key: any) => key.replace(/_/g, ' '));
   

        // this.RegisterGridData.forEach((item: any) => {
        //   item.vocdate = this.formatDate(item.vocdate)
        //   for (const key in item) {
        //     if (typeof item[key] === 'number' && key !== 'mid') {
        //       item[key] = this.customizeText(item[key]);
        //     }
        //   }
        // });


        this.RegisterGridData = result.dynamicData[0];
        console.log(this.RegisterGridData)
        this.RegisterGridData?.forEach((item: any) => {
          for (const key in item) {
            if (typeof item[key] === 'number' && key !== 'mid' && key !== 'vocno') {
              item[key] = this.customizeText(item[key], 2);
            }
          }
        });
        this.RegisterGridcolumnkeys = [
          // { dataField: 'mid', caption: 'ID' },
          { dataField: 'vocno', caption: 'Voucher No' },
          { dataField: 'vocdate', caption: 'Voucher Date', dataType: 'date' },
          { dataField: 'sman', caption: 'Salesman' },
          { dataField: 'GrossAmt', caption: 'Gross Amount', alignment: 'right' },
          { dataField: 'CC_CommissionAmt', caption: 'Commission Amount', alignment: 'right' },
          { dataField: 'invamt', caption: 'Invoice Amount', alignment: 'right' },




          { dataField: 'branch_code', caption: 'Branch Code' },
          { dataField: 'VOCTYPE', caption: 'Voucher Type' },
          { dataField: 'sretamt', caption: 'sretamt', alignment: 'right' },
          { dataField: 'scpamt', caption: 'scpamt', alignment: 'right' },
          { dataField: 'roundoff', caption: 'Round Off', alignment: 'right' },
          { dataField: 'lcreceived', caption: 'LC Received', alignment: 'right'},
          { dataField: 'fc', caption: 'fc' },
          { dataField: 'fcreceived', caption: 'fcreceived' },
          { dataField: 'creditcrd', caption: 'Credit Card', alignment: 'right' },
          { dataField: 'advance', caption: 'Advance', alignment: 'right' },
          { dataField: 'creditac', caption: 'Credit Ac', alignment: 'right' },
          { dataField: 'creditamt', caption: 'Credit Amount', alignment: 'right' },
          { dataField: 'others', caption: 'Others', alignment: 'right' }
        ];
      }
      else{
        this.toastr.error(result.status);
        this.commonService.closeSnackBarMsg();
        this.isLoading = false;
      }
    },(err: any) => this.toastr.error(err)); 
    this.commonService.closeSnackBarMsg();
    this.isLoading = false;
  }
  customizeText(data: any, decimalPoints: any) {
    return Number(data).toFixed(decimalPoints);
  }
  customizeSummaryContent(data: any) {
    return Number(data.value).toFixed(2);
  }

  POSCollectn_GoldPurchaseGridData(){
    this.isLoading = true;
    this.userLoginBranch = localStorage.getItem('userbranch');
    this.commonService.showSnackBarMsg('MSG81447');

    const API1 = "POSDayBook/GetPOSNetCollectionGrid";
    const postData1 = {
        "strFmDate": this.dateToPass.fromDate,
        "strToDate": this.dateToPass.toDate,
        "strBranch": this.formattedBranchDivisionData ? this.formattedBranchDivisionData : this.userLoginBranch
    };

    const API2 = "POSDayBook/GetOldGoldSummGrid";
    const postData2 = {
        "strFmDate": this.dateToPass.fromDate,
        "strToDate": this.dateToPass.toDate,
        "strBranch": this.formattedBranchDivisionData ? this.formattedBranchDivisionData : this.userLoginBranch
    };

    const API3 = "POSDayBook/GetPOSAcctBalanceGrid/MOE";
   
    this.Collectn_GoldPurchaseGrid = [];
    this.GoldSum_collection = [];
    forkJoin({
        collectionData: this.dataService.postDynamicAPI(API1, postData1),
        goldSumData: this.dataService.postDynamicAPI(API2, postData2),
        accountBalance: this.dataService.getDynamicAPI(API3)
    }).subscribe({
        next: (response) => {
          this.Collectn_GoldPurchaseGrid = response.collectionData.dynamicData[0];
          this.Collectn_GoldPurchaseGrid?.forEach((item: any) => {
            for (const key in item) {
              if (typeof item[key] === 'number' && key !== 'mid') {
                item[key] = this.customizeText(item[key], 2);
              }
            }
          });

          this.GoldSum_collection = response.goldSumData.dynamicData[0];
           this.GoldSum_collection?.forEach((item: any) => {
            for (const key in item) {
              if (typeof item[key] === 'number' && key !== 'mid') {
                item[key] = this.customizeText(item[key], 2);
              }
            }
          });

          console.log('GetPOSAcctBalanceGrid', response)
          this.accountBalanceGrid = response.accountBalance.dynamicData[0];
           this.accountBalanceGrid?.forEach((item: any) => {
            for (const key in item) {
              if (typeof item[key] === 'number' && key !== 'mid') {
                item[key] = this.customizeText(item[key], 2);
              }
            }
          });

          if(response.collectionData.dynamicData[0].length>0 ||  response.goldSumData.dynamicData[0].length>0){
            this.commonService.showSnackBarMsg('data loaded successfully!');
            this.isLoading = false;
          }
          else{
            this.commonService.showSnackBarMsg('No Data!');
            this.isLoading = false;
          }
        },
        error: (error) => {
            console.error('Error loading data:', error);
            this.commonService.showSnackBarMsg('Error loading data.');
            this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
    });
  }

  POSMovementTabGridData(){
    this.isLoading = true;
    this.userLoginBranch = localStorage.getItem('userbranch');
    this.commonService.showSnackBarMsg('MSG81447');

    const API1 = "POSDayBook/GetPOSAccountMovement";
    const postData1 = {
        "strFmDate": this.formatDateToYYYYMMDD(this.dateToPass.fromDate),
        "strToDate": this.dateToPass.toDate,
        "strBranch": this.formattedBranchDivisionData ? this.formattedBranchDivisionData : this.userLoginBranch
    };

    const API2 = "POSDayBook/GetPOSSalesOrdSumm";
    const postData2 = {
      "strFmDate": this.formatDateToYYYYMMDD(this.dateToPass.fromDate),
      "strToDate": this.dateToPass.toDate
    };

    forkJoin({
      movementData: this.dataService.postDynamicAPI(API1, postData1),
      salesOrderSum: this.dataService.postDynamicAPI(API2, postData2),
    }).subscribe({
      next: (response) => { 
        this.acccountMovementGrid = response.movementData.dynamicData[0];
        this.acccountMovementGrid.forEach((item: any) => {
          for (const key in item) {
            if (typeof item[key] === 'number' && key !== 'mid') {
              item[key] = this.customizeText(item[key], 2);
            }
          }
        });

        this.salesOrderSumaryGrid = response.salesOrderSum.dynamicData[0];
        this.salesOrderSumaryGrid.forEach((item: any) => {
          for (const key in item) {
            if (typeof item[key] === 'number' && key !== 'mid') {
              item[key] = this.customizeText(item[key], 2);
            }
          }
        });


        if(response.movementData.dynamicData[0].length>0 ||  response.salesOrderSum.dynamicData[0].length>0){
          this.commonService.showSnackBarMsg('data loaded successfully!');
          this.isLoading = false;
        }
        else{
          this.commonService.showSnackBarMsg('No Data!');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.commonService.showSnackBarMsg('Error loading data.');
        this.isLoading = false;
      
      },
    })

  }

  OthersGridData(){
    this.isLoading = true;
    this.userLoginBranch = localStorage.getItem('userbranch');
    this.commonService.showSnackBarMsg('MSG81447');

    const API1 = "POSDayBook/GetSmanWiseSummgrid";
    const postData1 = {
      "strFmDate": this.formatDateToYYYYMMDD(this.dateToPass.fromDate),
      "strToDate": this.dateToPass.toDate,
    };

    const API2 = "POSDayBook/GetCashCreditSummgrid";
    const postData2 = {
      "strFmDate": this.formatDateToYYYYMMDD(this.dateToPass.fromDate),
      "strToDate": this.dateToPass.toDate,
      "strBranch": this.formattedBranchDivisionData ? this.formattedBranchDivisionData : this.userLoginBranch
    };

    forkJoin({
      salesmanSummary: this.dataService.postDynamicAPI(API1, postData1),
      cashCreditSummry: this.dataService.postDynamicAPI(API2, postData2),
    }).subscribe({
      next: (response) => { 
        this.salesmanSummaryGridArr = response.salesmanSummary?.dynamicData?.[0];
        this.salesmanSummaryGridArr?.forEach((item: any) => {
          for (const key in item) {
            if (typeof item[key] === 'number' && key !== 'mid') {
              item[key] = this.customizeText(item[key], 2);
            }
          }
        }); 

        this.cashCreditSmryGrid = response.cashCreditSummry.dynamicData?.[0];
        this.cashCreditSmryGrid?.forEach((item: any) => {
          for (const key in item) {
            if (typeof item[key] === 'number' && key !== 'mid') {
              item[key] = this.customizeText(item[key], 2);
            }
          }
        });

        if(response.salesmanSummary.dynamicData?.[0]?.length>0 || response.cashCreditSummry.dynamicData?.[0]?.length>0){
          this.commonService.showSnackBarMsg('data loaded successfully!');
          this.isLoading = false;
        }
        else{
          this.commonService.showSnackBarMsg('No Data!');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.commonService.showSnackBarMsg('Error loading data.');
        this.isLoading = false;
      
      },
    })
  }
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
