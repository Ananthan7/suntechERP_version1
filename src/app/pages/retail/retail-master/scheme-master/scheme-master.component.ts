import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from 'sweetalert2';
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { AuthCheckerComponent } from "src/app/shared/common/auth-checker/auth-checker.component";


@Component({
  selector: "app-scheme-master",
  templateUrl: "./scheme-master.component.html",
  styleUrls: ["./scheme-master.component.scss"],
})
export class SchemeMasterComponent implements OnInit {
  @ViewChild(MasterSearchComponent) masterSearchComponent?: MasterSearchComponent;
  @ViewChild(AuthCheckerComponent) authCheckerComponent?: AuthCheckerComponent;

  @Input() content!: any;
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  frequencyList: any[] = [];
  depositinList: any[] = [];
  receipt1List: any[] = [];
  receipt2List: any[] = [];
  branchCode?: String;
  yearMonth?: String;
  viewMode: boolean = false;
  codeEditMode: boolean = false;
  codeViewMode: boolean = false;
  usedSchemeEditMode: boolean = false;
  isloadingSave: boolean = false;
  BRANCHASSCHEMEPREFIX: boolean = false;
  prefixCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION='M' AND SCHEME_PREFIX = 1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  schemeMasterForm: FormGroup = this.formBuilder.group({
    mid: [""],
    code: ["", Validators.required],
    branch: [""],
    prefix: ["", Validators.required],
    prefixCode: [""],
    description: ["", Validators.required],
    frequency: ["", Validators.required],
    tenurePeriod: [""],
    installmentAmount: ["", Validators.required],
    bonusInstallment: [""],
    cancelCharges: [""],
    receiptModeone: [""],
    receiptModeTwo: [""],
    receiptModeThree: [""],
    depositIn: [""],
    startDate: [""],
    remarks: [""],
    schemeStatus: [true],
    SCHEMEFIXEDAMT: [false],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.checkInitialConditions()
  }
  checkInitialConditions() {
    if (this.content) {
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.BRANCHASSCHEMEPREFIX = true
        this.codeEditMode = true
        this.codeViewMode = true
        this.usedSchemeEditMode = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.BRANCHASSCHEMEPREFIX = true
        this.codeEditMode = true
        this.codeViewMode = true;
        this.schemeRegistrationWithParameter()
        this.getAllSelectOptions()
      }
      if (this.content.FLAG == 'DELETE') {
        this.codeEditMode = false
        this.codeViewMode = true;
        this.viewMode = true;
        this.BRANCHASSCHEMEPREFIX = true
        this.usedSchemeEditMode = true;
        this.schemeRegistrationWithParameter()
      }
      this.setInitialValues()
    } else {
      this.codeEditMode = true
      this.codeViewMode = false;
      this.getAllSelectOptions()
      this.setFormValues()
  
    }
  }
  //number validation
  isNumeric(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;
    console.log(event.keyCode, 'event.keyCode');

    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8 || keyCode == 46;
    return isValid;
  }
  addCommaSeperation(event: any) {
    event.target.value = this.comService.commaSeperation(event.target.value)
  }
  setFormControlAmount(controlName: string, amount: any) {
    amount = this.comService.emptyToZero(amount)
    amount = this.comService.decimalQuantityFormat(amount, 'AMOUNT')
    this.schemeMasterForm.controls[controlName].setValue(
      this.comService.commaSeperation(amount)
    )
  }
  /**use: load all conditions for select */
  getAllSelectOptions() {
    let frequencyAPI = 'ComboFilter/scheme%20frequency';
    let sub: Subscription = this.dataService.getDynamicAPI(frequencyAPI).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.frequencyList = resp.response
      }
    });
    this.subscriptions.push(sub);

    let depositinAPI = 'ComboFilter/scheme%20type';
    let subs: Subscription = this.dataService.getDynamicAPI(depositinAPI).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.depositinList = resp.response
        this.depositinList = this.depositinList.filter((item: any) => item.ENGLISH == 'AMOUNT')
        this.schemeMasterForm.controls.depositIn.setValue('AMOUNT')
      }
    });
    this.subscriptions.push(subs);

    let receiptAPI = 'CreditCardMaster/GetReceiptModes/3/' + this.branchCode;
    let receipts1: Subscription = this.dataService.getDynamicAPI(receiptAPI).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.receipt1List = resp.response
        let scheme: any[] = this.receipt1List.filter((item: any) => item.CREDIT_CODE == 'SCHEME')
        if (scheme.length > 0) {
          this.schemeMasterForm.controls.receiptModeone.setValue('SCHEME');
        } else {
          this.schemeMasterForm.controls.receiptModeone.setValue(this.receipt1List[0].CREDIT_CODE);
        }
      }
    });
    this.subscriptions.push(receipts1);

    let receiptAPI2 = 'CreditCardMaster/GetReceiptModes/2/' + this.branchCode;
    let receipts2: Subscription = this.dataService.getDynamicAPI(receiptAPI2).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.receipt2List = resp.response
        // this.schemeMasterForm.controls.receiptModeTwo.setValue(this.receipt2List[0].CREDIT_CODE);
        // this.schemeMasterForm.controls.receiptModeThree.setValue(this.receipt2List[0].CREDIT_CODE);
      }
    });
    this.subscriptions.push(receipts2);
  }

  checkIfSchemeCodeExists() {
    if (this.content) return
    let API = 'SchemeMaster/CheckIfSchemeCodeExists/' + this.schemeMasterForm.value.code
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((resp: any) => {
        if (resp.checkifExists) {
          this.comService.toastErrorByMsgId(resp.message || 'Scheme Already Exists')
          this.schemeMasterForm.controls.code.setValue('')
        }
      });
    this.subscriptions.push(Sub);
  }
  getSchemeMasterList() {
    let API = 'SchemeMaster/GetSchemeMasterDetails/'+ this.schemeMasterForm.value.code
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((resp: any) => {
        if (this.content && this.content?.FLAG) {
          let data = resp.response
          this.schemeMasterForm.controls.startDate.setValue(data.START_DATE)
        } else {
          if (resp.status == 'Success') {
            this.comService.toastErrorByMsgId('Scheme Already Exists')
            this.schemeMasterForm.controls.code.setValue('')
            return
          }
        }
      });
    this.subscriptions.push(Sub);
  }
  setFormValues() {
    this.schemeMasterForm.controls.startDate.setValue(this.currentDate)
    //checking for branch wise prefix setting from company parameter starts
    this.BRANCHASSCHEMEPREFIX = this.comService.getCompanyParamValue('BRANCHASSCHEMEPREFIX');
    if(this.BRANCHASSCHEMEPREFIX){
      this.schemeMasterForm.controls.prefixCode.setValue(this.comService.branchCode)
    }
  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.schemeMasterForm.controls.startDate.setValue(new Date(date))
    }
  }


  prefixSelected(e: any) {
    this.schemeMasterForm.controls.prefixCode.setValue(e.PREFIX_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  // function to check zero and set values to empty
  checkReceiptModeExist(amt: string, mode: string) {
    if (this.comService.emptyToZero(this.schemeMasterForm.value[amt]) == 0) {
      this.schemeMasterForm.controls[mode].setValue('')
      this.schemeMasterForm.controls[amt].setValue('')
    }
  }
  private submitFormValidation(): boolean {
    let flag = false;
    let form = this.schemeMasterForm.value;
    if (this.comService.nullToString(form.code).trim() == '') {
      this.comService.toastErrorByMsgId('Code is required')
      flag = true
    }
    if (this.comService.nullToString(form.prefixCode).trim() == '') {
      this.comService.toastErrorByMsgId('Prefix is required')
      flag = true
    }
    if (this.comService.nullToString(form.description).trim() == '') {
      this.comService.toastErrorByMsgId('Description is required')
      flag = true
    }
    if (this.comService.nullToString(form.frequency) == '') {
      this.comService.toastErrorByMsgId('Frequency is required')
      flag = true
    }
    if (this.comService.nullToString(form.depositIn) == '') {
      this.comService.toastErrorByMsgId('Deposit In is required')
      flag = true
    }
    if (this.comService.emptyToZero(form.tenurePeriod) == 0) {
      this.comService.toastErrorByMsgId('Period is required')
      flag = true
    }
    if (this.comService.emptyToZero(form.installmentAmount) == 0) {
      this.comService.toastErrorByMsgId('Installment amount is required')
      flag = true
    }
    if (this.comService.emptyToZero(form.installmentAmount) != 0 && !form.receiptModeone) {
      this.comService.toastErrorByMsgId('Receipt Mode is required for installment Amount')
      flag = true
    }
    if (this.comService.emptyToZero(form.installmentAmount) == 0 && form.receiptModeone != '') {
      this.comService.toastErrorByMsgId('Installment Amount is required')
      flag = true
    }
    if (this.comService.emptyToZero(form.bonusInstallment) != 0 && !form.receiptModeTwo) {
      this.comService.toastErrorByMsgId('Receipt Mode is required for bonus installment')
      flag = true
    }
    if (this.comService.emptyToZero(form.bonusInstallment) == 0 && this.comService.nullToString(form.receiptModeTwo) != '') {
      this.comService.toastErrorByMsgId('Bonus installment is required')
      flag = true
    }
    if (this.comService.emptyToZero(form.cancelCharges) != 0 && !form.receiptModeThree) {
      this.comService.toastErrorByMsgId('Receipt Mode is required for cancel charges')
      flag = true
    }
    if (this.comService.emptyToZero(form.cancelCharges) == 0 && this.comService.nullToString(form.receiptModeThree) != '') {
      this.comService.toastErrorByMsgId('Cancel charges is required')
      flag = true
    }
    return flag
  }
  formSubmit() {
    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitFormValidation()) {
      return
    }
    this.comService.showSnackBarMsg('MSG81447');
    let API = 'SchemeMaster/InsertSchemeMaster'
    let postData = this.setPostData()
    this.isloadingSave = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloadingSave = false;
        this.comService.closeSnackBarMsg();
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: this.comService.getMsgByID('MSG2443') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.schemeMasterForm.reset()
                this.close('reloadMainGrid')
              }
            });
            this.viewMode = true
            this.BRANCHASSCHEMEPREFIX = true
          } else {
            this.comService.toastErrorByMsgId(result.message)
          }
        } else {
          this.comService.toastErrorByMsgId(result.message)
        }
      }, err => {
        this.isloadingSave = false;
        this.comService.toastErrorByMsgId('network issue found')
        this.comService.closeSnackBarMsg();
      })
    this.subscriptions.push(Sub);
  };

  setPostData() {
    return {
      "MID": this.content?.MID || 0,
      "BRANCH_CODE": this.comService.nullToString(this.branchCode),
      "SCHEME_CODE": this.comService.nullToString(this.schemeMasterForm.value.code.toUpperCase()),
      "SCHEME_NAME": this.comService.nullToString(this.schemeMasterForm.value.description),
      "SCHEME_UNIT": 1,
      "SCHEME_BONUS": this.comService.emptyToZero(this.schemeMasterForm.value.bonusInstallment),
      "SCHEME_PERIOD": this.comService.emptyToZero(this.schemeMasterForm.value.tenurePeriod),
      "SCHEME_REMARKS": this.comService.nullToString(this.schemeMasterForm.value.remarks),
      "SCHEME_AMOUNT": this.comService.emptyToZero(this.schemeMasterForm.value.installmentAmount),
      "SCHEME_METALCURRENCY": this.schemeMasterForm.value.depositIn || '',
      "CANCEL_CHARGE": this.comService.emptyToZero(this.schemeMasterForm.value.cancelCharges),
      "SCHEME_FREQUENCY": this.comService.nullToString(this.schemeMasterForm.value.frequency),
      "STATUS": this.schemeMasterForm.value.schemeStatus,
      "START_DATE": this.schemeMasterForm.value.startDate,
      "SCHEME_CURRENCY_CODE": '',
      "PREFIX_CODE": this.comService.nullToString(this.schemeMasterForm.value.prefixCode),
      "BONUS_RECTYPE": this.comService.nullToString(this.schemeMasterForm.value.receiptModeTwo),
      "CANCEL_RECTYPE": this.comService.nullToString(this.schemeMasterForm.value.receiptModeThree),
      "INST_RECTYPE": this.comService.nullToString(this.schemeMasterForm.value.receiptModeone),
      "SCHEME_FIXEDAMT": this.schemeMasterForm.value.SCHEMEFIXEDAMT
    }
  }
  setInitialValues() {
    if (!this.content) return
    this.schemeMasterForm.controls.mid.setValue(this.content.MID);
    this.schemeMasterForm.controls.code.setValue(this.content.SCHEME_CODE);
    this.schemeMasterForm.controls.description.setValue(this.content.SCHEME_NAME);
    this.schemeMasterForm.controls.remarks.setValue(this.content.SCHEME_REMARKS);
    this.schemeMasterForm.controls.frequency.setValue(this.content.SCHEME_FREQUENCY);
    this.schemeMasterForm.controls.prefixCode.setValue(this.content.PREFIX_CODE);
    this.schemeMasterForm.controls.receiptModeTwo.setValue(this.content.BONUS_RECTYPE);
    this.schemeMasterForm.controls.receiptModeThree.setValue(this.content.CANCEL_RECTYPE);
    this.schemeMasterForm.controls.receiptModeone.setValue(this.content.INST_RECTYPE);
    this.schemeMasterForm.controls.tenurePeriod.setValue(this.content.SCHEME_PERIOD);
    this.schemeMasterForm.controls.schemeStatus.setValue(this.content.STATUS == 'Y' ? true : false);
    this.schemeMasterForm.controls.SCHEMEFIXEDAMT.setValue(this.content.SCHEME_FIXEDAMT == 'Y' ? true : false);
    this.schemeMasterForm.controls.branch.setValue(this.content.BRANCH_CODE);
    this.schemeMasterForm.controls.depositIn.setValue(this.content.DEPOSIT_IN);

    this.setFormControlAmount('installmentAmount', this.content.SCHEME_AMOUNT)
    this.setFormControlAmount('cancelCharges', this.content.CANCEL_CHARGE)
    this.setFormControlAmount('bonusInstallment', this.content.SCHEME_BONUS)
    this.getSchemeMasterList()
  }
  removePrefixCode() {
    this.schemeMasterForm.controls.prefixCode.setValue('');
  }
  handleKeyPress(event: any) {
    // Check if the key pressed is Enter (key code 13)
    if (event.keyCode === 13) {
      this.masterSearchComponent?.showOverlayPanel()
    } else if (event.keyCode === 9) {
      this.masterSearchComponent?.showOverlayPanel()
    }
  }
  schemeRegistrationWithParameter() {
    let API = 'SchemeRegistration/GetSchemeWithParameter'
    let data = {
      "SCH_SCHEME_CODE": this.content.SCHEME_CODE
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI(API, data)
      .subscribe((resp: any) => {
        this.comService.closeSnackBarMsg()
        if (resp.status == 'Success') {
          // this.comService.toastErrorByMsgId('Cannot Edit Registered Scheme')
          this.viewMode = true
          if (this.content?.FLAG == 'DELETE') {
            this.comService.toastErrorByMsgId('Scheme Already Registered')
            return
          }
          this.usedSchemeEditMode = false
        } else {
          if (this.content?.FLAG == 'DELETE') {
            this.deleteSchemeMaster()
          }
        }
      });
    this.subscriptions.push(Sub);
  }
  prefixCodeValidate(event: any) {
    if(this.content?.FLAG == 'VIEW' || this.BRANCHASSCHEMEPREFIX) return;
    let API = 'PrefixMaster/GetPrefixMasterDetail/' + event.target.value
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((resp: any) => {
        if (resp.status == 'Failed') {
          this.comService.toastErrorByMsgId('Prefix code not found')
          this.schemeMasterForm.controls.prefixCode.setValue('')
        } else {
          let data = resp.response
          this.schemeMasterForm.controls.prefixCode.setValue(data.PREFIX_CODE)
        }
      });
    this.subscriptions.push(Sub);
  }
  update() {
    if (this.submitFormValidation()) {
      return
    }
    let API = 'SchemeMaster/UpdateSchemeMaster/' + this.branchCode + "/" + this.schemeMasterForm.value.code
    let postData = this.setPostData()
    this.isloadingSave = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloadingSave = false;
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: this.comService.getMsgByID('MSG2443') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.schemeMasterForm.reset()
                this.close('reloadMainGrid')
              }
            });
          } else {
            this.comService.toastErrorByMsgId(result.message)
          }
        } else {
          this.comService.toastErrorByMsgId(result.message)
        }
      }, err => {
        this.isloadingSave = false;
        this.comService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }
  deleteSchemeClick() {
    this.authCheckerComponent?.openAuthModal()
  }
  // SchemeMaster/UpdateSchemeMaster

  deleteSchemeMaster() {
    if (this.content?.FLAG == 'VIEW') return
    if (!this.content.MID) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'SchemeMaster/DeleteSchemeMaster/' + this.schemeMasterForm.value.branch + '/' + this.schemeMasterForm.value.code;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: this.comService.getMsgByID('MSG3588') || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.schemeMasterForm.reset()

                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.schemeMasterForm.reset()

                    this.close('reloadMainGrid')
                  }
                });
              }
            } else {
              this.comService.toastErrorByMsgId('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
}
