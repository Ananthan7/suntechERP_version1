import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-process-transfer-authorisation',
  templateUrl: './process-transfer-authorisation.component.html',
  styleUrls: ['./process-transfer-authorisation.component.scss']
})
export class ProcessTransferAuthorisationComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = [];
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead: any[] = ['No', 'User Name', 'Branch', 'VocType', 'Voc No', 'Voc Date', 'DocTime', 'System Date/Time', 'Job No', 'Form Process', 'To Process', 'From Worker', 'To Worker', 'Job Pcs', 'Gross Wt', 'Loss Qty', 'Authorise']
  columnheadcadSketch: any[] = ['BRANCH_CODE', 'VOCTYPE', 'VOCNO', 'VOCDATE', 'USER_CODE', 'YEARMONTH', 'APPR_TYPE'];
  columnheadAuthorizedVoc: any[] = ['Sno', 'BranchCode', 'Voctype', 'YearMonth', 'Job Number', 'UnqJobId', 'UserId', 'Doc Time', 'AuthorisedDate', 'Idle Time', 'System Name', 'MainVoctype'];
  columnheadHoldingTransfer: any[] = ['No', 'Branch', 'VocType', 'Voc No', 'Voc Date', 'Voc Time', 'Job No', 'From Process', 'To Process', 'From Worker', 'To Worker', 'Job Pcs', 'Gross Wt', 'Loss Qty'];
  private subscriptions: Subscription[] = [];

  processTransferAuthorisationForm: FormGroup = this.formBuilder.group({
    mid:[],
    fromDate: [''],
    toDate: [''],
    branch: [''],
    tranctionType: [''],
    process: [''],
    vocDate: [''],
    vocType: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    console.log(this.branchCode);

    this.yearMonth = this.comService.yearSelected;

    this.setInitialValues()

    if (this.content) {
      this.setFormValues()
    }
  }

  setInitialValues() {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.processTransferAuthorisationForm.controls.vocType.setValue(
      this.comService.getqueryParamVocType()
    )

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.processTransferAuthorisationForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'ProcessAuthorize/InsertProcessAuthorize'
    let postData = {
      "MID":  0,
      "BRANCH_CODE":  this.branchCode,
      "VOCTYPE": this.processTransferAuthorisationForm.value.vocType,
      "VOCNO": 0,
      "YEARMONTH":  this.yearMonth,
      "JOB_NUMBER": "string",
      "UNQ_JOB_ID": "string",
      "USER_ID": "string",
      "SYSTEM_DATE": "2024-01-20T07:10:57.073Z",
      "AUTHORISE": true,
      "REFMID": 0,
      "MAIN_VOCTYPE": "string",
      "SYSTEM_NAME": "string",
      "DOCTIME": "2024-01-20T07:10:57.073Z",
      "SRNO": 0,
      "FRM_PROCESS_CODE": "string",
      "TO_PROCESS_CODE": "string",
      "PCS": 0,
      "GROSSWT": 0,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string"
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
    .subscribe((result) => {
      if (result.response) {
        if (result.status.trim() == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.processTransferAuthorisationForm.reset()
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

  setFormValues() {
    // if(!this.content) return
    // console.log(this.content);
    
    this.processTransferAuthorisationForm.controls.mid.setValue(this.content.MID);

  }

  update() {
   
    let API = 'ProcessAuthorize/UpdateProcessAuthorize/' + this.processTransferAuthorisationForm.value.mid;
    let postData = {
      "MID":  this.processTransferAuthorisationForm.value.mid,
      "BRANCH_CODE":  this.branchCode,
      "VOCTYPE": this.processTransferAuthorisationForm.value.vocType,
      "VOCNO": 0,
      "YEARMONTH":  this.yearMonth,
      "JOB_NUMBER": "string",
      "UNQ_JOB_ID": "string",
      "USER_ID": "string",
      "SYSTEM_DATE": "2024-01-20T07:10:57.073Z",
      "AUTHORISE": true,
      "REFMID": 0,
      "MAIN_VOCTYPE": "string",
      "SYSTEM_NAME": "string",
      "DOCTIME": "2024-01-20T07:10:57.073Z",
      "SRNO": 0,
      "FRM_PROCESS_CODE": "string",
      "TO_PROCESS_CODE": "string",
      "PCS": 0,
      "GROSSWT": 0,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string"
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim()  == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.processTransferAuthorisationForm.reset()
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


  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
