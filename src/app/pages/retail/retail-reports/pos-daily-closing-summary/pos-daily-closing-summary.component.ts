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
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { stringify } from "querystring";

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
  columnhead: any[] = ["No.Inv", "Amt.Rcvd", "Gold", "Dia & Other"];
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
  metalOptions = [
    { value: "TYPE", label: "TYPE" },
    { value: "KARAT", label: "KARAT" },
    { value: "BRAND", label: "BRAND" },
    { value: "COUNTRY", label: "COUNTRY" },
    { value: "STOCK CODE", label: "STOCK CODE" },
    { value: "CATEGORY", label: "CATEGORY" },
    { value: "COST CODE", label: "COST CODE" },
    { value: "TYPE", label: "TYPE" },
    { value: "KARAT", label: "KARAT" },
    { value: "BRAND", label: "BRAND" },
    { value: "COUNTRY", label: "COUNTRY" },
    { value: "STOCK CODE", label: "STOCK CODE" },
    { value: "CATEGORY", label: "CATEGORY" },
    { value: "COST CODE", label: "COST CODE" },
  ];

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
  fetchedBranchDataParam: any[]= [];
  fetchedBranchData: any[] =[];

  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private dataService: SuntechAPIService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.metalInsert();
    this.diamondInsert();
    this.salesManclosingInsert();
    this.vocherInsert();
    this.closingPurchaseNetInsert();
    this.posClsngSmanSummaryNet();
  }

  metalInsert() {
    let API = "UspPosClosingMetalSalesNet";

    let postData = {
      "strSalType": 0,
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
      "str_MGroupBy": this.posDailyClosingSummaryForm.value.metalType,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  diamondInsert() {
    let API = "UspPosClsngDiamondSalesNet";
    let postData = {
      "strSalType": 0,      
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
      "str_MGroupBy": this.posDailyClosingSummaryForm.value.diamondType,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  salesManclosingInsert() {
    let API = "UspOpsClsngSmanSummaryNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  vocherInsert() {
    let API = "UspPosClosingVoucherSummaryNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  closingPurchaseNetInsert() {
    let API = "UspPosClosingPosPurchaseNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              console.log(result.response);                      
              this.tableData = [];
            }
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  posClsngSmanSummaryNet(){
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
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
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

  setDateValue(event: any){
    if(event.FromDate){
      this.posDailyClosingSummaryForm.controls.fromDate.setValue(event.FromDate);
      console.log(event.FromDate)
    }
    else if(event.ToDate){
      this.posDailyClosingSummaryForm.controls.toDate.setValue(event.ToDate);
      console.log(this.posDailyClosingSummaryForm)
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
              // "STRBRANCHCODES": this.formattedBranchDivisionData,
              // "STRVOCTYPES": this.VocTypeParam,
              // "FROMVOCDATE": this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.fromDate),
              // "TOVOCDATE": this.formatDateToYYYYMMDD(this.posDailyClosingSummaryForm.value.toDate),
              // "USERBRANCH": localStorage.getItem('userbranch'),
              // "USERNAME": localStorage.getItem('username'),
              // "SHOWDATE": this.posDailyClosingSummaryForm.value.showDateCheckbox ? 0 : 1,
              // "SHOWINVOICE": this.posDailyClosingSummaryForm.value.showInvoiceCheckbox ? 0 : 1
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
        "str_MGroupBy": this.posDailyClosingSummaryForm.value.metalType || this.posDailyClosingSummaryForm.value.diamondType,
        'USERNAME': localStorage.getItem('username'),
        'MODE': localStorage.getItem('userbranch'),
        'VOCTYPE': ''
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
      this.comService.closeSnackBarMsg()
    });      
  }

}
