import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-job-closing',
  templateUrl: './job-closing.component.html',
  styleUrls: ['./job-closing.component.scss']
})
export class JobClosingComponent implements OnInit {
  @ViewChild('overlayusernamecode') overlayusernamecode!: MasterSearchComponent;
  @ViewChild('overlaypartycode') overlaypartycode!: MasterSearchComponent;
  @ViewChild('overlayjobnumbercode') overlayjobnumbercode!: MasterSearchComponent;
  @ViewChild('overlayworkercode') overlayworkercode!: MasterSearchComponent;
  @ViewChild('overlayreasoncode') overlayreasoncode!: MasterSearchComponent;
  @ViewChild('overlaymetallocationcode') overlaymetallocationcode!: MasterSearchComponent;
  @ViewChild('overlaystonelocationcode') overlaystonelocationcode!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  tableData: any[] = [];
  tableDatas: any[] = [];
  columnheadItemDetails: any[] = ['UNIQUEID', 'SRNO', 'DT_BRANCH_CODE', 'DT_VOCTYPE', 'DT_VOCNO', 'DT_YEARMOTH', 'JOB_NUMBER', 'JOB_SO_NUMBER', 'UNQ_JOB_ID', 'JOB_DESCRIPTION', 'DESIGN_CODE', 'JOB_PCS', 'UNQ_DESIGN_ID', 'PICTURE_NAME', 'PART_CODE', 'JOB_DATE', 'JOB_SO_MID'];
  columnheadItemDetails1: any[] = ['SRNO', 'Job Number', 'Unq.Job Id', 'DESIGN', 'METALSTONE', 'DIVCODE', 'Stock_Code', 'Batch_Id', 'STOCK_DESCRIPTION', 'COLOR', 'CLARITY', 'SHAPE', 'SIZE', 'SIEVE', 'PCS', 'GROSS_WT', 'RATE', 'AMOUNTLC', 'AMOUNTFC', 'PROCESS_CODE', 'WORKER_CODE', 'RATEFC', 'PUREWT', 'PURITY', 'STONE_WT', 'NET_WT', 'NET_WT', 'KARAT_CODE', 'Job Pcs'];
  columnheadItemDetails2: any[] = ['METALSTONE', 'DIVCODE', 'Stock_Code', 'Sub_stock', 'Karat_code', 'Color', 'Clarity', 'Size', 'Sieve', 'Shape', 'Sieve_set', 'Pcs', 'GROSS_WT'];
  content!: any;
  jobNumberDetailData: any[] = [];
  divisionMS: any = 'ID';
  currentDate = new FormControl(new Date());
  text = "Sales Order";
  checked: boolean = true
  userName: any;
  subscriptions: any[] = [];
  viewMode: boolean = false;
  editMode: boolean = false;
  isloading: boolean = false;
  isDisableSaveBtn: boolean = false;
  branchCode: String = this.commonService.branchCode;
  yearMonth: String = this.commonService.yearSelected;

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }


  ngOnInit(): void {

    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    // this.voctype = this.commonService.getqueryParamMainVocType()
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
        this.jobCloseingFrom.controls.FLAG.setValue(this.content.FLAG)
      }
    } else {
      this.generateVocNo()
      this.setvalues()
      this.setvoucherTypeMaster()
    }

  }
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobClosingMasterDJ/GetJobClosingMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(this.content.REMARKS, 'working')
          data.Details.forEach((element: any) => {
            this.tableData.push({
              Srno: element.SRNO,
              Division: element.DIVCODE,

            })
          });
          console.log(this.tableDatas)
          data.Components.forEach((element: any) => {
            this.tableDatas.push({
              Srno: element.SRNO,
              CompCode: element.COMP_CODE,
              Description: element.COMP_DESCRIPTION,
              Pcs: element.PCS,
              SizeSet: element.COMPSIZE_CODE,
              SizeCode: element.COMPSET_CODE,
              Type: element.TYPE_CODE,
              Category: element.CATEGORY_CODE,
              Shape: element.COMP_SHAPE,
              Height: element.HEIGHT,
              Width: element.WIDTH,
              Length: element.LENGTH,
              Radius: element.RADIUS,
              Remarks: element.REMARKS


            })
          });
          this.jobCloseingFrom.controls.vocNo.setValue(data.VOCNO)
          this.jobCloseingFrom.controls.voctype.setValue(data.VOCTYPE)
          this.jobCloseingFrom.controls.design.setValue(data.DESIGN_CODE)
          this.jobCloseingFrom.controls.job.setValue(data.JOB_NUMBER)
          this.jobCloseingFrom.controls.toWorker.setValue(data.TO_WORKER_CODE)
          this.jobCloseingFrom.controls.toProcess.setValue(data.TO_PROCESS_CODE)
          this.jobCloseingFrom.controls.soNumber.setValue(data.JOB_SO_NUMBER)
          this.jobCloseingFrom.controls.subJobId.setValue(data.JOB_SO_MID)
          this.jobCloseingFrom.controls.narration.setValue(data.REMARKS)


        } else {
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
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

  change(event: any) {
    console.log(event);
    this.text = event.target.value;
    if (event.target.checked == true) {
      this.text = "Non Sales Order";
    } else {
      this.text = "Sales Order";
    }
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCodeSelected(e: any) {
    console.log(e);
    this.jobCloseingFrom.controls.party_code.setValue(e.ACCODE);
  }

  jobCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobCodeSelected(e: any) {
    console.log(e);
    this.jobCloseingFrom.controls.job_no.setValue(e.job_number);
    this.jobNumberValidate({ target: { value: e.job_number } })

  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'WORKER',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerCodeSelected(e: any) {
    console.log(e);
    this.jobCloseingFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  reasonCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'DESCRIPTION',
    SEARCH_HEADING: 'Reason',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESCRIPTION<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  reasonCodeSelected(e: any) {
    console.log(e);
    this.jobCloseingFrom.controls.reason.setValue(e.DESCRIPTION);
  }

  MetalLocCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'Metal Location',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strUserCode='${this.comService.userName}' ,     
 @strAvoidFORSALES='',
 @strFrom=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  MetalLocCodeSelected(e: any) {
    console.log(e);
    this.jobCloseingFrom.controls.metal_loc.setValue(e.Location);
  }

  StoneLocCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'Stone Location',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strUserCode='${this.comService.userName}' ,     
    @strAvoidFORSALES='',
    @strFrom=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  StoneLocCodeSelected(e: any) {
    console.log(e);
    this.jobCloseingFrom.controls.stone_loc.setValue(e.Location);
  }

  UserCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UserCodeSelected(e: any) {
    console.log(e);
    this.jobCloseingFrom.controls.user_name.setValue(e.SALESPERSON_CODE);
  }

  jobCloseingFrom: FormGroup = this.formBuilder.group({
    vocType: ['', [Validators.required]],
    vocNo: ['', [Validators.required]],
    vocdate: [''],
    user_name: ['',],
    party_code: ['',],
    job_no: ['',],
    worker: ['',],
    reason: ['',],
    stone_loc: ['', [Validators.required]],
    metal_loc: ['', [Validators.required]],
    doc_ref: ['',],
    remarks: ['',],
    FLAG: [null],
    MAIN_VOCTYPE: ['']
    
  });

  setDetaills() {
    let Details: any = []
    this.tableData.forEach((Element: any) => {
      Details.push(
        {
          "UNIQUEID": 0,
          "SRNO": Element.SRNO,
          "DT_BRANCH_CODE": Element.BRANCH_CODE,
          "DT_VOCTYPE": this.jobCloseingFrom.value.vocType,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "JOB_NUMBER": this.jobCloseingFrom.value.job,
          "JOB_SO_NUMBER": this.jobCloseingFrom.value.JOB_SO_NUMBER,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": "string",
          "DESIGN_CODE": this.jobCloseingFrom.value.job_description,
          "JOB_PCS": 0,
          "UNQ_DESIGN_ID": "string",
          "PICTURE_NAME": "string",
          "PART_CODE": "string",
          "JOB_DATE": "2024-02-02T23:49:41.431Z",
          "JOB_SO_MID": 0
        }
      )

    }
    )
    return Details
  }
  componentSet() {
    let Components: any = []
    this.tableDatas.forEach((item: any) => {
      Components.push(
        {
          "REFMID": 0,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCTYPE": this.jobCloseingFrom.value.vocType,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": item.Srno,
          "JOB_NUMBER": item.job,
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "DESIGN_CODE": item.designCode,
          "METALSTONE": item.METALSTONE,
          "DIVCODE": item.DIVCODE,
          "STOCK_CODE": item.stock_code,
          "SUB_STOCK_CODE": "string",
          "STOCK_DESCRIPTION": "string",
          "COLOR": item.Color,
          "CLARITY": item.Clarity,
          "SHAPE": item.Shape,
          "SIZE": item.Size,
          "SIEVE": item.Sieve,
          "SIEVE_SET": "string",
          "PCS": item.Pcs,
          "GROSS_WT": 0,
          "RATE": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "PROCESS_CODE": item.processcode,
          "WORKER_CODE": item.worker,
          "UNQ_DESIGN_ID": "string",
          "RATEFC": 0,
          "PUREWT": 0,
          "PURITY": 0,
          "STONE_WT": 0,
          "NET_WT": 0,
          "KARAT_CODE": "string",
          "JOB_PCS": 0,
          "JOB_SO_MID": 0
        }

      )
    }
    )
    return Components
  }
  setvalues() {
    this.jobCloseingFrom.controls.vocType.setValue(this.commonService.getqueryParamVocType())
    this.jobCloseingFrom.controls.vocNo.setValue(this.commonService.popMetalValueOnNet)
    this.jobCloseingFrom.controls.vocdate.setValue(this.commonService.currentDate)
    this.jobCloseingFrom.controls.MAIN_VOCTYPE.setValue(
      this.commonService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()

  }

  lookupKeyPress(event: any, form?: any) {
    if(event.key == 'Tab' && event.target.value == ''){
      this.showOverleyPanel(event,form)
    }
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.jobCloseingFrom.value
    const vocTypeMaster = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.jobCloseingFrom.value.vocNo}`
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
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.comService.branchCode}/${this.comService.yearSelected}/${this.comService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.jobCloseingFrom.controls.vocNo.setValue(resp.newvocno);
        }
      });
  }


  
  submitValidations(form: any) {
    if (this.commonService.nullToString(form.vocType) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// vocType  CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.vocNo) == '') {
      this.commonService.toastErrorByMsgId('MSG1940')//"vocNo cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.stone_loc) == '') {
      this.commonService.toastErrorByMsgId('')//"stone_loc cannot be empty"
      return true
    }
    // else if (this.commonService.nullToString(form.metal_loc) == '') {
    //   this.commonService.toastErrorByMsgId('MSG1189')//"metal_loc cannot be empty"
    //   return true
    // }
    return false;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.jobCloseingFrom.value)) return;

    // if (this.jobCloseingFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'JobClosingMaster/InsertJobClosingMasterDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.comService.nullToString(this.branchCode),
      "VOCTYPE": this.comService.nullToString(this.jobCloseingFrom.value.vocType),
      "VOCNO": 0,
      "YEARMONTH": this.yearMonth,
      "VOCDATE": "2024-02-02T23:49:41.431Z",
      "PARTYCODE": this.comService.nullToString(this.jobCloseingFrom.value.party_code),
      "SALESPERSON_CODE": "string",
      "SYSTEM_DATE": "2024-02-02T23:49:41.431Z",
      "MACHINEID": "string",
      "DOC_REF": this.comService.nullToString(this.jobCloseingFrom.value.doc_ref),
      "REMARKS": this.comService.nullToString(this.jobCloseingFrom.value.remarks),
      "NAVSEQNO": 0,
      "WORKER_CODE": this.comService.nullToString(this.jobCloseingFrom.value.worker),
      "MLOCTYPE_CODE": "string",
      "SLOCTYPE_CODE": "string",
      "DSO_VOCTYPE": "str",
      "DSO_VOCNO": 0,
      "DSO_YEARMONTH": "stri",
      "DSO_VOCDATE": "2024-02-02T23:49:41.431Z",
      "APPR_CODE": "string",
      "APPR_TYPE": 0,
      "TRANS_REF": "string",
      "USER_ID": "string",
      "REASON_TYPE": "string",
      "POSTDATE": "string",
      "AUTOPOSTING": true,
      "WIP_TYPE": "s",
      "JOB_NUMBER": "string",
      "HTUSERNAME": "string",
      "JOB_CLOSING_DETAIL_DJ": this.setDetaills(),
      "JOB_CLOSING_STNMTL_dj": this.componentSet(),
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status.trim() == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.jobCloseingFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.jobCloseingFrom.value.job_no,
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
          // this.jobCloseingFrom.controls.processcode.setValue(data[0].PROCESS)
          // this.jobCloseingFrom.controls.worker.setValue(data[0].WORKER)
          // this.meltingIssueFrom.controls.stockcode.setValue(data[0].STOCK_CODE)
          // this.meltingIssueFrom.controls.pureweight.setValue(data[0].PUREWT)
          // this.meltingIssueFrom.controls.pcs.setValue(data[0].PCS)
          // this.jobCloseingFrom.controls.workerdes.setValue(data[0].WORKERDESC)
          // this.jobCloseingFrom.controls.processdes.setValue(data[0].PROCESSDESC)
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
    this.showOverleyPanel(event, 'job_no')
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
            // this.jobCloseingFrom.controls.job_no.setValue(data[0].JOB_NUMBER)
            // this.jobCloseingFrom.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)

            this.subJobNumberValidate()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            this.jobCloseingFrom.controls.job_no.setValue('')
            this.showOverleyPanel(event, 'job_no')
            return
          }
        } else {
          this.overlayjobnumbercode.closeOverlayPanel()
          this.jobCloseingFrom.controls.job_no.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  update() {
    console.log(this.update)
    // if (this.jobCloseingFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    if (this.submitValidations(this.jobCloseingFrom.value)) return;


    let API = `JobClosingMasterDJ/UpdateJobClosingMasterDJ/${this.branchCode}/${this.jobCloseingFrom.value.voctype}/${this.jobCloseingFrom.value.vocno}/${this.commonService.yearSelected}`
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.jobCloseingFrom.value.vocType,
      "VOCNO": 0,
      "YEARMONTH": this.yearMonth,
      "VOCDATE": "2024-02-02T23:49:41.449Z",
      "PARTYCODE": this.jobCloseingFrom.value.PartyCode,
      "SALESPERSON_CODE": "string",
      "SYSTEM_DATE": "2024-02-02T23:49:41.449Z",
      "MACHINEID": "string",
      "DOC_REF": "string",
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "WORKER_CODE": this.jobCloseingFrom.value.worker,
      "MLOCTYPE_CODE": "string",
      "SLOCTYPE_CODE": "string",
      "DSO_VOCTYPE": "str",
      "DSO_VOCNO": 0,
      "DSO_YEARMONTH": "stri",
      "DSO_VOCDATE": "2024-02-02T23:49:41.449Z",
      "APPR_CODE": "string",
      "APPR_TYPE": 0,
      "TRANS_REF": "string",
      "USER_ID": "string",
      "REASON_TYPE": "string",
      "POSTDATE": "string",
      "AUTOPOSTING": true,
      "WIP_TYPE": "s",
      "JOB_NUMBER": "string",
      "HTUSERNAME": "string",
      "JOB_CLOSING_DETAIL_DJ": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "stri",
          "JOB_NUMBER": "string",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": "string",
          "DESIGN_CODE": "string",
          "JOB_PCS": 0,
          "UNQ_DESIGN_ID": "string",
          "PICTURE_NAME": "string",
          "PART_CODE": "string",
          "JOB_DATE": "2024-02-02T23:49:41.449Z",
          "JOB_SO_MID": 0
        }
      ],
      "JOB_CLOSING_STNMTL_dj": [
        {
          "REFMID": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "string",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "SRNO": 0,
          "JOB_NUMBER": "string",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "DESIGN_CODE": "string",
          "METALSTONE": "string",
          "DIVCODE": "string",
          "STOCK_CODE": "string",
          "SUB_STOCK_CODE": "string",
          "STOCK_DESCRIPTION": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SHAPE": "string",
          "SIZE": "string",
          "SIEVE": "string",
          "SIEVE_SET": "string",
          "PCS": 0,
          "GROSS_WT": 0,
          "RATE": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "PROCESS_CODE": "string",
          "WORKER_CODE": "string",
          "UNQ_DESIGN_ID": "string",
          "RATEFC": 0,
          "PUREWT": 0,
          "PURITY": 0,
          "STONE_WT": 0,
          "NET_WT": 0,
          "KARAT_CODE": "string",
          "JOB_PCS": 0,
          "JOB_SO_MID": 0
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
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.jobCloseingFrom.value[formControlName] != '') return;
  
    switch (formControlName) {
      case 'user_name':
        this.overlayusernamecode.showOverlayPanel(event);
        break;
      case 'party_code':
        this.overlaypartycode.showOverlayPanel(event);
        break;
      case 'job_no':
        this.overlayjobnumbercode.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkercode.showOverlayPanel(event);
        break;
      case 'reason':
        this.overlayreasoncode.showOverlayPanel(event);
        break;
      case 'metal_loc':
        this.overlaymetallocationcode.showOverlayPanel(event);
        break;
      case 'stone_loc':
        this.overlaystonelocationcode.showOverlayPanel(event);
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
    this.comService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.jobCloseingFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'user_name' || FORMNAME === 'party_code' || FORMNAME === 'job_no' || FORMNAME === 'worker' || FORMNAME === 'reason' || FORMNAME === 'metal_loc' || FORMNAME === 'stone_loc') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  metalLocationValidate(event: any) {
    this.showOverleyPanel(event, 'metal_loc')
    let form = this.jobCloseingFrom.value;
    let postData = {
      "SPID": "057",
      "parameter": {
        strBranch_Code: this.commonService.nullToString(this.branchCode),
        strUserCode: '',
        strUserName: '',
        strAvoidFORSALES: '',
        strFrom:'',
      }
    };
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {

        } else {
          this.overlayjobnumbercode.showOverlayPanel(event)
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
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
