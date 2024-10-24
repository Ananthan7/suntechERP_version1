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
  btndisable: boolean = false;
  isDisableSaveBtn: boolean = false;
  isloading: boolean = false;
  filteredData: any[] = []; // Data source for the filtered grid
  searchTerm: string = '';

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
    WHERECONDITION: "WORKER_CODE <> ''",
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
    DailyTarget: ['D'],
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
    this.renderer.selectRootElement('#code')?.focus();
    if (this.content?.FLAG) {
      this.setFormValues();
      this.selectProcessWithSP()
      this.btndisable = true
      if (this.content?.FLAG == 'VIEW') {
        this.viewMode = true;
        this.isViewMode = true;
      } else if (this.content?.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteWorkerMaster()
      }
    }
  }
  changeTextUpperCase(event: any) {
    event.target.value = event.target.value.toString().toUpperCase();
  }
  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
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
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.workerMasterForm.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
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
    this.workerMasterForm.controls.Password.setValue(this.content.SECRET_CODE)
    this.workerMasterForm.controls.TargetPcs.setValue(
      this.commonService.commaSeperation(this.content.TARGET_PCS)
    )

    this.setValueWithDecimal('LossAllowed', this.content.LOSS_ALLOWED, 'METAL')
    this.setValueWithDecimal('TrayWeight', this.content.TRAY_WEIGHT, 'METAL')
    this.setValueWithDecimal('TargetCaratWt', this.content.TARGET_CARAT_WT, 'METAL')
    this.setValueWithDecimal('TargetMetalWt', this.content.TARGET_METAL_WT, 'METAL')
    this.setValueWithDecimal('TargetWeight', this.content.TARGET_WEIGHT, 'METAL')
    this.workerMasterForm.controls.DailyTarget.setValue(this.content.TARGET_BY)
    this.workerMasterForm.controls.Active.setValue(this.content.ACTIVE == 'Y' ? true : false)
  }
  setProcessData() {
    let num = 0
    this.tableData.forEach((item) => {
      if (item.SELECT1 == true) {
        num += 1
        this.selectedProcessArr.push({
          "UNIQUEID": 0,
          "SRNO": num,
          "WORKER_CODE": this.workerMasterForm.value.WorkerCode,
          "PROCESS_CODE": item.PROCESS_CODE,
        })
      }
    })
  }
  setPostData() {
    this.setProcessData() //detail grid data to save
    let form = this.workerMasterForm.value
    return {
      "MID": this.content?.MID ? this.content.MID : 0,
      "WORKER_CODE": this.commonService.nullToString((form.WorkerCode).toUpperCase()),
      "DESCRIPTION": form.WorkerDESCRIPTION.toUpperCase(),
      "DEPARTMENT_CODE": "",
      "NETSAL": 0,
      "PERKS": 0,
      "GROSSAL": 0,
      "EXP": 0,
      "TOTALSAL": 0,
      "ACCODE": this.commonService.nullToString(form.WorkerAcCode.toUpperCase()),
      "LOSS_ALLOWED": this.commonService.emptyToZero(form.LossAllowed),
      "SECRET_CODE": this.commonService.nullToString(form.Password),
      "PROCESS_CODE": this.commonService.nullToString(this.selectedProcessArr[0]?.PROCESS_CODE),
      "TRAY_WEIGHT": this.commonService.emptyToZero(form.TrayWeight),
      "SUPERVISOR": this.commonService.nullToString(form.NameOfSupervisor.toUpperCase()),
      "ACTIVE": form.Active,
      "TARGET_WEIGHT": this.commonService.emptyToZero(form.TargetWeight),
      "TARGET_BY": this.commonService.nullToString(form.DailyTarget),
      "FINGER_ID": "",
      "TARGET_PCS": this.commonService.emptyToZero(form.TargetPcs),
      "TARGET_CARAT_WT": this.commonService.emptyToZero(form.TargetCaratWt),
      "TARGET_METAL_WT": this.commonService.emptyToZero(form.TargetMetalWt),
      "WORKER_EXPIRY_DATE": "",
      "workerDetails": this.selectedProcessArr || [] 
    }
  }
  submitValidations(form: any) {
    if (this.commonService.nullToString(form.WorkerCode) == '') {
      this.toastr.error("Worker Code cannot be empty")
      return true
    }
    else if (this.commonService.nullToString(form.WorkerDESCRIPTION) == '') {
      this.toastr.error("Description cannot be empty")
      return true
    }
    return false;
  }
  reCalculateSrno() {
    if (this.selectedProcessArr?.length > 0) {
      this.selectedProcessArr.forEach((item: any, i: any) => {
        item.SRNO = i + 1;
      });
    }
  }
  /**USE:  final save API call*/
  formSubmit() {
    this.buttonField = false;
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.submitValidations(this.workerMasterForm.value)) return;
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateWorkerMaster()
      return
    }
    let API = 'WorkerMaster/InsertWorkerMaster'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
      this.isloading = false;
        if (result) {
          if (result.status == "Success") {
            this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
          } else {
            this.showErrorDialog('Error please try again');
          }
        } else {
          this.toastr.error('Not deleted');
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network error')
      })
    this.subscriptions.push(Sub)

  }

  updateWorkerMaster() {
    this.viewModeBtn = false;
    let API = 'WorkerMaster/UpdateWorkerMaster/' + this.workerMasterForm.value.WorkerCode
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
      this.isloading = false;
        if (result) {
          if (result.status == "Success") {
            this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
          } else {
            this.showErrorDialog('Error please try again');
          }
        } else {
          this.toastr.error('Not deleted');
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network error')
      })
    this.subscriptions.push(Sub)
  }
  afterSave(value:any){
      this.workerMasterForm.reset()
      this.tableData = []
      this.close('reloadMainGrid')
  }
  /**USE: delete worker master from row */
  deleteWorkerMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content.WORKER_CODE) {
      this.showDeleteErrorDialog('Please Select data to delete!');
      return;
    }
  
    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let API = 'WorkerMaster/DeleteWorkerMaster/' + this.content.WORKER_CODE;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                this.showSuccessDialog(result.message || 'Success');
              } else {
                this.showErrorDialog(result.message || 'Error please try again');
              }
            } else {
              this.toastr.error('Not deleted');
            }
          }, err => {
            this.commonService.toastErrorByMsgId('network error')
          });
        this.subscriptions.push(Sub);
      }
    });
  }
  
  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }
  
  showDeleteErrorDialog(message: string): void {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    });
  }
  
  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }
  
  showErrorDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
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
        this.isDisableSaveBtn = false;
        this.setwithFormControl(result.status, flag)
      }, err => {
        this.workerMasterForm.reset()
      })
    this.subscriptions.push(Sub)
  }
  
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION?`AND ${LOOKUPDATA.WHERECONDITION}`:''}`
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.workerMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
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
        this.isDisableSaveBtn = false;
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
  @ViewChild('barcode') barcodeElement!: ElementRef;
  name: string = 'John Doe'; //
 
  
  printBarcode() {
    const inputText = this.workerMasterForm.value.WorkerCode
    const barcodeElement:any = this.barcodeElement.nativeElement;
    
    // Generate a simple barcode representation
    barcodeElement.innerText = inputText;
    const printWindow:any = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print Barcode</title></head><body>');
    printWindow.document.write('<img src="data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="0" y="15">' + barcodeElement.innerText + '</text></svg>') + '" />');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
