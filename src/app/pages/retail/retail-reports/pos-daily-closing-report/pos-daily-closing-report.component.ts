import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-pos-daily-closing-report',
  templateUrl: './pos-daily-closing-report.component.html',
  styleUrls: ['./pos-daily-closing-report.component.scss']
})
export class PosDailyClosingReportComponent implements OnInit {
  private cssFilePath = '/assets/scss/scheme_register_pdf.scss';
  dailyClosingReportForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromdate: [new Date()],
    todate: [new Date()],
    asOnDate : [new Date()],
    salesMan: [''],
    systemStockGold: [''],
    physicalStockGold: [''],
    differenceGold: [''],
    systemStockDiamond: [''],
    physicalStock: [''],
    differenceDiamond: [''],
    remarks: [''],
    dailyStockGrandTotal: [''],
    differenceRemarks: [''],
    goldQtyPCS: [''],
    goldQtyGMS: [''],
    goldAmount: [''],
    diamondQtyPCS: [''],
    diamondQtyGMS: [''],
    diamondAmount: [''],
    totalQtyPCS: [''],
    totalQtyGMS: [''],
    totalAmount: [''],
    manualInvoiceRemarks: [''],

    //Cash On Hand Tab controls
    cashAsPerSystem: [''],
    physicalCash: [''],
    cashDiff: [''],
    openingCashBalance: [''],
    goldSummary: [''],
    diamondSummary: [''],
    otherService: [''],
    advanceSummary: [''],
    giftVoucher: [''],
    grossAmount: [''],
    cashPayment: [''],
    currencyPayment: [''],
    creditCard: [''],
    goldPurchase: [''],
    salesReturn: [''],
    redeemAdvance: [''],
    redeemGiftVoucher: [''],
    grossAmt: [''],
    closingCashBalance: [''],
    cashTrnsfrtoHO: [''],
    nonJawaharaGiftVoucher: [''],
    rounfOffAmt: [''],
    specifyOther1: [''],
    specifyOther2: [''],
    specifyOther3: [''],
    CashOnHandGrandTotal: [''],

