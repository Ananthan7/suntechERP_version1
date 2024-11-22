import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-mould-making',
  templateUrl: './mould-making.component.html',
  styleUrls: ['./mould-making.component.scss']
})
export class MouldMakingComponent implements OnInit {
  @ViewChild('overlayuserName') overlayuserName!: MasterSearchComponent;
  @ViewChild('overlayProcessCode') overlayProcessCode!: MasterSearchComponent;
  @ViewChild('overlayWorkercodeData') overlayWorkercodeData!: MasterSearchComponent;
  @ViewChild('overlayJobNo') overlayJobNo!: MasterSearchComponent;
  @ViewChild('overlayMouldType') overlayMouldType!: MasterSearchComponent;
  @ViewChild('overlayToProcess') overlayToProcess!: MasterSearchComponent;
  @ViewChild('overlayToWorker') overlayToWorker!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  columnheads: any[] = ['Stock Code', 'Description', 'Psc', 'Gross Weight', 'Rate', 'Amount', 'Location'];
  branchCode?: String;
  yearMonth?: String;
  allMode: string;
  checkBoxesMode: string;
  selectedIndexes: any = [];
  vocMaxDate = new Date();
  currentDate = new Date();
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
  isSaved: boolean = false;
  isloading: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;

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


  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  mouldCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Mould Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock type',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,
  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setCompanyCurrency();
    this.setvalues()
    this.setAllInitialValues()

