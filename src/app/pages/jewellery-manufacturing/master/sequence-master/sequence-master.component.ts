import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { CdkDragDrop, CdkDragStart, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
@Component({
  selector: 'app-sequence-master',
  templateUrl: './sequence-master.component.html',
  styleUrls: ['./sequence-master.component.scss']
})
export class SequenceMasterComponent implements OnInit {
  @ViewChild('overlaysequencePrefixCodeSearch') overlaysequencePrefixCodeSearch!: MasterSearchComponent;
  @Input() content!: any; //use: To get clicked row details from master grid

  dataSource: any[] = [];
  tableData: any[] = []
  processSearch: string = '';
  selectedSequence: any[] = [];
  currentFilter: any;
  showFilterRow!: boolean;
  showHeaderFilter!: boolean;
  selectAll: boolean = false;
  viewMode: boolean = false;
  calculateProcessDisable: boolean = false;
  codeEnable: boolean = true;
  editMode: boolean = false;
  checkCondtion: boolean = false;
  checkTimeCondtion: boolean = false;

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
    private renderer: Renderer2,
  ) {
    this.getTableData()
  }
  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content.FLAG == 'EDIT') {
        this.editMode = true
      } else if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;

      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteSequenceMaster()
      }
    }
  }

  onDragStarted(event: CdkDragStart, index: number) {
    // handle drag start event
  }

  codeEnabled() {
    if (this.sequenceMasterForm.value.sequenceCode == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }
  getTime() {
    // convertTimeMinutesToDHM
  }

  checkCode(): boolean {
    if (this.sequenceMasterForm.value.sequenceCode == '') {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return true
    }
    return false
  }


  /**use:  search component selection changes*/
  wipAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].WIP_ACCODE = event.ACCODE;
  }
  gainAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].GAIN_ACCODE = event.ACCODE;
    this.dataSource[data.SRNO - 1].GAIN_AC = event.ACCODE;
  }
  labAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].LAB_ACCODE = event.ACCODE;
  }
  lossAccodeSelected(event: any, data: any) {
    this.dataSource[data.SRNO - 1].LOSS_ACCODE = event.ACCODE;
  }

  // searchFromGrid(event: any) {
  //   if (event.target.value == '') {
  //     this.dataSource = this.tableData
  //   }
  //   const results: any = []
  //   this.dataSource = this.dataSource.filter(obj =>
  //     obj.PROCESS_CODE.toLowerCase().startsWith(event.target.value.toLowerCase())
  //   );
  //   this.dataSource = this.dataSource.filter(results =>
  //     results.DESCRIPTION.toLowerCase().startsWith(event.target.value.toLowerCase())
  //   );

  // }
  searchFromGrid(event: any) {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue === '') {
      this.dataSource = this.tableData;
      return;
    }

    this.dataSource = this.tableData.filter(obj =>
      obj.PROCESS_CODE.toLowerCase().startsWith(searchValue) ||
      obj.DESCRIPTION.toLowerCase().startsWith(searchValue)
    );
  }

  /**USE: get table data on initial load */
  private getTableData(): void {
    let API = 'ProcessMasterDj/GetProcessMasterDJList'
    this.commonService.toastInfoByMsgId('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          this.dataSource = result.response
          this.tableData = result.response
          this.sortWithMID()

          this.dataSource.forEach((item: any, index: any) => {
            item.SRNO = index + 1
            item.STD_LOSS = this.commonService.decimalQuantityFormat(item.STD_LOSS, 'METAL')
            item.MAX_LOSS = this.commonService.decimalQuantityFormat(item.MAX_LOSS, 'METAL')
            item.isChecked = false
            item.orderId = this.dataSource.length
            if (Number(item.MAX_TIME) > 0 || Number(item.MAX_TIME) > 0) {
              item.TIMEON_PROCESS = true
            } else {
              item.TIMEON_PROCESS = false
            }
          })

          if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'VIEW') {
            this.checkSequenceExists()
          }
        } else {
          this.commonService.toastInfoByMsgId('MSG1452')//No Data Found
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  calculateProcessChange(event: any) {
    console.log(event)
    if (event.target.checked == true) {
      this.calculateProcessDisable = false;
    }
    else {
      this.calculateProcessDisable = true;
    }
  }

  /**use: to check code exists in db */
  checkCodeExists(event: any) {
    if (event.target.value == '') return
    if (this.editMode == true || this.viewMode == true) return
    let API = 'SequenceMasterDJ/CheckIfSeqCodeExists/' + event.target.value
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: result.message || 'Sequence Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
            }
            setTimeout(() => {
              this.renderer.selectRootElement('#code').focus();
            }, 500);
          });
          this.sequenceMasterForm.controls.sequenceCode.setValue('')
        }
      }, err => {
        this.sequenceMasterForm.controls.sequenceCode.setValue('')
      })
    this.subscriptions.push(Sub)
  }


  // use: check sequence exists and fill grid
  checkSequenceExists() {
    if (this.sequenceMasterForm.value.sequenceCode == '') return
    this.commonService.toastInfoByMsgId('Loading..');
    let API = 'SequenceMasterDJ/GetSequenceMasterDJDetail/' + this.sequenceMasterForm.value.sequenceCode
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        let data = result.response
        if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'VIEW') {
          let itemNum = 0;
          data.sequenceDetails.forEach((item: any) => {
            this.dataSource.forEach((obj: any) => {
              if (item.PROCESS_CODE == obj.PROCESS_CODE) {
                obj.isChecked = true
                itemNum += 1
                obj.SRNO = itemNum
                obj.orderId = item.SEQ_NO
                obj.WIP_ACCODE = item.WIP_ACCODE
                obj.STD_TIME = Number(item.STD_TIME),
                  obj.MAX_TIME = Number(item.MAX_TIME),
                  obj.STD_LOSS = this.commonService.decimalQuantityFormat(item.STD_LOSS, 'METAL'),
                  obj.MIN_LOSS = this.commonService.decimalQuantityFormat(item.MIN_LOSS, 'METAL'),
                  obj.MAX_LOSS = this.commonService.decimalQuantityFormat(item.MAX_LOSS, 'METAL'),
                  obj.LOSS_ACCODE = this.commonService.nullToString(item.LOSS_ACCODE),
                  obj.WIP_ACCODE = this.commonService.nullToString(item.WIP_ACCODE),
                  obj.LAB_ACCODE = this.commonService.nullToString(item.LAB_ACCODE),
                  obj.POINTS = item.POINTS || 0,
                  obj.GAIN_ACCODE = this.commonService.nullToString(item.GAIN_AC),
                  obj.GAIN_AC = "",
                  obj.TIMEON_PROCESS = item.TIMEON_PROCESS

              }
            });
          })
          // this.dataSource.forEach((obj: any) => {
          //   obj.STD_TIME = this.commonService.convertTimeMinutesToDHM(obj.STD_TIME)
          //   obj.MAX_TIME = this.commonService.convertTimeMinutesToDHM(obj.MAX_TIME)
          // })
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
  timeConvert(time: any) {
    const daysTime = Math.floor(time / 24 / 60);
    const hoursTime = Math.floor(time / 60 % 24);
    const minutesTime = Math.floor(time % 60);
    return daysTime + ":" + hoursTime + ':' + minutesTime;
  }
  submitValidation() {
    if (this.selectedSequence.length == 0) {
      console.log(this.selectedSequence)
      this.commonService.toastErrorByMsgId('MSG1777')
      //this.toastr.error('Select all required fields & Process')Select atleast one option
      return true;
    }
    if (this.commonService.nullToString(this.sequenceMasterForm.value.sequenceCode) == '') {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(this.sequenceMasterForm.value.sequenceDESCRIPTION) == '') {
      this.commonService.toastErrorByMsgId('MSG1193')//"description cannot be empty"
      return true
    }

    this.commonService.toastInfoByMsgId

    this.dataSource.forEach((item: any) => {
      if (item.isChecked == true && item.STD_LOSS > item.MAX_LOSS) {
        this.checkCondtion = true;
        this.commonService.toastErrorByMsgId('MSG1808')//Max Loss cannot be less than Std Loss
      }
      if (item.isChecked == true && item.STD_LOSS < item.MAX_LOSS) {
        this.checkCondtion = false

      }
    })
    if (this.checkCondtion == true) {
      return true;
    }

    this.dataSource.forEach((item: any) => {
      if (item.isChecked == true && item.STD_TIME > item.MAX_TIME) {
        this.checkTimeCondtion = true;
        this.commonService.toastErrorByMsgId('MSG7901')//Max Time cannot be less than Std Time
        // this.toastr.error('Max Time must be Greater than the Standard Time')
      }

      if (item.isChecked == true && item.STD_TIME < item.MAX_TIME) {
        this.checkTimeCondtion = false
      }
    })
    if (this.checkTimeCondtion == true) {
      return true;
    }
    return false;
  }
  setPostData(form: any) {
    return {
      "SEQ_CODE": this.commonService.nullToString(form.sequenceCode?.toUpperCase()),
      "DESCRIPTION": this.commonService.nullToString(form.sequenceDESCRIPTION?.toUpperCase()),
      "PRINT_COUNT": 0,
      "PREFIX_CODE": this.commonService.nullToString(form.sequencePrefixCode?.toUpperCase()),
      "MID": this.content?.MID || 0,
      "sequenceDetails": this.setSelectedSequence()
    }
  }
  /**USE:  final save API call*/
  formSubmit() {
    if (this.content?.FLAG == 'VIEW') return
    if (this.submitValidation()) return;
    // // Check loss condition with the postData
    // if (!this.checkLossCondition()) {
    //   return; // Prevent form submission if condition fails
    // }
    if (this.content?.FLAG == 'EDIT') {
      this.updateWorkerMaster()
      return
    }
    let API = 'SequenceMasterDJ/InsertSequenceMasterDJ'
    let postData = this.setPostData(this.sequenceMasterForm.value)

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {

        if (result.status == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
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
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }


  updateWorkerMaster() {
    // if (this.submitValidation()) return;
    let API = 'SequenceMasterDJ/UpdateSequenceMasterDJ/' + this.sequenceMasterForm.value.sequenceCode
    let postData = this.setPostData(this.sequenceMasterForm.value)

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {

        if (result.status == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || result.message,
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
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }
  /**use: validate all lookups to check data exists in db */
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
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.sequenceMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'sequencePrefixCode') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   }
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       // this.isDisableSaveBtn = false;
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.sequenceMasterForm.controls[FORMNAME].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found')
  //     })
  //   this.subscriptions.push(Sub)
  // }
  /**USE: delete  master from row */
  deleteSequenceMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
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
  codeValidate() {
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
      return true
    }
    return false
  }
  /**use: checkbox change order*/
  changedCheckbox(dataSelected: any) {
    if (this.codeValidate()) return;
    this.processSearch = ''
    this.dataSource = this.tableData;
    console.log(dataSelected);

    this.dataSource.forEach((item: any, index: number) => {
      if (dataSelected.MID == item.MID) {
        item.isChecked = dataSelected.isChecked
        item.orderId = index + 1
        if (item.orderId == this.dataSource.length) {
          item.orderId = index
        }
      }
    })

    if (dataSelected.isChecked == true) {
      this.selectedSequence.push(dataSelected)
    }

    if (dataSelected.isChecked == false) {
      const index = this.selectedSequence.indexOf(dataSelected);
      this.selectedSequence.splice(index, 1); // Remove the item from its current position
      this.dataSource.forEach((item: any, index: number) => {
        if (dataSelected.MID == item.MID) {
          item.orderId = this.dataSource.length - 1
        }
      })
    }

    this.dataSource.sort((a, b) => a.orderId - b.orderId);
    console.log(this.dataSource, 'dataSource');
    this.reCalculateSRNO()
  }
  /**USE: set Selected Sequence data */
  // setSelectedSequence() {

  //   this.dataSource.forEach((item: any) => {
  //     if (item.isChecked == true) {
  //       this.selectedSequence.push({
  //         "UNIQUEID": 0,
  //         "SEQ_CODE": this.commonService.nullToString(item.PROCESS_CODE),
  //         "SEQ_NO": this.commonService.emptyToZero(item.SRNO),
  //         "PROCESS_CODE": this.commonService.nullToString(item.PROCESS_CODE),
  //         "PROCESS_DESCRIPTION": this.commonService.nullToString(item.DESCRIPTION),
  //         "PROCESS_TYPE": "",
  //         "CURRENCY_CODE": "",
  //         "UNIT_RATE": item.UNIT_RATE || 0,
  //         "UNIT": "",
  //         "NO_OF_UNITS": item.NO_OF_UNITS || 0,
  //         "STD_TIME": item.STD_TIME,
  //         "MAX_TIME": item.MAX_TIME,
  //         "STD_LOSS": item.STD_LOSS || 0,
  //         "MIN_LOSS": item.MIN_LOSS || 0,
  //         "MAX_LOSS": item.MAX_LOSS || 0,
  //         "LOSS_ACCODE": this.commonService.nullToString(item.LOSS_ACCODE),
  //         "WIP_ACCODE": this.commonService.nullToString(item.WIP_ACCODE),
  //         "LAB_ACCODE": this.commonService.nullToString(item.LAB_ACCODE),
  //         "POINTS": item.POINTS || 0,
  //         "GAIN_ACCODE": "",
  //         "GAIN_AC": this.commonService.nullToString(item.GAIN_ACCODE),
  //         "TRAY_WT": item.TRAY_WT || 0,
  //         "PACKET_CODE": this.commonService.nullToString(item.PROCESS_CODE),
  //         "LOSS_ON_GROSS": item.LOSS_ON_GROSS || false,
  //         "TIMEON_PROCESS": item.TIMEON_PROCESS || false,
  //         "LABCHRG_PERHOUR": item.LABCHRG_PERHOUR || 0
  //       })
  //     }
  //   })
  //   return this.selectedSequence
  // }

  setSelectedSequence() {
    const selectedSequence = this.dataSource
      .filter((item: any) => item.isChecked === true)
      .map((item: any) => {
        return {
          "UNIQUEID": 0,
          "SEQ_CODE": this.commonService.nullToString(item.PROCESS_CODE),
          "SEQ_NO": this.commonService.emptyToZero(item.SRNO),
          "PROCESS_CODE": this.commonService.nullToString(item.PROCESS_CODE),
          "PROCESS_DESCRIPTION": this.commonService.nullToString(item.DESCRIPTION),
          "PROCESS_TYPE": "", // Populate this field as needed
          "CURRENCY_CODE": "", // Populate this field as needed
          "UNIT_RATE": item.UNIT_RATE || 0,
          "UNIT": "", // Populate this field as needed
          "NO_OF_UNITS": item.NO_OF_UNITS || 0,
          "STD_TIME": item.STD_TIME,
          "MAX_TIME": item.MAX_TIME,
          "STD_LOSS": item.STD_LOSS || 0,
          "MIN_LOSS": item.MIN_LOSS || 0,
          "MAX_LOSS": item.MAX_LOSS || 0,
          "LOSS_ACCODE": this.commonService.nullToString(item.LOSS_ACCODE),
          "WIP_ACCODE": this.commonService.nullToString(item.WIP_ACCODE),
          "LAB_ACCODE": this.commonService.nullToString(item.LAB_ACCODE),
          "POINTS": item.POINTS || 0,
          "GAIN_ACCODE": this.commonService.nullToString(item.GAIN_ACCODE), // Populate this field as needed
          "GAIN_AC": "",
          "TRAY_WT": item.TRAY_WT || 0,
          "PACKET_CODE": "",
          "LOSS_ON_GROSS": item.LOSS_ON_GROSS || false,
          "TIMEON_PROCESS": item.TIMEON_PROCESS || false,
          "LABCHRG_PERHOUR": 0
        };
      });

    return selectedSequence;
  }

  private handleDurationUpdate(value: any): number {
    if (value == '' || !value) return 0;
    let duration = value.split(':')
    let totalDays = (Number(duration[0]) * 24) * 60
    let totalHours = (Number(duration[1]) * 60)
    let totalMinutes = (Number(duration[2]))
    let total = totalDays + totalHours + totalMinutes
    console.log(`Total Minutes: ${total}`);
    return total
  }

  //selected field value setting
  sequencePrefixCodeSelected(data: any) {
    if (this.checkCode()) return
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


  // checkLossCondition(data: any) {
  //   let max = this.commonService.emptyToZero(data['MAX_LOSS'])
  //   let std = this.commonService.emptyToZero(data['STD_LOSS'])
  //   if (max < std) {
  //     this.commonService.toastErrorByMsgId('Max Loss cannot be less than Std Loss')
  //     this.dataSource[data.SRNO].MAX_LOSS = 0
  //     return false;
  //   }
  //   return true;
  // }

  checkLossCondition(data: any) {
    let max: number = parseFloat(data['MAX_LOSS'])
    let std: number = parseFloat(data['STD_LOSS'])
    if (max < std) {
      this.commonService.toastErrorByMsgId('MSG1808')//Max Loss cannot be less than Std Loss
      this.dataSource[data.SRNO].MAX_LOSS = 0
      return false;
    }
    return true;
  }

  // stdLoss Change
  stdLossChanged(data: any) {
    this.checkLossCondition(data)
  }

  // maxLoss Change
  maxLossChanged(data: any) {
    console.log(data, 'data');
    this.checkLossCondition(data)
  }

  // checkTimeCondition(data: any) {
  //   let max = this.commonService.emptyToZero(data['MAX_TIME'])
  //   let std = this.commonService.emptyToZero(data['STD_TIME'])
  //   if (max < std) {
  //     this.commonService.toastErrorByMsgId('Max Time cannot be less than Std Time')
  //     this.dataSource[data.SRNO].MAX_TIME = 0
  //     return false;
  //   }
  //   return true;
  // }

  checkTimeCondition(data: any) {
    let max: number = parseFloat(data['MAX_TIME'])
    let std: number = parseFloat(data['STD_TIME'])
    if (max < std) {
      this.commonService.toastErrorByMsgId('MSG7901')//Max Time cannot be less than Std Time
      this.dataSource[data.SRNO].MAX_TIME = 0
      return false;
    }
    return true;
  }
  // stdLoss Change
  stdTimeChanged(data: any) {
    this.checkTimeCondition(data)
  }

  // maxLoss Change
  maxTimeChanged(data: any) {
    console.log(data, 'data');
    this.checkTimeCondition(data)
  }




  /**USE: close modal window */
  // close(data?: any) {
  //   this.sequenceMasterForm.reset()
  //   this.activeModal.close(data);
  // }

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

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  oncalculateChange(event: any) {
    if (event.checked == true) {
      this.sequenceMasterForm.controls['calculatetime'].enable();


    }
  }

  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {

    if (formControlName == 'sequencePrefixCode') {
      this.overlaysequencePrefixCodeSearch.showOverlayPanel(event)
    }
  }
}


