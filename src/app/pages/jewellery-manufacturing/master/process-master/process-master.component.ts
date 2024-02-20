import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { DurationPickerComponent } from 'src/app/shared/common/duration-picker/duration-picker.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-process-master',
  templateUrl: './process-master.component.html',
  styleUrls: ['./process-master.component.scss']
})
export class ProcessMasterComponent implements OnInit {

  @Input() content!: any;
  viewMode: boolean = false;
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  processTypeList: any[] = [];
  formattedTime: any;
  formattedMaxTime: any;
  islossReadOnly = true;
  isRecovReadOnly = true;
  isAlloWGainReadOnly = true;
  processMasterForm !: FormGroup;

  lossData: any;

  maxTime: any;
  standTime: any;

  yourContent = {
    standardTime: {
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
    }
  }

  maxContent = {
    maximumTime: {
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
    }
  }

/**use: to check code exists in db */
checkCodeExists(event: any) {
  if (event.target.value == '' || this.viewMode == true) return
  let API = 'ProcessMasterDj/CheckIfCodeExists/' + event.target.value
  let Sub: Subscription = this.dataService.getDynamicAPI(API)
    .subscribe((result) => {
      if (result.checkifExists) {
        Swal.fire({
          title: '',
          text: result.message || 'Process Code Already Exists!',
          icon: 'warning',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        }).then((result: any) => {
          if (result.value) {
          }
        });
        this.processMasterForm.controls.processCode.setValue('')
      }
    }, err => {
      this.processMasterForm.controls.processCode.setValue('')
    })
  this.subscriptions.push(Sub)
}

  updateStandardTime(duration: any) {
    // this.yourContent.standardTime.totalDays = duration[0] || 0;
    // this.yourContent.standardTime.totalHours = duration[1] || 0;
    // this.yourContent.standardTime.totalMinutes = duration[2] || 0;

    this.formattedTime = duration;

    // console.log(this.formattedTime);

    console.log(duration)
  }

  updateMaximumTime(duration: any[]) {
    // this.maxContent.maximumTime.totalDays = duration[0] || 0;
    // this.maxContent.maximumTime.totalHours = duration[1] || 0;
    // this.maxContent.maximumTime.totalMinutes = duration[2] || 0;

    // this.formattedMaxTime = `${this.maxContent.maximumTime.totalDays}:${this.maxContent.maximumTime.totalHours}:${this.maxContent.maximumTime.totalMinutes}`;
    this.formattedMaxTime = duration;
    console.log(this.formattedMaxTime);
  }

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

  approvalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 97,
    SEARCH_FIELD: 'APPR_CODE',
    SEARCH_HEADING: 'Approval Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "APPR_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  approvalProcessData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  StockProcessData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'Stock_Code',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Stock_Code <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  accountStartData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'LOSS ACCOUNT CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>'' AND account_mode not in ('B','P','R')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  accountMiddleData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'RECOVERY ACCOUNT CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>'' AND account_mode not in ('B','P','R')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  accountEndData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'ALLOW GAIN ACCOUNT CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>'' AND account_mode not in ('B','P','R')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  maxInputLength: number = 2



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) {
    // this.setInitialValues()
  }

  ngOnInit(): void {

    this.processMasterForm = this.formBuilder.group({
      mid: [''],
      processCode: ['', [Validators.required]],
      processDesc: ['', [Validators.required]],
      processType: [null],
      stand_time: [''],
      WIPaccount: ['', [Validators.required]],
      max_time: [''],
      Position: [''],
      trayWeight: [''],
      approvalCode: [''],
      approvalProcess: [''],
      recStockCode: [''],
      labour_charge: [''],
      accountStart: [''],
      accountMiddle: [''],
      accountEnd: [''],
      loss: [false],
      recovery: [false],
      allowGain: [false],
      accode_start: [''],
      accode_end: [''],
      accode_middle: [''],
      loss_on_gross: [false],
      FinalProcess: [false],
      Setting: [false],
      LabProcess: [false],
      WaxProcess: [false],
      Stone: [false],
      MergePices: [false],
      LockWeight: [false],
      HaveTreeNo: [false],
      NonQuantity: [false],
      Consumable: [false],
      RefineryAutoProcess: [false],
      ApplyAutoLossToRefinery: [false],
      RepairProcess: [false],
      Metal: [false],
      ApprovalRequired: [false],
      DeductPureWeight: [false],
      StoneIncluded: [false],
      TimeCalculateonProcess: [false],
      RecoveryProcess: [false],
      AutoTransfer: [false],
      ApplySetting: [false],
      loss_standard: [''],
      loss_min: ['', [Validators.min(0)]],
      loss_max: [''],
      standard_start: [''],
      standard_end: [''],
      min_start: [''],
      min_end: ['', [Validators.min(0)]],
      max: [''],

    })

    this.islossReadOnly = true;
    this.isRecovReadOnly = true;
    this.isAlloWGainReadOnly = true;

    this.setInitialValues()
    this.getProcessTypeOptions()
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.setFormValues();
      // this.processMasterForm();
    } else if (this.content.FLAG == 'EDIT') {
      this.setFormValues();

    }
  }

  validateLossRange() {
    console.log(this.processMasterForm.value.loss_standard)
    console.log(this.processMasterForm.value.loss_min)
    console.log(this.processMasterForm.value.loss_max)

    const stdLoss = this.processMasterForm.value.loss_standard;
    const minLoss = this.processMasterForm.value.loss_min;
    const maxLoss = this.processMasterForm.value.loss_max;

    if (minLoss < stdLoss && stdLoss < maxLoss) {
      this.lossData = true;
    } else {
      this.lossData = false;
    }

  }


  // USE: get select options Process TypeMaster
  private getProcessTypeOptions(): void {
    let API = 'ComboFilter/PROCESS TYPE MASTER';
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.processTypeList = result.response;
        this.processTypeList.sort((a: any, b: any) => a.SRNO - b.SRNO)
      }
    });
    this.subscriptions.push(Sub)
  }

  private setInitialValues() {
    this.processMasterForm.controls.trayWeight.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.processMasterForm.controls.labour_charge.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))

  }
  private setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.processMasterForm.controls.processCode.setValue(this.content.PROCESS_CODE);
    this.processMasterForm.controls.processDesc.setValue(this.content.DESCRIPTION);
    this.processMasterForm.controls.RepairProcess.setValue(this.content.REPAIR_PROCESS);
    this.processMasterForm.controls.FinalProcess.setValue(this.content.FINAL_PROCESS);
    this.processMasterForm.controls.Setting.setValue(this.content.SETTING_PROCESS);
    this.processMasterForm.controls.LockWeight.setValue(this.content.LOCK_WEIGHT);
    this.processMasterForm.controls.LabProcess.setValue(this.content.LAB_PROCESS);
    this.processMasterForm.controls.WaxProcess.setValue(this.content.WAX_PROCESS);
    this.processMasterForm.controls.allowGain.setValue(this.content.ALLOW_GAIN);
    this.processMasterForm.controls.DeductPureWeight.setValue(this.content.DEDUCT_PURE_WT);
    this.processMasterForm.controls.approvalCode.setValue(this.content.APPR_CODE);
    this.processMasterForm.controls.ApplySetting.setValue(this.content.APPLY_SETTING);
    this.processMasterForm.controls.TimeCalculateonProcess.setValue(this.content.TIMEON_PROCESS);
    this.processMasterForm.controls.StoneIncluded.setValue(this.content.STONE_INCLUDED);
    this.processMasterForm.controls.RecoveryProcess.setValue(this.content.RECOVERY_PROCESS);
    this.processMasterForm.controls.Metal.setValue(this.content.ALLOW_METAL);
    this.processMasterForm.controls.Stone.setValue(this.content.ALLOW_STONE);
    this.processMasterForm.controls.Consumable.setValue(this.content.ALLOW_CONSUMABLE);
    this.processMasterForm.controls.ApprovalRequired.setValue(this.content.APPROVAL_REQUIRED);
    this.processMasterForm.controls.NonQuantity.setValue(this.content.NON_QUANTITY);
    this.processMasterForm.controls.RefineryAutoProcess.setValue(this.content.DF_REFINERY);
    this.processMasterForm.controls.ApplyAutoLossToRefinery.setValue(this.content.AUTO_LOSS);
    this.processMasterForm.controls.HaveTreeNo.setValue(this.content.TREE_NO);

    this.processMasterForm.controls.WIPaccount.setValue(this.content.WIP_ACCODE);
    this.processMasterForm.controls.processType.setValue(this.content.PROCESS_TYPE);
    this.processMasterForm.controls.Position.setValue(this.content.POSITION);
    this.processMasterForm.controls.recStockCode.setValue(this.content.RECOV_STOCK_CODE);
    this.processMasterForm.controls.approvalProcess.setValue(this.content.APPR_PROCESS);
    this.processMasterForm.controls.loss_standard.setValue(this.content.STD_LOSS);
    this.processMasterForm.controls.loss_min.setValue(this.content.MIN_LOSS);
    this.processMasterForm.controls.loss_max.setValue(this.content.MAX_LOSS);
    this.processMasterForm.controls.loss_on_gross.setValue(this.content.LOSS_ON_GROSS);
    this.processMasterForm.controls.trayWeight.setValue(this.content.TRAY_WT);
    this.processMasterForm.controls.labour_charge.setValue(this.content.LABCHRG_PERHOUR);
    this.processMasterForm.controls.loss.setValue(this.content.ALLOW_LOSS);
    this.processMasterForm.controls.standard_end.setValue(this.content.RECOV_MIN);
    this.processMasterForm.controls.min_end.setValue(this.content.RECOV_VAR1);
    this.processMasterForm.controls.accountMiddle.setValue(this.content.RECOV_ACCODE);
    this.processMasterForm.controls.accountStart.setValue(this.content.LOSS_ACCODE);
    this.processMasterForm.controls.accountEnd.setValue(this.content.GAIN_ACCODE);
    // this.processMasterForm.controls.stand_time.setValue(this.content.STD_TIME);
    // this.processMasterForm.controls.max_time.setValue(this.content.MAX_TIME);
    // this.formattedMaxTime.controls.setValue(this.content.STD_TIME);
    // this.formattedMaxTime.controls.setValue(this.content.MAX_TIME);

    //this.maxTime = this.content.MAX_TIME;
    this.standTime = this.content

    this.maxTime = this.content

    this.formattedTime = this.content.STD_TIME;

    this.formattedMaxTime = this.content.MAX_TIME;



  }
  onchangeCheckBox(e: any) {
    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }

  // final save
  formSubmit() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.processMasterForm.value.loss == 1) {
      this.validateLossRange();
    }
    if (this.lossData == false) {
      this.toastr.error('Standard % should be Greater than Minimum % and Lesser than Maximum %');
    }
    else {

      if (this.formattedTime > this.formattedMaxTime) {
        this.toastr.error('Maximum time should not be less than Standard time');
      }
      else {

        // let time = this.commonService.timeToMinutes(this.processMasterForm.value.stand_time)
        if (this.content && this.content.FLAG == 'EDIT') {
          this.updateProcessMaster()
          return
        }

        if (this.processMasterForm.invalid) {
          this.toastr.error('select all required fields')
          return
        }

        let API = 'ProcessMasterDj/InsertProcessMasterDJ'
        let postData = {
          "MID": 0,
          "PROCESS_CODE": this.processMasterForm.value.processCode || "",
          "DESCRIPTION": this.processMasterForm.value.processDesc || "",
          // "STD_TIME": this.commonService.timeToMinutes(this.formattedTime)  || "",
          // "MAX_TIME": this.commonService.timeToMinutes(this.formattedMaxTime)  || "",
          "STD_TIME": this.formattedTime || "",
          "MAX_TIME": this.formattedMaxTime || "",
          "LOSS_ACCODE": this.processMasterForm.value.accountStart,
          "WIP_ACCODE": this.processMasterForm.value.WIPaccount,
          "CURRENCY_CODE": "",
          "PROCESS_TYPE": this.processMasterForm.value.processType,
          "UNIT": "",
          "NO_OF_UNITS": 0,
          "UNIT_RATE": 0,
          "LAB_ACCODE": "",
          "LAST_NO": "",
          "REPAIR_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.RepairProcess),
          "FINAL_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.FinalProcess),
          "GAIN_ACCODE": this.processMasterForm.value.accountEnd,
          "TRAY_WT": this.processMasterForm.value.trayWeight || 0,
          "SETTING_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.Setting),
          "POINTS": 0,
          "LOCK_WEIGHT": this.onchangeCheckBox(this.processMasterForm.value.LockWeight),
          "AUTOTRANSFER": 0,
          "MASTER_WEIGHT": 0,
          "MERGE_BLOCK": 0,
          "LAB_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.LabProcess),
          "WAX_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.WaxProcess),
          "STD_LOSS_QTY": 0,
          "POSITION": this.processMasterForm.value.Position || 0,
          "RECOV_MIN": this.processMasterForm.value.standard_end || 0,
          "RECOV_ACCODE": this.processMasterForm.value.accountMiddle,
          "RECOV_STOCK_CODE": this.processMasterForm.value.recStockCode || "",
          "RECOV_VAR1": this.processMasterForm.value.min_end || 0,
          "RECOV_VAR2": 0,
          "DEDUCT_PURE_WT": this.onchangeCheckBox(this.processMasterForm.value.DeductPureWeight),
          "APPR_PROCESS": this.processMasterForm.value.approvalProcess || "",
          "APPR_CODE": this.processMasterForm.value.approvalCode || "",
          "ALLOW_GAIN": this.processMasterForm.value.AllowGain,
          "STD_GAIN": 0,
          "MIN_GAIN": 0,
          "MAX_GAIN": 0,
          "ALLOW_LOSS": this.processMasterForm.value.loss,
          "STD_LOSS": this.processMasterForm.value.loss_standard || 0,
          "MIN_LOSS": this.processMasterForm.value.loss_min || 0,
          "MAX_LOSS": this.processMasterForm.value.loss_max || 0,
          "LOSS_ON_GROSS": this.processMasterForm.value.loss_on_gross,
          "JOB_NUMBER": "",
          "LABCHRG_PERHOUR": this.processMasterForm.value.labour_charge || 0,
          "APPLY_SETTING": this.processMasterForm.value.ApplySetting,
          "TIMEON_PROCESS": this.processMasterForm.value.TimeCalculateonProcess,
          "STONE_INCLUDED": this.processMasterForm.value.StoneIncluded,
          "RECOVERY_PROCESS": this.processMasterForm.value.RecoveryProcess,
          "ALLOW_METAL": this.processMasterForm.value.Metal,
          "ALLOW_STONE": this.processMasterForm.value.Stone,
          "ALLOW_CONSUMABLE": this.processMasterForm.value.Consumable,
          "APPROVAL_REQUIRED": this.processMasterForm.value.ApprovalRequired,
          "NON_QUANTITY": this.processMasterForm.value.NonQuantity,
          "DF_REFINERY": this.processMasterForm.value.RefineryAutoProcess,
          "AUTO_LOSS": this.processMasterForm.value.ApplyAutoLossToRefinery,
          "ISACCUPDT": true,
          "TREE_NO": this.processMasterForm.value.HaveTreeNo,
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
                    this.processMasterForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                this.toastr.error('Error: ' + result.message || 'An error occurred during the save process');
              }
            } else {
              this.toastr.error('Not saved');
            }

          }, err => {
            this.toastr.error('An error occurred: ' + err);
            console.error(err);
          });

        this.subscriptions.push(Sub);

        console.log(this.processMasterForm.value.stand_time);
      }
    }
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  ApprovalCodeSelected(e: any) {
    this.processMasterForm.controls.approvalCode.setValue(e.APPR_CODE);
  }
  ApprovalProcessSelected(e: any) {
    this.processMasterForm.controls.approvalProcess.setValue(e.Process_Code);
  }
  ACCODESelected(e: any) {
    if (this.isSameAccountCodeSelected(e.ACCODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same account code');
      return;
    }
    this.processMasterForm.controls.WIPaccount.setValue(e.ACCODE);
  }

  StockProcesSelected(e: any) {
    this.processMasterForm.controls.recStockCode.setValue(e.STOCK_CODE);
  }
  /** checking for same account code selection */
  private isSameAccountCodeSelected(accountCode: any): boolean {
    return (
      this.processMasterForm.value.accountStart === accountCode ||
      this.processMasterForm.value.accountMiddle === accountCode ||
      this.processMasterForm.value.accountEnd === accountCode ||
      this.processMasterForm.value.WIPaccount === accountCode
    );
  }

  accountStartSelected(e: any) {
    if (this.isSameAccountCodeSelected(e.ACCODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same account code');
      return;
    }
    this.processMasterForm.controls.accountStart.setValue(e.ACCODE);
  }

  accountMiddleSelected(e: any) {
    if (this.isSameAccountCodeSelected(e.ACCODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same account code');
      return;
    }
    this.processMasterForm.controls.accountMiddle.setValue(e.ACCODE);
  }

  accountEndSelected(e: any) {
    if (this.isSameAccountCodeSelected(e.ACCODE)) {
      this.commonService.toastErrorByMsgId('cannot select the same account code');
      return;
    }
    this.processMasterForm.controls.accountEnd.setValue(e.ACCODE);
  }

  updateProcessMaster() {
    console.log(this.processMasterForm.value);
    if (this.processMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'ProcessMasterDj/UpdateProcessMasterDJ/' + this.processMasterForm.value.processCode
    let postData = {
      "MID": 0,
      "PROCESS_CODE": this.processMasterForm.value.processCode || "",
      "DESCRIPTION": this.processMasterForm.value.processDesc || "",
      // "STD_TIME": this.commonService.timeToMinutes(this.formattedTime)  || "",
      // "MAX_TIME": this.commonService.timeToMinutes(this.formattedMaxTime)  || "",
      "STD_TIME": this.formattedTime || "",
      "MAX_TIME": this.formattedMaxTime || "",
      "LOSS_ACCODE": this.processMasterForm.value.accountStart,
      "WIP_ACCODE": this.processMasterForm.value.WIPaccount,
      "CURRENCY_CODE": "",
      "PROCESS_TYPE": this.processMasterForm.value.processType,
      "UNIT": "",
      "NO_OF_UNITS": 0,
      "UNIT_RATE": 0,
      "LAB_ACCODE": "",
      "LAST_NO": "",
      "REPAIR_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.RepairProcess),
      "FINAL_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.FinalProcess),
      "GAIN_ACCODE": this.processMasterForm.value.accountEnd,
      "TRAY_WT": this.processMasterForm.value.trayWeight || 0,
      "SETTING_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.Setting),
      "POINTS": 0,
      "LOCK_WEIGHT": this.onchangeCheckBox(this.processMasterForm.value.LockWeight),
      "AUTOTRANSFER": 0,
      "MASTER_WEIGHT": 0,
      "MERGE_BLOCK": 0,
      "LAB_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.LabProcess),
      "WAX_PROCESS": this.onchangeCheckBox(this.processMasterForm.value.WaxProcess),
      "STD_LOSS_QTY": 0,
      "POSITION": this.processMasterForm.value.Position || 0,
      "RECOV_MIN": this.processMasterForm.value.standard_end || 0,
      "RECOV_ACCODE": this.processMasterForm.value.accountMiddle,
      "RECOV_STOCK_CODE": this.processMasterForm.value.recStockCode || "",
      "RECOV_VAR1": this.processMasterForm.value.min_end || 0,
      "RECOV_VAR2": 0,
      "DEDUCT_PURE_WT": this.onchangeCheckBox(this.processMasterForm.value.DeductPureWeight),
      "APPR_PROCESS": this.processMasterForm.value.approvalProcess || "",
      "APPR_CODE": this.processMasterForm.value.approvalCode || "",
      "ALLOW_GAIN": this.processMasterForm.value.AllowGain,
      "STD_GAIN": 0,
      "MIN_GAIN": 0,
      "MAX_GAIN": 0,
      "ALLOW_LOSS": this.processMasterForm.value.loss,
      "STD_LOSS": this.processMasterForm.value.loss_standard || 0,
      "MIN_LOSS": this.processMasterForm.value.loss_min || 0,
      "MAX_LOSS": this.processMasterForm.value.loss_max || 0,
      "LOSS_ON_GROSS": this.processMasterForm.value.loss_on_gross,
      "JOB_NUMBER": "",
      "LABCHRG_PERHOUR": this.processMasterForm.value.labour_charge || 0,
      "APPLY_SETTING": this.processMasterForm.value.ApplySetting,
      "TIMEON_PROCESS": this.processMasterForm.value.TimeCalculateonProcess,
      "STONE_INCLUDED": this.processMasterForm.value.StoneIncluded,
      "RECOVERY_PROCESS": this.processMasterForm.value.RecoveryProcess,
      "ALLOW_METAL": this.processMasterForm.value.Metal,
      "ALLOW_STONE": this.processMasterForm.value.Stone,
      "ALLOW_CONSUMABLE": this.processMasterForm.value.Consumable,
      "APPROVAL_REQUIRED": this.processMasterForm.value.ApprovalRequired,
      "NON_QUANTITY": this.processMasterForm.value.NonQuantity,
      "DF_REFINERY": this.processMasterForm.value.RefineryAutoProcess,
      "AUTO_LOSS": this.processMasterForm.value.ApplyAutoLossToRefinery,
      "ISACCUPDT": true,
      "TREE_NO": this.processMasterForm.value.HaveTreeNo,
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
                this.processMasterForm.reset()
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
  deleteProcessMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'ProcessMasterDj/DeleteProcessMasterDJ/' + this.content.PROCESS_CODE
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
                    this.processMasterForm.reset()
                    this.tableData = []
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
                    this.processMasterForm.reset()
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

  onlossChange(event: any) {
    this.islossReadOnly = !this.islossReadOnly;
    console.log(event);
    // if(event.checked === true){
    //   this.processMasterForm.controls['loss_max'].enable();
    //   this.processMasterForm.controls['loss_min'].enable();
    //   this.processMasterForm.controls['accountStart'].enable();
    //   this.processMasterForm.controls['loss_standard'].enable();
    // }
    // else{
    //   this.processMasterForm.controls['loss_min'].disable();
    //   this.processMasterForm.controls['loss_max'].disable();
    //   this.processMasterForm.controls['accountStart'].disable();
    //   this.processMasterForm.controls['loss_standard'].disable();
    //   this.processMasterForm.controls['loss_min'].disable();
    //   this.processMasterForm.controls['loss_max'].disable();
    //   this.processMasterForm.controls['accountStart'].disable();
    //   this.processMasterForm.controls['loss_standard'].disable();
    // }
  }

  onRecovery(event: any) {
    this.isRecovReadOnly = !this.isRecovReadOnly;

    console.log(event);
    // if(event.checked === true){
    //   this.processMasterForm.controls['standard_end'].enable();
    //   this.processMasterForm.controls['min_end'].enable();
    //   this.processMasterForm.controls['accountMiddle'].enable();
    // }
    // else{
    //   this.processMasterForm.controls['standard_end'].disable();
    //   this.processMasterForm.controls['min_end'].disable();
    //   this.processMasterForm.controls['accountMiddle'].disable();
    //   this.processMasterForm.controls['standard_end'].disable();
    //   this.processMasterForm.controls['min_end'].disable();
    //   this.processMasterForm.controls['accountMiddle'].disable();
    // }
  }

  onAllowGain(event: any) {
    this.isAlloWGainReadOnly = !this.isAlloWGainReadOnly;

    console.log(event);
    // if(event.checked == true){
    //   this.processMasterForm.controls['accountEnd'].enable();
    //  }
    //else{
    //   this.processMasterForm.controls['accountEnd'].disable();
    //   this.processMasterForm.controls['accountEnd'].disable();
    // }
  }



  // onInput(event: Event): void {
  //   const inputValue = (event.target as HTMLInputElement).value;

  //   // Trim the input to 3 letters
  //   const limitedValue = inputValue.slice(0, 3);

  //   // Update the input value
  //   (event.target as HTMLInputElement).value = limitedValue;
  //   }




  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    // Remove any non-digit characters
    const numericValue = inputValue.replace(/[^0-9]/g, '');


    // Insert a dot after the first 3 digits
    let formattedValue = numericValue.slice(0, 3);

    if (numericValue.length > 3) {
      formattedValue += '.' + numericValue.slice(3, 6);
    }

    // Update the input value
    (event.target as HTMLInputElement).value = formattedValue;
  }

  // onInput(event: Event): void {
  //   const inputValue = (event.target as HTMLInputElement).value;

  //   // Remove any non-digit characters
  //   const numericValue = inputValue.replace(/[^0-9]/g, '');

  //   // Extract up to 3 digits before and after the decimal point
  //   const match = numericValue.match(/^(\d{0,3})(\.\d{0,3})?/);

  //   // Combine the digits with a dot
  //   const formattedValue = match ? match[1] + (match[2] || '') : '';

  //   // Update the input value
  //   (event.target as HTMLInputElement).value = formattedValue;
  // }




}