    //this.content provide the data and flag from main grid to the form
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
      }
      this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.deleteRecord()
      }
      this.mouldMakingForm.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.setvalues()
    }

  }

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  setvalues() {
    this.mouldMakingForm.controls.vocher.setValue(this.comService.getqueryParamVocType())
    this.mouldMakingForm.controls.fromProcess.setValue(this.comService.getqueryParamVocType())
    this.mouldMakingForm.controls.fromWorker.setValue(this.comService.getqueryParamVocType())
    this.mouldMakingForm.controls.vocDate.setValue(this.comService.currentDate)
    this.mouldMakingForm.controls.itemCurrency.setValue(this.comService.compCurrency)
    this.mouldMakingForm.controls.itemCurrencyRate.setValue('1.000')
  }

  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.compCurrency;
    this.mouldMakingForm.controls.itemCurrency.setValue(CURRENCY_CODE);
  }

  userDataSelected(value: any) {
    console.log(value);
    this.mouldMakingForm.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e: any) {
    console.log(e);
    this.mouldMakingForm.controls.fromProcess.setValue(e.Process_Code);
    this.mouldMakingForm.controls.toProcess.setValue(e.Process_Code);
  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.mouldMakingForm.controls.fromWorker.setValue(e.WORKER_CODE);
    this.mouldMakingForm.controls.toWorker.setValue(e.WORKER_CODE);
  }

  jobnoCodeSelected(e: any) {
    console.log(e);
    this.mouldMakingForm.controls.jobNo.setValue(e.job_number);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }

  mouldCodeSelected(e: any) {
    console.log(e);
    this.mouldMakingForm.controls.mouldType.setValue(e.CODE);
  }

  stockCodeSelected(e: any) {
    console.log(e);
    this.mouldMakingForm.controls.stockcode.setValue(e.STOCK_CODE);
  }

  stock_codetemp(data: any, value: any) {
    console.log(data);
    this.tableData[value.data.SN - 1].stock_code = data.STOCK_CODE;
  }

  descriptiontemp(data: any, value: any) {
    console.log(value);
    console.log(data);
    this.tableData[value.data.SN - 1].stock_code = data.STOCK_CODE;
    this.tableData[value.data.SN - 1].description = data.DESCRIPTION;
  }

  Psctemp(data: any, value: any) {
    this.tableData[value.data.SN - 1].Psc = data.target.value;
  }

  gross_weighttemp(data: any, value: any) {
    this.tableData[value.data.SN - 1].gross_weight = data.target.value;
  }

  ratetemp(data: any, value: any) {
    this.tableData[value.data.SN - 1].rate = data.target.value;
  }

  amounttemp(data: any, value: any) {
    this.tableData[value.data.SN - 1].amount = data.target.value;
  }

  locationtemp(data: any, value: any) {
    this.tableData[value.data.SN - 1].location = data.target.value;
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


  addTableData() {
    let length = this.tableData.length;
    let sn = length + 1;
    let data = {
      "SN": sn,
      "stock_code": "",
      "description": "",
      "Psc": "",
      "gross_weight": "",
      "rate": "",
      "amount": "",
      "location": "",
    };
    this.tableData.push(data);
  }



  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SN))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);

  }

  deleteTableData() {
    console.log(this.selectedIndexes);

    if (this.selectedIndexes.length > 0) {
      this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
    }
  }

  mouldMakingForm: FormGroup = this.formBuilder.group({
    uniq: [''],
    uniqNo: [''],
    job: [''],
    MID: [0],
    vocher: ['', [Validators.required]],
    vocherNo: [1],
    vocDate: [''],
    enteredBy: [''],
    fromProcess: ['', [Validators.required]],
    fromWorker: ['', [Validators.required]],
    jobNo: ['', [Validators.required]],
    mouldNo: ['', [Validators.required]],
    mouldType: ['', [Validators.required]],
    noOfParts: [''],
    narration: [''],
    toProcess: ['', [Validators.required]],
    toWorker: ['', [Validators.required]],
    designCode: ['', [Validators.required]],
    itemCurrency: [''],
    itemCurrencyRate: [1.000000],
    location: [''],

  });
  setAllInitialValues() {
    if (!this.content?.FLAG) return
    let API = `JobMouldHeaderDj/GetJobMouldHeaderDJWithMid/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          // data.Details.forEach((element: any) => {
          // this.tableData.push({
          //   SN: element.SRNO,
          //   stock_code: element.STOCK_CODE,
          //   description: element.DISCPER,
          //   Psc: element.PCS,
          //   gross_weight: element.GRWT,
          //   rate: element.RATEFC,
          //   amount: element.VALUEFC,
          //   location: element.LOCTYPE_CODE,

          // })
          // });
          this.mouldMakingForm.controls.MID.setValue(data.MID)
          this.mouldMakingForm.controls.vocherNo.setValue(data.VOCNO)
          this.mouldMakingForm.controls.vocDate.setValue(data.VOCDATE)
          this.mouldMakingForm.controls.vocher.setValue(data.VOCTYPE)
          this.mouldMakingForm.controls.uniq.setValue(data.UNQ_JOB_ID)
          this.mouldMakingForm.controls.uniqNo.setValue(data.UNQ_DESIGN_ID)
          this.mouldMakingForm.controls.fromProcess.setValue(data.FROM_PROCESS_CODE)
          this.mouldMakingForm.controls.fromWorker.setValue(data.FROM_WORKER_CODE)
          this.mouldMakingForm.controls.toProcess.setValue(data.TO_PROCESS_CODE)
          this.mouldMakingForm.controls.toWorker.setValue(data.TO_WORKER_CODE)
          this.mouldMakingForm.controls.job.setValue(data.JOB_DESCRIPTION)
          this.mouldMakingForm.controls.enteredBy.setValue(data.TREE_NO)
          this.mouldMakingForm.controls.jobNo.setValue(data.UNQ_JOB_ID)
          this.mouldMakingForm.controls.mouldType.setValue(data.MOULD_TYPE)
          this.mouldMakingForm.controls.mouldNo.setValue(data.MOULD_NUMBER)
          this.mouldMakingForm.controls.noOfParts.setValue(data.CONV_FACT)
          this.mouldMakingForm.controls.narration.setValue(data.PROCESS_CODE)
          this.mouldMakingForm.controls.designCode.setValue(data.DESIGN_CODE)
          this.mouldMakingForm.controls.location.setValue(data.RCVD_MET_WT)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  setPostData() {
    let form = this.mouldMakingForm.value
    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.mouldMakingForm.value.vocher || "",
      "VOCNO": 0,
      "VOCDATE": this.mouldMakingForm.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "JOB_NUMBER": this.mouldMakingForm.value.jobNo || "",
      "JOB_DESCRIPTION": this.mouldMakingForm.value.job || "",
      "DESIGN_CODE": this.mouldMakingForm.value.designCode || "",
      "MOULD_NUMBER": this.comService.nullToString(form.mouldNo),
      "MOULD_LOCATION": this.mouldMakingForm.value.location || "",
      "MOULD_TYPE": this.mouldMakingForm.value.mouldType || "",
      "UNQ_JOB_ID": this.mouldMakingForm.value.uniq,
      "UNQ_DESIGN_ID": this.mouldMakingForm.value.uniqNo,
      "JOB_SO_MID": 0,
      "JOB_SO_NUMBER": 0,
      "PARTYCODE": this.mouldMakingForm.value.noOfParts || "",
      "PARTY_CURRENCY": "",
      "PARTY_CURR_RATE": 0,
      "ITEM_CURRENCY": this.mouldMakingForm.value.itemCurrency || "",
      "ITEM_CURR_RATE": this.mouldMakingForm.value.itemCurrencyRate || "",
      "VALUE_DATE": "2023-10-19T08:59:58.514Z",
      "SALESPERSON_CODE": this.mouldMakingForm.value.enteredBy,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_DISCAMTFC": 0,
      "TOTAL_DISCAMTCC": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": 0,
      "NET_VALUE_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "GROSS_VALUE_FC": 0,
      "GROSS_VALUE_CC": 0,
      "REMARKS": this.mouldMakingForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-19T08:59:58.514Z",
      "CONSIGNMENTID": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": "string",
      "SUPINVDATE": "2023-10-19T08:59:58.514Z",
      "PAYMENTREMARKS": "",
      "HHACCOUNT_HEAD": "",
      "D2DTRANSFER": "",
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "DOC_REF": "",
      "PICTURE_NAME": "",
      "FROM_WORKER_CODE": this.mouldMakingForm.value.fromWorker || "",
      "TO_WORKER_CODE": this.mouldMakingForm.value.toWorker || "",
      "FROM_PROCESS_CODE": this.mouldMakingForm.value.fromProcess || "",
      "TO_PROCESS_CODE": this.mouldMakingForm.value.toProcess || "",
      "PARTS": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "PCS": 0,
          "GRWT": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "VALUEFC": 0,
          "VALUECC": 0,
          "DISCPER": 0,
          "DISCAMTFC": 0,
          "DISCAMTCC": 0,
          "NETVALUEFC": 0,
          "NETVALUECC": 0,
          "LOCTYPE_CODE": "",
          "STOCK_DOCDESC": "",
          "DETDIVISION": "",
          "BASE_CONV_RATE": 0,
          "DIVISION_CODE": "",
          "POSTDATE": "",
          "DETLINEREMARKS": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "TOTAL_AMOUNTCC": 0,
          "TOTAL_AMOUNTFC": 0
        }
      ]
    }
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.vocher) == '') {
      this.commonService.toastErrorByMsgId('MSG1940')// vocher  CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.fromProcess) == '') {
      this.commonService.toastErrorByMsgId('MSG1295')//"fromProcess cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.fromWorker) == '') {
      this.commonService.toastErrorByMsgId('MSG1296')//"fromWorker cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.jobNo) == '') {
      this.commonService.toastErrorByMsgId('MSG1358')//"jobNo cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.mouldNo) == '') {
      this.commonService.toastErrorByMsgId('MSG7964')//"mouldNo cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.mouldType) == '') {
      this.commonService.toastErrorByMsgId('MSG7966')//"mouldType cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.toProcess) == '') {
      this.commonService.toastErrorByMsgId('MSG1907')//"toProcess cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.toWorker) == '') {
      this.commonService.toastErrorByMsgId('MSG1912')//"toWorker cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.designCode) == '') {
      this.commonService.toastErrorByMsgId('MSG1197	')//"designCode cannot be empty"
      return true
    }
    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.mouldMakingForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    if (this.submitValidations(this.mouldMakingForm.value)) return;


    let API = 'JobMouldHeaderDJ/InsertJobMouldHeaderDJ'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status.trim() == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.mouldMakingForm.reset()
              this.isSaved = true;
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }


  update() {
    if (this.submitValidations(this.mouldMakingForm.value)) return;

    let form = this.mouldMakingForm.value
    let API = `JobMouldHeaderDJ/UpdateJobMouldHeaderDJ/${this.branchCode}/${this.mouldMakingForm.value.vocher}/${this.mouldMakingForm.value.vocherNo}/${this.commonService.yearSelected}`;
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status == "Success") {
          this.isSaved = true;
          Swal.fire({
            title: this.comService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.mouldMakingForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
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
        let API = 'JobMouldHeaderDJ/DeleteJobMouldHeaderDJ/' +
          this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
          this.content.VOCNO + '/' + this.content.YEARMONTH;
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
                    this.mouldMakingForm.reset()
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
                    this.mouldMakingForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.mouldMakingForm.value.jobNo,
        'strBranchCode': this.comService.nullToString(this.comService.branchCode),
        'strCurrenctUser': this.comService.nullToString(this.comService.userName),
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        console.log(postData, 'uuu')
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          console.log(data, 'data')
          this.mouldMakingForm.controls.mouldNo.setValue(data[0].MOULD_NUMBER)
          this.mouldMakingForm.controls.mouldType.setValue(data[0].MOULD_TYPE)
          this.mouldMakingForm.controls.toProcess.setValue(data[0].PROCESS)
          this.mouldMakingForm.controls.toWorker.setValue(data[0].WORKER)
          this.mouldMakingForm.controls.job.setValue(data[0].JOB_NUMBER)
          this.mouldMakingForm.controls.uniq.setValue(data[0].UNQ_JOB_ID)
          this.mouldMakingForm.controls.uniqNo.setValue(data[0].UNQ_DESIGN_ID)
          this.mouldMakingForm.controls.designCode.setValue(data[0].DESIGN_CODE)
          // this.mouldMakingForm.controls.fromProcess.setValue(data[0].PROCESSDESC)
          // this.mouldMakingForm.controls.fromWorker.setValue(data[0].WORKERDESC)


        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strJobNumber': this.comService.nullToString(event.target.value),
        'strCurrenctUser': this.comService.nullToString(this.userName)
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            console.log(data, 'pppp')
            this.jobNumberDetailData = data
            this.mouldMakingForm.controls.jobNo.setValue(data[0].UNQ_JOB_ID)



            this.subJobNumberValidate()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    if (this.mouldMakingForm.value[formControlName] != '') return;

    switch (formControlName) {
      case 'enteredBy':
        this.overlayuserName.showOverlayPanel(event);
        break;
      case 'fromProcess':
        this.overlayProcessCode.showOverlayPanel(event);
        break;
      case 'fromWorker':
        this.overlayWorkercodeData.showOverlayPanel(event);
        break;
      case 'jobNo':
        this.overlayJobNo.showOverlayPanel(event);
        break;
      case 'mouldType':
        this.overlayMouldType.showOverlayPanel(event);
        break;
      case 'toProcess':
        this.overlayToProcess.showOverlayPanel(event);
        break;
      case 'toWorker':
        this.overlayToWorker.showOverlayPanel(event);
        break;
      default:
    }
  }


  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.mouldMakingForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'enteredBy' || FORMNAME === 'fromProcess' || FORMNAME === 'fromWorker' || FORMNAME === 'jobNo' || FORMNAME === 'mouldType' || FORMNAME === 'toProcess' || FORMNAME === 'toWorker') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

}
