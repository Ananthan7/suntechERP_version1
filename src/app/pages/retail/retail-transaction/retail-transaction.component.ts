import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { NewPosEntryComponent } from './new-pos-entry/new-pos-entry.component';
import { AddPosComponent } from './add-pos/add-pos.component';
import { PosCurrencyReceiptComponent } from './pos-currency-receipt/pos-currency-receipt.component';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
import { SchemeRegisterComponent } from './scheme-register/scheme-register.component';
import { TouristVatRefundVerificationComponent } from './tourist-vat-refund-verification/tourist-vat-refund-verification.component';
import { AdvanceReturnComponent } from './advance-return/advance-return.component';
import { PosSalesOrderCancellationComponent } from './pos-sales-order-cancellation/pos-sales-order-cancellation.component';

@Component({
  selector: 'app-retail-transaction',
  templateUrl: './retail-transaction.component.html',
  styleUrls: ['./retail-transaction.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetailTransactionComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  //variables
  menuTitle: string = '';
  tableName: any;
  PERMISSIONS: any
  componentSelected: any;
  private componentDbList: any = {}
  componentName: any;

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.getMasterGridData()
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
  }

  ngOnInit(): void {
    if (localStorage.getItem('AddNewFlag') && localStorage.getItem('AddNewFlag') == '1') {
      this.openModalView()
      localStorage.removeItem('AddNewFlag')
    }
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
  /**USE: open form components in modal*/
  openModalView(data?: any) {
    this.componentDbList = {
      'AddPosComponent': AddPosComponent,
      'PosCurrencyReceiptComponent': PosCurrencyReceiptComponent,
      'SchemeRegisterComponent': SchemeRegisterComponent,
      'TouristVatRefundVerificationComponent': TouristVatRefundVerificationComponent,
      'AdvanceReturnComponent': AdvanceReturnComponent,
      'PosSalesOrderCancellationComponent': PosSalesOrderCancellationComponent,

      // Add components and update in operationals > menu updation grid form component name
    }
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName]
    } else {
      this.CommonService.showSnackBarMsg('Module Not Created')
    }
    const modalRef: NgbModalRef = this.modalService.open(this.componentSelected, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width'
    });

    modalRef.componentInstance.content = data;

    modalRef.result.then((result) => {
      if (result === 'reloadMainGrid') {
        this.getMasterGridData({ HEADER_TABLE: this.CommonService.getqueryParamTable() })
      }
    }, (reason) => {
      if (reason === 'reloadMainGrid') {
        this.getMasterGridData({ HEADER_TABLE: this.CommonService.getqueryParamTable() })
      }
      // Handle modal dismissal (if needed)
    });
  }
  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      if (data.MENU_CAPTION_ENG) {
        this.menuTitle = data.MENU_CAPTION_ENG;
        this.PERMISSIONS = data.PERMISSION;
      } else {
        this.menuTitle = this.CommonService.getModuleName()
      }
      if (data.ANG_WEB_FORM_NAME) {
        this.componentName = data.ANG_WEB_FORM_NAME;
      } else {
        this.componentName = this.CommonService.getFormComponentName()
      }
      this.PERMISSIONS = data.PERMISSION;
    }
    this.masterGridComponent?.getMasterGridData(data)
  }
}
