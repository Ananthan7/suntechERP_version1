import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
@Component({
  selector: 'app-job-allocation',
  templateUrl: './job-allocation.component.html',
  styleUrls: ['./job-allocation.component.scss']
})


export class JobAllocationComponent implements OnInit {
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;


  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  @ViewChild('overlayuserName') overlayuserName!: MasterSearchComponent;
  gridData: any[] = [];
  @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;
  branchCode?: String;
  yearMonth?: String;
  @Input() content!: any;
  viewMode: boolean = false;
  tableData: any[] = [];
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;

  columnheadItemDetails: any[] = ['Design', 'Order. No', 'Process', 'Worker', 'Doc. Attachment', 'Std. Time', 'Pirority', 'Customer', 'Job Number', 'Unq. Job. Id', 'Pcs'];
  columnheadOthers: any[] = ['Design', 'Order No', 'Process', 'Worker', 'Doc Attachment', 'Std Time', 'Priority', 'Customer', 'Job Number', 'Unq Job Id', 'Pcs']
  divisionMS: any = 'ID';
  currentDate = new Date();
  private subscriptions: Subscription[] = [];

  userNameCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User Name',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) {
    this.dataGrid = {} as DxDataGridComponent;

  }

  jobalocationFrom: FormGroup = this.formBuilder.group({
    vocType: ['', [Validators.required]],
    vocNum: [1, [Validators.required]],
    vocDate: [new Date()],
    userName: [''],
    date: [new Date()],
    remarks: [''],
    job: ['']
  });

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.jobalocationFrom.controls.vocType.setValue(this.commonService.getqueryParamVocType());


    console.log(this.content);
    console.log(Object.keys(this.content));

    if (Object.keys(this.content)?.length != 0) {
      this.setFormValues()
    }

  }

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
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }

  
  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  setFormValues() {
    if (!this.content) return
    this.jobalocationFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.jobalocationFrom.controls.vocno.setValue(this.content.VOCNO)
    this.jobalocationFrom.controls.vocDate.setValue(this.content.VOCDATE)
    this.jobalocationFrom.controls.vocDate.setValue(this.content.DOCTIME)
    this.jobalocationFrom.controls.vocDate.setValue(this.content.REMARKS)

    console.log(this.content);
  }


  userNameCodeSelected(e: any) {
    console.log(e);
    this.jobalocationFrom.controls.userName.setValue(e.UsersName);
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.vocType) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// vocType  CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.vocNum) == '') {
      this.commonService.toastErrorByMsgId('MSG1940')//"vocNum cannot be empty"
      return true
    }
    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.jobalocationFrom.value)) return;

    let API = 'JobAllocationMaster/InsertJobAllocationMaster'
    let postData = {
      "VOCTYPE": this.jobalocationFrom.value.vocType || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": 0,
      "VOCDATE": this.jobalocationFrom.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2024-01-18T12:26:27.661Z",
      "SMAN": "string",
      "REMARKS": this.jobalocationFrom.value.remarks || "",
      "NAVSEQNO": 0,
      "MID": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "SYSTEM_DATE": "2024-01-18T10:29:30.742Z",
      "HTUSERNAME": "string",
      "jobAllocationDetails": [
        {
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "string",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "SLNO": 0,
          "JOB_NUMBER": "string",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "DESIGN_CODE": "string",
          "UNQ_DESIGN_ID": "string",
          "ACCODE": "string",
          "TOT_PCS": 0,
          "PCS": 0,
          "RATEFC": 0,
          "RATELC": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "LOCTYPE_CODE": "string",
          "DEL_DATE": "2024-01-18T10:29:30.742Z"
        }
      ]
    };

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.jobalocationFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update() {
    if (this.submitValidations(this.jobalocationFrom.value)) return;

    let API = 'JobAllocationMaster/UpdateJobAllocationMaster/' + this.jobalocationFrom.value.branchCode + this.jobalocationFrom.value.vocType + this.jobalocationFrom.value.yearMonth + this.jobalocationFrom.value.vocNo;
    let postData =
    {
      "VOCTYPE": this.jobalocationFrom.value.vocType || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": 0,
      "VOCDATE": this.jobalocationFrom.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2024-01-18T12:26:27.661Z",
      "SMAN": "string",
      "REMARKS": this.jobalocationFrom.value.remarks || "",
      "NAVSEQNO": 0,
      "MID": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "SYSTEM_DATE": "2024-01-18T10:29:30.742Z",
      "HTUSERNAME": "string",
      "jobAllocationDetails": [
        {
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "string",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "SLNO": 0,
          "JOB_NUMBER": "string",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "DESIGN_CODE": "string",
          "UNQ_DESIGN_ID": "string",
          "ACCODE": "string",
          "TOT_PCS": 0,
          "PCS": 0,
          "RATEFC": 0,
          "RATELC": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "LOCTYPE_CODE": "string",
          "DEL_DATE": "2024-01-18T10:29:30.742Z"
        }
      ]
    };

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.jobalocationFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content.VOCTYPE) {
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
        let API = 'JobAllocationMaster/DeleteJobAllocationeMaster/' + this.jobalocationFrom.value.branchCode + this.jobalocationFrom.value.voctype + this.jobalocationFrom.value.vocno + this.jobalocationFrom.value.yearMonth;
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
                    this.jobalocationFrom.reset()
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
                    this.jobalocationFrom.reset()
                    this.tableData = []
                    this.close()
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
  showOverleyPanel(event: any, formControlName: string) {
    if (this.jobalocationFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'userName':
        this.overlayuserName.showOverlayPanel(event);
        break;
      default:
    }
  }

  
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
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.jobalocationFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'userName') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }


  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }


  refreshGridData() {

    // console.log(this.jobalocationFrom.value.job);

    if (this.jobalocationFrom.value.job == 1) {
      const apiUrl = 'DaimondSalesOrder/GetDaimondSalesOrderList/DMCC/DSO/2023';

      let sub: Subscription = this.dataService.getDynamicAPI(apiUrl).subscribe((resp: any) => {
        if (resp.status == 'Success') {
          this.gridData = resp.response;
        }

      });
    } else {
      this.gridData = [];
    }
  }

}