import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { lookup } from 'dns';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-process-master',
  templateUrl: './process-master.component.html',
  styleUrls: ['./process-master.component.scss']
})
export class ProcessMasterComponent implements OnInit {
  @ViewChild('overlayWIPaccountSearch') overlayWIPaccountSearch!: MasterSearchComponent;
  @ViewChild('overlayapprovalCodeSearch') overlayapprovalCodeSearch!: MasterSearchComponent;
  @ViewChild('overlayapprovalProcessSearch') overlayapprovalProcessSearch!: MasterSearchComponent;
  @ViewChild('overlayrecStockCodeSearch') overlayrecStockCodeSearch!: MasterSearchComponent;
  @ViewChild('overlayadjustaccodeSearch') overlayadjustaccodeSearch!: MasterSearchComponent;
  @ViewChild('overlayjobNoSearch') overlayjobNoSearch!: MasterSearchComponent; //
  @ViewChild('overlaylossaccodeSearch') overlaylossaccodeSearch!: MasterSearchComponent;
  @ViewChild('overlayrecoveaccodeSearch') overlayrecoveaccodeSearch!: MasterSearchComponent;
  @ViewChild('overlaygainaccodeSearch') overlaygainaccodeSearch!: MasterSearchComponent;

  @Input() content!: any;
  viewMode: boolean = false;
  codeMode: boolean = false;
  searchModeLoss: boolean = false;
  searchModeRecov: boolean = false;
  searchModeAllow: boolean = false;
  codeEnable: boolean = true;
  editMode: boolean = true;
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  processTypeList: any[] = [];
  formattedTime: number = 0;
  formattedMaxTime: number = 0;
  islossReadOnly: boolean = true;
  isRecovReadOnly: boolean = true;
  isAlloWGainReadOnly = true;
  editableMode: boolean = false;
  lossDisable: boolean = false;
  // processMasterForm !: FormGroup;
  dele: boolean = false;
  selectedTabIndex = 0;
  lossData: boolean = false;
  recoveryData: boolean = false;
  positionCode: number = 0;

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

  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  value: any;
  searchlookup: boolean = false;
  isloading: boolean = false;

  @ViewChild('codeInput1') codeInput1!: ElementRef;
  @ViewChild('approvalProcessInput') approvalProcessInput!: ElementRef;
  @ViewChild('recStockCode') recStockCode!: ElementRef;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;


  accountMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
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
  LossACCODEData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Loss A/C Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>'' AND account_mode not in ('B','P','R')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  RecovACCODEData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Recovery A/C Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>'' AND account_mode not in ('B','P','R')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  WipACCODEData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 252,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'WipCode Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>'' AND account_mode not in ('B','P','R')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  adjustAccodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'ACCOUNT CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>'' AND account_mode not in ('B','P','R')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  jobNoData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Master',
    SEARCH_VALUE: '',
    WHERECONDITION: `DESIGN_TYPE = 'METAL' AND JOB_CLOSED_ON is null and  Branch_code = '${this.commonService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  maxInputLength: number = 2
  processMasterForm: FormGroup = this.formBuilder.group({
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
    jobNumber: [''],
    recStockCode: [''],
    labour_charge: [''],
    LOSS_ACCODE: [''],
    RECOV_ACCODE: [''],
    GAIN_ACCODE: [''],
    loss: [false, [Validators.required]],
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
    loss_min: [''],
    loss_max: [''],
    standard_start: [''],
    standard_end: [''],
    min_start: [''],
    min_end: [''],
    max: [''],
    ADJUST_ACCODE: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
  }

  ngAfterViewInit() {
    // Focus on the first input
    if (!this.content && this.codeInput1) {
      this.codeInput1.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.lossDisable = true;
    this.searchModeLoss = false;
    this.searchModeRecov = false;
    this.searchModeAllow = false;
    this.setInitialValues()
    this.getProcessTypeOptions();
    this.getMandatoryDetails(); // mandatory checklist called in inital load
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == 'VIEW') {
        this.viewMode = true;
        this.codeMode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.editableMode = true;
        this.codeMode = true;
        this.editMode = true;
        this.codeEnable = false;
        this.onlossChange();
        this.onRecovery();
        this.onAllowGain();
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteProcessMaster()
      }
    } else {
      this.postionCodeValidate();//to get position only for new entry
    }
  }

  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.processMasterForm.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  private setInitialValues() {
    this.setValueWithDecimal('labour_charge', 0, 'AMOUNT')
    this.setValueWithDecimal('trayWeight', 0, 'AMOUNT')
    this.setValueWithDecimal('loss_standard', 0, 'AMOUNT')
    this.setValueWithDecimal('loss_min', 0, 'AMOUNT')
    this.setValueWithDecimal('loss_max', 0, 'AMOUNT')
    this.setValueWithDecimal('standard_end', 0, 'AMOUNT')
    this.setValueWithDecimal('min_end', 0, 'AMOUNT')
    this.processMasterForm.controls.Position.setValue(0)
  }
  private setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.processMasterForm.controls.processCode.setValue(this.content.PROCESS_CODE);
    this.processMasterForm.controls.processDesc.setValue(this.content.DESCRIPTION);

    this.processMasterForm.controls.RepairProcess.setValue(this.onchangeCheckBoxNum(this.content.REPAIR_PROCESS));
    this.processMasterForm.controls.FinalProcess.setValue(this.onchangeCheckBoxNum(this.content.FINAL_PROCESS));
    this.processMasterForm.controls.Setting.setValue(this.onchangeCheckBoxNum(this.content.SETTING_PROCESS));
    this.processMasterForm.controls.LockWeight.setValue(this.onchangeCheckBoxNum(this.content.LOCK_WEIGHT));
    this.processMasterForm.controls.LabProcess.setValue(this.onchangeCheckBoxNum(this.content.LAB_PROCESS));
    this.processMasterForm.controls.WaxProcess.setValue(this.onchangeCheckBoxNum(this.content.WAX_PROCESS));
    this.processMasterForm.controls.recovery.setValue(this.onchangeCheckBoxNum(this.content.RECOV_VAR2));
    this.processMasterForm.controls.DeductPureWeight.setValue(this.onchangeCheckBoxNum(this.content.DEDUCT_PURE_WT));
    this.processMasterForm.controls.MergePices.setValue(this.onchangeCheckBoxNum(this.content.MERGE_BLOCK))


    this.processMasterForm.controls.loss.setValue(this.viewchangeYorN(this.content.ALLOW_LOSS));
    this.processMasterForm.controls.loss_on_gross.setValue(this.viewchangeYorN(this.content.LOSS_ON_GROSS));
    this.processMasterForm.controls.TimeCalculateonProcess.setValue(this.viewchangeYorN(this.content.TIMEON_PROCESS));
    this.processMasterForm.controls.RecoveryProcess.setValue(this.viewchangeYorN(this.content.RECOVERY_PROCESS));
    this.processMasterForm.controls.Metal.setValue(this.viewchangeYorN(this.content.ALLOW_METAL));
    this.processMasterForm.controls.Stone.setValue(this.viewchangeYorN(this.content.ALLOW_STONE));
    this.processMasterForm.controls.Consumable.setValue(this.viewchangeYorN(this.content.ALLOW_CONSUMABLE));
    this.processMasterForm.controls.ApprovalRequired.setValue(this.viewchangeYorN(this.content.APPROVAL_REQUIRED));
    this.processMasterForm.controls.NonQuantity.setValue(this.viewchangeYorN(this.content.NON_QUANTITY));
    this.processMasterForm.controls.RefineryAutoProcess.setValue(this.viewchangeYorN(this.content.DF_REFINERY));
    this.processMasterForm.controls.ApplyAutoLossToRefinery.setValue(this.viewchangeYorN(this.content.AUTO_LOSS));
    this.processMasterForm.controls.HaveTreeNo.setValue(this.viewchangeYorN(this.content.TREE_NO));
    this.processMasterForm.controls.allowGain.setValue(this.viewchangeYorN(this.content.ALLOW_GAIN));
    this.processMasterForm.controls.StoneIncluded.setValue(this.viewchangeYorN(this.content.STONE_INCLUDED));
    this.processMasterForm.controls.AutoTransfer.setValue(this.onchangeCheckBoxNum(this.content.AUTOTRANSFER));

    this.processMasterForm.controls.approvalCode.setValue(this.content.APPR_CODE);
    this.processMasterForm.controls.ADJUST_ACCODE.setValue(this.content.ADJUST_ACCODE);
    // this.processMasterForm.controls.ApplySetting.setValue(this.onchangeCheckBoxNum(this.content.APPLY_SETTING));
    this.processMasterForm.controls.WIPaccount.setValue(this.content.WIP_ACCODE);
    this.processMasterForm.controls.jobNumber.setValue(this.content.JOB_NUMBER);

    this.processMasterForm.controls.Position.setValue(this.content.POSITION);
    this.processMasterForm.controls.recStockCode.setValue(this.content.RECOV_STOCK_CODE);
    this.processMasterForm.controls.approvalProcess.setValue(this.content.APPR_PROCESS);
    // this.processMasterForm.controls.loss_standard.setValue(this.content.STD_LOSS);
    // this.processMasterForm.controls.loss_min.setValue(this.content.MIN_LOSS);
    // this.processMasterForm.controls.loss_max.setValue(this.content.MAX_LOSS);
    // this.processMasterForm.controls.trayWeight.setValue(this.content.TRAY_WT);
    // this.processMasterForm.controls.standard_end.setValue(this.content.RECOV_MIN);
    // this.processMasterForm.controls.min_end.setValue(this.content.RECOV_VAR1);
    this.processMasterForm.controls.RECOV_ACCODE.setValue(this.content.RECOV_ACCODE);
    this.processMasterForm.controls.LOSS_ACCODE.setValue(this.content.LOSS_ACCODE);
    this.processMasterForm.controls.GAIN_ACCODE.setValue(this.content.GAIN_ACCODE);
    // this.processMasterForm.controls.labour_charge.setValue(this.content.LABCHRG_PERHOUR);
    this.setValueWithDecimal('labour_charge', this.content.LABCHRG_PERHOUR, 'AMOUNT')
    this.setValueWithDecimal('trayWeight', this.content.TRAY_WT, 'AMOUNT')
    this.setValueWithDecimal('loss_standard', this.content.STD_LOSS, 'AMOUNT')
    this.setValueWithDecimal('loss_min', this.content.MIN_LOSS, 'AMOUNT')
    this.setValueWithDecimal('loss_max', this.content.MAX_LOSS, 'AMOUNT')
    this.setValueWithDecimal('standard_end', this.content.RECOV_MIN, 'AMOUNT')
    this.setValueWithDecimal('min_end', this.content.RECOV_VAR1, 'AMOUNT')
    // console.log(this.processMasterForm.value, '.....fired.....');

    // this.processMasterForm.controls.stand_time.setValue(this.content.STD_TIME);
    // this.processMasterForm.controls.max_time.setValue(this.content.MAX_TIME);
    // this.formattedMaxTime.controls.setValue(this.content.STD_TIME);
    // this.formattedMaxTime.controls.setValue(this.content.MAX_TIME);

    //this.maxTime = this.content.MAX_TIME;
    this.standTime = this.content.STD_TIME;
    this.maxTime = this.content.MAX_TIME;

    this.formattedTime = this.content.STD_TIME;
    this.formattedMaxTime = this.content.MAX_TIME;
  }

  showMaxContentAlert(): void {
    if (this.processMasterForm.value.processCode == '') {
      this.commonService.toastErrorByMsgId('MSG1680')//Process Code cannot be empty
    }
  }

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);

  }

  jobNumberShow() {
    // console.log(this.commonService.getCompanyParamValue('PROCESSBALANCETOJOB'));
    if (this.commonService.getCompanyParamValue('PROCESSBALANCETOJOB') == 1) {
      return true
    }
    return false
  }

  mandatoryChecklist() {
    // console.log(this.commonService.getCompanyParamValue('COMPACCODE'));
    if (this.commonService.getCompanyParamValue('COMPACCODE') == 'SUNTECH') {
      return true
    } return false
  }

  applySettinglist() {
    // console.log(this.commonService.getCompanyParamValue('DIALABOURCHARGETYPE'));
    if (this.commonService.getCompanyParamValue('DIALABOURCHARGETYPE') == 4) {
      return true
    } return false
  }

  codeEnabled() {
    if (this.processMasterForm.value.processCode == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }

  minValueValidator(control: FormControl) {
    const value = control.value;
    if (value < 5) {
      return { minValue: true };
    }
    return null;
  }

  changedCheckbox(event: any) {
    this.tableData[event.data.SRNO - 1].ISMANDATORY = !event.data.ISMANDATORY;
  }

  ProcessDes() {
    if (this.processMasterForm.value.processDesc == '') {

    }
  }

  /**use: to check code exists in db */
  checkCodeExists(event: any) {
    this.renderer.selectRootElement('#codeDesc').focus();


    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }
    if (event.target.value == '' || this.viewMode) {
      return;
    }
    const API = 'ProcessMasterDj/CheckIfCodeExists/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          this.processMasterForm.controls.processType.markAsTouched();

          Swal.fire({
            title: '',
            text: result.message || 'Process Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.processMasterForm.controls.processCode.setValue('');
            // this.processMasterForm.controls.processCode.focus()
            this.codeEnable = true;
            setTimeout(() => {
              this.renderer.selectRootElement('#code').focus();
            }, 500);

          });
        } else {
          // this.processMasterForm.markAllAsTouched();
        }
      }, err => {
        this.processMasterForm.reset();
      });


    this.subscriptions.push(sub);
  }



  updateStandardTime(duration: any) {
    // this.yourContent.standardTime.totalDays = duration[0] || 0;
    // this.yourContent.standardTime.totalHours = duration[1] || 0;
    // this.yourContent.standardTime.totalMinutes = duration[2] || 0;

    this.formattedTime = duration;
  }

  updateMaximumTime(duration: any) {
    // this.maxContent.maximumTime.totalDays = duration[0] || 0;
    // this.maxContent.maximumTime.totalHours = duration[1] || 0;
    // this.maxContent.maximumTime.totalMinutes = duration[2] || 0;

    // this.formattedMaxTime = `${this.maxContent.maximumTime.totalDays}:${this.maxContent.maximumTime.totalHours}:${this.maxContent.maximumTime.totalMinutes}`;
    this.formattedMaxTime = duration;
    console.log(this.formattedMaxTime);
  }
  validateLossRange() {
    this.lossData = false;
    let form = this.processMasterForm.value
    if (this.commonService.emptyToZero(form.loss_standard) < this.commonService.emptyToZero(form.loss_min)) {
      this.lossData = true;
      this.commonService.toastErrorByMsgId('MSG1438');
      // this.toastr.error('Standard % should be Greater than Minimum %');
    }
    if (this.commonService.emptyToZero(form.loss_standard) > this.commonService.emptyToZero(form.loss_max)) {
      this.lossData = true;
      this.commonService.toastErrorByMsgId('MSG1808');
    }
    if (this.commonService.emptyToZero(form.loss_min) > this.commonService.emptyToZero(form.loss_max)) {
      this.lossData = true;
      this.commonService.toastErrorByMsgId('MSG1810');

      //this.toastr.error('Minimum % should be Lesser than Maximum %');
    }
    return this.lossData
  }

  validateRecoveryRange() {
    this.recoveryData = false;
    const recLoss = this.processMasterForm.value.standard_end;
    const minRec = this.processMasterForm.value.min_end;
    // if (minLoss < 0) {
    //   // Set lossData to false if minLoss is less than 5
    //   this.toastr.error('Standard % should be Greater than Minimum % and Lesser than Maximum %');
    // }

    if (this.commonService.emptyToZero(recLoss) < this.commonService.emptyToZero(minRec)) {
      this.recoveryData = true;
      this.commonService.toastErrorByMsgId('MSG1438');
      // this.toastr.error('Standard % should be Greater than Minimum %');

    }
    return this.recoveryData
  }

  // USE: get select options Process TypeMaster
  private getProcessTypeOptions(): void {
    let API = 'ComboFilter/PROCESS TYPE MASTER';
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.processTypeList = result.response;
        this.processTypeList.sort((a: any, b: any) => a.SRNO - b.SRNO)
        this.processTypeList.forEach((item: any, index: number) => {
          item.SRNO = index
        })
        if (this.content?.FLAG == 'VIEW' || this.content?.FLAG == 'EDIT') {
          let type = this.processTypeList.filter((item: any) => item.SRNO == this.content.PROCESS_TYPE)
          if (type.length > 0) this.processMasterForm.controls.processType.setValue(type[0].SRNO);
        }
      }
    });
    this.subscriptions.push(Sub)
  }


  onchangeCheckBox(e: any) {
    // console.log(e);

    if (e == true) {
      return true;
    } else {
      return false;
    }
  }

  onchangeCheckBoxNum(e: any) {
    // console.log(e);

    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }
  viewchangeYorN(e: any) {
    // console.log(e);

    if (e == 'Y') {
      return true;
    } else {
      return false;
    }
  }


  submitValidations(form: any) {
    if (form.loss == true && this.validateLossRange()) {
      return true;
    }
    if (form.recovery == true && this.validateRecoveryRange()) {
      return true;
    }

    if (form.ApprovalRequired == true) {
      if (this.commonService.nullToString(form.approvalProcess) == '') {
        this.commonService.toastErrorByMsgId('MSG81513 ');//Approval Process must be Required
        return true;
      }
      if (this.commonService.nullToString(form.approvalCode) == '') {
        this.commonService.toastErrorByMsgId('MSG81513 ');//Approval Process must be Required
        return true;
      }
    }

    // if (form.ApprovalRequired == true && this.commonService.nullToString(form.approvalProcess) == '') {
    //   this.processMasterForm.controls.approvalProcess.setValidators(Validators.required)
    //   this.approvalProcessInput.nativeElement.focus();
    //   this.commonService.toastErrorByMsgId('MSG81513 ');//Approval Process must be Required
    //   return true;
    // }

    if (form.TimeCalculateonProcess == true && this.formattedTime == 0 && this.formattedMaxTime == 0) {
      this.commonService.toastErrorByMsgId('MSG81516');//Standard Time  and  Maximum Time must be Required
      return true;
    }

    if (this.formattedTime > this.formattedMaxTime) {
      this.commonService.toastErrorByMsgId('MSG7901');//Standard Time  should not be Greater than Maximum Time
      return true;
    }

    if (form.loss != true) {
      this.commonService.toastErrorByMsgId('MSG1395');//loss cannot be empty
      return true;
    }

    if (form.loss == true) {
      if (this.commonService.emptyToZero(form.loss_standard) == 0) {
        this.commonService.toastErrorByMsgId('MSG1395');//loss cannot be empty
        return true;
      }
      else if (this.commonService.emptyToZero(form.loss_min) == 0) {
        this.commonService.toastErrorByMsgId('MSG1395');
        return true;
      }
      else if (this.commonService.emptyToZero(form.loss_max) == 0) {
        this.commonService.toastErrorByMsgId('MSG1395');
        return true;
      }
      else if (form.LOSS_ACCODE == '') {
        this.commonService.toastErrorByMsgId('MSG1395');
        return true;
      }
    }

    if (form.recovery == true) {
      if (this.commonService.emptyToZero(form.standard_end) == 0) {
        this.commonService.toastErrorByMsgId('MSG81365');// Recovery Minimum % Cannot be Zero
        return true;
      }
      else if (form.min_end == '') {
        this.commonService.toastErrorByMsgId('MSG81365');
        return true;
      }
      // else if (form.RECOV_ACCODE == '') {
      // this.commonService.toastErrorByMsgId('Recovery Account Code Cannot be Empty');
      //   return true;
      // }
    }

    if (form.allowGain == true) {
      if (form.GAIN_ACCODE == '') {
        this.commonService.toastErrorByMsgId('MSG3865');//Gain Account Code Cannot be Empty
        return true;
      }
    }

    if (form.RecoveryProcess == true && form.recovery == false) {
      this.commonService.toastErrorByMsgId('MSG81365');//Recovery details Must be Filled
      return true
    }
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (form.processCode == nameRegexp) {
      this.commonService.toastErrorByMsgId('MSG81525');//Process Code cannot be empty
      return true;
    }

    if (!form.processCode) {
      this.commonService.toastErrorByMsgId('MSG1680');//Process Code cannot be empty
      return true;
    }
    if (!form.processDesc) {
      this.commonService.toastErrorByMsgId('MSG1193');//Description cannot be empty
      return true;
    }
    // if (form.processType == null) {
    //   this.commonService.toastErrorByMsgId('Process Type cannot be empty');
    //   return true;
    // }
    if (this.commonService.nullToString(form.WIPaccount) == '') {
      this.commonService.toastErrorByMsgId('MSG2497');
      return true;
    }


    return false;
  }
  setPostData() {
    let form = this.processMasterForm.value
    let AutopostingFlag = this.commonService.getAutopostingFlag()
    console.log(form.processType);
    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "PROCESS_CODE": form.processCode?.toUpperCase(),
      "DESCRIPTION": form.processDesc?.toUpperCase(),
      "STD_TIME": this.commonService.emptyToZero(this.formattedTime),
      "MAX_TIME": this.commonService.emptyToZero(this.formattedMaxTime),
      "LOSS_ACCODE": form.LOSS_ACCODE,
      "WIP_ACCODE": form.WIPaccount,
      "CURRENCY_CODE": "",
      "PROCESS_TYPE": this.commonService.nullToString(form.processType),
      "UNIT": "",
      "NO_OF_UNITS": 0,
      "UNIT_RATE": 0,
      "LAB_ACCODE": "",
      "LAST_NO": "",
      "REPAIR_PROCESS": this.onchangeCheckBoxNum(form.RepairProcess),
      "FINAL_PROCESS": this.onchangeCheckBoxNum(form.FinalProcess),
      "GAIN_ACCODE": form.GAIN_ACCODE,
      "TRAY_WT": this.commonService.emptyToZero(form.trayWeight),
      "SETTING_PROCESS": this.onchangeCheckBoxNum(form.Setting),
      "POINTS": 0,
      "LOCK_WEIGHT": this.onchangeCheckBoxNum(form.LockWeight),
      "AUTOTRANSFER": this.onchangeCheckBoxNum(form.AutoTransfer),
      "MASTER_WEIGHT": 0,
      "MERGE_BLOCK": this.onchangeCheckBoxNum(form.MergePices),
      "LAB_PROCESS": this.onchangeCheckBoxNum(form.LabProcess),
      "WAX_PROCESS": this.onchangeCheckBoxNum(form.WaxProcess),
      "STD_LOSS_QTY": 0,
      "POSITION": this.commonService.emptyToZero(form.Position),
      "RECOV_MIN": form.standard_end || 0,
      "RECOV_ACCODE": form.RECOV_ACCODE,
      "RECOV_STOCK_CODE": form.recStockCode || "",
      "RECOV_VAR1": form.min_end || 0,
      "RECOV_VAR2": this.onchangeCheckBoxNum(form.recovery),
      "DEDUCT_PURE_WT": this.onchangeCheckBoxNum(form.DeductPureWeight),
      "APPR_PROCESS": form.approvalProcess || "",
      "APPR_CODE": this.commonService.nullToString(form.approvalCode.toUpperCase()),
      "ALLOW_GAIN": this.onchangeCheckBox(form.allowGain),
      "STD_GAIN": 0,
      "MIN_GAIN": 0,
      "MAX_GAIN": 0,
      "ALLOW_LOSS": this.commonService.Null2BitValue(form.loss),
      "STD_LOSS": form.loss_standard || 0,
      "MIN_LOSS": form.loss_min || 0,
      "MAX_LOSS": form.loss_max || 0,
      "LOSS_ON_GROSS": this.onchangeCheckBox(form.loss_on_gross),
      "JOB_NUMBER": this.commonService.nullToString(form.jobNumber),
      "LABCHRG_PERHOUR": this.commonService.emptyToZero(form.labour_charge),
      "APPLY_SETTING": form.ApplySetting,
      "TIMEON_PROCESS": this.onchangeCheckBox(form.TimeCalculateonProcess),
      "STONE_INCLUDED": this.onchangeCheckBox(form.StoneIncluded),
      "RECOVERY_PROCESS": this.onchangeCheckBox(form.RecoveryProcess),
      "ALLOW_METAL": this.onchangeCheckBox(form.Metal),
      "ALLOW_STONE": this.onchangeCheckBox(form.Stone),
      "ALLOW_CONSUMABLE": this.onchangeCheckBox(form.Consumable),
      "APPROVAL_REQUIRED": this.onchangeCheckBox(form.ApprovalRequired),
      "NON_QUANTITY": this.onchangeCheckBox(form.NonQuantity),
      "DF_REFINERY": this.onchangeCheckBox(form.RefineryAutoProcess),
      "AUTO_LOSS": this.onchangeCheckBox(form.ApplyAutoLossToRefinery),
      "ISACCUPDT": AutopostingFlag,
      "TREE_NO": this.onchangeCheckBox(form.HaveTreeNo),
      "ADJUST_ACCODE": this.commonService.nullToString(form.ADJUST_ACCODE),
      "Details": this.setDetailArray()
    }
  }
  // detail array setting
  private setDetailArray() {
    let data: any = []
    this.tableData.forEach((element: any, index: any) => {
      if (element.ISMANDATORY) {
        data.push({
          "PROCESS_CODE": this.processMasterForm.value.processCode?.toUpperCase() || '',
          "SRNO": index + 1,
          "MAND_CODE": this.commonService.nullToString(element.MAND_CODE),
          "MAND_DESCRIPTION": this.commonService.nullToString(element.MAND_DESCRIPTION)
        })
      }
    });
    return data
  }
  formSubmit() {
    // Skip submission if in VIEW mode
    if (this.content && this.content.FLAG == 'VIEW') return;
    // Run validations before submission
    if (this.submitValidations(this.processMasterForm.value)) return;
    // Handle EDIT mode
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateProcessMaster();
      return;
    }
    // Confirm adding all users
    this.UsersConfirmation().then((firstResult) => {
      if (firstResult.isConfirmed) { // If confirmed, proceed with next confirm
        // Confirm adding all sequences
        this.sequencesConfirmation().then((secondResult) => {
          this.saveFinalData()
        });
      } else {
        this.saveFinalData()
      }
    });
  }
  // API call for INSERT
  saveFinalData() {
    let API = 'ProcessMasterDj/InsertProcessMasterDJ';
    let postData = this.setPostData();

    this.commonService.showSnackBarMsg('MSG81447');
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        // Handle success from second confirm
        this.isloading = false;
        if (result.status.trim() === "Success") {
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
        } else {
          this.showErrorDialog(result.message || 'Error please try again');
        }

      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG3577');
      });
    // Push the subscription to the array to manage unsubscriptions if needed
    this.subscriptions.push(Sub);
  }
  UsersConfirmation(): Promise<any> {
    return Swal.fire({
      title: 'Do you want to add all Users?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#2a5298 ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      cancelButtonText: 'Cancel'
    });
  }

  sequencesConfirmation(): Promise<any> {
    return Swal.fire({
      title: 'Do you want to add all sequences?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#2a5298',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      cancelButtonText: 'Cancel'
    });
  }


  /**USE: delete worker master from row */
  deleteProcessMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let API = 'ProcessMasterDj/DeleteProcessMasterDJ/' + this.content?.PROCESS_CODE;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status === "Success") {
                this.showSuccessDialog('Deleted Successfully');
              } else {
                this.showErrorDialog(result.message || 'Error please try again');
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err));
        this.subscriptions.push(Sub);
      }
    });
  }

  updateProcessMaster() {
    if (this.submitValidations(this.processMasterForm.value)) return;
    let form = this.processMasterForm.value;
    let API = 'ProcessMasterDj/UpdateProcessMasterDJ/' + form.processCode
    let postData = this.setPostData()
    this.commonService.showSnackBarMsg('Loading')
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        if (result) {
          if (result.status === "Success") {
            console.log(this.commonService.getMsgByID('MSG2443'));
            this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
          } else {
            this.showErrorDialog(result.message || 'Error please try again');
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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

  ApprovalCodeSelected(e: any) {
    console.log(e)
    if (this.checkCode()) return;

    this.processMasterForm.controls.approvalCode.setValue(e.APPR_CODE);
  }

  checkCode(): boolean {
    if (this.processMasterForm.value.processCode == '') {
      this.commonService.toastErrorByMsgId('MSG1680');//Process Code cannot be empty
      return true
    }
    return false
  }
  ApprovalProcessSelected(e: any) {
    if (this.checkCode()) return

    if (this.processMasterForm.value.processCode == e.Process_Code) {
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      return;
    }

    this.processMasterForm.controls.approvalProcess.setValue(e.Process_Code);
  }

  StockProcesSelected(e: any) {
    if (this.checkCode()) return
    this.processMasterForm.controls.recStockCode.setValue(e.STOCK_CODE);
  }
  adjustAccodeSelected(e: any) {
    if (this.checkCode()) return
    this.processMasterForm.controls.ADJUST_ACCODE.setValue(e.ACCODE);
  }
  jobNoSelected(e: any) {
    if (this.checkCode()) return
    this.processMasterForm.controls.jobNumber.setValue(e.job_number);
  }


  getMandatoryDetails() {
    let FLAG = 'ADD'
    switch (this.content?.FLAG) {
      case 'EDIT':
        FLAG = 'EDIT'
        break;
      case 'VIEW':
        FLAG = 'LOAD'
        break;
      default:
        FLAG = 'ADD'
        break;
    }
    let postData = {
      "SPID": "161",
      "parameter": {
        "strProcess": this.processMasterForm.value.processCode,
        "strAction": this.commonService.nullToString(FLAG),
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.tableData = result.dynamicData[0] || []
          // this.componentmasterForm.controls.jobno.setValue(result.dynamicData[0][0].JOB_NO)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')
      })
    this.subscriptions.push(Sub)
  }




  postionCodeValidate(event?: any) {

    let postData = {
      "SPID": "141",
      "parameter": {
      }
    }
    // if(this.alloyMastereForm.value.price5code.length > 0) return
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()

        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0];
          this.processMasterForm.controls.Position.setValue(data[0].POSITION);
          this.positionCode = data[0].POSITION;
        } else {
          this.processMasterForm.controls.Position.setValue('')
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1747')
      })
    this.subscriptions.push(Sub)
  }

  postionCodeValidates() {
    // console.log(this.positionCode);
    let curr_value = this.processMasterForm.controls.Position.value;
    // console.log(curr_value);
    // console.log(typeof(curr_value));
    // console.log(typeof(this.positionCode));
    if (this.positionCode > curr_value) {
      Swal.fire({
        icon: "error",
        text: "This Details Already Exists"
      });
    }
  }

  /** checking for same account code selection */
  private isSameAccountCodeSelected(accountCode: any, formControlName: string): boolean {
    console.log(this.processMasterForm.value, 'this.processMasterForm.value');
    let flag = false;
    switch (formControlName) {
      case 'WIPaccount':
        flag = (
          this.processMasterForm.value.LOSS_ACCODE === accountCode ||
          this.processMasterForm.value.RECOV_ACCODE === accountCode ||
          this.processMasterForm.value.GAIN_ACCODE === accountCode
        );
        return flag
      case 'LOSS_ACCODE':
        flag = (
          this.processMasterForm.value.RECOV_ACCODE === accountCode ||
          this.processMasterForm.value.GAIN_ACCODE === accountCode ||
          this.processMasterForm.value.WIPaccount === accountCode
        );
        return flag
      case 'RECOV_ACCODE':
        flag = (
          this.processMasterForm.value.LOSS_ACCODE === accountCode ||
          this.processMasterForm.value.GAIN_ACCODE === accountCode ||
          this.processMasterForm.value.WIPaccount === accountCode
        );
        return flag
      case 'GAIN_ACCODE':
        flag = (
          this.processMasterForm.value.LOSS_ACCODE === accountCode ||
          this.processMasterForm.value.RECOV_ACCODE === accountCode ||
          this.processMasterForm.value.WIPaccount === accountCode
        );
        return flag
      case 'WIPaccount':
        flag = (
          this.processMasterForm.value.WIPaccount === accountCode
        );
        return flag
      default:
        flag = (
          this.processMasterForm.value.LOSS_ACCODE === accountCode ||
          this.processMasterForm.value.RECOV_ACCODE === accountCode ||
          this.processMasterForm.value.GAIN_ACCODE === accountCode ||
          this.processMasterForm.value.WIPaccount === accountCode
        );
        return flag;
    }

  }
  WIPaccountSelected(event: any) {
    if (!event || !event.ACCODE) {
      console.error('Invalid event or ACCODE not found');
      return;
    }
    if (this.checkCode()) return
    if (this.isSameAccountCodeSelected(event.ACCODE, 'WIPaccount')) {
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      this.processMasterForm.controls.WIPaccount.setValue('');
      return;
    }
    this.processMasterForm.controls.WIPaccount.setValue(event.ACCODE);
    console.log(event);
    this.wipAccodeValidateSP();
    // this.accodeValidateSP(event, this.WipACCODEData, 'WIPaccount')
  }

  LOSS_ACCODESelected(e: any) {
    if (this.isSameAccountCodeSelected(e.ACCODE, 'LOSS_ACCODE')) {
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      this.processMasterForm.controls.LOSS_ACCODE.setValue('');
      return;
    }
    this.processMasterForm.controls.LOSS_ACCODE.setValue(e.ACCODE);
    // this.accodeValidateSP(e.ACCODE, this.LossACCODEData, 'LOSS_ACCODE')
    this.lossAccodeValidateSP();

  }

  RECOV_ACCODESelected(e: any) {
    if (this.isSameAccountCodeSelected(e.ACCODE, 'RECOV_ACCODE')) {
      this.processMasterForm.controls.RECOV_ACCODE.setValue('');
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      return;
    }
    this.processMasterForm.controls.RECOV_ACCODE.setValue(e.ACCODE);
    // this.accodeValidateSP(e.ACCODE, this.RecovACCODEData, 'RECOV_ACCODE')
    this.recovAccodeValidateSP();
  }

  GAIN_ACCODESelected(e: any) {
    if (this.isSameAccountCodeSelected(e.ACCODE, 'GAIN_ACCODE')) {
      this.processMasterForm.controls.GAIN_ACCODE.setValue('');
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      return;
    }
    this.processMasterForm.controls.GAIN_ACCODE.setValue(e.ACCODE);
    // this.accodeValidateSP(e.ACCODE, this.WipACCODEData, 'GAIN_ACCODE');
    this.gainAccodeValidateSP();
  }

  /**use: common accode change validation */
  checkAccodeSelected(event: any, LOOKUPDATA: MasterSearchModel, formname: string) {
    // LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '') {
      this.processMasterForm.controls[formname].setValue('');
      return
    }

    // this.accodeValidateSP(checkValue, LOOKUPDATA, formname)
    this.wipAccodeValidateSP();
    // this.lossAccodeValidateSP();
    if (this.isSameAccountCodeSelected(event.target.value, formname)) {
      this.processMasterForm.controls[formname].setValue('');
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      //this.commonService.toastErrorByMsgId('Accode already selected');
      return;
    }
  }


  losscheckAccodeSelected(event: any, LOOKUPDATA: MasterSearchModel, formname: string) {
    console.log(event.target.value);

    var checkValue = event.target.value;
    console.log(checkValue);


    // LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '') {
      this.processMasterForm.controls[formname].setValue('');
      return
    }

    // this.accodeValidateSP(checkValue, LOOKUPDATA, formname)
    this.lossAccodeValidateSP();


    if (this.isSameAccountCodeSelected(event.target.value, formname)) {
      this.processMasterForm.controls[formname].setValue('');
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      //this.commonService.toastErrorByMsgId('Accode already selected');
      return;
    }
  }

  recovcheckAccodeSelected(event: any, LOOKUPDATA: MasterSearchModel, formname: string) {
    console.log(event.target.value);

    var checkValue = event.target.value;
    console.log(checkValue);


    // LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '') {
      this.processMasterForm.controls[formname].setValue('');
      return
    }

    // this.accodeValidateSP(checkValue, LOOKUPDATA, formname)
    this.recovAccodeValidateSP();



    if (this.isSameAccountCodeSelected(event.target.value, formname)) {
      this.processMasterForm.controls[formname].setValue('');
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      //this.commonService.toastErrorByMsgId('Accode already selected');
      return;
    }
  }

  gaincheckAccodeSelected(event: any, LOOKUPDATA: MasterSearchModel, formname: string) {
    console.log(event.target.value);

    var checkValue = event.target.value;
    console.log(checkValue);


    // LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '') {
      this.processMasterForm.controls[formname].setValue('');
      return
    }

    // this.accodeValidateSP(checkValue, LOOKUPDATA, formname)
    this.gainAccodeValidateSP();



    if (this.isSameAccountCodeSelected(event.target.value, formname)) {
      this.processMasterForm.controls[formname].setValue('');
      this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
      //this.commonService.toastErrorByMsgId('Accode already selected');
      return;
    }
  }

  /**use: sp call to validate same accode to avoid same accode selection */
  accodeValidateSP(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    // console.log('This');

    // console.log(event.target.value);
    // LOOKUPDATA.SEARCH_VALUE = event.target.value
    let values = event.target.value;
    if (values == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${values}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        console.log('this api working');
        // this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length > 0) {
          this.commonService.toastErrorByMsgId('MSG1121')//Accode already exists in other process
          this.processMasterForm.controls[FORMNAME].setValue('')
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }


  wipAccodeValidateSP() {
    let postData = {
      "SPID": "0176",
      "parameter": {
        "strType": "WIP",
        "Adjust_AC": "",
        "Wip_AC": this.processMasterForm.value.WIPaccount,
        "Process_Code": "",
        "Loss_AC": "",
        "RecAccode": "",
        "Gain_AC": "",
      }
    };
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        try {
          if (result.status === "Success" && Array.isArray(result.dynamicData) && result.dynamicData[0]?.[0]) {
            const responseData = result.dynamicData[0][0];
            if (responseData.WIP_ACCODE === this.processMasterForm.value.WIPaccount) {
              Swal.fire({
                title: '',
                text: `Account code Already Exists in process ${responseData.PROCESS_CODE} - ${responseData.DESCRIPTION}`,
                icon: 'warning',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then(() => {
                this.processMasterForm.controls.WIPaccount.setValue('');
                this.renderer.selectRootElement('#code').focus();
              });
            }
          } else {
            console.error("Unexpected response structure: ", result);
          }
        } catch (error) {
          console.error("Error processing response: ", error);
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451');
      });

    this.subscriptions.push(Sub);
  }



  lossAccodeValidateSP() {
    let postData = {
      "SPID": "0176",
      "parameter": {
        "strType": "LOSS",
        "Adjust_AC": "",
        "Wip_AC": "",
        "Process_Code": "",
        "Loss_AC": this.processMasterForm.value.LOSS_ACCODE,
        "RecAccode": "",
        "Gain_AC": "",
      }
    };
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          const responseData = result.dynamicData[0][0];
          console.log(responseData);
          console.log(responseData.LOSS_ACCODE);
          if (responseData.LOSS_ACCODE == this.processMasterForm.value.LOSS_ACCODE) {
            Swal.fire({
              title: '',
              text: 'Account code Already Exists in process  ' + responseData.PROCESS_CODE + '-' + responseData.DESCRIPTION,
              icon: 'warning',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.processMasterForm.controls.LOSS_ACCODE.setValue('');
              this.renderer.selectRootElement('#code').focus();
            });
          }
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451');
      });

    this.subscriptions.push(Sub);
  }

  recovAccodeValidateSP() {
    let postData = {
      "SPID": "0176",
      "parameter": {
        "strType": "RECOVERY",
        "Adjust_AC": "",
        "Wip_AC": "",
        "Process_Code": "",
        "Loss_AC": "",
        "RecAccode": this.processMasterForm.value.RECOV_ACCODE,
        "Gain_AC": "",
      }
    };
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          const responseData = result.dynamicData[0][0];
          console.log(responseData);
          console.log(responseData.RECOV_ACCODE);
          if (responseData.RECOV_ACCODE == this.processMasterForm.value.RECOV_ACCODE) {
            Swal.fire({
              title: '',
              text: 'Account code Already Exists in process  ' + responseData.PROCESS_CODE + '-' + responseData.DESCRIPTION,
              icon: 'warning',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.processMasterForm.controls.RECOV_ACCODE.setValue('');
              this.renderer.selectRootElement('#code').focus();
            });
          }
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451');
      });

    this.subscriptions.push(Sub);
  }

  gainAccodeValidateSP() {
    let postData = {
      "SPID": "0176",
      "parameter": {
        "strType": "GAIN",
        "Adjust_AC": "",
        "Wip_AC": "",
        "Process_Code": "",
        "Loss_AC": "",
        "RecAccode": "",
        "Gain_AC": this.processMasterForm.value.GAIN_ACCODE,
      }
    };
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          const responseData = result.dynamicData[0][0];
          console.log(responseData);
          console.log(responseData.GAIN_ACCODE);
          if (responseData.GAIN_ACCODE == this.processMasterForm.value.GAIN_ACCODE) {
            Swal.fire({
              title: '',
              text: 'Account code Already Exists in process  ' + responseData.PROCESS_CODE + '-' + responseData.DESCRIPTION,
              icon: 'warning',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.processMasterForm.controls.GAIN_ACCODE.setValue('');
              this.renderer.selectRootElement('#code').focus();
            });
          }
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451');
      });

    this.subscriptions.push(Sub);
  }


  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode) return
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
          this.processMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  // /**use: focusout fn for input valate */
  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, formControlName: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '') {
  //     this.processMasterForm.controls[formControlName].setValue('');
  //     return
  //   }
  //   if (this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION?`AND ${LOOKUPDATA.WHERECONDITION}`:''}`
  //   }
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       // this.isDisableSaveBtn = false;
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.processMasterForm.controls[formControlName].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found')
  //     })
  //   this.subscriptions.push(Sub)
  // }
  getAccodeField(formControlName: string, value: string) {
    let form = this.processMasterForm.value
    switch (formControlName) {
      case 'LOSS_ACCODE':
        return true
      case 'RECOV_ACCODE':
        return true
      case 'GAIN_ACCODE':
        return true
      case 'WIPaccount':
        return true
      default:
        return false
    }
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

  submitTwoConfrim(): Promise<any> {
    return Swal.fire({
      title: 'Process Master',
      text: "Do you want to add all Users?",
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#f39c12',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      cancelButtonText: 'Cancel'
    });
  }

  submitThreeConfrim(): Promise<any> {
    return Swal.fire({
      title: 'Process Master',
      text: "Do you want to add all sequences?",
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#f39c12',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      cancelButtonText: 'Cancel'
    });
  }


  showSuccessDialog(message: string): void {
    console.log('sucess Icons');

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

  afterSave(value: any) {
    if (value) {
      this.processMasterForm.reset();
      this.tableData = [];
      this.close('reloadMainGrid');
    }
  }

  onlossChange() {
    this.lossDisable = false;
    // if(this.processMasterForm.value.LOSS_ACCODE == ''){
    //   this.toastr.error('Account Code Cannot be Empty');
    // }
    if (this.processMasterForm.value.loss == true) {
      this.processMasterForm.get('LOSS_ACCODE')?.setValidators(Validators.required);
      // this.processMasterForm.get('RECOV_ACCODE')?.setValidators(Validators.required);
      // this.processMasterForm.get('GAIN_ACCODE')?.setValidators(Validators.required);
      // this.processMasterForm.get('LOSS_ACCODE')?.setValidators(Validators.required);
      this.islossReadOnly = false;
      this.searchModeLoss = true;
    } else {
      this.islossReadOnly = true;
      this.lossDisable = true;
      this.processMasterForm.controls.loss_on_gross.setValue('')
      this.processMasterForm.controls.recovery.setValue('')
      this.searchModeLoss = false;

      this.processMasterForm.get('LOSS_ACCODE')?.clearValidators();
      this.setValueWithDecimal('loss_standard', 0, 'AMOUNT')
      this.setValueWithDecimal('loss_min', 0, 'AMOUNT')
      this.setValueWithDecimal('loss_max', 0, 'AMOUNT')
      this.setValueWithDecimal('standard_end', 0, 'AMOUNT')
      this.setValueWithDecimal('min_end', 0, 'AMOUNT')
      this.processMasterForm.controls.LOSS_ACCODE.setValue('');
      this.processMasterForm.controls.RECOV_ACCODE.setValue('');
    }



    //  this.processMasterForm.controls.min_end.setValue(0);

    // Update the validation status after setting or clearing validators
    //  this.processMasterForm.get('LOSS_ACCODE')?.updateValueAndValidity();

  }



  onRecovery() {

    // if(this.processMasterForm.value.RECOV_ACCODE == ''){
    //   this.toastr.error('Account Code Cannot be Empty');
    // }


    if (this.processMasterForm.value.recovery == true) {
      this.processMasterForm.get('RECOV_ACCODE')?.setValidators(Validators.required);
      this.isRecovReadOnly = false;
      this.searchModeRecov = true;
    }
    else {
      this.isRecovReadOnly = true;
      this.searchModeRecov = false;
      this.processMasterForm.get('RECOV_ACCODE')?.clearValidators();
      this.setValueWithDecimal('min_end', 0, 'AMOUNT')
      this.setValueWithDecimal('standard_end', 0, 'AMOUNT')
      this.processMasterForm.controls.RECOV_ACCODE.setValue('');
    }



    // this.processMasterForm.controls.standard_end.setValue('');


    // console.log(event);

  }

  onAllowGain() {

    // if(this.processMasterForm.value.GAIN_ACCODE == ''){
    //   this.toastr.error('Account Code Cannot be Empty');
    // }

    if (this.processMasterForm.value.allowGain == true) {
      this.processMasterForm.get('GAIN_ACCODE')?.setValidators(Validators.required);
      this.isAlloWGainReadOnly = false;
      this.searchModeAllow = true;
    }
    else {
      this.isAlloWGainReadOnly = true;
      this.searchModeAllow = false;
      this.processMasterForm.get('GAIN_ACCODE')?.clearValidators();
      this.processMasterForm.controls.GAIN_ACCODE.setValue('');
    }



  }

  onRecovStockCode(event: any) {
    if (this.processMasterForm.value.RecoveryProcess == true) {
      if (this.processMasterForm.controls.recStockCode.value == '') {
        this.renderer.selectRootElement('#recStockCode').focus();
        this.processMasterForm.get('recStockCode')?.setValidators(Validators.required);
      }
    }
    else {
      this.processMasterForm.get('recStockCode')?.clearValidators();
    }
  }


  approvalSelect(event: any) {
    if (this.processMasterForm.value.ApprovalRequired == true) {
      if (this.processMasterForm.controls.approvalCode.value == '') {
        this.renderer.selectRootElement('#approvalCode').focus();
        this.renderer.selectRootElement('#approvalProcess').focus();
        this.processMasterForm.get('approvalCode')?.setValidators(Validators.required);
        this.processMasterForm.get('approvalProcess')?.setValidators(Validators.required);
        this.processMasterForm.controls.approvalCode.setValue('');
        this.processMasterForm.controls.approvalProcess.setValue('');
      }
    }
    else {
      this.processMasterForm.get('approvalCode')?.clearValidators();
      this.processMasterForm.get('approvalProcess')?.clearValidators();
    }
    console.log(event);

  }


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
  showAlertIfCodeIsEmpty(): void {
    if (this.processMasterForm.value.processCode == '') {
      this.commonService.toastErrorByMsgId('MSG1680')//Process Code cannot be empty
    }
  }

  lookupKeyPress(event: any, form?: any) {
    this.showAlertIfCodeIsEmpty()
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'WIPaccount':
        this.overlayWIPaccountSearch.showOverlayPanel(event);
        break;
      case 'approvalCode':
        this.overlayapprovalCodeSearch.showOverlayPanel(event);
        break;
      case 'approvalProcess':
        this.overlayapprovalProcessSearch.showOverlayPanel(event);
        break;
      case 'recStockCode':
        this.overlayrecStockCodeSearch.showOverlayPanel(event);
        break;
      case 'ADJUST_ACCODE':
        this.overlayadjustaccodeSearch.showOverlayPanel(event);
        break;
      case 'JOB_NO':
        this.overlayjobNoSearch.showOverlayPanel(event);
        break;
      case 'LOSS_ACCODE':
        this.overlaylossaccodeSearch.showOverlayPanel(event);//
        break;
      case 'RECOV_ACCODE':
        this.overlayrecoveaccodeSearch.showOverlayPanel(event);
        break;
      case 'GAIN_ACCODE':
        this.overlaygainaccodeSearch.showOverlayPanel(event);
        break;
      default:
        // Optional: handle the case where formControlName does not match any case
        console.warn(`No overlay found for form control: ${formControlName}`);
    }
  }


  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'WIPaccount') {
  //     this.overlayWIPaccountSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'approvalCode') {
  //     this.overlayapprovalCodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'approvalProcess') {
  //     this.overlayapprovalProcessSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'recStockCode') {
  //     this.overlayrecStockCodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'ADJUST_ACCODE') {
  //     this.overlayadjustaccodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'LOSS_ACCODE') {
  //     this.overlaylossaccodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'RECOV_ACCODE') {
  //     this.overlayrecoveaccodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'GAIN_ACCODE') {
  //     this.overlaygainaccodeSearch.showOverlayPanel(event)
  //   }
  // }
}

