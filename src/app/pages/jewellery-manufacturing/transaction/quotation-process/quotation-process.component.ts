import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
@Component({
  selector: 'app-quotation-process',
  templateUrl: './quotation-process.component.html',
  styleUrls: ['./quotation-process.component.scss']
})
export class QuotationProcessComponent implements OnInit {
  @ViewChild('overlaysalesman') public overlaysalesman!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

    Attachedfile: any[] = [];
  savedAttachments: any[] = [];


  tableData: any[] = [];  
  columnheadItemDetails:any[] = ['  ',];
  divisionMS: any = 'ID';
  @Input() content!: any; 
  viewMode: boolean = false;
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];

  salesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'SalesPerson Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 

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
    this.yearMonth = this.comService.yearSelected;
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
    if(event.key == 'Tab' && event.target.value == ''){
      this.showOverleyPanel(event,form)
    }
  }


  salesCodeSelected(e:any){
    console.log(e);
    this.quotationProcessFrom.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  quotationProcessFrom: FormGroup = this.formBuilder.group({
    voctype:['OOT',[Validators.required]],
    vocdate : [''],
    vocno:['',[Validators.required]],
    documentype:[''],
    salesman:['',[Validators.required]],
    ason:[''],
    docref :[''],
    narration :[''],
  });

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  submitValidations(form: any) {
    if (this.comService.nullToString(form.voctype) == '') {
      this.comService.toastErrorByMsgId('MSG1939')// voctype  CANNOT BE EMPTY
      return true
    }
    else if (this.comService.nullToString(form.vocno) == '') {
      this.comService.toastErrorByMsgId('MSG1940')//"vocno cannot be empty"
      return true
    }
    else if (this.comService.nullToString(form.salesman) == '') {
      this.comService.toastErrorByMsgId('MSG2320')//"salesman cannot be empty"
      return true
    }
    return false;
  }

  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    // if (this.quotationProcessFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    if (this.submitValidations(this.quotationProcessFrom.value)) return;

  
    let API = 'JobQuotProcessMasterDJ/InsertJobQuotProcessMasterDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.quotationProcessFrom.value.voctype || "",
      "VOCNO": this.quotationProcessFrom.value.vocno || "",
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.quotationProcessFrom.value.vocdate  || "",
      "SALESPERSON_CODE": this.quotationProcessFrom.value.salesman || "",
      "SYSTEM_DATE": "2023-10-21T09:34:29.847Z",
      "MACHINEID": "",
      "DOC_REF": this.quotationProcessFrom.value.docref || "",
      "REMARKS": this.quotationProcessFrom.value.narration || "",
      "NAVSEQNO": 0,
      "APPR_CODE": "",
      "APPR_TYPE": 0,
      "TRANS_REF": "",
      "USER_ID": "",
      "QUOT_TYPE": "",
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "dm3",
          "DT_VOCTYPE": "MIS",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "stri",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": "",
          "DQT_PARTYCODE": "",
          "DQT_BRANCH_CODE": "",
          "DQT_VOCTYPE": "",
          "DQT_VOCNO": 0,
          "DQT_YEARMONTH": "",
          "DQT_VOCDATE": "2023-10-21T09:34:29.848Z",
          "DQT_REFMID": 0,
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "DSO_BRANCH_CODE": "",
          "DSO_VOCTYPE": "",
          "DSO_VOCNO": 0,
          "DSO_YEARMONTH": "",
          "DSO_REFMID": 0,
          "DQT_PARTYNAME": "",
          "DQT_SUBLEDGER_CODE": ""
        }
      ],
      "Designs": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "DESIGN_CODE": "",
          "UNQ_DESIGN_ID": "",
          "DELIVERY_DATE": "2023-10-21T09:34:29.848Z",
          "KARAT_CODE": "",
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "PICTURE_PATH": "",
          "DQT_REFMID": 0,
          "DSO_REFMID": 0,
          "STOCK_CODE": "",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": ""
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
                this.quotationProcessFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

 


  update(){
    // if (this.quotationProcessFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    if (this.submitValidations(this.quotationProcessFrom.value)) return;

  
    let API = 'JobQuotProcessMasterDJ/UpdateJobQuotProcessMasterDJ/'+ this.quotationProcessFrom.value.branchCode + this.quotationProcessFrom.value.voctype + this.quotationProcessFrom.value.vocno + this.quotationProcessFrom.value.yearMonth
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.quotationProcessFrom.value.voctype || "",
      "VOCNO": this.quotationProcessFrom.value.vocno || "",
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.quotationProcessFrom.value.vocdate  || "",
      "SALESPERSON_CODE": this.quotationProcessFrom.value.salesman || "",
      "SYSTEM_DATE": "2023-10-21T09:34:29.847Z",
      "MACHINEID": "",
      "DOC_REF": this.quotationProcessFrom.value.docref || "",
      "REMARKS": this.quotationProcessFrom.value.narration || "",
      "NAVSEQNO": 0,
      "APPR_CODE": "",
      "APPR_TYPE": 0,
      "TRANS_REF": "",
      "USER_ID": "",
      "QUOT_TYPE": "",
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": "",
          "DQT_PARTYCODE": "",
          "DQT_BRANCH_CODE": "",
          "DQT_VOCTYPE": "",
          "DQT_VOCNO": 0,
          "DQT_YEARMONTH": "",
          "DQT_VOCDATE": "2023-10-21T09:34:29.848Z",
          "DQT_REFMID": 0,
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "DSO_BRANCH_CODE": "",
          "DSO_VOCTYPE": "",
          "DSO_VOCNO": 0,
          "DSO_YEARMONTH": "",
          "DSO_REFMID": 0,
          "DQT_PARTYNAME": "",
          "DQT_SUBLEDGER_CODE": ""
        }
      ],
      "Designs": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "DESIGN_CODE": "",
          "UNQ_DESIGN_ID": "",
          "DELIVERY_DATE": "2023-10-21T09:34:29.848Z",
          "KARAT_CODE": "",
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "PICTURE_PATH": "",
          "DQT_REFMID": 0,
          "DSO_REFMID": 0,
          "STOCK_CODE": "",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": ""
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
                this.quotationProcessFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

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
        let API = 'JobQuotProcessMasterDJ/DeleteJobQuotProcessMasterDJ/' + this.quotationProcessFrom.value.branchCode + this.quotationProcessFrom.value.voctype + this.quotationProcessFrom.value.vocno + this.quotationProcessFrom.value.yearMonth
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
                    this.quotationProcessFrom.reset()
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
                    this.quotationProcessFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.comService.toastErrorByMsgId('MSG1880');// Not Deleted

            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  showOverleyPanel(event: any, formControlName: string) {
    if(this.quotationProcessFrom.value[formControlName] != '')return
    if (formControlName == 'salesman') {
      this.overlaysalesman.showOverlayPanel(event)
    }
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.comService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.quotationProcessFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'salesman') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }


}
