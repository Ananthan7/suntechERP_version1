import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(
    private CommonService: CommonServiceService,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.getMasterGridData()
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
  }

  ngOnInit(): void {
    // for opening Report- Modal's
    this.openModalView()
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

      
      
      
  
      // Add components and update in operationals > menu updation grid form component name
    }
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName]
    } else {
      this.CommonService.showSnackBarMsg('Module Not Created')
    }

    const modalRef: NgbModalRef = this.modalService.open(this.componentSelected, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      // windowClass: 'modal-full-width',
    });
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

}
