import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';
import { MetalReturnDetailsComponent } from './metal-return-details/metal-return-details.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { CommonServiceService } from 'src/app/services/common-service.service';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-metal-return',
  templateUrl: './metal-return.component.html',
  styleUrls: ['./metal-return.component.scss']
})
export class MetalReturnComponent implements OnInit {
  @ViewChild('metalReturnDetailScreen') public MetalReturnDetailScreen!: NgbModal;
  @Input() content!: any;
  modalReference!: NgbModalRef;
  dataToDetailScreen: any;
  
  divisionMS: any = 'ID';
  orders: any = [];
  currentFilter: any;
  tableData: any[] = ['Process', 'Worker', 'Job No', 'Sub.Job No', 'Design', 'Stock Code', 'Gross Wt.', 'Net Wt.', 'Purity', 'Pure Wt.'];
  metalReturnDetailsData: any[] = [];
  columnhead: any[] = [''];
  branchCode?: String;
  currentDate: any = this.commonService.currentDate;
  userName = this.commonService.userName;
  selectRowIndex: any;
  viewMode: boolean = false;
  isSaved: boolean = false;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
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
  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  metalReturnForm: FormGroup = this.formBuilder.group({

    VOCTYPE: ['', [Validators.required]],
    VOCNO: [''],
    vocDate: [''],
    vocTime: [new Date().toTimeString().slice(0, 5), [Validators.required]],
    enteredBy: [''],
    process: [''],
    worker: [''],
    location: [''],
    REMARKS: [''],
    FLAG: [null],
    YEARMONTH: [''],
    BRANCH_CODE: ['']
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,

  ) {
    // this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
      }
      this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.isSaved = false;
        this.deleteMeltingType()
      }
      this.metalReturnForm.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.setNewFormValue()
    }
  }
  setNewFormValue() {
    this.branchCode = this.commonService.branchCode;
    this.metalReturnForm.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.metalReturnForm.controls.vocDate.setValue(this.currentDate)
    this.metalReturnForm.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.metalReturnForm.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.metalReturnForm.controls.vocdate.setValue(new Date(date))
    }
  }
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobMetalReturnMasterDJ/GetJobMetalReturnMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.metalReturnDetailsData = data.Details
          console.log(this.tableData, 'table')
          data.Details.forEach((element: any) => {
            this.tableData.push({
              SRNO: element.SRNO,
              Job_id: element.JOB_NUMBER,
              Unq_job_id: element.UNQ_JOB_ID,
              Process: element.PROCESS_CODE,
              Design: element.DESIGN_CODE,
              Stock_Code: element.STOCK_CODE,
              Worker: element.WORKER_CODE,
              Description: element.JOB_DESCRIPTION,
              Carat: element.KARAT_CODE,
              Rate: element.RATE_TYPE,
              Division: element.DIVCODE,
              Amount: element.NET_WT,
            })
          });
          this.metalReturnForm.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.metalReturnForm.controls.VOCNO.setValue(data.VOCNO)
          this.metalReturnForm.controls.vocDate.setValue(data.VOCDATE)
          this.metalReturnForm.controls.REMARKS.setValue(data.REMARKS)
          this.metalReturnForm.controls.enteredBy.setValue(data.SMAN)
          this.metalReturnForm.controls.YEARMONTH.setValue(data.YEARMONTH)
          this.metalReturnForm.controls.process.setValue(data.Details[0].PROCESS_CODE)
          this.metalReturnForm.controls.worker.setValue(data.Details[0].WORKER_CODE)
          this.metalReturnForm.controls.location.setValue(data.Details[0].LOCTYPE_CODE)
          this.metalReturnForm.controls.BRANCH_CODE.setValue(data.Details[0].BRANCH_CODE)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  userDataSelected(value: any) {
    console.log(value);
    this.metalReturnForm.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.process.setValue(e.Process_Code);
  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.worker.setValue(e.WORKER_CODE);
  }

  locationCodeSelected(e: any) {
    this.metalReturnForm.controls.location.setValue(e.LOCATION_CODE);
  }
  /**use: open detail screen */
  openAddMetalReturnDetail(dataToChild?: any) {
    if (dataToChild) {
      dataToChild.FLAG = this.content?.FLAG || ''
      dataToChild.HEADERDETAILS = this.metalReturnForm.value;
    } else {
      dataToChild = { HEADERDETAILS: this.metalReturnForm.value }
    }
    this.dataToDetailScreen = dataToChild //input variable to pass data to child
    this.modalReference = this.modalService.open(this.MetalReturnDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    // this.modalReference.componentInstance.content = dataToChild
    // this.modalReference.result.then((dataToParent) => {
    //   if (dataToParent) {
    //     this.setValuesToHeaderGrid(dataToParent);
    //   }
    // });
  }
  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.metalReturnDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      this.metalReturnDetailsData.push(detailDataToParent);
      this.recalculateSRNO()
    }
    if(DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if(DATA.FLAG == 'CONTINUE'){
      this.commonService.showSnackBarMsg('Details added successfully')
    };
  }
  closeDetailScreen(){
    this.modalReference.close()
  }

  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
  }
  onRowDoubleClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
    let selectedData = event.data
    this.openAddMetalReturnDetail(selectedData)
  }

  deleteTableData(): void {
    this.metalReturnDetailsData = this.metalReturnDetailsData.filter((element: any) => element.SRNO != this.selectRowIndex)
    this.recalculateSRNO()
  }
  recalculateSRNO(): void {
    this.metalReturnDetailsData.forEach((element: any, index: any) => {
      element.SRNO = index + 1
      element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
    })
  }

  setPostData() {
    let form = this.metalReturnForm.value
    let currRate = this.commonService.getCurrecnyRate(this.commonService.compCurrency)
    console.log(form);

    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "VOCTYPE": form.VOCTYPE,
      "BRANCH_CODE": form.BRANCH_CODE,
      "VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(new Date(form.vocDate)),
      "YEARMONTH": form.YEARMONTH,
      "DOCTIME": this.commonService.formatDateTime(new Date(form.vocDate)),
      "CURRENCY_CODE": this.commonService.compCurrency,
      "CURRENCY_RATE": this.commonService.emptyToZero(currRate),
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
      "SMAN": this.commonService.nullToString(form.enteredBy),
      "REMARKS": this.commonService.nullToString(form.REMARKS),
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "SYSTEM_DATE": "2023-10-06T11:27:36.260Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.metalReturnDetailsData,
    }
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }

    if (this.metalReturnForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobMetalReturnMasterDJ/InsertJobMetalReturnMasterDJ'
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.metalReturnForm.reset()
                this.isSaved = true;
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

  updateMeltingType() {
    if (this.metalReturnForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let form = this.metalReturnForm.value
    let API = `JobMetalReturnMasterDJ/UpdateJobMetalReturnMasterDJ/${form.BRANCH_CODE}/${form.VOCTYPE}/${form.VOCNO}/${form.YEARMONTH}`
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
                this.metalReturnForm.reset()
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
  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (!this.content.VOCNO) {
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
        let API = 'JobMetalReturnMasterDJ/DeleteJobMetalReturnMasterDJ/' +
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
                    this.metalReturnForm.reset()
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
                    this.metalReturnForm.reset()
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

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.process.setValue(e.Process_Code);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE ',
    SEARCH_HEADING: 'WORKER CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workerSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.worker.setValue(e.WORKER_CODE);
  }


}
