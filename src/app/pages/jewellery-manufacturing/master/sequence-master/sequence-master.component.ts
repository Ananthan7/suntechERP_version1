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

  dataSource: any[] = [];
  selectedSequence: any[] = [];
  currentFilter: any;
  showFilterRow!: boolean;
  showHeaderFilter!: boolean;
  selectAll = false
  isReadOnly:boolean=true
  isdisabled:boolean=true

  private subscriptions: Subscription[] = [];

  sequenceMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix master',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sequenceMasterForm: FormGroup = this.formBuilder.group({
    mid:[''],
    sequenceCode: ['', [Validators.required]],
    sequenceDESCRIPTION: ['', [Validators.required]],
    sequencePrefixCode: [''],
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
    // this.sequenceMasterForm.controls['calculatetime'].disable();
    console.log(this.content.FLAG);
    if (this.content.FLAG == 'VIEW') {
      this.viewFormValues();
    }
    else(this.content.FLAG == 'EDIT')
    {
      this.setFormValues();
    }
    
  }

  checkAll() {
    console.log(this.dataSource);
    this.dataSource.forEach((item:any)=>item.isChecked = this.selectAll )
}
  /**USE: drag and drop event */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
  }
  
  /**USE: get table data on initial load */
  private getTableData(): void {
    let API = 'ProcessMasterDj/GetProcessMasterDJList'

    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          this.dataSource = result.response
          this.dataSource.forEach((item: any) => {
            item.UNIQUEID = 0
            item.isChecked = false
            item.orderId = this.dataSource.length
          })
          // this.displayedColumns = Object.keys(this.dataSource[0]);
        } else {
          this.toastr.error('No Data Found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  setFormValues() {
    if (!this.content) return
    this.sequenceMasterForm.controls.mid.setValue(this.content.MID)
    this.sequenceMasterForm.controls.sequenceCode.setValue(this.content.SEQ_CODE)
    this.sequenceMasterForm.controls.sequenceDESCRIPTION.setValue(this.content.DESCRIPTION)
    this.sequenceMasterForm.controls.sequencePrefixCode.setValue(this.content.PREFIX_CODE)
  }

  viewFormValues() {
    if (!this.content) return
    this.sequenceMasterForm.controls.mid.setValue(this.content.MID)
    this.sequenceMasterForm.controls.sequenceCode.setValue(this.content.SEQ_CODE)
    this.sequenceMasterForm.controls.sequenceDESCRIPTION.setValue(this.content.DESCRIPTION)
    this.sequenceMasterForm.controls.sequencePrefixCode.setValue(this.content.PREFIX_CODE)
  }

  /**USE:  final save API call*/
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateWorkerMaster()
      return
    }
    if (this.sequenceMasterForm.invalid && this.selectedSequence) {
      this.toastr.error('select all required fields & Process')
      return
    }

    let API = 'SequenceMasterDJ/InsertSequenceMasterDJ'
    let postData = {
      "SEQ_CODE": this.sequenceMasterForm.value.sequenceCode || "",
      "DESCRIPTION": this.sequenceMasterForm.value.sequenceDESCRIPTION || "",
      "PRINT_COUNT": 0,
      "PREFIX_CODE": this.sequenceMasterForm.value.sequencePrefixCode || "",
      "MID": 0,
      "sequenceDetails": this.selectedSequence || []
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
  updateWorkerMaster() {
    if (this.selectedSequence.length == 0 && this.sequenceMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'SequenceMasterDJ/UpdateSequenceMasterDJ/' + this.sequenceMasterForm.value.sequenceCode
    let postData = {
      "SEQ_CODE": this.sequenceMasterForm.value.sequenceCode || "",
      "DESCRIPTION": this.sequenceMasterForm.value.sequenceDESCRIPTION || "",
      "PRINT_COUNT": 0,
      "PREFIX_CODE": this.sequenceMasterForm.value.sequencePrefixCode || "",
      "MID": this.sequenceMasterForm.value.mid || 0,
      "sequenceDetails": this.selectedSequence || []
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
    if (!this.content.SEQ_CODE) {
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
        let API = 'SequenceMasterDJ/DeleteSequenceMasterDJ/' + this.content.SEQ_CODE
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
  selectAllChekbox(event: any) {
    this.dataSource.forEach((item: any) => {
      item.isChecked = event.target.checked
    })
  }
  seqIndex: number = 0;

  /**use: checkbox change */
  changedCheckbox(value: any) {
    if(value.isChecked == true){
     this.isdisabled = !this.isdisabled
    }

    if (this.sequenceMasterForm.value.sequenceCode == "") {
      this.isdisabled = false
      if(value.isChecked == false){this.isdisabled = true}

      Swal.fire({
        title: '',
        text: 'Code cannot be empty!',
        icon: 'warning',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.dataSource.forEach((item: any, index: number) => {
            item.isChecked = false;
          })
        }
      });
      return
    }
    let dataSet: any
    this.dataSource.forEach((item: any, index: number) => {
      if (value.MID == item.MID) {
        item.UNIQUEID = index + 1
        item.isChecked = value.isChecked
        item.orderId = index+1
      }
    })
    if (value.isChecked) {
      dataSet = {
        "UNIQUEID": 0,
        "SEQ_CODE": this.sequenceMasterForm.value.sequenceCode || "",
        "SEQ_NO": this.seqIndex || 0,
        "PROCESS_CODE": value.PROCESS_CODE || "",
        "PROCESS_DESCRIPTION": value.DESCRIPTION || "",
        "PROCESS_TYPE": value.PROCESS_TYPE || "",
        "CURRENCY_CODE": value.CURRENCY_CODE || "",
        "UNIT_RATE": value.UNIT_RATE || 0,
        "UNIT": value.UNIT || "",
        "NO_OF_UNITS": value.NO_OF_UNITS || 0,
        "STD_TIME": value.STD_TIME || 0,
        "MAX_TIME": value.MAX_TIME || 0,
        "STD_LOSS": value.STD_LOSS || 0,
        "MIN_LOSS": value.MIN_LOSS || 0,
        "MAX_LOSS": value.MAX_LOSS || 0,
        "LOSS_ACCODE": value.LOSS_ACCODE || "",
        "WIP_ACCODE": value.WIP_ACCODE || "",
        "LAB_ACCODE": value.LAB_ACCODE || "",
        "POINTS": value.POINTS || 0,
        "GAIN_ACCODE": value.GAIN_ACCODE || "",
        "GAIN_AC": "",
        "TRAY_WT": value.TRAY_WT || 0,
        "PACKET_CODE": "",
        "LOSS_ON_GROSS": value.LOSS_ON_GROSS || true,
        "TIMEON_PROCESS": value.TIMEON_PROCESS || true,
        "LABCHRG_PERHOUR": value.LABCHRG_PERHOUR || 0
      }
      this.selectedSequence.push(dataSet)
      // Reorder the data array based on the order of clicks
      this.dataSource.sort((a, b) => a.orderId - b.orderId);
    } else {
      const index = this.selectedSequence.indexOf(value);
      this.selectedSequence.splice(index, 1); // Remove the item from its current position
      this.dataSource.forEach((item: any, index: number) => {
        if (value.MID == item.MID) {
          item.orderId = this.dataSource.length
        }
      })
      this.dataSource.sort((a, b) => a.orderId - b.orderId);
    }
    this.selectedSequence.forEach((item: any, index: number) => {
        item.SEQ_NO = index+1
    })

    console.log(this.selectedSequence, 'selectedSequence');
  }
  /**use: to check worker exists in db */
  checkSequenceExists(event: any) {
    if (event.target.value == '') return

    let API = 'SequenceMasterDJ/GetSequenceMasterDJDetail/' + event.target.value
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          Swal.fire({
            title: '',
            text: 'Sequence Already Exists!',
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

  gainAccSelected(data: any) {
    this.sequenceMasterForm.controls.gainAcc.setValue(data.GAIN_ACCODE)
  }

  PrefixCodeChange(event: any) {
    this.sequenceMasterData.SEARCH_VALUE = event.target.value
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
  oncalculateChange(event:any) {
    console.log(event);
    if(event.checked==true){
      this.sequenceMasterForm.controls['calculatetime'].enable();
   
     
    }
  //   else{
  //     this.sequenceMasterForm.controls['calculatetime'].disable();
  //      
  //   }
}
}
