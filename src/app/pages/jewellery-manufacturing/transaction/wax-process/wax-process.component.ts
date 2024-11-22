import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
@Component({
  selector: 'app-metal-issue',
  templateUrl: './wax-process.component.html',
  styleUrls: ['./wax-process.component.scss']
})
export class WaxProcessComponent implements OnInit {
  @ViewChild('overlayprocessCodeSearch') overlayprocessCodeSearch!: MasterSearchComponent;
  @ViewChild('overlayworkercodeSearch') overlayworkercodeSearch!: MasterSearchComponent;
  @ViewChild('overlayenteredBySearch') overlayenteredBySearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];
  // columnhead:any[] = ['SR No','Job Number','Design', 'Party','SO','SO Date ','Del Date','Gross Wt','Metal Wt','Stone Wt','Ord Pcs','Issue Pcs'];
  branchCode?: String;
  yearMonth?: String;
  @Input() content!: any;
  srno = 0;
  tableData: any[] = [];
  tableDataJob: any[] = [];
  private subscriptions: Subscription[] = [];
  isReadOnly: boolean = true;
  vocMaxDate = new Date();
  viewMode: boolean = false;
  currentDate = new Date();
  jobNumberDetailData: any[] = [];
  isloading: boolean = false;
  isSaved: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  //waxprocessFrom!: FormGroup

  userName = localStorage.getItem('username');
  userbranch = localStorage.getItem('userbranch');
  branchParmeter: any = localStorage.getItem('BRANCH_PARAMETER');
  strBranchcode: any = '';


  salesmanCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman type',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  jobNumberCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'JOB NUMBER',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
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
  description: any;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private suntechApi: SuntechAPIService,
  ) {
    this.strBranchcode = localStorage.getItem('userbranch');
  }

  ngOnInit(): void {
    this.waxprocessFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    this.waxprocessFrom.controls.vocdate.setValue(this.commonService.currentDate)
    //this.waxprocessFrom.controls.vocno.setValue('1')
    // console.log(this.branchParmeter);
    let data = this.branchParmeter.split(',');
    this.description = data[4].substring(15);

    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;

    // console.log(this.content);
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

  userDataSelected(value: any) {
    console.log(value);
    this.waxprocessFrom.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.processcode.setValue(e.Process_Code);

  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.workercode.setValue(e.WORKER_CODE);
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

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  jobNumberDataSelected(data: any, value: any) {
    // Check if the selected job number already exists in the table
    const jobNumberData = this.tableDataJob.filter((item: any) => item.JOB_NUMBER === data.job_number);
    
    // If job number already exists, show an error message
    if (jobNumberData.length > 0) {
      this.toastr.error('MSG2052'); // Error: Job number already exists
      return; // Exit the function early if validation fails
    }
  
    // Update the JOB_NUMBER for the corresponding row in tableDataJob
    const rowIndex = value.data.SRNO - 1; // Get row index using SRNO (assuming it's 1-based index)
    this.tableDataJob[rowIndex].JOB_NUMBER = data.job_number;
  
    // Call API to fetch additional job details based on job number
    let API = `GetWaxIssueJobs/GetWaxIssueJobs/${this.strBranchcode}/${data.job_number}`;
    this.suntechApi.getDynamicAPI(API).subscribe((result) => {
      if (result && result.dynamicData && result.dynamicData.length > 0 && result.dynamicData[0].length > 0) {
        // Successfully received data from API
        console.log('API Result:', result.dynamicData[0]);
  
        // Update the corresponding row with the data received from the API
        this.tableDataJob[rowIndex] = result.dynamicData[0][0];
      } else {
        // Handle API response with no data
        console.error('No data returned from API');
        this.toastr.error('No job data found for the selected job number.');
      }
    }, (error) => {
      // Handle API error
      console.error('API Error:', error);
      this.toastr.error('Error fetching job data.');
    });
  }
  
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.waxprocessFrom.value
    const vocTypeMaster = this.commonService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.commonService.getqueryParamMainVocType()}/${this.waxprocessFrom.value.vocno}`
    API += `/${this.commonService.branchCode}/${this.commonService.getqueryParamVocType()}`
    API += `/${this.commonService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.commonService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${this.commonService.branchCode}/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.waxprocessFrom.controls.vocno.setValue(resp.newvocno);
        }
      });
  }
  // designtextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].design = data.job_description;
  // }

  // partytextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].party = data.target.value;
  // }

  // Sotextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].So = data.target.value;
  // }

  // SoDatetextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].SoDate = data.target.value;
  // }

  // DelDatetextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].DelDate = data.target.value;
  // }

  // GrossWttextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].GrossWt = data.target.value;
  // }

  // MetalWttextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].MetalWt = data.target.value;
  // }

  // StoneWttextevent(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].StoneWt = data.target.value;
  // }

  // OrderPcstextevent(data: any, value: any) {
  //   // this.tableData[value.data.SRNO - 1].OrderPcs = data.OrderPcs;
  // }

  // IssuePcstextevent(data: any, value: any) {
  //   // this.tableData[value.data.SRNO - 1].IssuePcs = data.IssuePcs;
  // }



  waxprocessFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocdate: ['', [Validators.required]],
    vocno: ['', [Validators.required]],
    processcode: ['', [Validators.required]],
    workercode: ['', [Validators.required]],
    enteredBy: [''],
    remarks: [''],
    FLAG: [null],
    MAIN_VOCTYPE: ['']
  });


  setFormValues() {
    if (!this.content) return
    // this.waxprocessFrom.controls.job_number.setValue(this.content.APPR_CODE)
    // this.waxprocessFrom.controls.design.setValue(this.content.job_description)
    this.waxprocessFrom.controls.MAIN_VOCTYPE.setValue(
      this.commonService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
  }



  adddata() {
    let length = this.tableDataJob.length;
    this.srno = length + 1;
    let data = {
      "UNIQUEID": 0,
      "DT_VOCTYPE": "",
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "WAX_CODE": "",
      "SRNO": this.srno,
      "job_number": "",
      "design": "",
      "party": "",
      "So": "",
      "SoDate": "",
      "DelDate": "",
      "GrossWt": "0.000",
      "MetalWt": "0.000",
      "StoneWt": "0.000",
      "OrderPcs": "",
      "IssuePcs": ""

    };
    this.tableDataJob.push(data);
  }

  removedata() {
    this.tableDataJob.pop();
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

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.voctype) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// voctype  CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.vocno) == '') {
      this.commonService.toastErrorByMsgId('MSG1940')//"vocno cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.processcode) == '') {
      this.commonService.toastErrorByMsgId('MSG1680')//"processcode cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.workercode) == '') {
      this.commonService.toastErrorByMsgId('MSG1951')//"workercode cannot be empty"
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

    let API = 'JobWaxIssue/InsertJobWaxIssue'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.waxprocessFrom.value.vocno,
      "VOCDATE": this.waxprocessFrom.value.vocdate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-20T10:24:24.037Z",
      "PROCESS_CODE": this.waxprocessFrom.value.processcode,
      "WORKER_CODE": this.waxprocessFrom.value.workercode,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_STONE_WT": 0,
      "SMAN": this.waxprocessFrom.value.enteredBy || "",
      "REMARKS": this.waxprocessFrom.value.remarks,
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "SYSTEM_DATE": "2023-10-20T10:24:24.037Z",
      "Details": this.setDetaills()
      // [
      //   {
      //     "UNIQUEID": 0,
      //     "DT_VOCTYPE": "str",
      //     "DT_BRANCH_CODE": this.branchCode,
      //     "DT_VOCNO": 0,
      //     "DT_YEARMONTH": this.yearMonth,
      //     "SRNO": 0,
      //     "job_number": "",
      //     "design": "",
      //     "party": "",
      //     "So": "",
      //     "SoDate": "",
      //     "DelDate": "",
      //     "GrossWt": "0.000",
      //     "MetalWt": "0.000",
      //     "StoneWt": "0.000",
      //     "OrderPcs": "",
      //     "IssuePcs": ""
      //   }
      // ]
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
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  setDetaills() {
    let Details: any = []
    this.tableDataJob.forEach((Element: any) => {
      Details.push(
        {
          "UNIQUEID": 0,
          "DT_VOCTYPE": this.waxprocessFrom.value.voctype,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": Element.vocno,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": Element.SRNO,
          "JOB_NUMBER":Element.JOB_NUMBER,
          "UNQ_JOB_ID": "",
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "DESIGN_CODE": "",
          "PARTYCODE": "",
          "ISSUE_PCS": 0,
          "TOTAL_PCS": 0,
          "UNQ_DESIGN_ID": "",
          "GROSS_WT": 0,
          "METAL_WT": 0,
          "STONE_WT": 0
        }
      )

    }
    )
    return Details
  }

  update() {
    // if (this.waxprocessFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    if (this.submitValidations(this.waxprocessFrom.value)) return;

    let API = 'JobWaxIssue/UpdateJobWaxIssue/' + this.content.BRANCH_CODE + this.content.VOCTYPE + this.content.VOCNO + this.content.YEARMONTH
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.waxprocessFrom.value.vocno,
      "VOCDATE": this.waxprocessFrom.value.vocdate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-20T10:24:24.037Z",
      "PROCESS_CODE": this.waxprocessFrom.value.processcode,
      "WORKER_CODE": this.waxprocessFrom.value.workercode,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_STONE_WT": 0,
      "SMAN": this.waxprocessFrom.value.enteredBy || "",
      "REMARKS": this.waxprocessFrom.value.remarks,
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "SYSTEM_DATE": "2023-10-20T10:24:24.037Z",
      "Details": this.tableDataJob,
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
          this.commonService.toastErrorByMsgId('MSG3577')
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
        let API = 'ApprovalMaster/DeleteApprovalMaster/' + this.content.APPR_CODE
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
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.waxprocessFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'processcode':
        this.overlayprocessCodeSearch.showOverlayPanel(event);
        break;
      case 'workercode':
        this.overlayworkercodeSearch.showOverlayPanel(event);
        break;
      case 'enteredBy':
        this.overlayenteredBySearch.showOverlayPanel(event);
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
          this.waxprocessFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'processcode' || FORMNAME === 'workercode' || FORMNAME === 'enteredBy') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.waxprocessFrom.value.JOB_SO_NUMBER,
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
          console.log(data,'data')
          this.waxprocessFrom.controls.process.setValue(data[0].PROCESS)
          this.waxprocessFrom.controls.processname.setValue(data[0].PROCESSDESC)
          this.waxprocessFrom.controls.worker.setValue(data[0].WORKER)
          this.waxprocessFrom.controls.workername.setValue(data[0].WORKERDESC)
          // this.stonereturndetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          // this.stonereturndetailsFrom.controls.stockCodeDes.setValue(data[0].STOCK_DESCRIPTION)
          this.waxprocessFrom.controls.designcode.setValue(data[0].DESIGN_CODE)
          this.waxprocessFrom.controls.location.setValue(data[0].LOCTYPE_CODE)
          this.waxprocessFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)

        
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
        'strCurrenctUser': this.commonService.nullToString(this.commonService.userName)
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
            this.waxprocessFrom.controls.jobDesc.setValue(data[0].DESCRIPTION)
            this.waxprocessFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.waxprocessFrom.controls.subjobDesc.setValue(data[0].JOB_DESCRIPTION)
            this.waxprocessFrom.controls.designcode.setValue(data[0].DESIGN_CODE)
            this.waxprocessFrom.controls.JOB_DATE.setValue(data[0].JOB_DATE)

            this.subJobNumberValidate()
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
            this.waxprocessFrom.controls.jobNumber.setValue('')
            this.showOverleyPanel(event, 'jobNumber')

          }
        } else {
          this.waxprocessFrom.controls.jobNumber.setValue('')
          this.commonService.toastErrorByMsgId('MSG1747')
        } return
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

}

