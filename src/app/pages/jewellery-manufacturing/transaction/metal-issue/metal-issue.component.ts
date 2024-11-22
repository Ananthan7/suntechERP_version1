import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MetalIssueDetailsComponent } from './metal-issue-details/metal-issue-details.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './metal-issue.component.html',
  styleUrls: ['./metal-issue.component.scss']
})
export class MetalIssueComponent implements OnInit {
  @ViewChild('metalIssueDetailScreen') public MetalIssueDetailScreen!: NgbModal;
  @ViewChild('overlayworkerDes') overlayworkerDes!: MasterSearchComponent;
  @ViewChild('overlaysalesperson') overlaysalesperson!: MasterSearchComponent;
  @Input() content!: any;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];


  private subscriptions: Subscription[] = [];
  modalReference!: NgbModalRef;

  currentFilter: any;
  divisionMS: any = 'ID';
  tableData: any[] = [];
  columnhead: any[] = [
    { title: 'SRNO', field: 'SRNO', format: '', alignment: 'center' },
    { title: 'Job Number', field: 'JOB_NUMBER', format: '', alignment: 'left' },
    { title: 'Sub job Id', field: 'UNQ_JOB_ID', format: '', alignment: 'left' },
    // { title: 'Design', field: 'DESIGN_CODE', format: '', alignment: 'left' },
    { title: 'Description', field: 'STOCK_DESCRIPTION', format: '', alignment: 'left' },
    { title: 'Stock Code', field: 'STOCK_CODE', format: '', alignment: 'left' },
    {
      title: 'Gross WT', field: 'GROSS_WT', format: {
        type: 'fixedPoint',
        precision: this.comService.allbranchMaster?.BAMTDECIMALS,
        currency: this.comService.compCurrency
      }, alignment: 'right'
    },
    { title: 'Net Wt', field: 'NET_WT', format: '', alignment: 'right' },
    { title: 'Purity', field: 'PURITY', format: '', alignment: 'right' },
    { title: 'Pure Wt', field: 'PURE_WT', format: '', alignment: 'right' },
    { title: 'Karat', field: 'KARAT_CODE', format: '', alignment: 'right' },
    { title: 'Location', field: 'LOCTYPE_CODE', format: '', alignment: 'left' },
    // { title: 'Division', field: 'DIVCODE', format: '', alignment: 'left' },

    // { title: 'Process', field: 'PROCESS_CODE', format: '', alignment: 'left' },
    // { title: 'Worker', field: 'WORKER_CODE', format: '', alignment: 'left' },
    {
      title: 'Amount.', field: 'TOTAL_AMOUNTFC', format: {
        type: 'fixedPoint',
        precision: this.comService.allbranchMaster?.BAMTDECIMALS,
        currency: this.comService.compCurrency
      }, alignment: 'right'
    },
  ];
  // workerCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 19,
  //   SEARCH_FIELD: 'WORKER_CODE',
  //   SEARCH_HEADING: 'Worker Code',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "WORKER_CODE<> ''",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }
  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 254,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "@strProcess='',@blnActive=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  SALESPERSON_CODEData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Entered by',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACTIVE=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  metalIssueDetailsData: any[] = [];
  userName = localStorage.getItem('username');
  srNo: any = 0;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  viewOnly: boolean = false;
  selectedIndexes: any = [];
  getdata!: any[];
  tableRowCount: number = 0;
  selectRowIndex: any;
  viewMode: boolean = false;
  isSaved: boolean = false;
  isloading: boolean = false;
  gridAmountDecimalFormat: any;

  metalIssueForm: FormGroup = this.formBuilder.group({
    VOCTYPE: ['', [Validators.required]],
    time: [new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()],
    vocdate: ['', [Validators.required]],
    SALESPERSON_CODE: [''],
    VOCNO: [''],
    MID: [0],
    worker: ['', [Validators.required]],
    workerDes: [''],
    REMARKS: [''],
    FLAG: [null],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    MAIN_VOCTYPE: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private renderer: Renderer2,
  ) { }


  ngOnInit(): void {
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
      currency: this.comService.compCurrency
    };
    //this.content provide the data and flag from main grid to the form
    this.renderer.selectRootElement('#code')?.focus();
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.LOCKVOUCHERNO = true;
      }
      this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.deleteRecord()
      }
      this.metalIssueForm.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.generateVocNo()
      this.setNewFormValues()
      this.setvoucherTypeMaster()
    }
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  setvoucherTypeMaster() {
    let frm = this.metalIssueForm.value
    const vocTypeMaster = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.metalIssueForm.value.VOCNO}`
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
          this.metalIssueForm.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }

  setNewFormValues() {
    this.metalIssueForm.controls.VOCTYPE.setValue(this.comService.getqueryParamVocType())
    this.metalIssueForm.controls.vocdate.setValue(this.comService.currentDate)
    this.metalIssueForm.controls.YEARMONTH.setValue(this.comService.yearSelected)
    this.metalIssueForm.controls.BRANCH_CODE.setValue(this.comService.branchCode)
    this.metalIssueForm.controls.MAIN_VOCTYPE.setValue(
      this.comService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
  }

  setAllInitialValues() {
    if (!this.content?.FLAG) return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `JobMetalIssueMasterDJ/GetJobMetalIssueMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.metalIssueForm.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.metalIssueForm.controls.VOCNO.setValue(data.VOCNO)
          this.metalIssueForm.controls.MID.setValue(data.MID)
          this.metalIssueForm.controls.vocdate.setValue(new Date(data.VOCDATE))
          this.metalIssueForm.controls.worker.setValue(data.Details[0].WORKER_CODE)
          this.metalIssueForm.controls.workerDes.setValue(data.Details[0].WORKER_NAME)
          this.metalIssueForm.controls.YEARMONTH.setValue(data.YEARMONTH)
          this.metalIssueForm.controls.BRANCH_CODE.setValue(data.BRANCH_CODE)
          this.metalIssueForm.controls.SALESPERSON_CODE.setValue(data.SMAN)
          this.metalIssueForm.controls.REMARKS.setValue(data.REMARKS)
          let part = data.DOCTIME.split('T')
          this.metalIssueForm.controls.time.setValue(part[1])

          this.metalIssueDetailsData = data.Details
          this.formatMainGrid() //set to main grid

          this.metalIssueDetailsData.forEach((element: any) => {
            this.tableData.push({
              jobNumber: element.JOB_NUMBER,
              jobNumDes: element.JOB_DESCRIPTION,
              processCode: element.PROCESS_CODE,
              processCodeDesc: element.PROCESS_NAME,
              workerCode: element.WORKER_CODE,
              workerCodeDes: element.WORKER_NAME,
              pcs: element.PCS,
              purity: element.PURITY,
              grossWeight: element.GROSS_WT,
              netWeight: element.NET_WT,
            })
          });

        } else {
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  // use : to recalculate index number and decimal points
  formatMainGrid() {
    this.metalIssueDetailsData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
      item.GROSS_WT = this.comService.setCommaSerperatedNumber(item.GROSS_WT, 'METAL')
      item.NET_WT = this.comService.setCommaSerperatedNumber(item.NET_WT, 'METAL')
      item.PURITY = this.comService.setCommaSerperatedNumber(item.PURITY, 'PURITY')
      item.PURE_WT = this.comService.setCommaSerperatedNumber(item.PURE_WT, 'METAL')
      item.TOTAL_AMOUNTFC = this.comService.setCommaSerperatedNumber(item.TOTAL_AMOUNTFC, 'AMOUNT')
    })
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
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  deleteRowClicked(): void {
    if (!this.selectRowIndex) {
      Swal.fire({
        title: '',
        text: 'Please select row to remove from grid!',
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
        this.metalIssueDetailsData = this.metalIssueDetailsData.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
        this.formatMainGrid()
      }
    }
    )
  }
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
    console.log(this.selectRowIndex);
  }
  onRowDblClickHandler(event: any) {
    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    this.openAddMetalIssue(selectedData)
  }
  dataToDetailScreen: any; //data to pass to child
  openAddMetalIssue(dataToChild?: any) {
    // if (this.submitValidations(this.metalIssueForm.value)) {
    //   return
    // }
    if (dataToChild) {
      dataToChild.FLAG = this.content?.FLAG || 'EDIT'
      dataToChild.HEADERDETAILS = this.metalIssueForm.value;
    } else {
      dataToChild = { HEADERDETAILS: this.metalIssueForm.value }
    }
    console.log(dataToChild, 'dataToChild to parent');
    this.dataToDetailScreen = dataToChild //input variable to pass data to child

    this.modalReference = this.modalService.open(this.MetalIssueDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    // modalRef.componentInstance.content = dataToChild
    // modalRef.result.then((postData) => {
    //   if (postData) {
    //     this.setValuesToHeaderGrid(postData);
    //   }
    // });
  }
  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.metalIssueDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      detailDataToParent.SRNO = this.metalIssueDetailsData.length + 1
      this.metalIssueDetailsData.push(detailDataToParent);
    }
    this.formatMainGrid()
    this.tableData.push(detailDataToParent)
    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE' || DATA.FLAG == 'CHANGEJOB') {
      this.comService.showSnackBarMsg('Details added successfully')
    };
  }
  closeDetailScreen() {
    this.modalReference.close()
  }

  stock_codetemp(data: any, value: any) {
    console.log(data);
    this.tableData[value.data.SN - 1].stock_code = data.postData.stockCode;
  }

  removeLineItemsGrid(event: any) {
  }
  editTable(event: any) {
  }

  customizeWeight(data: any) {
    return 'Wt: ' + data['value'];
  }

  customizeQty(data: any) {
  }
  customizeDate(data: any) {
    // return "First: " + new DatePipe("en-US").transform(data.value, 'MMM dd, yyyy');
  }
  SALESPERSON_CODESelected(e: any) {
    this.metalIssueForm.controls.SALESPERSON_CODE.setValue(e.SALESPERSON_CODE);
  }


  workerCodeSelected(e: any) {
    console.log(e);
    this.metalIssueForm.controls.worker.setValue(e.WORKER_CODE);
    this.metalIssueForm.controls.workerDes.setValue(e.DESCRIPTION);
  }

  removedata() {
    this.tableData.pop();
  }

  setPostData() {
    let form = this.metalIssueForm.value
    return {
      "MID": this.comService.emptyToZero(form.MID),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCDATE": this.comService.formatDateTime(form.vocdate),
      "YEARMONTH": this.comService.nullToString(form.YEARMONTH),
      "DOCTIME": this.comService.formatDateTime(form.vocdate),
      "CURRENCY_CODE": this.comService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.comService.emptyToZero(form.CURRENCY_RATE),
      "METAL_RATE_TYPE": "",
      "METAL_RATE": 0,
      "TOTAL_AMOUNTFC_METAL": 0,
      "TOTAL_AMOUNTLC_METAL": 0,
      "TOTAL_AMOUNTFC_MAKING": 0,
      "TOTAL_AMOUNTLC_MAKING": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_PURE_WT": 0,
      "SMAN": this.comService.nullToString(this.metalIssueForm.value.SALESPERSON_CODE?.toUpperCase()),
      "REMARKS": this.metalIssueForm.value.REMARKS || "",
      "NAVSEQNO": 0,
      "FIX_UNFIX": false,
      "AUTOPOSTING": true,
      "POSTDATE": this.comService.formatDateTime(form.currentDate),
      "SYSTEM_DATE": this.comService.formatDateTime(form.vocdate),
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.metalIssueDetailsData
    }
  }
  submitValidations(form: any) {
    if (form.VOCTYPE == '') {
      this.comService.toastErrorByMsgId('MSG1939')//VOCTYPE is required
      return true
    }
    if (form.worker == '') {
      this.comService.toastErrorByMsgId('MSG1951')// worker is required
      return true
    }
    if (this.tableData?.length <= 0) {
      this.comService.toastErrorByMsgId('MSG1200')
      return true;
    }
    return false
  }
  formSubmit() {
    if (this.submitValidations(this.metalIssueForm.value)) {
      return
    }
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    let API = 'JobMetalIssueMasterDJ/InsertJobMetalIssueMasterDJ'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status.trim() == "Success") {
          this.isSaved = true;
          Swal.fire({
            title: this.comService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.metalIssueForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

        console.log(err);
      })
    this.subscriptions.push(Sub)
  }

  update() {
    let form = this.metalIssueForm.value
    let API = `JobMetalIssueMasterDJ/UpdateJobMetalIssueMasterDJ/${form.BRANCH_CODE}/${form.VOCTYPE}/${form.VOCNO}/${form.YEARMONTH}`
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
              this.metalIssueForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content) {
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
        let form = this.metalIssueForm.value
        let API = 'JobMetalIssueMasterDJ/DeleteJobMetalIssueMasterDJ/' +
          this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
          this.content.VOCNO + '/' + this.content.YEARMONTH
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
                    this.metalIssueForm.reset()
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
                    this.metalIssueForm.reset()
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
    if (this.metalIssueForm.value[formControlName] != '') return
    switch (formControlName) {
      case 'SALESPERSON_CODE':
        this.overlaysalesperson.showOverlayPanel(event)
        break;
      case 'worker':
        this.overlayworkerDes.showOverlayPanel(event)
        break;

      default:
        break;
    }

  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.comService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.metalIssueForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.showOverleyPanel(event, FORMNAME);
          return
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }
  SPvalidateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;
    if (event.target.value == '' || this.viewMode == true) return;

    let param = {
      "PAGENO": LOOKUPDATA.PAGENO,
      "RECORDS": LOOKUPDATA.RECORDS,
      "LOOKUPID": LOOKUPDATA.LOOKUPID,
      "ORDER_TYPE": LOOKUPDATA.SEARCH_VALUE ? 1 : 0,
      "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
      "searchField": LOOKUPDATA.SEARCH_FIELD,
      "searchValue": LOOKUPDATA.SEARCH_VALUE
    };

    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        let data = result.dynamicData[0];
        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE != '') {
            let searchResult = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE);
            if (searchResult && searchResult.length == 0) {
              this.metalIssueForm.controls[FORMNAME].setValue('');
              LOOKUPDATA.SEARCH_VALUE = '';
              this.showOverleyPanel(event, FORMNAME);
              return;
            }
            let result = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE)
            if (result) this.setFormValues(result, FORMNAME)
          }
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      });
    this.subscriptions.push(Sub);
  }
  setFormValues(result: any, FORMNAME: string) {
    switch (FORMNAME) {
      case 'worker':
        this.metalIssueForm.controls.worker.setValue(result[0].WORKER_CODE)
        this.metalIssueForm.controls.workerDes.setValue(result[0].DESCRIPTION)
        break;
      default:
    }
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
