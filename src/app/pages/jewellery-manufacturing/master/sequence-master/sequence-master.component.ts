import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-sequence-master',
  templateUrl: './sequence-master.component.html',
  styleUrls: ['./sequence-master.component.scss']
})
export class SequenceMasterComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid

  dataSource = [];
  selectedSequence: string[] = [];

  currentFilter: any;
  showFilterRow!: boolean;
  showHeaderFilter!: boolean;

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
  sequenceMasterForm: FormGroup = this.formBuilder.group({
    sequenceCode: ['', [Validators.required]],
    sequenceDESCRIPTION: ['', [Validators.required]],
    sequencePrefixCode: ['', [Validators.required]],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) {
    this.getTableData()
  }

  ngOnInit(): void {
    if(this.content){
      this.setFormValues()
    }
  }
  /**USE: drag and drop event */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
  }
  getTableData(){
    let API = 'ProcessMasterDj/GetProcessMasterDJList'

    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          this.dataSource = result.response
          this.dataSource.forEach((item:any)=>{
            item.isChecked = false
          })
          // this.displayedColumns = Object.keys(this.dataSource[0]);
        } else {
          this.toastr.error('No Data Found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

 
  setFormValues() {
    if(!this.content) return
    // this.sequenceMasterForm.controls.WorkerCode.setValue(this.content.WORKER_CODE)
    // this.sequenceMasterForm.controls.WorkerDESCRIPTION.setValue(this.content.DESCRIPTION)
    // this.sequenceMasterForm.controls.WorkerAcCode.setValue(this.content.ACCODE)
    // this.sequenceMasterForm.controls.NameOfSupervisor.setValue(this.content.SUPERVISOR)
  }
 
  
  /**USE:  final save API call*/
  formSubmit() {
    if(this.content && this.content.FLAG == 'EDIT'){
      this.updateWorkerMaster()
      return
    }
    if (this.sequenceMasterForm.invalid && this.selectedProcessArr) {
      this.toastr.error('select all required fields & Process')
      return
    }

    let API = 'SequenceMasterDJ/InsertSequenceMasterDJ'
    let postData = {
      "SEQ_CODE": "string",
      "DESCRIPTION": "string",
      "PRINT_COUNT": 0,
      "PREFIX_CODE": "string",
      "MID": 0,
      "sequenceDetails": [
        {
          "UNIQUEID": 0,
          "SEQ_CODE": "string",
          "SEQ_NO": 0,
          "PROCESS_CODE": "string",
          "PROCESS_DESCRIPTION": "string",
          "PROCESS_TYPE": "string",
          "CURRENCY_CODE": "stri",
          "UNIT_RATE": 0,
          "UNIT": "string",
          "NO_OF_UNITS": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "STD_LOSS": 0,
          "MIN_LOSS": 0,
          "MAX_LOSS": 0,
          "LOSS_ACCODE": "string",
          "WIP_ACCODE": "string",
          "LAB_ACCODE": "string",
          "POINTS": 0,
          "GAIN_ACCODE": "string",
          "GAIN_AC": "string",
          "TRAY_WT": 0,
          "PACKET_CODE": "string",
          "LOSS_ON_GROSS": true,
          "TIMEON_PROCESS": true,
          "LABCHRG_PERHOUR": 0
        }
      ]
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
                this.sequenceMasterForm.reset()
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
    if (this.selectedProcessArr.length == 0 && this.sequenceMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'WorkerMaster/UpdateWorkerMaster/'+this.sequenceMasterForm.value.WorkerCode
    let postData = {
      "SEQ_CODE": "string",
      "DESCRIPTION": "string",
      "PRINT_COUNT": 0,
      "PREFIX_CODE": "string",
      "MID": 0,
      "sequenceDetails": [
        {
          "UNIQUEID": 0,
          "SEQ_CODE": "string",
          "SEQ_NO": 0,
          "PROCESS_CODE": "string",
          "PROCESS_DESCRIPTION": "string",
          "PROCESS_TYPE": "string",
          "CURRENCY_CODE": "stri",
          "UNIT_RATE": 0,
          "UNIT": "string",
          "NO_OF_UNITS": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "STD_LOSS": 0,
          "MIN_LOSS": 0,
          "MAX_LOSS": 0,
          "LOSS_ACCODE": "string",
          "WIP_ACCODE": "string",
          "LAB_ACCODE": "string",
          "POINTS": 0,
          "GAIN_ACCODE": "string",
          "GAIN_AC": "string",
          "TRAY_WT": 0,
          "PACKET_CODE": "string",
          "LOSS_ON_GROSS": true,
          "TIMEON_PROCESS": true,
          "LABCHRG_PERHOUR": 0
        }
      ]
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
                this.sequenceMasterForm.reset()
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
                    this.sequenceMasterForm.reset()
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
                    this.sequenceMasterForm.reset()
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
  selectAllChekbox(event: any){
    this.dataSource.forEach((item: any) => {
      item.isChecked = event.target.checked
    })
  }
  /**use: checkbox change */
  changedCheckbox(value: any) {
    this.dataSource.forEach((item: any) => {
      if (value.MID == item.MID) {
        value.isChecked = !value.isChecked
      }
    })
      
    this.selectedSequence = this.dataSource.filter((item:any)=> item.isChecked == true)
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
              this.sequenceMasterForm.reset()
            }
          });
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  //selected field value setting
  sequencePrefixCodeSelected(data: any) {
    this.sequenceMasterForm.controls.sequencePrefixCode.setValue(data.PREFIX_CODE)
  }
  supervisorSelected(data: any) {
    this.sequenceMasterForm.controls.NameOfSupervisor.setValue(data.WORKER_CODE)
  }
  defaultProcessSelected(data: any) {
    this.sequenceMasterForm.controls.DefaultProcess.setValue(data.Process_Code)
  }
  PrefixCodeChange(event: any) {
    this.accountMasterData.SEARCH_VALUE = event.target.value
  }

  /**USE: close modal window */
  close() {
    this.sequenceMasterForm.reset()
    this.activeModal.close();
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
