import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-possummary',
  templateUrl: './possummary.component.html',
  styleUrls: ['./possummary.component.scss']
})
export class POSSummaryComponent implements OnInit {
  @Input() content!: any; 
  POS_SummaryForm: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    templateName: [''],

    serviceChargeBoolean: [true],

    

  });
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  pointOfSalesSummaryArr: any = [];
  receiptSummaryArr: any = [];
  isLoading: boolean = false;
  currentTabIndex: number = 0;
  availableStockGridDataArr: any = [];
  posCollectionGridDataArr: any = [];
  posPurchaseGridDataArr: any = [];
  accountsGridDataArr: any = [];
  popupVisible: boolean = false;
  templateNameHasValue: boolean = false
  tabChangeLoader: boolean = false;
  htmlPreview: any;


  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    private commonService: CommonServiceService, private dataService: SuntechAPIService,
    private toastr: ToastrService, private datePipe: DatePipe, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    // this.pointOfSalesSummaryGridData();

    this.pointOfSalesSummary_ReceiptGridData().subscribe({
      next: () => {
        //trigger onTabChange only after completing pointOfSalesSummaryGridData API call
        this.onTabChange({ index: this.currentTabIndex });
      },
      error: (err: any) => {
        console.error('API call failed', err);
      }
    });
  }

  headerCellFormatting(e: any) {
    // to make grid header center aligned
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
    }
  } 

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.POS_SummaryForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.POS_SummaryForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate = this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }

    this.pointOfSalesSummary_ReceiptGridData().subscribe({
      next: () => {
        this.onTabChange({ index: this.currentTabIndex });
      },
      error: (err: any) => {
        console.error('API call failed', err);
      }
    });
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.POS_SummaryForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.POS_SummaryForm.controls.templateName.setValue(null)
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

    this.formattedBranchDivisionData = branchDivisionData
    this.POS_SummaryForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }


  pointOfSalesSummary_ReceiptGridData(): Observable<any>{
    this.isLoading = true;
    let API1 = "RptPosSummaryShowVoctypeNet";
    let postData1 = { 
      "Branches":  this.POS_SummaryForm.controls.branch.value,
      "FromDate":  this.dateToPass.fromDate,
      "ToDate":  this.dateToPass.toDate,
      "Vouchers": "",
      "VocTypeWise": 0
    };

    let API2 = "UspPOSReceiptsNet";
    let receiptPostData = { 
      "strDateFm":  this.dateToPass.fromDate, 
      "strDateTo": this.dateToPass.toDate,
      "strBranch": this.POS_SummaryForm.controls.branch.value,
      "strBRFLAG": false 
    };
    
    forkJoin({
      salesSummaryData: this.dataService.postDynamicAPI(API1, postData1),
      receiptSummaryData: this.dataService.postDynamicAPI(API2, receiptPostData),
    }).subscribe({
        next: (result) => {
          if (result) {
            this.pointOfSalesSummaryArr = result.salesSummaryData.dynamicData[0];
            this.receiptSummaryArr = result.receiptSummaryData.dynamicData[0];

            if(result.salesSummaryData.dynamicData[0].length>0 ||  result.receiptSummaryData.dynamicData[0].length>0){
              this.commonService.showSnackBarMsg('data loaded successfully!');
              this.isLoading = false;
            }
            else{
              this.commonService.showSnackBarMsg('No data available for the given criteria in POS Summary and POS Receipt!');
              this.isLoading = false;
            }
          }
          else{
            this.pointOfSalesSummaryArr = [];
            this.receiptSummaryArr = [];
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
    return new Observable(observer => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 2000);
    });
  }

  onTabChange(event: any){
    this.currentTabIndex = event.index; 
    switch(this.currentTabIndex){
      case 0: 
      this.availableStockGridData();
      break;
      case 1: 
        this.POSCollectnGridData();
        break;
      case 2: 
        this.posPurchaseGridData();
        break;
      case 3: 
        this.accountsGridData();
        break;
      default:
        break;
    }
  }
  availableStockGridData(){
    this.tabChangeLoader = true;
    let API = "RptPosSummaryStockBalanceNet";
    let postData = { 
      "Asondate": this.dateToPass.toDate,
      "branches": this.POS_SummaryForm.controls.branch.value,
      "Vouchers": "",
      "FixingStcode": ""
    };
    this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        if (result && result.dynamicData) {
          if(result.dynamicData[0].length> 0){
            this.availableStockGridDataArr = result.dynamicData[0];
            this.toastr.success(result.dynamicData.status || 'Success');
          }
          else{
            this.toastr.warning('No data available for the given criteria in Available Stock.');
          }
          this.tabChangeLoader = false;
        } else {
          this.posCollectionGridDataArr = [];
          this.toastr.warning('No data available for the given criteria in Available Stock.');
          this.tabChangeLoader = false;
        }
      },
      (err) => {
        this.toastr.error(err.message || 'An error occurred while fetching the data.');
        this.tabChangeLoader = false;
      }
    );
  }
  POSCollectnGridData(){
    this.tabChangeLoader = true;
    let API = "RptPOSSummaryShowPosNetCollectionNet";
    let postData = { 
      "Branches": this.POS_SummaryForm.controls.branch.value,
      "FromDate": this.dateToPass.fromDate,
      "ToDate": this.dateToPass.toDate,
      "Vouchers": "",
      "ShopCtrlAc": ""
    };
    this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        if (result && result.dynamicData) {
          if(result.dynamicData[0].length> 0){
            this.posCollectionGridDataArr = result.dynamicData[0];
            this.toastr.success(result.dynamicData.status || 'Success');
          }
          else{
            this.toastr.warning('No data available for the given criteria in POS Collection.');
          }
          this.tabChangeLoader = false;
        } else {
          this.posCollectionGridDataArr = [];
          this.toastr.warning('No data available for the given criteria in POS Collection.');
          this.tabChangeLoader = false;
        }
      },
      (err) => {
        this.toastr.error(err.message || 'An error occurred while fetching the data.');
        this.tabChangeLoader = false;
      }
    );
  }
  posPurchaseGridData(){
    this.tabChangeLoader = true;
    let API = "RptPOSSummaryShowPOSPurchaseNet";
    let postData = { 
      "Branches": this.POS_SummaryForm.controls.branch.value,
      "FromDate": this.dateToPass.fromDate,
      "ToDate": this.dateToPass.toDate,
      "Vouchers": ""
    };
    this.dataService.postDynamicAPI(API, postData).subscribe((result) => {
      if (result && result.dynamicData) {
        if(result.dynamicData[0].length> 0){
          this.posPurchaseGridDataArr = result.dynamicData[0];
          this.toastr.success(result.dynamicData.status || 'Success');
        }
        else{
          this.toastr.warning('No data available for the given criteria in POS Purchase.');
        }
        this.tabChangeLoader = false;
      } else {
        this.posCollectionGridDataArr = [];
        this.toastr.warning('No data available for the given criteria in POS Purchase.');
        this.tabChangeLoader = false;
        }
      },
      (err) => {
        this.toastr.error(err.message || 'An error occurred while fetching the data.');
        this.tabChangeLoader = false;
      }
    );
  }
  accountsGridData(){
    this.tabChangeLoader = true;
    let API = "RptPOSSummaryShowPOSAccountsNet";
    let postData = { 
      "branches": this.POS_SummaryForm.controls.branch.value,
    };
    this.dataService.postDynamicAPI(API, postData).subscribe((result) => {
      if (result && result.dynamicData) {
        if(result.dynamicData[0].length> 0){
          console.log(result.dynamicData[0])
          this.accountsGridDataArr = result.dynamicData[0];
          this.toastr.success(result.dynamicData.status || 'Success');
        }
        else{
          this.toastr.warning('No data available for the given criteria in Accounts.');
        }
        this.tabChangeLoader = false;
      } else {
        this.posCollectionGridDataArr = [];
        this.toastr.warning('No data available for the given criteria in Accounts.');
        this.tabChangeLoader = false;
        }
      },
      (err) => {
        this.toastr.error(err.message || 'An error occurred while fetching the data.');
        this.tabChangeLoader = false;
      }
    );
  }

  saveTemplate(){
    this.popupVisible = true;
    console.log(this.POS_SummaryForm.controls.templateName.value)
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
              "TEMPLATENAME": this.POS_SummaryForm.controls.templateName.value,
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
    this.isLoading = true;
    this.tabChangeLoader = true;
    let postData = {
      "SPID": "0182",
      "parameter": {
       "Branches ": this.POS_SummaryForm.controls.branch.value,
       "FromDate ": this.dateToPass.fromDate, 
       "ToDate ": this.dateToPass.toDate, 
       "Vouchers ": '',
       "VocTypeWise ": 0,
      }
    }
 
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].POS_Summary_HTML;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.commonService.closeSnackBarMsg();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.isLoading = false;
        this.tabChangeLoader = false;
      }
      else{
        this.toastr.error(result.message);
        this.isLoading = false;
        this.tabChangeLoader = false;
        return
      }
    });      
  }

  printBtnClick(){
    this.isLoading = true;
    this.tabChangeLoader = true;
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
      "SPID": "0182",
      "parameter": {
       "Branches ": this.POS_SummaryForm.controls.branch.value,
       "FromDate ": this.dateToPass.fromDate, 
       "ToDate ": this.dateToPass.toDate, 
       "Vouchers ": '',
       "VocTypeWise ": 0,
      }
    }
    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      let printContent = data[0][0].POS_Summary_HTML;
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

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write(modifiedContent);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
        this.isLoading = false;
        this.tabChangeLoader = false;
       
      } else {
        Swal.fire('No Data!', 'There is no data to print!', 'info');
        this.commonService.closeSnackBarMsg();
        this.isLoading = false;
        this.tabChangeLoader = false;
        return
      }
    }, 3000); 
  }


  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = false;

      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);

      this.dateToPass = {
        fromDate:  this.content?.FROMVOCDATE,
        toDate: this.content?.TOVOCDATE,
      };

      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON) //data from retailREPORT Component- modalRef instance
      this.POS_SummaryForm.controls.branch.setValue(`${ParcedPreFetchData?.CONTROL_DETAIL?.USERBRANCH}#`);
     
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.POS_SummaryForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };

    }
  }


  customizeMainGridSummaryContent = (data: any) => {
    // value separation handler from commonService
    return this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT');
  };
  customizeMainGridContent = (data: any) => {
    const formattedValue = this.commonService.decimalQuantityFormat(data.value, 'AMOUNT');

    return Number(formattedValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  customizeSummaryContent = (data: any) => {
    // value separation handler from commonService
    return this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT');
  };
  customizeContent = (data: any) => {
    const formattedValue = this.commonService.decimalQuantityFormat(data.value, 'AMOUNT');

    return Number(formattedValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  customizePOS_ClctnContent = (data: any) => {
    const formattedValue = this.commonService.decimalQuantityFormat(data.value, 'AMOUNT');

    return Number(formattedValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  customizePOS_ClctnSummaryContent = (data: any) => {
    // value separation handler from commonService
    return this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT');
  };
 
  customizePOS_PurChseContent = (data: any) => {
    const formattedValue = this.commonService.decimalQuantityFormat(data.value, 'AMOUNT');

    return Number(formattedValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  customizePOS_PurChseSummaryContent = (data: any) => {
    // value separation handler from commonService
    return this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT');
  };

  customizeAccountsContent = (data: any) => {
    const formattedValue = this.commonService.decimalQuantityFormat(data.value, 'AMOUNT');

    return Number(formattedValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  customizeAccountsSummaryContent = (data: any) => {
    // value separation handler from commonService
    return this.commonService.setCommaSerperatedNumber(data.value, 'AMOUNT');
  };
  
}
