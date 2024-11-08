import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
import { PosDailyClosingSummaryComponent } from './pos-daily-closing-summary/pos-daily-closing-summary.component';
import { RetailAdvanceReceiptRegisterComponent } from './retail-advance-receipt-register/retail-advance-receipt-register.component';
import { PosCustomerFeedbackFollowupComponent } from './pos-customer-feedback-followup/pos-customer-feedback-followup.component';
import { PosCustomerFeedbackActionComponent } from './pos-customer-feedback-action/pos-customer-feedback-action.component';
import { RetailSalesKaratWiseProfitComponent } from './retail-sales-karat-wise-profit/retail-sales-karat-wise-profit.component';
import { PosCrmDashboardComponent } from './pos-crm-dashboard/pos-crm-dashboard.component';
import { FestivalSalesComparisonComponent } from './festival-sales-comparison/festival-sales-comparison.component';
import { PosTargetDashboardComponent } from './pos-target-dashboard/pos-target-dashboard.component';
import { RepairEnquiryComponent } from './repair-enquiry/repair-enquiry.component';
import { RepairRegisterComponent } from './repair-register/repair-register.component';
import { LoyaltyRegisterComponent } from './loyalty-register/loyalty-register.component';
import { PosSalesmanCommissionComponent } from './pos-salesman-commission/pos-salesman-commission.component';
import { RetailSalesCollectionComponent } from './retail-sales-collection/retail-sales-collection.component';
import { SalesOrderRegisterComponent } from './sales-order-register/sales-order-register.component';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { PosDailyClosingReportComponent } from './pos-daily-closing-report/pos-daily-closing-report.component';
import { POSDaybookComponent } from './posdaybook/posdaybook.component';
import { CustomerEnquiryComponent } from './customer-enquiry/customer-enquiry.component';
import { CreditSaleReportComponent } from './credit-sale-report/credit-sale-report.component';
import { DailyClosingSummaryWatchComponent } from './daily-closing-summary-watch/daily-closing-summary-watch.component';
import { PointSalesSMJComponent } from './point-sales-smj/point-sales-smj.component';
import { POSSales_Stock_ComparisonComponent } from './pos-sales-stock-comparison/pos-sales-stock-comparison.component';
import { TimeWiseSalesAnalysisComponent } from './time-wise-sales-analysis/time-wise-sales-analysis.component';
import { SalesmanWiseProfitAnalysisComponent } from './salesman-wise-profit-analysis/salesman-wise-profit-analysis.component';
import { POSSummaryComponent } from './possummary/possummary.component';
@Component({
  selector: 'app-retail-reports',
  templateUrl: './retail-reports.component.html',
  styleUrls: ['./retail-reports.component.scss']
})
export class RetailReportsComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  //variables
  menuTitle: any;
  componentName: any;
  PERMISSIONS: any;
  componentSelected: any;
  private componentDbList: any = {}
  ReportVouchers: any;

  constructor(
    private CommonService: CommonServiceService,
    private modalService: NgbModal,
    private dataService: SuntechAPIService
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.getMasterGridData()
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
  }

  ngOnInit(): void {
    localStorage.setItem('strMainVouchers', "#POS#POSC#RIN#PSR#POSEX#POSER#PCR")
    // for opening Report- Modal's
    // this.openModalView()
    let voucherData = localStorage.getItem('strMainVouchers');
    let payload = {
      "strReportName": "POS_COLLECTION_A",
      "strMainVouchers": voucherData,
      "strExcludeVouchers": "",
      "strWhereCond": "",
      "strLoginBranch": "", //this.comService.branchCode
    };
 
    this.dataService.postDynamicAPI('GetReportVouchers', payload).subscribe((response) => {
      console.log('Retailsales API call data', response);
      this.ReportVouchers = response.dynamicData[0] || [];

  
    },(error: any) => {
      console.error('Error occurred:', error);
    });
  }

  viewRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'VIEW'
    this.openModalView(str)
  }
  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openModalView(str)
  }
  //  open forms in modal
  openModalView(data?: any) {
    this.componentDbList = {
      'PosDailyclosingSummary': PosDailyClosingSummaryComponent,
      'RetailAdvanceReceiptRegisterComponent': RetailAdvanceReceiptRegisterComponent,
      'PosCustomerFeedbackFollowupComponent': PosCustomerFeedbackFollowupComponent,
      'PosCustomerFeedbackActionComponent': PosCustomerFeedbackActionComponent,
      'RetailSalesKaratWiseProfitComponent': RetailSalesKaratWiseProfitComponent,
      'PosCrmDashboardComponent': PosCrmDashboardComponent,
      'FestivalSalesComparisonComponent': FestivalSalesComparisonComponent,
      'PosTargetDashboardComponent': PosTargetDashboardComponent, 
      'RepairEnquiryComponent': RepairEnquiryComponent, 
      'RepairRegisterComponent': RepairRegisterComponent,


      'LoyaltyRegisterComponent': LoyaltyRegisterComponent,
      'PosSalesmanCommissionComponent': PosSalesmanCommissionComponent,
      'RetailSalesCollectionComponent': RetailSalesCollectionComponent,
      'SalesOrderRegisterComponent': SalesOrderRegisterComponent,
      'PosDailyClosingReportComponent': PosDailyClosingReportComponent,
      'POSDaybookComponent': POSDaybookComponent,
      'CustomerEnquiryComponent': CustomerEnquiryComponent,
      'CreditSaleReportComponent': CreditSaleReportComponent,
      'DailyClosingSummaryWatchComponent': DailyClosingSummaryWatchComponent,
      'PointSalesSMJComponent': PointSalesSMJComponent,
      'POSSales_Stock_ComparisonComponent': POSSales_Stock_ComparisonComponent,
      'TimeWiseSalesAnalysisComponent': TimeWiseSalesAnalysisComponent,
      'SalesmanWiseProfitAnalysisComponent': SalesmanWiseProfitAnalysisComponent,
      'POSSummaryComponent': POSSummaryComponent
      // Add components and update in operationals > menu updation grid form component name
    }
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName]
    } else {
      this.CommonService.showSnackBarMsg('Module Not Created')
    }

    //check for determining the screen selected
    const modalOptions: any = this.componentName === 'PosDailyclosingSummary' ? {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width',
      //page-content container-fluid
    } : {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    };
    
    const modalRef: NgbModalRef = this.modalService.open(this.componentSelected, modalOptions);
    // console.log(this.componentName)
    modalRef.result.then((result:any) => {
      if (result === 'reloadMainGrid') {
        let details = { 
          HEADER_TABLE: this.CommonService.getqueryParamTable(),
          MENU_CAPTION_ENG: this.CommonService.getModuleName()
        }
        this.getMasterGridData(details)
      }
    }, (reason:any) => {
      // Handle modal dismissal (if needed)
    });
    modalRef.componentInstance.content = data || {};
    modalRef.componentInstance.reportVouchers = this.ReportVouchers || {};
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      if(data.MENU_CAPTION_ENG){
        this.menuTitle = data.MENU_CAPTION_ENG;
      }else{
        this.menuTitle = this.CommonService.getModuleName()
      }
      if(data.ANG_WEB_FORM_NAME){
        this.componentName = data.ANG_WEB_FORM_NAME;
      }else{
        this.componentName = this.CommonService.getFormComponentName()
      }
      this.PERMISSIONS = data.PERMISSION;
    }
    this.masterGridComponent?.getMasterGridData(data)
  }

  handleActionViewClick(data: any) {
    this.openModalView(data.data)
  }

}
