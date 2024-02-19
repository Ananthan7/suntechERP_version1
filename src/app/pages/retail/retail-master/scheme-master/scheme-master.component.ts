import { Component, Input, OnInit } from "@angular/core";
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


@Component({
  selector: "app-scheme-master",
  templateUrl: "./scheme-master.component.html",
  styleUrls: ["./scheme-master.component.scss"],
})
export class SchemeMasterComponent implements OnInit {
  @Input() content!: any;
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  frequencyList: any[] = [];
  depositinList: any[] = [];
  receipt1List: any[] = [];
  receipt2List: any[] = [];
  branchCode?: String;
  yearMonth?: String;

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
    prefix: [""],
    description: [""],
    frequency: ["", Validators.required],
    tenurePeriod: ["", Validators.required],
    installmentAmount: [""],
    bonusInstallment: [""],
    receiptModeone: [""],
    receiptModeTwo: [""],
    cancelCharges: [""],
    receiptModeThree: [""],
    depositIn: [""],
    startDate: [""],
    remarks: [""],
    schemeStatus: [false],
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
    this.getAllSelectOptions()
    if (this.content) {
      this.setInitialValues()
    } else {
      this.setFormValues()
    }
  }
  getAllSelectOptions() {
    let frequencyAPI = 'ComboFilter/scheme%20frequency';
    let sub: Subscription = this.dataService.getDynamicAPI(frequencyAPI).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.frequencyList = resp.response
      }
    });
    this.schemeMasterForm.value.frequency('Monthly')
    let depositinAPI = 'ComboFilter/scheme%20type';
    let subs: Subscription = this.dataService.getDynamicAPI(depositinAPI).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.depositinList = resp.response.filter((item: any) => item.ENGLISH == 'AMOUNT')
        this.schemeMasterForm.controls.depositIn.setValue('AMOUNT')
      }
    });
    let receiptAPI = 'CreditCardMaster/GetReceiptModes/3/' + this.branchCode;
    let receipts1: Subscription = this.dataService.getDynamicAPI(receiptAPI).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.receipt1List = resp.response
      }
    });
    let receiptAPI2 = 'CreditCardMaster/GetReceiptModes/2/' + this.branchCode;
    let receipts2: Subscription = this.dataService.getDynamicAPI(receiptAPI2).subscribe((resp: any) => {
      if (resp.status == 'Success') {
        this.receipt2List = resp.response
      }
    });
  }
  getSchemeMasterList() {
    let API = 'SchemeMaster/GetSchemeMasterDetails/' + this.comService.branchCode + '/' + this.schemeMasterForm.value.code
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((resp: any) => {
        if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'VIEW') {
          let data = resp.response
          this.schemeMasterForm.controls.startDate.setValue(data.START_DATE)
        }else{
          if (resp.status == 'Success') {
            this.comService.showSnackBarMsg('Scheme Already Exists')
            this.schemeMasterForm.controls.code.setValue('')
            return
          }
        }
      });
    this.subscriptions.push(Sub);
  }
  setFormValues() {
    this.schemeMasterForm.controls.startDate.setValue(this.currentDate)
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
    console.log(e);
    this.schemeMasterForm.controls.prefix.setValue(e.PREFIX_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {
    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.schemeMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'SchemeMaster/InsertSchemeMaster'
    let postData = this.setPostData()
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
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
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => this.toastr.error(err))
    this.subscriptions.push(Sub);
  };

  setPostData() {
    return {
      "MID": this.content?.MID || 0,
      "BRANCH_CODE": this.comService.nullToString(this.branchCode),
      "SCHEME_CODE": this.comService.nullToString(this.schemeMasterForm.value.code),
      "SCHEME_NAME": this.comService.nullToString(this.schemeMasterForm.value.description),
      "SCHEME_UNIT": 0,
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
      "PREFIX_CODE": this.comService.nullToString(this.schemeMasterForm.value.prefix),
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
    this.schemeMasterForm.controls.prefix.setValue(this.content.PREFIX_CODE);
    this.schemeMasterForm.controls.installmentAmount.setValue(this.content.SCHEME_AMOUNT);
    this.schemeMasterForm.controls.cancelCharges.setValue(this.content.CANCEL_CHARGE);
    this.schemeMasterForm.controls.receiptModeTwo.setValue(this.content.BONUS_RECTYPE);
    this.schemeMasterForm.controls.receiptModeThree.setValue(this.content.CANCEL_RECTYPE);
    this.schemeMasterForm.controls.receiptModeone.setValue(this.content.INST_RECTYPE);
    this.schemeMasterForm.controls.bonusInstallment.setValue(this.content.SCHEME_BONUS);
    this.schemeMasterForm.controls.tenurePeriod.setValue(this.content.SCHEME_PERIOD);
    this.schemeMasterForm.controls.schemeStatus.setValue(this.content.STATUS == 'Y'? true : false);
    this.schemeMasterForm.controls.SCHEMEFIXEDAMT.setValue(this.content.SCHEME_FIXEDAMT == 'Y'? true : false);
    this.schemeMasterForm.controls.branch.setValue(this.content.BRANCH_CODE);
    this.schemeMasterForm.controls.depositIn.setValue(this.content.DEPOSIT_IN);
    this.getSchemeMasterList()
    }
  prefixCodeValidate() {
    let API = 'PrefixMaster/GetPrefixMasterDetail/' + this.schemeMasterForm.value.prefix
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((resp: any) => {
        if (resp.status == 'Failed') {
          this.comService.toastErrorByMsgId('Prefix code not found')
          this.schemeMasterForm.controls.prefix.setValue('')
        }
      });
    this.subscriptions.push(Sub);
  }
  update() {
    if (this.schemeMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'SchemeMaster/UpdateSchemeMaster/' + this.branchCode + "/" + this.schemeMasterForm.value.code
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
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
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  // SchemeMaster/UpdateSchemeMaster

  deleteSchemeMaster() {
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
        let API = 'SchemeMaster/DeleteSchemeMaster/' + this.schemeMasterForm.value.branch + this.schemeMasterForm.value.code;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
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
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
}
