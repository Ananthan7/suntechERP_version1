import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sequence-master',
  templateUrl: './sequence-master.component.html',
  styleUrls: ['./sequence-master.component.scss']
})
export class SequenceMasterComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid
  currentFilter: any;
  showFilterRow!: boolean;
  showHeaderFilter!: boolean;
  tableData: any[] = [
    {SrNo: 'SrNo',PROCESS_CODE: '1'},
    {SrNo: 'SrNo',PROCESS_CODE: '2'},
    {SrNo: 'SrNo',PROCESS_CODE: '3'},
    {SrNo: 'SrNo',PROCESS_CODE: '4'},
    {SrNo: 'SrNo',PROCESS_CODE: '5'},
    {SrNo: 'SrNo',PROCESS_CODE: '6'},
    {SrNo: 'SrNo',PROCESS_CODE: '7'},
    {SrNo: 'SrNo',PROCESS_CODE: '8'},
  ];
  columnhead: any[] = ['Sr No', 'Process', 'Description'];
  selectedProcessArr: any[] = [];
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
  showDragIcons: boolean;
  workerMasterForm: FormGroup = this.formBuilder.group({
    WorkerCode: ['', [Validators.required]],
    WorkerDESCRIPTION: ['', [Validators.required]],
    WorkerAcCode: ['', [Validators.required]],
    NameOfSupervisor: ['', [Validators.required]],
    DefaultProcess: ['', [Validators.required]],
    LossAllowed: [''],
    Password: [''],
    TrayWeight: [''],
    TargetPcs: [''],
    TargetCaratWt: [''],
    TargetMetalWt: [''],
    TargetWeight: [''],
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
  ) {
    this.showDragIcons = true;
    this.onReorder = this.onReorder.bind(this);
  }

  ngOnInit(): void {
    if(this.content){
      this.setFormValues()
    }
  }
  setFormValues() {
    if(!this.content) return
    this.workerMasterForm.controls.WorkerCode.setValue(this.content.WORKER_CODE)
    this.workerMasterForm.controls.WorkerDESCRIPTION.setValue(this.content.DESCRIPTION)
    this.workerMasterForm.controls.WorkerAcCode.setValue(this.content.ACCODE)
    this.workerMasterForm.controls.NameOfSupervisor.setValue(this.content.SUPERVISOR)
    this.workerMasterForm.controls.DefaultProcess.setValue(this.content.PROCESS_CODE)
    this.workerMasterForm.controls.LossAllowed.setValue(this.content.LOSS_ALLOWED)
    this.workerMasterForm.controls.TrayWeight.setValue(this.content.TRAY_WEIGHT)
    this.workerMasterForm.controls.TargetPcs.setValue(this.content.TARGET_PCS)
    this.workerMasterForm.controls.TargetCaratWt.setValue(this.content.TARGET_CARAT_WT)
    this.workerMasterForm.controls.TargetMetalWt.setValue(this.content.TARGET_METAL_WT)
    this.workerMasterForm.controls.TargetWeight.setValue(this.content.TARGET_WEIGHT)
  }
 
  onReorder(e:any) {
    const visibleRows = e.component.getVisibleRows();
    const toIndex = this.tableData.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
    const fromIndex = this.tableData.findIndex((item) => item.ID === e.itemData.ID);

    this.tableData.splice(fromIndex, 1);
    this.tableData.splice(toIndex, 0, e.itemData);
  }
  /**USE:  final save API call*/
  formSubmit() {
    if(this.content && this.content.FLAG == 'EDIT'){
      this.updateWorkerMaster()
      return
    }
    if (this.workerMasterForm.invalid && this.selectedProcessArr) {
      this.toastr.error('select all required fields & Process')
      return
    }

    let API = 'WorkerMaster/InsertWorkerMaster'
    let postData = {
      "MID": 0,
      "WORKER_CODE": this.workerMasterForm.value.WorkerCode || "",
      "DESCRIPTION": this.workerMasterForm.value.WorkerDESCRIPTION || "",
      "DEPARTMENT_CODE": "",
      "NETSAL": 0,
      "PERKS": 0,
      "GROSSAL": 0,
      "EXP": 0,
      "TOTALSAL": 0,
      "ACCODE": this.workerMasterForm.value.WorkerAcCode || "",
      "LOSS_ALLOWED": this.workerMasterForm.value.LossAllowed || 0,
      "SECRET_CODE": "",
      "PROCESS_CODE": this.workerMasterForm.value.DefaultProcess || "",
      "TRAY_WEIGHT": this.workerMasterForm.value.TrayWeight || 0,
      "SUPERVISOR": this.workerMasterForm.value.NameOfSupervisor || "",
      "ACTIVE": true,
      "TARGET_WEIGHT": this.workerMasterForm.value.TargetWeight || 0.000,
      "TARGET_BY": "",
      "FINGER_ID": "",
      "TARGET_PCS": this.workerMasterForm.value.TargetPcs || 0,
      "TARGET_CARAT_WT": this.workerMasterForm.value.TargetCaratWt || 0.000,
      "TARGET_METAL_WT": this.workerMasterForm.value.TargetMetalWt || 0.000,
      "WORKER_EXPIRY_DATE": "",
      "workerDetails": this.selectedProcessArr
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.workerMasterForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  updateWorkerMaster(){
    if (this.selectedProcessArr.length == 0 && this.workerMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'WorkerMaster/UpdateWorkerMaster/'+this.workerMasterForm.value.WorkerCode
    let postData = {
      "MID": this.content.MID,
      "WORKER_CODE": this.workerMasterForm.value.WorkerCode || "",
      "DESCRIPTION": this.workerMasterForm.value.WorkerDESCRIPTION || "",
      "DEPARTMENT_CODE": "",
      "NETSAL": 0,
      "PERKS": 0,
      "GROSSAL": 0,
      "EXP": 0,
      "TOTALSAL": 0,
      "ACCODE": this.workerMasterForm.value.WorkerAcCode || "",
      "LOSS_ALLOWED": this.workerMasterForm.value.LossAllowed || 0,
      "SECRET_CODE": "",
      "PROCESS_CODE": this.workerMasterForm.value.DefaultProcess || "",
      "TRAY_WEIGHT": this.workerMasterForm.value.TrayWeight || 0,
      "SUPERVISOR": this.workerMasterForm.value.NameOfSupervisor || "",
      "ACTIVE": true,
      "TARGET_WEIGHT": this.workerMasterForm.value.TargetWeight || 0.000,
      "TARGET_BY": "",
      "FINGER_ID": "",
      "TARGET_PCS": this.workerMasterForm.value.TargetPcs || 0,
      "TARGET_CARAT_WT": this.workerMasterForm.value.TargetCaratWt || 0.000,
      "TARGET_METAL_WT": this.workerMasterForm.value.TargetMetalWt || 0.000,
      "WORKER_EXPIRY_DATE": "",
      "workerDetails": this.selectedProcessArr
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.workerMasterForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  /**USE: delete worker master from row */
  deleteWorkerMaster() {
    if (!this.content.WORKER_CODE) {
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
        let API = 'WorkerMaster/DeleteWorkerMaster/' + this.content.WORKER_CODE
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
                    this.workerMasterForm.reset()
                    this.tableData = []
                    this.close()
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
                    this.workerMasterForm.reset()
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

  /**use: checkbox change */
  changedCheckbox(cellInfo: any) {
    let value = cellInfo.data

    this.tableData.forEach((item: any) => {
      if (value.SrNo == item.SrNo) {
        value.isChecked = !value.isChecked
      }
      this.selectedProcessArr.push({
        "UNIQUEID": 0,
        "SRNO": value.SrNo,
        "WORKER_CODE": value.PROCESS_DESC,
        "PROCESS_CODE": value.PROCESS_CODE
      })
    })
  }
  
  /**use: to check worker exists in db */
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
  //selected field value setting
  WorkerAcCodeSelected(data: any) {
    this.workerMasterForm.controls.WorkerAcCode.setValue(data.ACCODE)
  }
  supervisorSelected(data: any) {
    this.workerMasterForm.controls.NameOfSupervisor.setValue(data.WORKER_CODE)
  }
  defaultProcessSelected(data: any) {
    this.workerMasterForm.controls.DefaultProcess.setValue(data.Process_Code)
  }
  workerCodeChange(event: any) {
    this.accountMasterData.SEARCH_VALUE = event.target.value
  }

  /**USE: close modal window */
  close() {
    this.workerMasterForm.reset()
    this.tableData = []
    this.activeModal.close();
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
