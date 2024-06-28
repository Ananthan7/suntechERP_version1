import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MeltingIssueDetailsComponent } from './melting-issue-details/melting-issue-details.component';


@Component({
  selector: 'app-melting-issue',
  templateUrl: './melting-issue.component.html',
  styleUrls: ['./melting-issue.component.scss']
})
export class MeltingIssueComponent implements OnInit {
  @ViewChild('meltingissueDetailScreen') public meltingissueDetailScreen!: NgbModal;
  dataToDetailScreen: any;
  modalReference!: NgbModalRef;
  columnhead: any[] = ['SRNO', 'DIV', 'Job No', 'Stock Code', 'Main Stock', 'Process', 'Worker', 'Pcs', 'Gross Weight', 'Purity', 'Pure Weight', 'Rate', 'Amount']
  columnheader: any[] = ['Sr#', 'SO No', 'Party Code', 'Party Name', 'Job Number', 'Job Description', 'Design Code', 'UNQ Design ID', 'Process', 'Worker', 'Metal Required', 'Metal Allocated', 'Allocated Pure', 'Job Pcs']
  columnhead1: any[] = ['Sr#', 'Ingredients', 'Qty']
  db1: any[] = ['Sr#', 'Division', 'Stock Code', 'Description', 'Alloy', 'Alloy Qty', 'Rate', 'Amount']
  @Input() content!: any;
  tableData: any[] = [];
  sequenceDetails: any[] = []
  voctype?: String;
  selectRowIndex: any;
  currentDate = new Date();
  tableRowCount: number = 0;
  detailData: any[] = [];
  jobNumberDetailData: any[] = [];
  meltingISsueDetailsData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  isSaved: boolean = false;
  isloading: boolean = false;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  gridAmountDecimalFormat: any = {
    type: 'fixedPoint',
    precision: this.commonService.allbranchMaster?.BAMTDECIMALS,
    currency: this.commonService.compCurrency
  };

