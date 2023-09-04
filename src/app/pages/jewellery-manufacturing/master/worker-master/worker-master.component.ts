import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-worker-master',
  templateUrl: './worker-master.component.html',
  styleUrls: ['./worker-master.component.scss']
})
export class WorkerMasterComponent implements OnInit {
  currentFilter: any;
  showFilterRow!: boolean;
  showHeaderFilter!: boolean;
  tableData: any[] = [];
  columnhead: any[] = ['Sr No', 'Process', 'Description'];
  private subscriptions: Subscription[] = [];

  accountMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Worker A/c Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  supervisorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Supervisor',
    SEARCH_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Default Process',
    SEARCH_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerMasterForm: FormGroup = this.formBuilder.group({
    WorkerCode: ['', [Validators.required]],
    WorkerDESCRIPTION: ['', [Validators.required]],
    WorkerAcCode: ['', [Validators.required]],
    NameOfSupervisor: ['', [Validators.required]],
    DefaultProcess: ['', [Validators.required]],
    LossAllowed: ['', [Validators.required]],
    Password: [''],
    TrayWeight: ['', [Validators.required]],
    TargetPcs: ['', [Validators.required]],
    TargetCaratWt: ['', [Validators.required]],
    TargetMetalWt: ['', [Validators.required]],
    TargetWeight: ['', [Validators.required]],
    DailyTarget: [false],
    MonthlyTarget: [false],
    YearlyTarget: [false],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }
  selectProcess() {
    let params = {
      "BranchCode": this.commonService.branchCode || '',
      "UserName": this.commonService.userName || '',
      "ProcessCode": this.workerMasterForm.value.DefaultProcess || '',
      "SubJobNo": ""
    }
    let API = 'ProcessCodeValidate/GetProcessCodeValidate'

    let Sub: Subscription = this.dataService.postDynamicAPI(API, params)
      .subscribe((result) => {
        if (result.response) {
          console.log(result, 'result');
          result.response[0].forEach((item: any, i: any) => {
            item.SrNo = i + 1;
          });
          this.tableData = result.response
          console.log(this.tableData);
          
         
        } else {
          Swal.fire({
            title: '',
            text: 'Data not available!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.workerMasterForm.reset()
            }
          });
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  checkWorkerExists(event: any) {
    if (event.target.value == '') return
    let API = 'WorkerMaster/GetWorkerMasterWorkerCodeLookup/' + event.target.value
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          Swal.fire({
            title: '',
            text: 'Worker Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.workerMasterForm.reset()
            }
          });
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  WorkerAcCodeSelected(data: any) {
    this.workerMasterForm.controls.WorkerAcCode.setValue(data.ACCODE)
  }
  supervisorSelected(data: any) {
    this.workerMasterForm.controls.NameOfSupervisor.setValue(data.DESCRIPTION)
  }
  defaultProcessSelected(data: any) {
    this.workerMasterForm.controls.DefaultProcess.setValue(data.Process_Code)
  }
  workerCodeChange(event: any) {
    this.accountMasterData.SEARCH_VALUE = event.target.value
  }
  /**USE:  get PaymentType*/
  formSubmit() {
    if (this.workerMasterForm.invalid) {
      this.toastr.error('')
      return
    }
    let API = 'WorkerMaster/InsertWorkerMaster'
    let postData = {
      "MID": 0,
      "WORKER_CODE": this.workerMasterForm.value.WorkerCode || "",
      "DESCRIPTION": "",
      "DEPARTMENT_CODE": "",
      "NETSAL": 0,
      "PERKS": 0,
      "GROSSAL": 0,
      "EXP": 0,
      "TOTALSAL": 0,
      "ACCODE": this.workerMasterForm.value.WorkerAcCode || "",
      "LOSS_ALLOWED": this.workerMasterForm.value.LossAllowed || 0,
      "SECRET_CODE": "",
      "PROCESS_CODE": "",
      "TRAY_WEIGHT": this.workerMasterForm.value.TrayWeight || 0,
      "SUPERVISOR": "",
      "ACTIVE": true,
      "TARGET_WEIGHT": this.workerMasterForm.value.WorkerCode || 0,
      "TARGET_BY": "s",
      "FINGER_ID": "strin",
      "TARGET_PCS": this.workerMasterForm.value.TargetPcs || 0,
      "TARGET_CARAT_WT": this.workerMasterForm.value.TargetCaratWt || 0,
      "TARGET_METAL_WT": this.workerMasterForm.value.TargetMetalWt || 0,
      "WORKER_EXPIRY_DATE": "2023-09-01T03:39:10.654Z",
      "workerDetails": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "WORKER_CODE": "",
          "PROCESS_CODE": ""
        }
      ]
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result) {
          console.log(result);
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  selectedCustomer(data: any) {
    console.log(data);
    // this.receiptDetailsForm.controls.POSCustomerName.setValue(data.NAME)
    // this.receiptDetailsForm.controls.POSCustomerCode.setValue(data.CODE)
  }

  /**USE: close modal window */
  close() {
    this.activeModal.close();
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }

}
