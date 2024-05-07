import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';


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
  viewModeBtn: boolean = true;
  isViewMode: boolean = false;
  showHeaderFilter!: boolean;
  tableData: any[] = [];
  columnhead: any[] = ['Sr No', 'Process Code', 'Description'];
  selectedProcessArr: any[] = [];
  selectedKey: number[] = []
  private subscriptions: Subscription[] = [];
  readonlyMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = true;
  dele: boolean = false;
  btndisable: boolean = false;

  filteredData: any[] = []; // Data source for the filtered grid
  searchTerm: string = '';


  // @ViewChild('codeInput')
  // codeInput!: ElementRef;

  // focusOnWorkerCodeInput() {
  //   if (this.codeInput && this.workerMasterForm.value.WorkerCode ==='') {
  //     this.codeInput.nativeElement.focus();
  //     return;
  //   }
  // }

  // ngAfterViewInit(): void {
  //   this.focusOnWorkerCodeInput();
  // }


  accountMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
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
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.setInitialValues()
    this.filteredData = this.tableData;
  }

  ngOnInit(): void {
    this.dele = true;
    this.renderer.selectRootElement('#code')?.focus();
    if (this.content?.FLAG) {
      this.setFormValues();
      this.selectProcessWithSP()
      if (this.content?.FLAG == 'VIEW') {
        this.viewMode = true;
        this.isViewMode = true;
      } else if (this.content?.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
        this.dele = false;
      } else if (this.content?.FLAG == 'DELETE') {
        this.deleteWorkerMaster()
      }
    }
  }

  checkCode(): boolean {
    if (this.workerMasterForm.value.WorkerCode == '') {
      this.commonService.toastErrorByMsgId('please enter Worker code')
      return true
    }
    return false
  }

  codeEnabled() {
    if (this.workerMasterForm.value.WorkerCode == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }

  }

  setInitialValues() {
    this.workerMasterForm.controls.LossAllowed.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TrayWeight.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetCaratWt.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetMetalWt.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetWeight.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.workerMasterForm.controls.TargetPcs.setValue(0)
  }

  setFormValues() {
    if (!this.content) return
    this.viewModeBtn = false;
    this.workerMasterForm.controls.WorkerCode.setValue(this.content.WORKER_CODE)
    this.workerMasterForm.controls.WorkerDESCRIPTION.setValue(this.content.DESCRIPTION)
    this.workerMasterForm.controls.WorkerAcCode.setValue(this.content.ACCODE)
    this.workerMasterForm.controls.NameOfSupervisor.setValue(this.content.SUPERVISOR)
    this.workerMasterForm.controls.DefaultProcess.setValue(this.content.PROCESS_CODE)
    this.workerMasterForm.controls.LossAllowed.setValue(this.commonService.decimalQuantityFormat(this.content.LOSS_ALLOWED, 'METAL'))
    this.workerMasterForm.controls.Password.setValue(this.content.SECRET_CODE)
    this.workerMasterForm.controls.TrayWeight.setValue(this.commonService.decimalQuantityFormat(this.content.TRAY_WEIGHT, 'METAL'))
    this.workerMasterForm.controls.TargetPcs.setValue(this.content.TARGET_PCS)
    this.workerMasterForm.controls.TargetCaratWt.setValue(this.commonService.decimalQuantityFormat(this.content.TARGET_CARAT_WT, 'METAL'))
    this.workerMasterForm.controls.TargetMetalWt.setValue(this.commonService.decimalQuantityFormat(this.content.TARGET_METAL_WT, 'METAL'))
    this.workerMasterForm.controls.TargetWeight.setValue(this.commonService.decimalQuantityFormat(this.content.TARGET_WEIGHT, 'METAL'))
    this.workerMasterForm.controls.DailyTarget.setValue(this.content.TARGET_BY)
    this.workerMasterForm.controls.Active.setValue(this.content.ACTIVE == 'Y' ? true : false)
  }

  setPostData() {
    this.tableData.forEach((item) => {
      if (item.SELECT1 == true) {
        this.selectedProcessArr.push({
          "UNIQUEID": 0,
          "SRNO": item.SRNO,
          "WORKER_CODE": this.workerMasterForm.value.WorkerCode,
          "PROCESS_CODE": item.PROCESS_CODE,
        })
      }
    })
    let form = this.workerMasterForm.value
    let postData = {
      "MID": this.content?.MID ? this.content.MID : 0,
      "WORKER_CODE": this.commonService.nullToString((form.WorkerCode).toUpperCase()),
      "DESCRIPTION": form.WorkerDESCRIPTION,
      "DEPARTMENT_CODE": "",
      "NETSAL": 0,
      "PERKS": 0,
      "GROSSAL": 0,
      "EXP": 0,
      "TOTALSAL": 0,
      "ACCODE": form.WorkerAcCode || "",
      "LOSS_ALLOWED": this.commonService.emptyToZero(form.LossAllowed),
      "SECRET_CODE": form.Password || "",
      "PROCESS_CODE": form.DefaultProcess || "",
      "TRAY_WEIGHT": this.commonService.emptyToZero(form.TrayWeight),
      "SUPERVISOR": form.NameOfSupervisor || "",
      "ACTIVE": form.Active,
      "TARGET_WEIGHT": this.commonService.emptyToZero(form.TargetWeight),
      "TARGET_BY": form.DailyTarget || "",
      "FINGER_ID": "",
      "TARGET_PCS": this.commonService.emptyToZero(form.TargetPcs),
      "TARGET_CARAT_WT": this.commonService.emptyToZero(form.TargetCaratWt),
      "TARGET_METAL_WT": this.commonService.emptyToZero(form.TargetMetalWt),
      "WORKER_EXPIRY_DATE": "",
      "workerDetails": this.selectedProcessArr
    }
    return postData
  }
  /**USE:  final save API call*/
  formSubmit() {
    this.buttonField = false;
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateWorkerMaster()
      return
    }

    if (this.workerMasterForm.value.WorkerCode == '' && this.workerMasterForm.invalid) {
      this.toastr.error("Worker Code cannot be empty")
      return
    }
    else if (this.workerMasterForm.value.WorkerDESCRIPTION == '' && this.workerMasterForm.invalid) {
      this.toastr.error("Description cannot be empty")
      return
    }

    // if(this.workerMasterForm.invalid && this.selectedProcessArr) {
    //   this.toastr.error('select all required fields & Process')
    //   return
    // }


    this.selectedProcessArr.forEach((item: any, i: any) => {
      item.SRNO = i + 1;
    });

    let API = 'WorkerMaster/InsertWorkerMaster'
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: this.commonService.getMsgByID('MSG2443') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.close('reloadMainGrid')
              }
            });
            this.workerMasterForm.reset()
            this.tableData = []
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)

  }

  updateWorkerMaster() {
    this.viewModeBtn = false;

    if (this.selectedProcessArr.length == 0 && this.workerMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'WorkerMaster/UpdateWorkerMaster/' + this.workerMasterForm.value.WorkerCode
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: this.commonService.getMsgByID('MSG2443') || 'Success',
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
    if (this.content && this.content.FLAG == 'VIEW') return
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

  printBarcode() {

  }

  /**use: checkbox change */
  changedCheckbox(event: any) {
    this.tableData[event.data.SRNO - 1].SELECT1 = !event.data.SELECT1;
  }
  selectProcessWithSP() {
    let postData = {
      "SPID": "049",
      "parameter": {
        "WORKER_CODE": this.content.WORKER_CODE || "",
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") { //
          let data = result.dynamicData[0]
          data.forEach((item: any, index: any) => {
            item.SRNO = index + 1
            if (item.SELECT1 == 1) {
              item.SELECT1 = true
            } else {
              item.SELECT1 = false
            }
          })
          this.tableData = data
          // this.selectedKey = selecteditem.map((item:any)=> item.SRNO)
        } else {
          this.toastr.error('PartyCode not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
    this.subscriptions.push(Sub)
  }
  CheckWorkerwiseMetalBalanceBoth(event: any) {
    // if(event.checked) return
    if (this.workerMasterForm.value.WorkerCode == '') {
      this.commonService.toastErrorByMsgId('please select workercode')
      return
    }
    let postData = {
      "SPID": "050",
      "parameter": {
        "strBranchCode": this.commonService.branchCode || "",
        "strWorkerCode": this.workerMasterForm.value.WorkerCode || "",
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") { //
          let data = result.dynamicData[0]
          if (data.length > 0) {
            this.commonService.toastErrorByMsgId('worker cannot be inactive')
            this.workerMasterForm.controls.Active.setValue(true)
            this.workerMasterForm.controls.Active.disable();
          }
        }
      }, err => {
        this.commonService.toastErrorByMsgId('Server Error')
      })
    this.subscriptions.push(Sub)
  }
  /**select process API call */
  // selectProcessMasterList() {
  //   this.btndisable = true;
  //   if (this.content && this.content.FLAG == 'EDIT') return
  //   if (this.workerMasterForm.value.WorkerCode == '') {
  //     this.commonService.toastErrorByMsgId('Worker Code Required');
  //     return
  //   }

  //   this.commonService.toastSuccessByMsgId('MSG81447');
  //   let API = 'ProcessMasterDj/GetProcessMasterDJList'
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       if (result.response) {
  //         let data = result.response;
  //         data.forEach((item: any, i: any) => {
  //           item.SELECT1 = false
  //           item.SRNO = i + 1;
  //         });
  //         this.tableData = data
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('MSG1531')
  //     })
  //   this.subscriptions.push(Sub)

  // }

  selectProcessMasterList() {
    this.btndisable = true;
    if (this.content && this.content.FLAG == 'EDIT') return;
    if (this.workerMasterForm.value.WorkerCode == '') {
      this.commonService.toastErrorByMsgId('Worker Code Required');
      return;
    }

    this.commonService.toastSuccessByMsgId('MSG81447');
    let API = 'ProcessMasterDj/GetProcessMasterDJList';
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response;
          data.forEach((item: any, i: any) => {
            item.SELECT1 = false;
            item.SRNO = i + 1;
          });

          // Apply search filtering if a search term is provided
          if (this.searchTerm.trim() !== '') {
            this.tableData = data.filter((item: any) =>
              item.PROCESS_CODE.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
            );
          } else {
            this.tableData = data;
          }
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531');
      });
    this.subscriptions.push(Sub);
  }


  // /**use: to check worker exists in db */
  // checkWorkerExists(event: any) {
  //   if (this.content && this.content.FLAG == 'EDIT') { } else {
  //     if (event.target.value == '' || this.viewMode == true) return
  //     let API = 'WorkerMaster/CheckIfCodeExists/' + event.target.value
  //     let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //       .subscribe((result) => {
  //         if (result.checkifExists) {
  //           Swal.fire({
  //             title: '',
  //             text: result.message || 'Worker Already Exists!',
  //             icon: 'warning',
  //             confirmButtonColor: '#336699',
  //             confirmButtonText: 'Ok'
  //           }).then((result: any) => {
  //             if (result.value) {


  //             }
  //           });
  //           this.focusOnWorkerCodeInput();
  //           this.workerMasterForm.controls.WorkerCode.setValue('');
  //           //  this.codeInput.nativeElement.focus();

  //         }
  //       }, err => {
  //         this.workerMasterForm.reset()
  //       })

  //     this.subscriptions.push(Sub)
  //   }
  // }




  checkWorkerExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode || this.editMode) {
      return; // Exit the function if the input is empty or in view mode
    }

    const API = 'WorkerMaster/CheckIfCodeExists/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: result.message || 'Worker Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.workerMasterForm.controls.WorkerCode.setValue('');

            this.codeEnable = true;
            setTimeout(() => {
              this.renderer.selectRootElement('#code').focus();
            }, 500);

          });
        }
      }, err => {
        this.workerMasterForm.reset();
      });

    this.subscriptions.push(sub);
  }


  /**use: to check worker exists in db */
  workerCodeChange(event: any, flag: any) {
    this.accountMasterData.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let API = 'WorkerMaster/GetWorkerMasterAccodeLookUp/' + event.target.value
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.setwithFormControl(result.status, flag)
      }, err => {
        this.workerMasterForm.reset()
      })
    this.subscriptions.push(Sub)
  }

  setwithFormControl(status: any, code: any) {
    if (status == "Failed") {
      this.commonService.toastErrorByMsgId('MSG1531')
      this.workerMasterForm.controls[code].setValue('')
    }
  }
  /**use: to check process exists in db */
  processCodeChange(event: any, code: any) {
    this.accountMasterData.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let API = 'ProcessMasterDj/GetProcessMasterDjWithProcessCode/' + event.target.value
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.setwithFormControl(result.status, code)
      }, err => {
        this.workerMasterForm.reset()
      })
    this.subscriptions.push(Sub)
  }
  //selected field value setting
  WorkerAcCodeSelected(data: any) {
    if (this.checkCode()) return
    console.log(data);
    this.workerMasterForm.controls.WorkerAcCode.setValue(data.ACCODE)
  }
  supervisorSelected(data: any) {
    if (this.checkCode()) return
    this.workerMasterForm.controls.NameOfSupervisor.setValue(data.WORKER_CODE)
  }
  defaultProcessSelected(data: any) {
    if (this.checkCode()) return
    this.workerMasterForm.controls.DefaultProcess.setValue(data.Process_Code)
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

  search() {
    console.log("hitrttt");
    if (this.searchTerm.trim() !== '') {
      // Filter data based on search term
      this.filteredData = this.tableData.filter(item =>
        item.PROCESS_CODE.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    } else {
      // If search term is empty, display all data
      this.filteredData = this.tableData;
    }
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