  branchCode?: String;
  yearMonth?: String;

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
  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'worker',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  MeltingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 94,
    SEARCH_FIELD: 'MELTING_TYPE',
    SEARCH_HEADING: 'Melting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
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

  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Time',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  meltingIssueFrom: FormGroup = this.formBuilder.group({
    vocno: [1],
    meltingtype: [''],
    jobno: [''],
    jobdes: [''],
    processcode: [''],
    processdes: [''],
    worker: [''],
    workerdes: [''],
    subjobno: ['', [Validators.required]],
    color: [''],
    time: [''],  // Not in table
    remarks: [''],
    issued: [''],
    required: [''],
    allocated: [''],
    balance: [''],
    TotalgrossWt: [''],
    TotalpureWt: [''],
    subJobDescription: ['', [Validators.required]],
    process: [''],
    currency: [''],
    currencyrate: [''],
    FLAG: [null],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    VOCNO: [''],
    MID: [0],
    voctype: ['', [Validators.required]],
    vocdate: ['', [Validators.required]],


  });
  router: any;
  onClose: any;
  modalRef: NgbModalRef | null = null

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,) { }

  ngOnInit(): void {

    this.setNewFormValues()
    // this.voctype = this.commonService.getqueryParamMainVocType();
    this.meltingIssueFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType());
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
      this.meltingIssueFrom.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.setNewFormValues()
    }

  }
  setNewFormValues() {
    this.branchCode = this.commonService.branchCode;
    this.meltingIssueFrom.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.meltingIssueFrom.controls.vocdate.setValue(this.currentDate)
    this.meltingIssueFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    this.meltingIssueFrom.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.meltingIssueFrom.controls.vocdate.setValue(new Date(date))
    }
  }

  setAllInitialValues() {
    if (!this.content?.FLAG) return
    let API = `JobMeltingIssueDJ/GetJobMeltingIssueDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPICustom(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data,'data')
          this.meltingIssueFrom.controls.MID.setValue(data.MID)
          this.meltingIssueFrom.controls.voctype.setValue(data.VOCTYPE)
          this.meltingIssueFrom.controls.vocno.setValue(data.VOCNO)
          this.meltingIssueFrom.controls.vocdate.setValue(data.VOCDATE)
          this.meltingIssueFrom.controls.processcode.setValue(data.PROCESS_CODE)
          this.meltingIssueFrom.controls.worker.setValue(data.WORKER_CODE)
          this.meltingIssueFrom.controls.workerdes.setValue(data.WORKER_DESC)
          this.meltingIssueFrom.controls.processdes.setValue(data.PROCESS_DESC)
          this.meltingIssueFrom.controls.jobno.setValue(data.Details[0].JOB_NUMBER)
          this.meltingIssueFrom.controls.jobdes.setValue(data.Details[0].JOB_DESCRIPTION)
          this.meltingIssueFrom.controls.color.setValue(data.COLOR)

          this.meltingISsueDetailsData = data.Details
          this.reCalculateSRNO() //set to main grid
          this.meltingISsueDetailsData.forEach((element: any) => {
            this.tableData.push({
              jobno: element.JOB_NUMBER,
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
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.meltingIssueFrom.controls.currency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.meltingIssueFrom.value.currency);
    if (CURRENCY_RATE.length > 0) {
      this.meltingIssueFrom.controls.currencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.meltingIssueFrom.controls.currency.setValue('')
      this.meltingIssueFrom.controls.currencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  // deleteTableData(): void {
  //   this.tableRowCount = 0;
  //   console.log(this.selectRowIndex)
  //   this.tableData.splice(this.selectRowIndex, 1)
  // }

  jobnoCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.jobno.setValue(e.job_number);
    this.meltingIssueFrom.controls.jobdes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  timeCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.time.setValue(e.CODE);
  }
  MeltingCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.meltingtype.setValue(e['Melting Type']);
    // this.meltingIssueFrom.controls.meltingtype.setValue(e.MELTING_TYPE);
  }
  ProcessCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.processcode.setValue(e.Process_Code);
    this.meltingIssueFrom.controls.processdes.setValue(e.Description);
  }
  WorkerCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.worker.setValue(e.WORKER_CODE);
    this.meltingIssueFrom.controls.workerdes.setValue(e.DESCRIPTION);
  }
  @ViewChild('mymodal') public mymodal!: NgbModal;

  open(modalname?: any) {

    const modalRef: NgbModalRef = this.modalService.open(modalname, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width'
    });

    modalRef.result.then((result) => {

    }, (reason) => {

    });
  }
  openModal(item: any) {
    // Open the modal and store the reference
    this.modalRef = this.modalService.open('mymodal', { size: 'sm' });
    // Pass item data to the modal if needed
    // this.modalRef.componentInstance.itemData = item;
  }

  closeModal() {
    // Check if the modal reference exists before trying to close
    if (this.modalRef) {
      // Close the modal using the reference
      this.modalRef.close();
    }
  }
  close1(data: any = null) {
    this.modalService.dismissAll(data);
  }

  openaddMeltingIssueDetails(dataToChild?: any) {
    if (dataToChild) {
      dataToChild.FLAG = this.content?.FLAG || ''
      dataToChild.HEADERDETAILS = this.meltingIssueFrom.value;
    } else {
      dataToChild = { HEADERDETAILS: this.meltingIssueFrom.value }
    }
    this.dataToDetailScreen = dataToChild //input variable to pass data to child
    this.modalReference = this.modalService.open(this.meltingissueDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }
  // onRowClickHandler(event: any) {

  //   this.selectRowIndex = (event.dataIndex)
  //   let selectedData = event.data
  //   let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
  //   this.openaddMeltingIssueDetails(selectedData)
  //   console.log(selectedData)
  //   console.log("fired.")
  //   console.log(this.selectRowIndex, event);

  // }



  // setValuesToHeaderGrid(detailDataToParent: any) {
  //   let PROCESS_FORMDETAILS = detailDataToParent.PROCESS_FORMDETAILS
  //   if (PROCESS_FORMDETAILS.SRNO) {
  //     this.swapObjects(this.tableData, [PROCESS_FORMDETAILS], (PROCESS_FORMDETAILS.SRNO - 1))
  //   } else {
  //     this.tableRowCount += 1
  //     PROCESS_FORMDETAILS.SRNO = this.tableRowCount
  //   }

  //   this.tableData.push(PROCESS_FORMDETAILS)

  //   if (detailDataToParent) {
  //     this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
  //   }
  //   //  this.getSequenceDetailData(PROCESS_FORMDETAILS);

  // }
  // swapObjects(array1: any, array2: any, index: number) {
  //   // Check if the index is valid
  //   if (index >= 0 && index < array1.length) {
  //     array1[index] = array2[0];
  //   } else {
  //     console.error('Invalid index');
  //   }
  // }

  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.meltingISsueDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      this.meltingISsueDetailsData.push(detailDataToParent);
      this.reCalculateSRNO()
    }
    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE') {
      this.commonService.showSnackBarMsg('Details added successfully')
    };
  }
  closeDetailScreen() {
    this.modalReference.close()
  }
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
  }
  onRowDoubleClickHandler(event: any) {
    console.log(this.selectRowIndex, 'passing')
    this.selectRowIndex = event.data.SRNO
    let selectedData = event.data
    this.openaddMeltingIssueDetails(selectedData)
  }

  deleteTableData(): void {
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
        this.meltingISsueDetailsData = this.meltingISsueDetailsData.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
        this.reCalculateSRNO()
      }
    }
    )
  }
  reCalculateSRNO(): void {
    this.meltingISsueDetailsData.forEach((element: any, index: any) => {
      element.SRNO = index + 1
      element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
    })
  }

  setPostData() {
    let form = this.meltingIssueFrom.value
    console.log(form, 'form');
    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "BRANCH_CODE": this.commonService.nullToString(this.meltingIssueFrom.value.BRANCH_CODE),
      "VOCTYPE": this.commonService.nullToString(this.meltingIssueFrom.value.voctype),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCDATE": this.meltingIssueFrom.value.vocdate,
      "YEARMONTH": this.commonService.nullToString(this.meltingIssueFrom.value.YEARMONTH),
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingIssueFrom.value.worker,
      "WORKER_DESC": this.meltingIssueFrom.value.workerdes,
      "JOB_CODE": this.meltingIssueFrom.value.jobno,
      "JOB_DESC": this.meltingIssueFrom.value.jobdes,
      "SALESPERSON_CODE": "",
      "SALESPERSON_NAME": "",
      "DOCTIME": "2023-10-21T10:15:43.789Z",
      "TOTAL_GROSSWT": 0,
      "MELTING_TYPE": "",
      "COLOR": "",
      "RET_STOCK_CODE": "",
      "RET_LOCATION_CODE": "",
      "TOTAL_PUREWT": 0,
      "TOTAL_STONEWT": 0,
      "TOTAL_NETWT": 0,
      "TOTAL_WAXWT": 0,
      "TOTAL_IRONWT": 0,
      "TOTAL_MKGVALUEFC": 0,
      "TOTAL_MKGVALUECC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_ISSUED_QTY": 0,
      "TOTAL_REQUIRED_QTY": 0,
      "TOTAL_ALLOCATED_QTY": 0,
      "CURRENCY_CODE": this.commonService.nullToString(this.meltingIssueFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.meltingIssueFrom.value.currencyrate),
      "TRAY_WEIGHT": 0,
      "REMARKS": this.meltingIssueFrom.value.remarks,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.commonService.nullToString(this.meltingIssueFrom.value.processcode),
      "PROCESS_DESC": this.commonService.nullToString(this.meltingIssueFrom.value.processdes),
      "PRINT_COUNT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "SCP_STOCK_CODE": "",
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": "",
      "LOSS_QTY": 0,
      "LOSS_PURE_WT": 0,
      "IS_AUTHORISE": true,
      "IS_REJECT": true,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "SYSTEM_DATE": "2023-10-21T10:15:43.790Z",
      "Details": this.meltingISsueDetailsData
    }
  }
  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.meltingIssueFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // } 


    let API = 'JobMeltingIssueDJ/InsertJobMeltingIssueDJ'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: this.commonService.getMsgByID('MSG2443') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.meltingIssueFrom.reset()
                this.isSaved = true;
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => {
        this.isloading = false;
        this.toastr.error('Not saved')
      })
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);

    this.meltingIssueFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.meltingIssueFrom.controls.vocno.setValue(this.content.VOCNO)
    this.meltingIssueFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.meltingIssueFrom.controls.processcode.setValue(this.content.PROCESS_CODE)
    this.meltingIssueFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.meltingIssueFrom.controls.workerdes.setValue(this.content.WORKER_DESC)
    this.meltingIssueFrom.controls.processdes.setValue(this.content.PROCESS_DESC)
    this.meltingIssueFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.meltingIssueFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.meltingIssueFrom.controls.color.setValue(this.content.COLOR)
    this.meltingIssueFrom.controls.remark.setValue(this.content.REMARKS)
  }

  update() {
    let form = this.meltingIssueFrom.value
    let API = `JobMeltingIssueDJ/UpdateJobMeltingIssueDJ/${form.BRANCH_CODE}/${form.voctype}/${form.vocno}/${form.YEARMONTH}`
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result.response) {
          if (result.status == "Success") {
            this.isSaved = true;
            Swal.fire({
              title: this.comService.getMsgByID('MSG2443') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.meltingIssueFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.comService.toastErrorByMsgId('Not saved')
        }
      }, err => {
        this.isloading = false;
        this.comService.toastErrorByMsgId('Not saved')
      })
    this.subscriptions.push(Sub)
  }
  deleteRecord() {
    console.log('deleteRecord called');
    console.log('this.content:', this.content);
    if (!this.content) {
      Swal.fire({
        title: '',
        text: 'Please select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      });
      return;
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
        console.log('User confirmed deletion');
        let form = this.meltingIssueFrom.value;
        const API = 'JobMetalIssueMasterDJ/DeleteJobMetalIssueMasterDJ/' +
            this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
            this.content.VOCNO + '/' + this.content.YEARMONTH;
        
        console.log('API endpoint:', API);
        
        const Sub: Subscription = this.dataService.deleteDynamicAPICustom(API)
          .subscribe((result) => {
            console.log('API response:', result);
            
            if (result) {
              if (result.status === "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then(() => {
                  this.meltingIssueFrom.reset();
                  this.tableData = [];
                  this.close('reloadMainGrid');
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error, please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then(() => {
                  this.meltingIssueFrom.reset();
                  this.tableData = [];
                  this.close();
                });
              }
            } else {
              this.toastr.error('Not deleted');
            }
          }, err => {
            console.error('API call failed:', err);
            this.toastr.error('Deletion failed');
          });
  
        this.subscriptions.push(Sub);
      }
    });
  }
  



  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  getSequenceDetailData(formData: any) {
    let API = `SequenceMasterDJ/GetSequenceMasterDJDetail/${formData.SEQ_CODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.sequenceDetails = data.sequenceDetails

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }


  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.meltingIssueFrom.value.subjobno,
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }

    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.meltingIssueFrom.controls.processcode.setValue(data[0].PROCESS)
          this.meltingIssueFrom.controls.worker.setValue(data[0].WORKER)
          // this.meltingIssueFrom.controls.stockcode.setValue(data[0].STOCK_CODE)
          // this.meltingIssueFrom.controls.pureweight.setValue(data[0].PUREWT)
          // this.meltingIssueFrom.controls.pcs.setValue(data[0].PCS)
          this.meltingIssueFrom.controls.workerdes.setValue(data[0].WORKERDESC)
          this.meltingIssueFrom.controls.processdes.setValue(data[0].PROCESSDESC)
          // this.meltingIssueFrom.controls.grossweight.setValue(data[0].NETWT)
          // this.meltingIssueFrom.controls.purity.setValue(data[0].PURITY)
          // this.meltingIssueFrom.controls.netweight.setValue(data[0].NETWT)
          // this.meltingIssueFrom.controls.MetalWeightFrom.setValue(
          //   this.commonService.decimalQuantityFormat(data[0].METAL, 'METAL'))

          // this.meltingIssueFrom.controls.StoneWeight.setValue(data[0].STONE)

          // this.meltingIssueFrom.controls.PURITY.setValue(data[0].PURITY)
          // this.meltingIssueFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          // this.meltingIssueFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          // this.stockCodeScrapValidate()
          // this.meltingIssuedetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.meltingIssuedetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
          // this.meltingIssuedetailsFrom.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          // this.meltingIssuedetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          // this.meltingIssuedetailsFrom.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          // this.fillStoneDetails()
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }




  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strJobNumber': this.commonService.nullToString(event.target.value),
        'strCurrenctUser': this.commonService.nullToString(this.userName)
      }
    }

    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            this.jobNumberDetailData = data
            console.log(data,'data')
            this.meltingIssueFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.meltingIssueFrom.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)

            this.subJobNumberValidate()
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

}


