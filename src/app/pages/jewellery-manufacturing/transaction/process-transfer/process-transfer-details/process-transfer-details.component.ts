import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {
  @Input() content!: any;

  divisionMS: any = 'ID';
  tableData: any[] = [];
  userName = this.comService.userName;
  branchCode: String = this.comService.branchCode;
  yearMonth: String = this.comService.yearSelected;
  MetalorProcessFlag: string = 'Metal';
  private subscriptions: Subscription[] = [];

  jobNoSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processTransferdetailsForm: FormGroup = this.formBuilder.group({
    jobno: [''],
    jobdes: [''],
    subjobno: [''],
    subJobDescription: [''],
    approvedby: [''],
    approveddate: [''],
    startdate: [''],
    enddate: [''],
    stdtime: [''],
    timetaken: [''],
    consumed: [''],
    variance: [''],
    treeno: [''],
    remarks: [''],
    toggleSwitchtIssue: [false],
    processFrom: [''],
    processTo: [''],
    workerFrom: [''],
    workerTo: [''],
    MetalPcsFrom: [''],
    MetalPcsTo: [''],
    MetalWeightFrom: [''],
    MetalWeightTo: [''],
    FromJobPcs: [''],
    FromJobPcsTo: [''],
    GrossWeightFrom: [''],
    GrossWeightTo: [''],
    Balance_WT: [''],
    stockCode: [''],
    quantity: [''],
    location: [''],
    stdLoss: [''],
    stdLossper: [''],
    StonePcsFrom: [''],
    StonePcsTo: [''],
    StoneWeighFrom: [''],
    StoneWeightTo: [''],
    designCode: [''],
    partCode: [''],
  });
  columnheader: any[] = ['Div', 'Stock Code', 'Color', 'Clarity', 'Size', 'Shape', 'Pcs', 'Setted', 'Weight', 'Loss', 'Gain Wt', 'Type', 'Rate ', 'Amount']

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setAllInitialValues() //set all values from parent to child
  }
  setAllInitialValues(){
    console.log(this.content,'content');
    let dataFromParent = this.content[0].PROCESS_FORMDETAILS
    this.processTransferdetailsForm.controls.jobno.setValue(dataFromParent.jobno)
    this.processTransferdetailsForm.controls.jobdes.setValue(dataFromParent.jobdes)
    this.processTransferdetailsForm.controls.subjobno.setValue(dataFromParent.subjobno)
    this.processTransferdetailsForm.controls.subJobDescription.setValue(dataFromParent.subJobDescription)
    this.processTransferdetailsForm.controls.workerFrom.setValue(dataFromParent.workerFrom)
    this.processTransferdetailsForm.controls.workerTo.setValue(dataFromParent.workerTo)
    this.processTransferdetailsForm.controls.toggleSwitchtIssue.setValue(dataFromParent.toggleSwitchtIssue)
    this.processTransferdetailsForm.controls.processFrom.setValue(dataFromParent.processFrom)
    this.processTransferdetailsForm.controls.processTo.setValue(dataFromParent.processTo)
    this.processTransferdetailsForm.controls.MetalPcsFrom.setValue(dataFromParent.MetalPcsFrom)
    this.processTransferdetailsForm.controls.MetalPcsTo.setValue(dataFromParent.MetalPcsTo)

    this.processTransferdetailsForm.controls.approvedby.setValue(dataFromParent.approvedby)
    this.processTransferdetailsForm.controls.startdate.setValue(dataFromParent.startdate)


    
  }
  /**USE: jobnumber validate API call */
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
            this.processTransferdetailsForm.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.processTransferdetailsForm.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)
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
  /**USE: subjobnumber validate API call  this.processTransferdetailsForm.value.subjobno*/
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': '156516/4/01',
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          console.log(data[0]);
          this.processTransferdetailsForm.controls.processFrom.setValue(data[0].PROCESS)
          this.processTransferdetailsForm.controls.workerFrom.setValue(data[0].WORKER)
          this.processTransferdetailsForm.controls.MetalPcsFrom.setValue(data[0].METAL)
          this.processTransferdetailsForm.controls.GrossWeightFrom.setValue(data[0].NETWT)
          this.processTransferdetailsForm.controls.StonePcsFrom.setValue(data[0].STONE)
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  toggleSwitchChange(event: any) {
    if(this.processTransferdetailsForm.value.toggleSwitchtIssue){
      this.MetalorProcessFlag = 'Process'
    }else{
      this.MetalorProcessFlag = 'Metal'
    }
  }
  /**USE: Process Master Validate */
  processMasterValidate(event:any,flag:string):void {
    if(event.target.value == '') return
    event.target.value = (event.target.value).toUpperCase()
    let API: string = `ProcessMasterDj/GetProcessMasterDjWithProcessCode/${event.target.value}`
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.response) {
          let data = result.response
          this.setProcessCodeData(data.PROCESS_CODE,flag)
        } else {
          this.setProcessCodeData('',flag)
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE set processcode to form */
  setProcessCodeData(Code:string,flag:any){
    if(flag == 'FROM'){
      this.processTransferdetailsForm.controls.processFrom.setValue(Code)
    }else{
      this.processTransferdetailsForm.controls.processTo.setValue(Code)
    }
  }
  /**USE bind selected values*/
  processCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.processFrom.setValue(event.Process_Code)
  }
  processCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.processTo.setValue(event.Process_Code)
  }
  workerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.workerFrom.setValue(event.WORKER_CODE)
  }
  workerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.workerTo.setValue(event.WORKER_CODE)
  }
  jobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.jobno.setValue(event.job_number)
    this.processTransferdetailsForm.controls.jobdes.setValue(event.job_description)
    this.jobNumberValidate({ target: { value: event.job_number } })
  }
  removedata() {
    this.tableData.pop();
  }
  formSubmit() {
    let detailDataToParent = {
      PROCESS_FORMDETAILS: []
    }

    detailDataToParent.PROCESS_FORMDETAILS = this.processTransferdetailsForm.value;
    this.close(detailDataToParent)//USE: passing Detail data to header screen on close
  }

  setFormValues() {
    if (!this.content) return
    this.processTransferdetailsForm.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.processTransferdetailsForm.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.processTransferdetailsForm.controls.subjobno.setValue(this.content.JOB_SO_NUMBER)
    this.processTransferdetailsForm.controls.approvedby.setValue(this.content.APPROVED_USER)
    this.processTransferdetailsForm.controls.approveddate.setValue(this.content.APPROVED_DATE)
    this.processTransferdetailsForm.controls.startdate.setValue(this.content.IN_DATE)
    this.processTransferdetailsForm.controls.enddate.setValue(this.content.OUT_DATE)
    this.processTransferdetailsForm.controls.stdtime.setValue(this.content.STD_TIME)
    this.processTransferdetailsForm.controls.timetaken.setValue(this.content.TIME_TAKEN_HRS)
    this.processTransferdetailsForm.controls.treeno.setValue(this.content.TREE_NO)
    this.processTransferdetailsForm.controls.remarks.setValue(this.content.REMARKS)
  }

  close(data?: any) {
    this.activeModal.close(data);
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
