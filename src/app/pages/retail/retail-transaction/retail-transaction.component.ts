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
import { SalesEstimationComponent } from './sales-estimation/sales-estimation.component';
import { PointOfSalesOrderComponent } from './point-of-sales-order/point-of-sales-order.component';
import { PosPurchaseDirectComponent } from './pos-purchase-direct/pos-purchase-direct.component';
import { SchemeReceiptComponent } from './scheme-receipt/scheme-receipt.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  @ViewChild('userAuthModal')
  public userAuthModal!: NgbModal;
  modalReferenceUserAuth!: NgbModalRef;

  authForm: FormGroup = this.formBuilder.group({
    username: [localStorage.getItem('username'), Validators.required],
    password: ['', Validators.required],
    reason: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,

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
  async editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    let isAuth = await this.openAuthModal();
    if (isAuth)
      this.openModalView(str)
    else
      this.snackBar.open('Authentication Failed');

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
      'SalesEstimationComponent': SalesEstimationComponent,
      'PointOfSalesOrderComponent': PointOfSalesOrderComponent,
      'PosPurchaseDirectComponent': PosPurchaseDirectComponent,
      'SchemeReceiptComponent': SchemeReceiptComponent,

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
      windowClass: 'modal-full-width'
    });

    modalRef.componentInstance.content = data;

    modalRef.result.then((result) => {
      if (result === 'reloadMainGrid') {
        this.getMasterGridData({ HEADER_TABLE: this.CommonService.getqueryParamTable() })
      } else if (result == 'OpenModal') {
        this.openModalView()
      }
    }, (reason) => {
      if (reason === 'reloadMainGrid') {
        this.getMasterGridData({ HEADER_TABLE: this.CommonService.getqueryParamTable() })
      } else if (reason == 'OpenModal') {
        this.openModalView()
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



  openAuthModal() {

    return new Promise((resolve) => {

      this.modalReferenceUserAuth = this.modalService.open(
        this.userAuthModal,
        {
          size: "lg",
          backdrop: true,
          keyboard: false,
          windowClass: "modal-full-width",
        }
      );

      this.modalReferenceUserAuth.result.then((result) => {
        if (result) {
          console.log("Result :", result);
          resolve(true);
        } else {
          resolve(false);
        }
      },
        (reason) => {
          console.log(`Dismissed ${reason}`);
          resolve(false);

        }
      );
    });


  }

  submitAuth() {
    if (!this.authForm.invalid) {
      let API = 'ValidatePassword/ValidateEditDelete';
      const postData = {
        "Username": this.authForm.value.username,
        "Password": this.authForm.value.password
      };
      let sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe((resp: any) => {
        if (resp.status == 'Success') {
          this.modalReferenceUserAuth.close(true);
          this.authForm.controls.password.setValue(null);
        } else {
          this.snackBar.open(resp.message, 'OK', {duration: 2000})
        }
      });


    } else {
      this.snackBar.open('Please fill all fields', 'OK', { duration: 1000 })
    }

  }
}
