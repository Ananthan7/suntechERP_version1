import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import validator from 'devextreme/ui/validator';

@Component({
  selector: 'app-metal-prefix-master',
  templateUrl: './metal-prefix-master.component.html',
  styleUrls: ['./metal-prefix-master.component.scss']
})
export class MetalPrefixMasterComponent implements OnInit {
  divisionMS: any = 'ID';
  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];
  editableMode: boolean = false;
  viewMode: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    this.setCompanyCurrency()
    this.setFormValues()
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true
    
      this.setFormValues()
    } else if (this.content.FLAG == 'EDIT') {
      this.editableMode = true;
     this.setFormValues()
    }
  }
  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.metalprefixForm.controls.prefixcode.setValue(this.content.PREFIX_CODE)
    this.metalprefixForm.controls.prefixcodedes.setValue(this.content.DESCRIPTION)
    this.metalprefixForm.controls.lastno.setValue(this.content.LAST_NO)
    this.metalprefixForm.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.metalprefixForm.controls.currencyRate.setValue(this.content.CONV_RATE)
    this.metalprefixForm.controls.refinervprefix.setValue(this.content.COST_CODE)
    this.metalprefixForm.controls.setrefprefix.setValue(this.content.JOB_PREFIX)
    this.metalprefixForm.controls.jobcardprefix.setValue(this.content.JOB_PREFIX)
    this.metalprefixForm.controls.branch.setValue(this.content.BRANCH_CODE)
    this.metalprefixForm.controls.suffixcode.setValue(this.content.SCHEME_PREFIX)
    this.metalprefixForm.controls.tagWt.setValue(this.content.TAG_WT)
    this.metalprefixForm.controls.hsn.setValue(this.content.HSN_CODE)
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.metalprefixForm.controls.currency.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == CURRENCY_CODE);
    this.metalprefixForm.controls.currencyRate.setValue(
      this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
    );
  }
  metalprefixForm: FormGroup = this.formBuilder.group({
    prefixcode: ['',[Validators.required]],
    prefixcodedes: ['',[Validators.required]],
    currencyRate: ['',[Validators.required]],
    currency: [''],
    lastno: ['00000', ''],
    tagWt: ['',[Validators.required]],
    branch: [''],
    suffixcode: [''],
    hsn: [''],
    jobcardprefix: false,
    setrefprefix: false,
    schemeprefix: false,
    refinervprefix: false,
    designprefix: false,
    userdefined_1: [''],
    userdefined_2: [''],
    userdefined_3: [''],
    userdefined_4: [''],
    userdefined_5: [''],
    userdefined_6: [''],
    userdefined_7: [''],
    userdefined_8: [''],
    userdefined_9: [''],
    userdefined_10: [''],
    userdefined_11: [''],
    userdefined_12: [''],
    userdefined_13: [''],
    userdefined_14: [''],
    userdefined_15: [''],
  })

  BranchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchCodeSelected(e: any) {
    console.log(e);
    this.metalprefixForm.controls.branch.setValue(e.BRANCH_CODE);
  }

  HSNCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'HSN',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  HSNCenterSelected(e: any) {
    console.log(e);
    this.metalprefixForm.controls.hsn.setValue(e.CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.metalprefixForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'PrefixMaster/InsertPrefixMaster'
    let postData = {
      "PREFIX_CODE": this.metalprefixForm.value.prefixcode || "",
      "DESCRIPTION": this.metalprefixForm.value.prefixcodedes || "",
      "LAST_NO": this.commonService.nullToString(this.metalprefixForm.value.lastno),
      "CURRENCY_CODE": this.commonService.nullToString(this.metalprefixForm.value.currency),
      "CONV_RATE": this.commonService.emptyToZero(this.metalprefixForm.value.currencyRate),
      "COST_CODE": " ",
      "CATEGORY_CODE": " ",
      "SUBCATEGORY_CODE": " ",
      "BRAND_CODE": " ",
      "TYPE_CODE": " ",
      "COUNTRY_CODE": " ",
      "MID": 0,
      "DIVISION": "M",
      "SYSTEM_DATE": "2023-11-28T08:50:38.675Z",
      "PM_BRANCHCODE": "",
      "JOB_PREFIX": this.metalprefixForm.value.jobcardprefix ,
      "SETREF_PREFIX": this.metalprefixForm.value.setrefprefix,
      "BRANCH_CODE": this.commonService.branchCode,
      "BOIL_PREFIX": true,
      "SCHEME_PREFIX": this.metalprefixForm.value.schemeprefix,
      "UDF1": this.metalprefixForm.value.userdefined_1 || "",
      "UDF2": this.metalprefixForm.value.userdefined_2 || "",
      "UDF3": this.metalprefixForm.value.userdefined_3 || "",
      "UDF4": this.metalprefixForm.value.userdefined_4 || "",
      "UDF5": this.metalprefixForm.value.userdefined_5 || "",
      "UDF6": this.metalprefixForm.value.userdefined_6 || "",
      "UDF7": this.metalprefixForm.value.userdefined_7 || "",
      "UDF8": this.metalprefixForm.value.userdefined_8 || "",
      "UDF9": this.metalprefixForm.value.userdefined_9 || "",
      "UDF10": this.metalprefixForm.value.userdefined_10 || "",
      "UDF11": this.metalprefixForm.value.userdefined_11 || "",
      "UDF12": this.metalprefixForm.value.userdefined_12 || "",
      "UDF13": this.metalprefixForm.value.userdefined_13 || "",
      "UDF14": this.metalprefixForm.value.userdefined_14 || "",
      "UDF15": this.metalprefixForm.value.userdefined_15 || "",
      "TAG_WT": this.metalprefixForm.value.tagWt || "",
      "COMP_PREFIX": true,
      "DESIGN_PREFIX": this.metalprefixForm.value.designprefix,
      "REFINE_PREFIX": this.metalprefixForm.value.refinervprefix,
      "SUBLEDGER_PREFIX": true,
      "SUFFIX_CODE": this.metalprefixForm.value.suffixcode || "",
      "HSN_CODE": this.metalprefixForm.value.hsn || "",
    }

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
                this.metalprefixForm.reset()
                this.tableData = []
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
  update() {
    if (this.metalprefixForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'PrefixMaster/UpdatePrefixMaster/' + this.metalprefixForm.value.prefixcode
    let postData =
    {
      "PREFIX_CODE": this.metalprefixForm.value.prefixcode || "",
      "DESCRIPTION": this.metalprefixForm.value.prefixcodedes || "",
      "LAST_NO": this.metalprefixForm.value.lastno || "",
      "CURRENCY_CODE": "",
      "CONV_RATE": 0,
      "COST_CODE": " ",
      "CATEGORY_CODE": " ",
      "SUBCATEGORY_CODE": " ",
      "BRAND_CODE": " ",
      "TYPE_CODE": " ",
      "COUNTRY_CODE": " ",
      "MID": 0,
      "DIVISION": "s",
      "SYSTEM_DATE": "2023-11-28T08:50:38.675Z",
      "PM_BRANCHCODE": " ",
      "JOB_PREFIX": this.metalprefixForm.value.jobcardprefix,
      "SETREF_PREFIX": this.metalprefixForm.value.setrefprefix,
      "BRANCH_CODE": this.metalprefixForm.value.branch || "",
      "BOIL_PREFIX": true,
      "SCHEME_PREFIX": this.metalprefixForm.value.schemeprefix,
      "UDF1": this.metalprefixForm.value.userdefined_1 || "",
      "UDF2": this.metalprefixForm.value.userdefined_2 || "",
      "UDF3": this.metalprefixForm.value.userdefined_3 || "",
      "UDF4": this.metalprefixForm.value.userdefined_4 || "",
      "UDF5": this.metalprefixForm.value.userdefined_5 || "",
      "UDF6": this.metalprefixForm.value.userdefined_6 || "",
      "UDF7": this.metalprefixForm.value.userdefined_7 || "",
      "UDF8": this.metalprefixForm.value.userdefined_8 || "",
      "UDF9": this.metalprefixForm.value.userdefined_9 || "",
      "UDF10": this.metalprefixForm.value.userdefined_10 || "",
      "UDF11": this.metalprefixForm.value.userdefined_11 || "",
      "UDF12": this.metalprefixForm.value.userdefined_12 || "",
      "UDF13": this.metalprefixForm.value.userdefined_13 || "",
      "UDF14": this.metalprefixForm.value.userdefined_14 || "",
      "UDF15": this.metalprefixForm.value.userdefined_15 || "",
      "TAG_WT": this.metalprefixForm.value.tagWt || "",
      "COMP_PREFIX": true,
      "DESIGN_PREFIX": this.metalprefixForm.value.designprefix,
      "REFINE_PREFIX": this.metalprefixForm.value.refinervprefix,
      "SUBLEDGER_PREFIX": true,
      "SUFFIX_CODE": this.metalprefixForm.value.suffixcode || "",
      "HSN_CODE": this.metalprefixForm.value.hsn || "",

    }


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
                this.metalprefixForm.reset()
                this.tableData = []
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
  deleteRecord() {
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
        let API = 'PrefixMaster/DeletePrefixMaster/' + this.metalprefixForm.value.prefixcode
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
                    this.metalprefixForm.reset()
                    this.tableData = []
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
                    this.metalprefixForm.reset()
                    this.tableData = []
                    this.close()
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
