import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
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
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { map, pairwise, startWith, filter } from 'rxjs/operators';
import { RetailGridComponent } from '../common-retail/retail-grid/retail-grid.component';
import { OrderLockUnlockComponent } from './order-lock-unlock/order-lock-unlock.component';

@Component({
  selector: 'app-retail-transaction',
  templateUrl: './retail-transaction.component.html',
  styleUrls: ['./retail-transaction.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetailTransactionComponent implements OnInit {
  @ViewChild(RetailGridComponent) masterGridComponent?: RetailGridComponent;
  //variables
  menuTitle: string = '';
  tableName: any;
  PERMISSIONS: any
  componentSelected: any;
  private componentDbList: any = {}
  componentName: any;

  //   reasonLookup: MasterSearchModel =
  //   {
  //    PAGENO: 1,
  //    RECORDS: 10,
  //    LOOKUPID: 10,
  //    SEARCH_FIELD: "DESCRIPTION",
  //    SEARCH_HEADING: "Reason",
  //    SEARCH_VALUE: "",
  //    WHERECONDITION: "DESCRIPTION<> ''",
  //    VIEW_INPUT: true,
  //    VIEW_TABLE: true,
  //  };

  @ViewChild('userAuthModal')
  public userAuthModal!: NgbModal;
  modalReferenceUserAuth!: NgbModalRef;

  authForm: FormGroup = this.formBuilder.group({
    // username: [localStorage.getItem('username'), Validators.required],
    password: ['', Validators.required],
    // reason: ['', Validators.required],
    reason: ['', [Validators.required, this.autoCompleteValidator(() => this.reasonMaster, 'CODE')]],
    description: ['', Validators.required],
  });

  reasonMaster: any = [];
  reasonMasterOptions!: Observable<any[]>;

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

    this.getReasonMasters();

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
      this.snackBar.open('Authentication Failed', 'OK');

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
      'OrderLockUnlockComponent': OrderLockUnlockComponent,

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

      // if (this.modalService.hasOpenModals()) {
      //     this.getReasonMasters();
      // }

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

  reasonSelected(e: any) {
    console.log(e);
    // this.authForm.controls.reason.setValue(e.CODE);
    this.authForm.controls.reason.setValue(e.DESCRIPTION);
    this.authForm.controls.description.setValue(e.DESCRIPTION);
  }


  getReasonMasters() {
    let API = `GeneralMaster/GetGeneralMasterList/reason%20master`
    this.dataService.getDynamicAPI(API).
      subscribe(data => {

        if (data.status == "Success") {
          this.reasonMaster = data.response;
          this.reasonMasterOptions = this.authForm.controls.reason.valueChanges.pipe(
            startWith(''),
            map((value) =>
              this._filterMasters(this.reasonMaster, value, 'CODE', 'DESCRIPTION')
            )
          );
          console.log(this.reasonMasterOptions);
        } else {
          this.reasonMaster = [];
        }

      });

  }

  submitAuth() {
    if (!this.authForm.invalid) {
      let API = 'ValidatePassword/ValidateEditDelete';
      const postData = {
        // "Username": this.authForm.value.username,
        "Username": localStorage.getItem('username') || '',
        "Password": this.authForm.value.password
      };
      let sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe((resp: any) => {
        if (resp.status == 'Success') {
          this.modalReferenceUserAuth.close(true);
          this.authForm.reset();
          // this.authForm.controls.password.setValue(null);
          // this.authForm.controls.reason.setValue('');
          // this.authForm.controls.description.setValue('');
        } else {
          this.snackBar.open(resp.message, 'OK', { duration: 2000 })
        }
      });


    } else {
      this.snackBar.open('Please fill all fields', 'OK', { duration: 1000 })
    }

  }

  changeReason(e: any) {
    console.log(e);
    const res = this.reasonMaster.filter((data: any) => data.CODE == e.value)
    let description = res.length > 0 ? res[0]['DESCRIPTION'] : '';
    this.authForm.controls.description.setValue(description);


  }

  private _filterMasters(
    arrName: any,
    value: string,
    optVal1: any,
    optVal2: any = null
  ): any[] {
    const filterValue = (value || '').toLowerCase();
    return arrName.filter(
      (option: any) =>
        option[optVal1].toLowerCase().includes(filterValue) ||
        option[optVal2].toLowerCase().includes(filterValue)
    );
  }


  autoCompleteValidator(optionsProvider: any, field: any = null) {
    return (control: AbstractControl) => {
      const options = optionsProvider();
      const inputValue = control.value;
      if (!options || !Array.isArray(options)) {
        return null;
      }
      if (field == null) {
        if (control.value && options.length > 0 && !options.includes(control.value)) {
          return { notInOptions: true };
        }
      } else {
        if (inputValue && options.length > 0 && !options.some(option => option[field] === inputValue)) {
          return { notInOptions: true };
        }
      }
      return null;
    };
  }


}
