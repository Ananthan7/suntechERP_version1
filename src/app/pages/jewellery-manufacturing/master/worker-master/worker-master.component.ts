import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./worker-master.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkerMasterComponent implements OnInit {

  @Input() content!: any; //use: To get clicked row details from master grid
  currentFilter: any;
  showFilterRow!: boolean;
  buttonField: boolean = true;
  viewMode: boolean = false;
  isViewMode: boolean = false;
  showHeaderFilter!: boolean;
  tableData: any[] = [];
  columnhead: any[] = ['Sr No', 'Process Code', 'Description'];
  selectedProcessArr: any[] = [];
  selectedKey: number[] = []
  private subscriptions: Subscription[] = [];
  readonlyMode: boolean = false;
  
  accountMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCODE',
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
  workerMasterForm = this.formBuilder.group({
    WorkerCode: ['', [Validators.required]],
    WorkerDESCRIPTION: ['', [Validators.required]],
    WorkerAcCode: [''],
    NameOfSupervisor: [''],
    DefaultProcess: [''],
    LossAllowed: [''],
    Password: [''],
    TrayWeight: [''],
    TargetPcs: [''],
    TargetCaratWt: [''],
    TargetMetalWt: [''],
    TargetWeight: [''],
    DailyTarget: ['1'],
    MonthlyTarget: [null],
    YearlyTarget: [null],
    Active: [true]
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.setInitialValues()
  }

  ngOnInit(): void {
    if(!this.content){
      
    }
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.isViewMode = true;
      this.setFormValues();
      this.selectProcessMasterList();
    } else if (this.content.FLAG == 'EDIT') {

      this.viewMode = false;
      this.setFormValues();
      this.selectProcessMasterList()
    }

    if (this.isViewMode) {
      this.tableData.forEach((item, index) => {
        item.SRNO = index + 1;
      });
    }
  
  }


 
  setInitialValues() {
    this.workerMasterForm.controls.LossAllowed.setValue(this.commonService.decimalQuantityFormat(0, 'METALMETAL'))
    this.workerMasterForm.controls.TrayWeight.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetPcs.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetCaratWt.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetMetalWt.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetWeight.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  }
  setFormValues() {
    if (!this.content) return
    this.workerMasterForm.controls.WorkerCode.setValue(this.content.WORKER_CODE)
    this.workerMasterForm.controls.WorkerDESCRIPTION.setValue(this.content.DESCRIPTION)
    this.workerMasterForm.controls.WorkerAcCode.setValue(this.content.ACCODE)
    this.workerMasterForm.controls.NameOfSupervisor.setValue(this.content.SUPERVISOR)
    this.workerMasterForm.controls.DefaultProcess.setValue(this.content.PROCESS_CODE)
    this.workerMasterForm.controls.LossAllowed.setValue(this.commonService.decimalQuantityFormat(this.content.LOSS_ALLOWED, 'METAL'))
    this.workerMasterForm.controls.Password.setValue(this.content.SECRET_CODE)
    this.workerMasterForm.controls.TrayWeight.setValue(this.commonService.decimalQuantityFormat(this.content.TRAY_WEIGHT, 'METAL'))
    this.workerMasterForm.controls.TargetPcs.setValue(this.commonService.decimalQuantityFormat(this.content.TARGET_PCS, 'METAL'))
    this.workerMasterForm.controls.TargetCaratWt.setValue(this.commonService.decimalQuantityFormat(this.content.TARGET_CARAT_WT, 'METAL'))
    this.workerMasterForm.controls.TargetMetalWt.setValue(this.commonService.decimalQuantityFormat(this.content.TARGET_METAL_WT, 'METAL'))
    this.workerMasterForm.controls.TargetWeight.setValue(this.commonService.decimalQuantityFormat(this.content.TARGET_WEIGHT, 'METAL'))
    this.workerMasterForm.controls.DailyTarget.setValue(this.content.TARGET_BY)
    this.workerMasterForm.controls.Active.setValue(this.content.ACTIVE)
  }

  loadFlag: number = 0
  getWorkerMaster() {
    let API = 'WorkerMaster/GetWorkerMasterMIDLookup/' + this.content.MID
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {
          let data = result.response;
          //this.selectedKey = data.workerDetails.map((obj: any) => obj.SRNO);

          
          let data1:any =[];
          this.tableData.forEach((element:any) => {

            for(let i=0; i<data.workerDetails.length; i++){

                 if(element.PROCESS_CODE == data.workerDetails[i].PROCESS_CODE){


                  data1.push(element)

                 }
            }

          })
   
            this.tableData.forEach((item, index) => {
              item.SRNO = index + 1;
            });

          console.log(data1)

          // this.selectedKey = data1;
          this.selectedKey = data1.map((obj: any) => obj.SRNO);
          console.log( this.selectedKey)
          if(this.loadFlag == 0){
            this.loadFlag+=1
            this.tableData = data.workerDetails
            console.log( this.tableData);
          }
          // this.selectedKey.forEach((element:any) => {
          //   this.tableData.forEach((item:any,index:number) => {
          //     if(element == item.SRNO){
          //       item.SORTID = index+1
          //     }else{
          //       item.SORTID = this.tableData.length
          //     }
          //   });
          // });
          // this.tableData = this.tableData.sort((a:any,b:any)=> a.SORTID - b.SORTID)
          // this.tableData.forEach((item:any,index:number) => {
          //   item.SRNO = index+1
        // });
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  /**USE:  final save API call*/
  formSubmit() {
    this.buttonField = false;

    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateWorkerMaster()
      return
    }
    if (this.workerMasterForm.invalid && this.selectedProcessArr) {
      this.toastr.error('select all required fields & Process')
      return
    }
    this.selectedProcessArr.forEach((item: any, i: any) => {
      item.SRNO = i + 1;
    });

    let API = 'WorkerMaster/InsertWorkerMaster'
    let postData = {
      "MID": 0,
      "WORKER_CODE": this.commonService.nullToString((this.workerMasterForm.value.WorkerCode).toUpperCase()),
      "DESCRIPTION": this.commonService.nullToString((this.workerMasterForm.value.WorkerDESCRIPTION).toUpperCase()),
      "DEPARTMENT_CODE": "",
      "NETSAL": 0,
      "PERKS": 0,
      "GROSSAL": 0,
      "EXP": 0,
      "TOTALSAL": 0,
      "ACCODE": this.workerMasterForm.value.WorkerAcCode || "",
      "LOSS_ALLOWED": this.workerMasterForm.value.LossAllowed || 0,
      "SECRET_CODE": this.workerMasterForm.value.Password || "",
      "PROCESS_CODE": this.workerMasterForm.value.DefaultProcess || "",
      "TRAY_WEIGHT": this.workerMasterForm.value.TrayWeight || 0,
      "SUPERVISOR": this.workerMasterForm.value.NameOfSupervisor || "",
      "ACTIVE":  this.workerMasterForm.value.Active,
      "TARGET_WEIGHT": this.workerMasterForm.value.TargetWeight || 0.000,
      "TARGET_BY": this.workerMasterForm.value.DailyTarget|| "",
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
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.close('reloadMainGrid')
                this.tableData = []
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)

}

  updateWorkerMaster() {
    if (this.selectedProcessArr.length == 0 && this.workerMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'WorkerMaster/UpdateWorkerMaster/' + this.workerMasterForm.value.WorkerCode
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
      "SECRET_CODE": this.workerMasterForm.value.Password || "",
      "PROCESS_CODE": this.workerMasterForm.value.DefaultProcess || "",
      "TRAY_WEIGHT": this.workerMasterForm.value.TrayWeight || 0,
      "SUPERVISOR": this.workerMasterForm.value.NameOfSupervisor || "",
      "ACTIVE":  this.workerMasterForm.value.Active,
      "TARGET_WEIGHT": this.workerMasterForm.value.TargetWeight || 0.000,
      "TARGET_BY": this.workerMasterForm.value.DailyTarget|| "",
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
                    this.close('reloadMainGrid') //reloads data in MainGrid
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
                    this.close('reloadMainGrid')
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

  printBarcode(){
    
  }

  /**use: checkbox change */
  changedCheckbox(data: any) {
    let value = data.selectedRowsData
    this.selectedProcessArr = []
    value.forEach((item: any) => {
      // if (value.SrNo == item.SrNo) { 
        // value.isChecked = !value.isChecked
        // if (value.isChecked == true) {
          this.selectedProcessArr.push({
            "UNIQUEID": 0,
            "SRNO": item.SRNO,
            "WORKER_CODE": this.workerMasterForm.value.WorkerCode,
            "PROCESS_CODE": item.PROCESS_CODE,
            "DESCRIPTION": item.DESCRIPTION
          })
        // } else if (value.isChecked == false) {
        //   this.selectedProcessArr = this.selectedProcessArr.filter((element) => element.SRNO != value.SrNo)
        // }
        
      // }
    })
  }
  /**select process API call */
  selectProcessMasterList() {
    if (this.workerMasterForm.value.WorkerCode == '') {
      this.commonService.toastErrorByMsgId('Worker Code Required');
      return
    }

    this.commonService.toastSuccessByMsgId('MSG81447');
    let API = 'ProcessMasterDj/GetProcessMasterDJList'
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          this.tableData = result.response;
          console.log(this.tableData);
          this.tableData.forEach((item: any, i: any) => {
            item.SRNO = i + 1;
          });
          this.selectedKey = []
          if ((this.content.FLAG == 'EDIT' || 'VIEW')) {
            this.getWorkerMaster()
          }
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }



  /**use: to check worker exists in db */
  checkWorkerExists(event: any) {
    if (event.target.value == '' || this.viewMode == true) return
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
      }, err => {
        this.workerMasterForm.reset()
      })
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
  close(data?: any) {
    this.workerMasterForm.reset()
    this.tableData = []
    // this.activeModal.close();
    this.activeModal.close(data);
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
