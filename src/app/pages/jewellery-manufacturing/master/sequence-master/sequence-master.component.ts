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
  selectAll: boolean = false;
  viewMode: boolean = false;

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
  accountMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Code Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  sequenceMasterForm: FormGroup = this.formBuilder.group({
    mid: [''],
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
    if (this.content.FLAG == 'EDIT') {
      this.setFormValues();
    } else if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.setFormValues();
    }
  }
  /**use:  search component selection changes*/
  wipAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].WIP_ACCODE = event.ACCODE;
  }
  gainAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].GAIN_ACCODE = event.ACCODE;
  }
  labAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].LAB_ACCODE = event.ACCODE;
  }
  lossAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].LOSS_ACCODE = event.ACCODE;
  }
  /**USE: get table data on initial load */
  private getTableData(): void {
    let API = 'ProcessMasterDj/GetProcessMasterDJList'
    this.commonService.toastInfoByMsgId('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          this.dataSource = result.response
          this.sortWithMID()
          this.dataSource.forEach((item: any, index: any) => {
            item.SRNO = index + 1
            item.STD_LOSS = this.commonService.decimalQuantityFormat(item.STD_LOSS, 'METAL')
            item.MAX_LOSS = this.commonService.decimalQuantityFormat(item.MAX_LOSS, 'METAL')
            item.isChecked = false
            item.orderId = this.dataSource.length
          })
          if (this.content.FLAG == ('EDIT' || 'VIEW')) {
            console.log('fired 1');
            
            this.checkSequenceExists()
          }
        } else {
          this.toastr.error('No Data Found')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  // check sequence exists and fill grid
  checkSequenceExists() {
    if (this.sequenceMasterForm.value.sequenceCode == '') return
    let API = 'SequenceMasterDJ/GetSequenceMasterDJDetail/' + this.sequenceMasterForm.value.sequenceCode
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        let data = result.response
        if (this.content.FLAG == ('EDIT' || 'VIEW')) {
          let itemNum = 0;
          console.log('fired 2');
          data.sequenceDetails.forEach((item: any) => {
            this.dataSource.forEach((obj: any) => {
              if (item.PROCESS_CODE == obj.PROCESS_CODE) {
                obj.isChecked = true
                itemNum += 1
                obj.SRNO = itemNum
                obj.orderId = item.SEQ_NO
                obj.WIP_ACCODE = item.WIP_ACCODE
                obj.STD_TIME = this.commonService.MinutesToHours(item.STD_TIME) || 0,
                obj.MAX_TIME = this.commonService.MinutesToHours(item.MAX_TIME) || 0,
                obj.STD_LOSS = this.commonService.decimalQuantityFormat(item.STD_LOSS, 'METAL'),
                obj.MIN_LOSS = this.commonService.decimalQuantityFormat(item.MIN_LOSS, 'METAL'),
                obj.MAX_LOSS = this.commonService.decimalQuantityFormat(item.MAX_LOSS, 'METAL'),
                obj.LOSS_ACCODE = this.commonService.nullToString(item.LOSS_ACCODE),
                obj.WIP_ACCODE = this.commonService.nullToString(item.WIP_ACCODE),
                obj.LAB_ACCODE = this.commonService.nullToString(item.LAB_ACCODE),
                obj.POINTS = item.POINTS || 0,
                obj.GAIN_ACCODE = this.commonService.nullToString(item.GAIN_ACCODE),
                obj.GAIN_AC = "",
                obj.TIMEON_PROCESS = item.TIMEON_PROCESS
              }
            });
          })
          console.log('fired 3');

          this.dataSource.sort((a: any, b: any) => a.orderId - b.orderId)
          this.selectedSequence = this.dataSource.filter((item: any) => item.isChecked == true)
          this.reCalculateSRNO()
        } else {
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
  checkAll() {
    this.dataSource.forEach((item: any) => item.isChecked = this.selectAll)
  }
  /**USE: drag and drop event */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    this.reCalculateSRNO()
  }
  reCalculateSRNO() {
    this.dataSource.forEach((item: any, index: any) => item.SRNO = index + 1)
  }
  sortWithMID() {
    this.dataSource.sort((a: any, b: any) => a.MID - b.MID)
  }

  setFormValues() {
    if (!this.content) return
    this.sequenceMasterForm.controls.mid.setValue(this.content.MID)
    this.sequenceMasterForm.controls.sequenceCode.setValue(this.content.SEQ_CODE)
    this.sequenceMasterForm.controls.sequenceDESCRIPTION.setValue(this.content.DESCRIPTION)
    this.sequenceMasterForm.controls.sequencePrefixCode.setValue(this.content.PREFIX_CODE)
  }

  /**USE:  final save API call*/
  formSubmit() {
    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {
      this.updateWorkerMaster()
      return
    }
    if (this.sequenceMasterForm.invalid && this.selectedSequence) {
      this.toastr.error('select all required fields & Process')
      return
    }

    let API = 'SequenceMasterDJ/InsertSequenceMasterDJ'
    let postData = {
      "SEQ_CODE": this.sequenceMasterForm.value.sequenceCode.toUpperCase() || "",
      "DESCRIPTION": this.sequenceMasterForm.value.sequenceDESCRIPTION.toUpperCase() || "",
      "PRINT_COUNT": 0,
      "PREFIX_CODE": this.sequenceMasterForm.value.sequencePrefixCode.toUpperCase() || "",
      "MID": 0,
      "sequenceDetails": this.setSelectedSequence() || []
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
  updateWorkerMaster() {
    if (this.selectedSequence.length == 0 && this.sequenceMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'SequenceMasterDJ/UpdateSequenceMasterDJ/' + this.sequenceMasterForm.value.sequenceCode
    let postData = {
      "SEQ_CODE": this.commonService.nullToString(this.sequenceMasterForm.value.sequenceCode),
      "DESCRIPTION": this.commonService.nullToString(this.sequenceMasterForm.value.sequenceDESCRIPTION),
      "PRINT_COUNT": 0,
      "PREFIX_CODE": this.commonService.nullToString(this.sequenceMasterForm.value.sequencePrefixCode),
      "MID": this.sequenceMasterForm.value.mid || 0,
      "sequenceDetails": this.setSelectedSequence() || []
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: this.commonService.getMsgByID('MSG2186') || result.message,
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.sequenceMasterForm.reset()
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
                    this.sequenceMasterForm.reset()
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
  selectAllChekbox(event: any) {
    this.dataSource.forEach((item: any) => {
      item.isChecked = event.target.checked
    })
  }

  /**use: checkbox change */
  changedCheckbox(value: any) {
    if (this.sequenceMasterForm.value.sequenceCode == "") {
      Swal.fire({
        title: '',
        text: this.commonService.getMsgByID('MSG1124'),
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
    this.dataSource.forEach((item: any, index: number) => {
      if (value.MID == item.MID) {
        item.isChecked = value.isChecked
        item.orderId = index + 1
      }
    })
    if (value.isChecked == false) {
      const index = this.selectedSequence.indexOf(value);
      this.selectedSequence.splice(index, 1); // Remove the item from its current position
      this.dataSource.forEach((item: any, index: number) => {
        if (value.MID == item.MID) {
          item.orderId = this.dataSource.length
        }
      })
    }
    this.dataSource.sort((a, b) => a.orderId - b.orderId);
    this.reCalculateSRNO()
  }
  /**USE: set Selected Sequence data */
  setSelectedSequence() {
    this.selectedSequence = []
    this.dataSource.forEach((item: any) => {
      if (item.isChecked == true) {
        this.selectedSequence.push({
          "UNIQUEID": 0,
          "SEQ_CODE": this.sequenceMasterForm.value.sequenceCode,
          "SEQ_NO": this.commonService.emptyToZero(item.SRNO),
          "PROCESS_CODE": this.commonService.nullToString(item.PROCESS_CODE),
          "PROCESS_DESCRIPTION": this.commonService.nullToString(item.DESCRIPTION),
          "PROCESS_TYPE": this.commonService.nullToString(item.PROCESS_TYPE),
          "CURRENCY_CODE": this.commonService.nullToString(item.CURRENCY_CODE),
          "UNIT_RATE": item.UNIT_RATE || 0,
          "UNIT": this.commonService.nullToString(item.UNIT),
          "NO_OF_UNITS": item.NO_OF_UNITS || 0,
          "STD_TIME": this.commonService.timeToMinutes(item.STD_TIME) || 0,
          "MAX_TIME": this.commonService.timeToMinutes(item.MAX_TIME) || 0,
          "STD_LOSS": item.STD_LOSS || 0,
          "MIN_LOSS": item.MIN_LOSS || 0,
          "MAX_LOSS": item.MAX_LOSS || 0,
          "LOSS_ACCODE": this.commonService.nullToString(item.LOSS_ACCODE),
          "WIP_ACCODE": this.commonService.nullToString(item.WIP_ACCODE),
          "LAB_ACCODE": this.commonService.nullToString(item.LAB_ACCODE),
          "POINTS": item.POINTS || 0,
          "GAIN_ACCODE": this.commonService.nullToString(item.GAIN_ACCODE),
          "GAIN_AC": "",
          "TRAY_WT": item.TRAY_WT || 0,
          "PACKET_CODE": "",
          "LOSS_ON_GROSS": item.LOSS_ON_GROSS || false,
          "TIMEON_PROCESS": item.TIMEON_PROCESS || false,
          "LABCHRG_PERHOUR": item.LABCHRG_PERHOUR || 0
        })
      }
    })
    return this.selectedSequence
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
  close(data?: any) {
    this.sequenceMasterForm.reset()
    this.activeModal.close(data);
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  oncalculateChange(event: any) {
    console.log(event);
    if (event.checked == true) {
      this.sequenceMasterForm.controls['calculatetime'].enable();


    }
    //   else{
    //     this.sequenceMasterForm.controls['calculatetime'].disable();
    //      
    //   }
  }
}
