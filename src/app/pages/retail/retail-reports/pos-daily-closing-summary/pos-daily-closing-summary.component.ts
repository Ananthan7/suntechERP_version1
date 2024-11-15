import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonServiceService } from "src/app/services/common-service.service";
import { PosSalesmanDetailsComponent } from "./pos-salesman-details/pos-salesman-details.component";
import { PosDailyClosingBranchComponent } from "./pos-daily-closing-branch/pos-daily-closing-branch.component";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { forkJoin, Observable, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { stringify } from "querystring";
import { DomSanitizer } from "@angular/platform-browser";
import { CostCenterConsumablesDetailsComponent } from "src/app/pages/wholesale/wholesale-master/costcentre-consumable/cost-center-consumables-details/cost-center-consumables-details.component";
import { tap } from "rxjs/operators";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-pos-daily-closing-summary",
  templateUrl: "./pos-daily-closing-summary.component.html",
  styleUrls: ["./pos-daily-closing-summary.component.scss"],
})
export class PosDailyClosingSummaryComponent implements OnInit {
  @Input() content!: any;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];
  // columnhead: any[] = ["No.Inv", "", "", "Dia & Other"];
  columnheadTransaction: any[] = ["Voucher", "No.Inv", "Amount"];
  columnheadMetal: any[] = [
    "Division",
    "Type",
    "Pcs",
    "Gms",
    "Pure Wt",
    "St.Qty",
    "St.Amt",
    "Mkg.Rate",
    "Mkg.Value",
    "Metal Value",
    "Total Amount",
  ];
  columnheadDiamond: any[] = ["Division", "Type", "Pcs", "Weight", " Amount"];
  columnheadReceipt: any[] = ["Rcvd.In", " Amount"];
  columnheadScrap: any[] = ["Item Code", "Gross Wt", " Amount"];
  columnheadSales: any[] = [
    "Salesman",
    "#Docs",
    "Tot Amount",
    "Gold",
    "Dia & Others",
    "Mkg.Value",
  ];
  columnheadSalesManDetails: any[] = ["Sales Man", "#Dos"];
  userbranch = localStorage.getItem("userbranch");
  branchCode?: String;
  yearMonth?: String;
  divisionMS: any = "ID";
  metalOptions: any[] = [];
  diamondOptions: any[] = [];
  transactionOptions = [
    { value: 0, label: "Sales" },
    { value: 1, label: "Sales Returns" },
    { value: 2, label: "Net Sales" },
  ];

  posDailyClosingSummaryForm: FormGroup = this.formBuilder.group({
    transactionType: [""],
    metalType: [""],
    diamondType: [""],
    fromDate: [new Date()],
    toDate: [new Date()],
    branch: [''],
    templateName: ['']
  });
  branchDivisionControls: any;
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  popupVisible: boolean = false;
  templateNameHasValue: boolean= false;
  fetchedBranchDataParam: any= [];
  fetchedBranchData: any[] =[];
  isLoading: boolean = false;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };

  htmlPreview: any;
  VocTypeParam: any = [];
  DiamonDivsnTableData: any[] = [];
  salesmanSummaryArr: any[] = [];
  transactionWiseSummaryArr: any[] = [];
  scrapPurchseSummaryArr: any[] =[];
  receiptSummaryArr: any[] = [];
  pendingSalesOrderSummaryArr: any[] =[];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,   private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.comService.showSnackBarMsg('MSG81447');
  
    this.dropdownValueFetch().subscribe(() => {
      this.prefillScreenValues();
      const insertObservables = [
        this.metalInsert(),
        this.diamondInsert(),
        this.vocherInsert(),
        this.closingPurchaseNetInsert(),
        this.posClsngSmanSummaryNet(),
        this.receiptSummaryDataFetch(),
        this.pendingSalesOrderSummaryDataFetch(),


        this.salesManclosingInsert(),
      ];
      const validObservables = insertObservables.filter(obs => obs !== undefined && obs !== null);
      // Use forkJoin to wait till observable calls to complete
      if (validObservables.length > 0) {
        forkJoin(validObservables).subscribe(() => {
          this.comService.closeSnackBarMsg();
        });
      } else {
        console.error('No valid observables to execute.');
        // Handle the case where no valid observables are present
        this.comService.closeSnackBarMsg();
      }
    });

    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;

  }

  dropdownValueFetch(): Observable<any> {
    const apiUrl = 'UspPosClosSumGetGroupByFilter/GetUspPosClosSumGetGroupByFilter';
    return this.dataService.getDynamicAPI(apiUrl).pipe(
      tap((resp: any) => {
        this.metalOptions = resp.dynamicData[0];
        this.diamondOptions = resp.dynamicData[1];
      })
    );
  }

  pendingSalesOrderSummaryDataFetch(){
    let API = "UspOpsClsngSmanSummaryNet";
    this.isLoading = true;
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.formatDateToYYYYMMDD( this.dateToPass.fromDate ),
      "strToDate": this.formatDateToYYYYMMDD( this.dateToPass.toDate ),
    };

    this.dataService.postDynamicAPI(API, postData).subscribe((result) => {
      if (result) {       
        this.pendingSalesOrderSummaryArr =  result.dynamicData[0];
        this.isLoading = false;

        this.pendingSalesOrderSummaryArr.forEach((item: any)=>{
          for (const key in item) {
            if (typeof item[key] === 'number') {
              item[key] = this.comService.decimalQuantityFormat(item[key], 'THREE');
              item[key] = this.comService.addCommaSepration(item[key]);
            }
          }
        })         
      }
    },(err) => alert(err));
  }

  vocherInsert() {
    this.isLoading = true;
    // this.comService.showSnackBarMsg('MSG81447');
    let API = "UspPosClosingVoucherSummaryNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.formatDateToYYYYMMDD( this.dateToPass.fromDate ),
      "strToDate": this.formatDateToYYYYMMDD( this.dateToPass.toDate ),
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result) {      
            // console.log('UspPosClosingVoucherSummaryNet', result.dynamicData[0])                 
            this.transactionWiseSummaryArr = result.dynamicData[0];
            this.isLoading = false;

            this.transactionWiseSummaryArr.forEach((item: any)=>{
              for (const key in item) {
                if (typeof item[key] === 'number') {
                  item[key] = this.comService.addCommaSepration(item[key]);
                }
              }
            })  
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  metalInsert() {
    this.isLoading = true;
    // this.comService.showSnackBarMsg('MSG81447');
    let API = "UspPosClosingMetalSalesNet";
    let postData = {
      "strSalType": 0,
      "strBranch": this.branchCode,
      "strFmDate": this.formatDateToYYYYMMDD(this.dateToPass.fromDate),
      "strToDate": this.formatDateToYYYYMMDD(this.dateToPass.toDate),
      "str_MGroupBy": this.posDailyClosingSummaryForm.value.metalType,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result) {
            // console.log('UspPosClosingMetalSalesNet', result.dynamicData[0])                  
            this.tableData = result.dynamicData[0];
  
            // this.tableData.forEach((item: any)=>{
            //   for (const key in item) {
            //     if (typeof item[key] === 'number') {
            //       item[key] = this.comService.addCommaSepration(item[key]);
            //       item[key] = this.comService.decimalQuantityFormat(item[key], 'THREE');
            //     }
            //   }
            // }) 
            this.isLoading = false;
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  diamondInsert() {
    this.isLoading = true;
    // this.comService.showSnackBarMsg('MSG81447');
    let API = "UspPosClsngDiamondSalesNet";
    let postData = {
      "strSalType": 0,      
      "strBranch": this.branchCode,
      "strFmDate": this.formatDateToYYYYMMDD( this.dateToPass.fromDate ),
      "strToDate": this.formatDateToYYYYMMDD( this.dateToPass.toDate ),
      "str_MGroupBy": this.posDailyClosingSummaryForm.value.diamondType,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result) {
            // console.log('UspPosClsngDiamondSalesNet', result.dynamicData[0])                  
            this.DiamonDivsnTableData = result.dynamicData[0]; 
            this.isLoading = false;

            this.DiamonDivsnTableData.forEach((item: any)=>{
              for (const key in item) {
                if (typeof item[key] === 'number') {
                  item[key] = this.comService.addCommaSepration(item[key]);
                }
              }
            }) 
            // this.comService.closeSnackBarMsg();             
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  receiptSummaryDataFetch(){
    this.isLoading = true;
    let API = "UspPosClosingNetCollectionNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.formatDateToYYYYMMDD( this.dateToPass.fromDate ),
      "strToDate": this.formatDateToYYYYMMDD( this.dateToPass.toDate ),
    };

    this.dataService.postDynamicAPI(API, postData).subscribe((result) => {
      if (result) {       
        this.receiptSummaryArr =  result.dynamicData[0]
        this.isLoading = false;
        
        this.receiptSummaryArr.forEach((item: any)=>{
          for (const key in item) {
            if (typeof item[key] === 'number') {
              item[key] = this.comService.addCommaSepration(item[key]);
            }
          }
        }) 
      }
    },(err) => alert(err));
  }

  closingPurchaseNetInsert() {
    // this.comService.showSnackBarMsg('MSG81447');
    this.isLoading = true;
    let API = "UspPosClosingPosPurchaseNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.formatDateToYYYYMMDD( this.dateToPass.fromDate ),
      "strToDate": this.formatDateToYYYYMMDD( this.dateToPass.toDate ),
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result) {
            // console.log('UspPosClosingPosPurchaseNet', result.dynamicData[0])                     
            this.scrapPurchseSummaryArr = result.dynamicData[0];
            this.isLoading = false;

            this.scrapPurchseSummaryArr.forEach((item: any)=>{
              for (const key in item) {
                if (typeof item[key] === 'number') {
                  item[key] = this.comService.addCommaSepration(item[key]);
                }
              }
            }) 
            // this.comService.closeSnackBarMsg(); 
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  posClsngSmanSummaryNet(){
    this.isLoading = true;
    // this.comService.showSnackBarMsg('MSG81447');
    let API = "UspPosClsngSmanSummaryNet";
    let postData = { 
      "SalType": 0,   
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result) {
            // console.log('UspPosClsngSmanSummaryNet', result.dynamicData[0])
            this.salesmanSummaryArr = result.dynamicData[0];
            this.isLoading = false;

            this.salesmanSummaryArr.forEach((item: any)=>{
              for (const key in item) {
                if (typeof item[key] === 'number') {
                  item[key] = this.comService.addCommaSepration(item[key]);
                }
              }
            }) 
            // this.comService.closeSnackBarMsg(); 
          } 
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  setDateValue(event: any){
    if(event.FromDate){
      this.posDailyClosingSummaryForm.controls.fromDate.setValue(event.FromDate);
      this.dateToPass.fromDate = event.FromDate
    }
    else if(event.ToDate){
      this.posDailyClosingSummaryForm.controls.toDate.setValue(event.ToDate);
      this.dateToPass.toDate = event.ToDate
    }

    this.comService.showSnackBarMsg('MSG81447');
    const insertObservables = [
      this.metalInsert(),
      this.diamondInsert(),
      this.vocherInsert(),
      this.closingPurchaseNetInsert(),
      this.posClsngSmanSummaryNet(),
      this.receiptSummaryDataFetch(),
      this.pendingSalesOrderSummaryDataFetch(),

      this.salesManclosingInsert(),
    ];

    const validObservables = insertObservables.filter(obs => obs !== undefined && obs !== null);
    if (validObservables.length > 0) {
      forkJoin(validObservables).subscribe(() => {
        this.comService.closeSnackBarMsg();
      });
    } else {
      console.error('No valid observables to execute.');
      this.comService.closeSnackBarMsg();
    }
  }


  salesManclosingInsert() {
    // this.comService.showSnackBarMsg('MSG81447');
    let API = "UspOpsClsngSmanSummaryNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.formatDateToYYYYMMDD( this.dateToPass.fromDate ),
      "strToDate": this.formatDateToYYYYMMDD( this.dateToPass.toDate ),
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result) {       
            // console.log('UspOpsClsngSmanSummaryNet', result.dynamicData[0])          
            // this.comService.closeSnackBarMsg();    
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }


  formSubmit() {
    
  }

  update() {}

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openPosDailyClosingBranch() {
    const modalRef: NgbModalRef = this.modalService.open(
      PosDailyClosingBranchComponent,
      {
        size: "lg",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
  }

  openaddstonereturndetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      PosSalesmanDetailsComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.componentInstance.posDailyClosingSummaryFormData = this.posDailyClosingSummaryForm;
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
    this.posDailyClosingSummaryForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  popupClosed(){
    if (this.content && Object.keys(this.content).length > 0) {
      console.log(this.content)
      let ParcedPreFetchData = JSON.parse(this.content?.CONTROL_LIST_JSON)
      this.posDailyClosingSummaryForm.controls.templateName.setValue(ParcedPreFetchData.CONTROL_HEADER.TEMPLATENAME)
      this.popupVisible = false;
    }
    else{
      this.popupVisible = false;
      this.posDailyClosingSummaryForm.controls.templateName.setValue(null)
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
    console.log(this.posDailyClosingSummaryForm.controls.templateName.value)
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
              "TEMPLATENAME": this.posDailyClosingSummaryForm.controls.templateName.value,
              "FORM_NAME": this.comService.getModuleName(),
              "ISDEFAULT": 1
            },
            "CONTROL_DETAIL": {
              "strSalType": JSON.stringify( this.posDailyClosingSummaryForm.value.transactionType),
              "strBranch" : this.formattedBranchDivisionData || this.fetchedBranchDataParam,
              "strFmDate" : this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.fromDate),
              "strToDate" : this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.toDate),
              "str_MGroupBy": this.posDailyClosingSummaryForm.value.metalType,
              "LOGDATA" : '',
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
        this.activeModal.close(data);
      }
      else {
        this.toastr.error(Notifdata)
      }
    }); 
  }

  previewClick() {
    let postData = {
      "SPID": "150",
      "parameter": {
        "strSalType": JSON.stringify( this.posDailyClosingSummaryForm.value.transactionType),
        "strBranch" : this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "strFmDate" : this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.fromDate),
        "strToDate" : this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.toDate),
        "str_MGroupBy": this.posDailyClosingSummaryForm.value.metalType,
        "LOGDATA" : '',
        // "str_DGroupBy" : this.posDailyClosingSummaryForm.value.diamondType,
        // 'USERNAME': localStorage.getItem('username'),
        // 'MODE': localStorage.getItem('userbranch'),
        // 'VOCTYPE': ''
      }
    }
    // console.log(postData)  
    this.comService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      // console.log(result);
      // let data = result.dynamicData;
      // const width = window.innerWidth;
      // const height = window.innerHeight;
      // const windowFeatures = `width=${width},height=${height},fullscreen=yes`;
      // var WindowPrt = window.open(' ', ' ', windowFeatures);
      // if (WindowPrt === null) {
      //   console.error('Failed to open the print window. Possibly blocked by a popup blocker.');
      //   return;
      // }
      // let printContent = data[0][0].HTMLReport;
      // WindowPrt.document.write(printContent);
      // WindowPrt.document.close();
      // WindowPrt.focus();  
      // WindowPrt.onload = function () {
      //   if (WindowPrt && WindowPrt.document.head) {
      //     let styleElement = WindowPrt.document.createElement('style');
      //     styleElement.textContent = `
      //                 @page {
      //                     size: A5 landscape;
      //                 }
      //                 body {
      //                     margin: 0mm;
      //                 }
      //             `;
      //     WindowPrt.document.head.appendChild(styleElement);

      //     setTimeout(() => {
      //       if (WindowPrt) {
      //         WindowPrt.print();
      //       } else {
      //         console.error('Print window was closed before printing could occur.');
      //       }
      //     }, 800);
      //   }
      // };
      // this.comService.closeSnackBarMsg()

      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].HTMLReport;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.comService.closeSnackBarMsg();
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
    let postData = {
      "SPID": "150",
      "parameter": {
        "strSalType": JSON.stringify( this.posDailyClosingSummaryForm.value.transactionType),
        "strBranch" : this.formattedBranchDivisionData || this.fetchedBranchDataParam,
        "strFmDate" : this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.fromDate),
        "strToDate" : this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.toDate),
        "str_MGroupBy": this.posDailyClosingSummaryForm.value.metalType,
        "LOGDATA" : '',
        // "str_DGroupBy" : this.posDailyClosingSummaryForm.value.diamondType,
        // 'USERNAME': localStorage.getItem('username'),
        // 'MODE': localStorage.getItem('userbranch'),
        // 'VOCTYPE': ''
      }
    }
 
    this.comService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      let data = result.dynamicData;
      if(result.status == "Success"){
        let printContent = data[0][0].HTMLReport;
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
              // printWindow?.close();
             
            } else {
              Swal.fire('No Data!', 'There is no data to print!', 'info');
              this.comService.closeSnackBarMsg();
              return
            }
          }, 1500); 

        }
      }
      else{
        this.toastr.error(result.message)
        return
      }
    });  
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      this.isLoading = true;

      this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
      this.posDailyClosingSummaryForm.controls.templateName.setValue(this.content?.TEMPLATE_NAME);

      var paresedItem = JSON.parse(this.content?.CONTROL_LIST_JSON);
      this.dateToPass = {
        fromDate:  paresedItem?.CONTROL_DETAIL.strFmDate,
        toDate: paresedItem?.CONTROL_DETAIL.strToDate
      };

      this.posDailyClosingSummaryForm.controls.branch.setValue(paresedItem?.CONTROL_DETAIL.strBranch);
      this.fetchedBranchData= paresedItem?.CONTROL_DETAIL.strBranch.split("#")
      this.fetchedBranchDataParam = paresedItem?.CONTROL_DETAIL.strBranch
      
      const filteredOptions = this.transactionOptions.filter(option => option.value == paresedItem?.CONTROL_DETAIL.strSalType );
      this.posDailyClosingSummaryForm.controls.transactionType.setValue(filteredOptions[0].value);

      this.posDailyClosingSummaryForm.controls.metalType.setValue(paresedItem?.CONTROL_DETAIL.str_MGroupBy);
      this.posDailyClosingSummaryForm.controls.diamondType.setValue(paresedItem?.CONTROL_DETAIL.str_DGroupBy);

      
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.posDailyClosingSummaryForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")

      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      };

      this.posDailyClosingSummaryForm.controls.transactionType.setValue(this.transactionOptions[2].value);
      this.posDailyClosingSummaryForm.controls.metalType.setValue(this.metalOptions[0].FIELD);
      this.posDailyClosingSummaryForm.controls.diamondType.setValue(this.diamondOptions[0].FIELD);      
    }
  }


}