    //Petty Cash Tab controls
    CashAsPerSystem2: [''],
    physicalCash2: [''],
    cashDifference2: [''],
    billsSenttoHO: [''],
    pendingStoreBills: [''],
    roundOffAmount2: [''],
    specifyOther4: [''],
    specifyOther5: [''],
    pettyCashGrandTotal: [''],
  })
  selectedTabIndex: number = 0; 

  valueContent: string = '';
  allowResizing: boolean = true;
  contextMenuEnabled: boolean = true;

  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  branchDivisionData: any[] = [];
  formattedBranchDivisionData: any;
  fetchedBranchData: any[] =[];
  @Input() content: any = {}; //get data from retailREPORT Component- modalRef instance
  fetchedBranchDataParam: any= [];
  templateNameHasValue: boolean= false;
  selectedRowKeys: any[] = [];
  VocTypeParam: any = [];
  isLoading: boolean = false;

  goldPurchase: any = [];


  constructor( private activeModal: NgbActiveModal,  private formBuilder: FormBuilder,  private datePipe: DatePipe,
    private dataService: SuntechAPIService, private commonService: CommonServiceService, private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.prefillScreenValues();
    this.performMultiplePostRequests();
  }

 headerCellFormatting(e: any) {
    // to make grid header center aligned
    if (e.rowType === 'header') {
      e.cellElement.style.textAlign = 'center';
    }
  } 

  setDateValue(event: any){
    if(event.FromDate){
      this.dailyClosingReportForm.controls.fromdate.setValue(event.FromDate);
      this.dateToPass.fromDate = this.datePipe.transform(event.FromDate, 'yyyy-MM-dd')!
    }
    else if(event.ToDate){
      this.dailyClosingReportForm.controls.todate.setValue(event.ToDate);
      this.dateToPass.toDate =  this.datePipe.transform(event.ToDate, 'yyyy-MM-dd')!
    }
    this.performMultiplePostRequests();
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
    this.dailyClosingReportForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  savePdf() {
    const printContent: any = document.getElementById('pdf_container');
    var WindowPrt: any = window.open(
      '',
      '_blank',
      // `height=${window.innerHeight / 1.5}, width=${window.innerWidth / 1.5}`
    );
    WindowPrt.document.write(
      '<html><head><title>SunTech - POS ' +
      new Date().toISOString() +
      '</title></head><body><div>'
    );
    const linkElement = WindowPrt.document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    linkElement.setAttribute('href', this.cssFilePath);
    WindowPrt.document.head.appendChild(linkElement);

    const bootstrapPdfLinkElement = WindowPrt.document.createElement('link');
    bootstrapPdfLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapPdfLinkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-print-css/css/bootstrap-print.min.css');
    bootstrapPdfLinkElement.setAttribute('media', 'print');
    WindowPrt.document.head.appendChild(bootstrapPdfLinkElement);

    const bootstrapLinkElement = WindowPrt.document.createElement('link');
    bootstrapLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapLinkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css');
    bootstrapLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapLinkElement.setAttribute('integrity', 'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC');
    bootstrapLinkElement.setAttribute('crossorigin', 'anonymous');
    WindowPrt.document.head.appendChild(bootstrapLinkElement);

    const bootstrapScriptLinkElement = WindowPrt.document.createElement('script');
    bootstrapScriptLinkElement.setAttribute('src', 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js');
    bootstrapScriptLinkElement.setAttribute('integrity', 'sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM');
    bootstrapScriptLinkElement.setAttribute('crossorigin', 'anonymous');
    WindowPrt.document.head.appendChild(bootstrapScriptLinkElement);

    const fontFamilyLinkElement = WindowPrt.document.createElement('link');
    fontFamilyLinkElement.setAttribute('rel', 'preconnect');
    fontFamilyLinkElement.setAttribute('href', 'https://fonts.googleapis.com');
    WindowPrt.document.head.appendChild(fontFamilyLinkElement);

    const fontFamilyLinkTwoElement = WindowPrt.document.createElement('link');
    fontFamilyLinkTwoElement.setAttribute('rel', 'preconnect');
    fontFamilyLinkTwoElement.setAttribute('href', 'https://fonts.gstatic.com');
    fontFamilyLinkTwoElement.setAttribute('crossorigin','');
    WindowPrt.document.head.appendChild(fontFamilyLinkTwoElement);

    const fontFamilyLinkThreeElement = WindowPrt.document.createElement('link');
    fontFamilyLinkThreeElement.setAttribute('rel', 'stylesheet');
    fontFamilyLinkThreeElement.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    WindowPrt.document.head.appendChild(fontFamilyLinkThreeElement);
 
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.write('</div></body></html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
    }, 800);
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }




  performMultiplePostRequests() {
    // Example API URLs and data for POST requests
    const apiUrl1 = 'RptPosSummaryStockBalanceNet'
    const apiUrl2 = 'RptPOSSummaryShowPOSAccountsNet';
    const apiUrl3 = 'RptPOSSummaryShowPOSPurchaseNet';
    const apiUrl4 = 'RptPOSSummaryShowPosNetCollectionNet';


    const postData1 = { 
      "Asondate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      "branches": this.dailyClosingReportForm.controls.branch.value,
      "Vouchers": "",
      "FixingStcode": "" 
    };
    const postData2 = { "branches": this.dailyClosingReportForm.controls.branch.value  };
    const postData3 = {  
      "Branches": this.dailyClosingReportForm.controls.branch.value, 
      "FromDate": this.dateToPass.fromDate, 
      "ToDate": this.dateToPass.toDate, 
      "Vouchers": "" 
    };
    const postData4= {
      "Branches": this.dailyClosingReportForm.controls.branch.value, 
      "FromDate": this.dateToPass.fromDate, 
      "ToDate": this.dateToPass.toDate, 
      "Vouchers": "", 
      "ShopCtrlAc": "" 
    };
    this.isLoading = true;

    // Perform POST requests in parallel using forkJoin
    forkJoin({
      request1: this.dataService.postDynamicAPI(apiUrl1, postData1),
      request2: this.dataService.postDynamicAPI(apiUrl2, postData2),
      request3: this.dataService.postDynamicAPI(apiUrl3, postData3),
      request4: this.dataService.postDynamicAPI(apiUrl4, postData4)
    }).pipe(
      catchError(error => {
        this.toastr.error('An error occurred while making requests');
        this.isLoading = false;
        return of({ request1: null, request2: null, request3: null, request4: null });
      }),

      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (responses: any) => {
        if (responses.request1) {
          console.log('Response from request1:', responses.request1);
        } else {
          // this.isLoading = false;
        }

        if (responses.request2) {
          console.log('Response from request2:', responses.request2);
        } else {
          console.log('Request 2 failed');
        }

        if (responses.request3) {
          this.goldPurchase = responses.request3.dynamicData[0]
          this.goldPurchase.forEach((item: any)=>{
            item.Amount = this.commonService.decimalQuantityFormat(item.Amount, 'AMOUNT')
          })
          // this.isLoading = false;
          console.log('Response from request3:', );
        } else {
          // this.isLoading = false;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error in one of the requests:', err);
      }
    });
  }

  prefillScreenValues(){ 
    if ( Object.keys(this.content).length > 0) {
   
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.dailyClosingReportForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = { 
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };

      let vocTypeArr: any= []
      this.selectedRowKeys.forEach((item: any)=>{
        vocTypeArr.push(item.VOCTYPE+'#') 
      })
      const uniqueArray = [...new Set( vocTypeArr )];
      const plainText = uniqueArray.join('');
      this.VocTypeParam = plainText

      
    }
  }
}
