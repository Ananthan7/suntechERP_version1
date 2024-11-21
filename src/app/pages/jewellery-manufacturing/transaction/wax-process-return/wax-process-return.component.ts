import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
@Component({
  selector: 'app-wax-process-return',
  templateUrl: './wax-process-return.component.html',
  styleUrls: ['./wax-process-return.component.scss']
})
export class WaxProcessReturnComponent implements OnInit {
  currentFilter: any;
  @ViewChild('overlayprocessCodeSearch') overlayprocessCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaytoprocessSearch') overlaytoprocessSearch!: MasterSearchComponent;
  @ViewChild('overlayworkerSearch') overlayworkerSearch!: MasterSearchComponent;
  @ViewChild('overlaytoworkerSearch') overlaytoworkerSearch!: MasterSearchComponent;
  @ViewChild('overlayenteredBySearch') overlayenteredBySearch!: MasterSearchComponent;
  @ViewChild('overlaywaxcodeSearch') overlaywaxcodeSearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];
  columnhead: any[] = ['Sr No', 'Job No', 'Design', 'Party', 'S.O', 'S.O Date', 'Del Date', 'Gross Weight', 'Metal Weight', 'Stone Weight', 'Wax Weight', 'Issue Pcs', 'Return Pcs', 'Karat'];
  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  viewMode: boolean = false;
  vocMaxDate = new Date();
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  currentDate = new Date();
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  isloading: boolean = false;
  private subscriptions: Subscription[] = [];
  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'PROCESS_CODE',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ToProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ToWorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  WaxCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Wax Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  waxprocessFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocDate: [new Date()],
    vocno: ['', [Validators.required]],
    enteredBy: [''],
    process: ['', [Validators.required]],
    worker: ['', [Validators.required]],
    toworker: [''],
    toprocess: [''],
    waxcode: [''],
    remark: [''],
    FLAG: [null],
    MAIN_VOCTYPE: ['']
  });


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.waxprocessFrom.controls.voctype.setValue(this.comService.getqueryParamVocType());
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content?.FLAG) {
        this.waxprocessFrom.controls.FLAG.setValue(this.content.FLAG)
      }
    } else {
      this.generateVocNo()
      this.setFormValues()
      this.setvoucherTypeMaster()
    }

  }
  setFormValues(){
    if (!this.content) return
    this.waxprocessFrom.controls.MAIN_VOCTYPE.setValue(
      this.comService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
  }

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  userDataSelected(value: any) {
    console.log(value);
    this.waxprocessFrom.controls.enteredBy.setValue(value.UsersName);
  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  ToWorkerCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.toworker.setValue(e.WORKER_CODE);
  }

  WaxCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.waxcode.setValue(e.CODE);
  }

  ProcessCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.process.setValue(e.Process_Code);
  }

  ToProcessCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.toprocess.setValue(e.Process_Code);
  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.waxprocessFrom.value
    const vocTypeMaster = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.waxprocessFrom.value.vocno}`
    API += `/${this.comService.branchCode}/${this.comService.getqueryParamVocType()}`
    API += `/${this.comService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.comService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.comService.branchCode}/${this.comService.yearSelected}/${this.comService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.waxprocessFrom.controls.vocno.setValue(resp.newvocno);
        }
      });
  }
  removedata() {
    this.tableData.pop();
  }


  submitValidations(form: any) {
    if (this.comService.nullToString(form.voctype) == '') {
      this.comService.toastErrorByMsgId('MSG1939')// voctype code CANNOT BE EMPTY
      return true
    }
    else if (this.comService.nullToString(form.vocno) == '') {
      this.comService.toastErrorByMsgId('MSG3661')//"vocno cannot be empty"
      return true
    }
    else if (this.comService.nullToString(form.process) == '') {
      this.comService.toastErrorByMsgId('MSG1680')//"process cannot be empty"
      return true
    }
    else if (this.comService.nullToString(form.worker) == '') {
      this.comService.toastErrorByMsgId('MSG1951')//"worker cannot be empty"
      return true
    }
    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.waxprocessFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    if (this.submitValidations(this.waxprocessFrom.value)) return;

    let API = 'JobWaxReturn/InsertJobWaxReturn'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.waxprocessFrom.value.vocno || "",
      "VOCDATE": this.waxprocessFrom.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-19T05:34:05.288Z",
      "PROCESS_CODE": this.waxprocessFrom.value.process || "",
      "WORKER_CODE": this.waxprocessFrom.value.worker || "",
      "SMAN": "",
      "REMARKS": this.waxprocessFrom.value.remark || "",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": this.waxprocessFrom.value.toprocess || "",
      "TO_WORKER_CODE": this.waxprocessFrom.value.toworker || "",
      "DIVISION_CODE": "",
      "STOCK_CODE": "",
      "SYSTEM_DATE": "2023-10-19T05:34:05.288Z",
      "HTUSERNAME": this.waxprocessFrom.value.enteredBy,
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_VOCTYPE": "JWA",
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 10,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": 0,
          "JOB_NUMBER": "12",
          "UNQ_JOB_ID": "",
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "DESIGN_CODE": "",
          "PARTYCODE": "",
          "ISSUE_PCS": 0,
          "RETURN_PCS": 0,
          "ISSUE_VOCTYPE": "",
          "ISSUE_BRANCH_CODE": "",
          "ISSUE_VOCNO": 0,
          "ISSUE_YEARMONTH": "",
          "TO_PROCESS_CODE": "",
          "TO_WORKER_CODE": "",
          "IS_AUTHORISE": true,
          "GROSS_WT": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "WAX_WT": 0,
          "JOB_PCS": 0,
          "AUTHORIZE_TIME": "2023-10-19T05:34:05.288Z",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": ""
        }
      ]
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.waxprocessFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }




  update() {
    // if (this.waxprocessFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    if (this.submitValidations(this.waxprocessFrom.value)) return;

    let API = 'JobWaxReturn/UpdateJobWaxReturn/' + this.waxprocessFrom.value.branchCode + this.waxprocessFrom.value.voctype + this.waxprocessFrom.value.vocno + this.waxprocessFrom.value.yearMonth
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.waxprocessFrom.value.vocno || "",
      "VOCDATE": this.waxprocessFrom.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-19T05:34:05.288Z",
      "PROCESS_CODE": this.waxprocessFrom.value.process || "",
      "WORKER_CODE": this.waxprocessFrom.value.worker || "",
      "SMAN": "",
      "REMARKS": this.waxprocessFrom.value.remark || "",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": this.waxprocessFrom.value.toprocess || "",
      "TO_WORKER_CODE": this.waxprocessFrom.value.toworker || "",
      "DIVISION_CODE": "",
      "STOCK_CODE": "",
      "SYSTEM_DATE": "2023-10-19T05:34:05.288Z",
      "HTUSERNAME": this.waxprocessFrom.value.enteredBy,
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_VOCTYPE": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "SRNO": 0,
          "JOB_NUMBER": "",
          "UNQ_JOB_ID": "",
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "DESIGN_CODE": "",
          "PARTYCODE": "",
          "ISSUE_PCS": 0,
          "RETURN_PCS": 0,
          "ISSUE_VOCTYPE": "",
          "ISSUE_BRANCH_CODE": "",
          "ISSUE_VOCNO": 0,
          "ISSUE_YEARMONTH": "",
          "TO_PROCESS_CODE": "",
          "TO_WORKER_CODE": "",
          "IS_AUTHORISE": true,
          "GROSS_WT": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "WAX_WT": 0,
          "JOB_PCS": 0,
          "AUTHORIZE_TIME": "2023-10-19T05:34:05.288Z",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": ""
        }
      ]
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.waxprocessFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }

      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content.VOCTYPE) {
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
        let API = 'JobWaxReturn/DeleteJobWaxReturn/' + this.waxprocessFrom.value.branchCode + this.waxprocessFrom.value.voctype + this.waxprocessFrom.value.vocno + this.waxprocessFrom.value.yearMonth
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
                    this.waxprocessFrom.reset()
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
                    this.waxprocessFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.comService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.waxprocessFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'process':
        this.overlayprocessCodeSearch.showOverlayPanel(event);
        break;
      case 'toprocess':
        this.overlaytoprocessSearch.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkerSearch.showOverlayPanel(event);
        break;
      case 'toworker':
        this.overlaytoworkerSearch.showOverlayPanel(event);
        break;
      case 'enteredBy':
        this.overlayenteredBySearch.showOverlayPanel(event);
        break;
      case 'waxcode':
        this.overlaywaxcodeSearch.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unexpected form control name: ${formControlName}`);
    }
  }

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.comService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.waxprocessFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'process' || FORMNAME === 'toprocess' || FORMNAME === 'worker' || FORMNAME === 'toworker' || FORMNAME === 'enteredBy' || FORMNAME === 'waxcode') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
