/*
MODULE : JEWELLERY MANUFACTURING
MENU_SCREEN_NAME : <FILL THE CORRECT MENU NAME>
DEVELOPER : ANANTHA
*/

import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-tree-down',
  templateUrl: './tree-down.component.html',
  styleUrls: ['./tree-down.component.scss']
})
export class TreeDownComponent implements OnInit {
  @ViewChild('overlayprocessCodeSearch') overlayprocessCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaycylinderSearch') overlaycylinderSearch!: MasterSearchComponent;
  @ViewChild('overlayworkerSearch') overlayworkerSearch!: MasterSearchComponent;
  @ViewChild('overlaytoProcessSearch') overlaytoProcessSearch!: MasterSearchComponent;
  @ViewChild('overlayenteredBySearch') overlayenteredBySearch!: MasterSearchComponent;
  @ViewChild('overlaykaratCodeSearch') overlaykaratCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaytoWorkerSearch') overlaytoWorkerSearch!: MasterSearchComponent;
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];


  divisionMS: any = 'ID';
  branchCode?: String;
  yearMonth?: String;
  modalReference: any;
  closeResult: any;
  pageTitle: any;
  currentFilter: any;
  columnhead: any[] = ['Job Code', 'Unique job ID', 'Design Code', 'Gross Wt.', 'Metal Wt', 'Stone Wt', 'RCVD Gross Weight', 'RCVD Metal Weight', 'Process code', 'Worker Code',];
  columnheader: any[] = ['type', 'Location Code', 'Stock Code', 'Sub Stock Code', 'Divcode', 'Gross Weight', 'Party', 'Pure Weiht', 'Balance', 'Pcs', '', '']
  @Input() content!: any;
  tableData: any[] = [];
  currentDate = new Date();
  viewMode: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  isloading: boolean = false;
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];

  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }



  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  cylinderCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Cylinder Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  treeDownFrom: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocNo: [''],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    vocDate: [''],
    processCode: ['', [Validators.required]],
    cylinder: [''],
    tree: [''],
    stoneWt: [''],
    treeNo: [''],
    worker: ['', [Validators.required]],
    convFact: ['', [Validators.required]],
    waxWt: ['', [Validators.required]],
    reqMetal: ['', [Validators.required]],
    toProcess: ['', [Validators.required]],
    enteredBy: [''],
    karatCode: ['', [Validators.required]],
    base: [''],
    recMetal: [''],
    toWorker: ['', [Validators.required]],
    color: ['', [Validators.required]],
    FLAG: [null],
    MAIN_VOCTYPE: ['']
  });


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    // this.treeDownFrom.controls.vocDate.setValue(this.currentDate);
    // this.treeDownFrom.controls.vocType.setValue(this.commonService.getqueryParamVocType());

    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content?.FLAG) {
        this.treeDownFrom.controls.FLAG.setValue(this.content.FLAG)
      }
    } else {
      this.generateVocNo()
      this.setFormValues()
      this.setvoucherTypeMaster()
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

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.treeDownFrom.controls.startdate.setValue(new Date(date));
    }
  }


  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data = {};
    this.tableData.push(data);
  }

  processCodeSelected(e: any) {
    console.log(e);
    this.treeDownFrom.controls.processCode.setValue(e.Process_Code);

  }
  processCode1Selected(e: any) {
    console.log(e);
    this.treeDownFrom.controls.toProcess.setValue(e.Process_Code)

  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.treeDownFrom.controls.worker.setValue(e.WORKER_CODE);

  }
  WorkerCode1Selected(e: any) {
    console.log(e);
    this.treeDownFrom.controls.toWorker.setValue(e.WORKER_CODE);

  }

  userDataSelected(value: any) {
    console.log(value);
    this.treeDownFrom.controls.enteredBy.setValue(value.UsersName);
  }

  cylinderCodeSelected(e: any) {
    console.log(e);
    this.treeDownFrom.controls.cylinder.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    this.treeDownFrom.controls.color.setValue(data.CODE)
  }

  karatCodeSelected(e: any) {
    console.log(e);
    this.treeDownFrom.controls.karatCode.setValue(e['Karat Code']);
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }


  addTableData() {

  }

  deleteTableData() {

  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.treeDownFrom.value
    const vocTypeMaster = this.commonService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.commonService.getqueryParamMainVocType()}/${this.treeDownFrom.value.vocNo}`
    API += `/${this.commonService.branchCode}/${this.commonService.getqueryParamVocType()}`
    API += `/${this.commonService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.commonService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${this.commonService.branchCode}/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.treeDownFrom.controls.vocNo.setValue(resp.newvocno);
        }
      });
  }

  removedata() {
    this.tableData.pop();
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.processCode) == '') {
      this.commonService.toastErrorByMsgId('MSG1680')// processCode CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.worker) == '') {
      this.commonService.toastErrorByMsgId('MSG1951')//"worker cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.convFact) == '') {
      this.commonService.toastErrorByMsgId('MSG1141')//"convFact cannot be empty"
      return true
    }
    // else if (this.commonService.nullToString(form.waxWt) == '') {
    //   this.commonService.toastErrorByMsgId('')//"waxWt cannot be empty"
    //   return true
    // }
    // else if (this.commonService.nullToString(form.reqMetal) == '') {
    //   this.commonService.toastErrorByMsgId('')//"reqMetal cannot be empty"
    //   return true
    // }
    else if (this.commonService.nullToString(form.toProcess) == '') {
      this.commonService.toastErrorByMsgId('MSG1907')//"toProcess cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.karatCode) == '') {
      this.commonService.toastErrorByMsgId('MSG1363')//"karatCode cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.toWorker) == '') {
      this.commonService.toastErrorByMsgId('MSG1912')//"toWorker cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.color) == '') {
      this.commonService.toastErrorByMsgId('MSG1125')//"color cannot be empty"
      return true
    }
    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.submitValidations(this.treeDownFrom.value)) return;
    // if (this.treeDownFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'JobTreeMasterDJ/InsertJobTreeMasterDJ'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.treeDownFrom.value.vocType,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.treeDownFrom.value.vocNo,
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.treeDownFrom.value.vocDate,
      "DOCTIME": "2023-10-21T07:22:12.302Z",
      "SMAN": this.treeDownFrom.value.enteredBy,
      "REMARKS": "",
      "NAVSEQNO": 0,
      "KARAT_CODE": this.treeDownFrom.value.karatCode,
      "COLOR": this.treeDownFrom.value.color,
      "METAL_WT": 0,
      "STONE_WT": this.treeDownFrom.value.stoneWt,
      "BASE_WT": 0,
      "TREE_WT": this.treeDownFrom.value.tree,
      "WAX_WT": this.treeDownFrom.value.waxWt,
      "WORKER_CODE": this.treeDownFrom.value.worker,
      "PROCESS_CODE": this.treeDownFrom.value.processCode,
      "CONV_FACT": this.treeDownFrom.value.convFact,
      "STOCK_CODE": "",
      "RCVD_MET_WT": this.treeDownFrom.value.reqMetal,
      "PRINT_COUNT": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "CYLINDER_CODE": this.treeDownFrom.value.cylinder,
      "FROM_PROCESS_CODE": "",
      "FROM_WORKER_CODE": "",
      "TRANSREF": "",
      "TREE_NO": this.treeDownFrom.value.treeNo,
      "SALESPERSON_CODE": "",
      "PARTIAL_TREE_REF": "",
      "SYSTEM_DATE": "2023-10-21T07:22:12.302Z",
      "JOB_TREEJOB_DETAIL_DJ": [
        {
          "DT_VOCTYPE": "str",
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": 0,
          "JOB_NUMBER": "",
          "UNQ_JOB_ID": "",
          "UNQ_DESIGN_ID": "",
          "GROSS_WT": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "KARAT_CODE": "",
          "RCVD_GROSS_WT": 0,
          "RCVD_METAL_WT": 0,
          "PURITY": 0,
          "PURE_WT": 0,
          "COLOR": "",
          "PCS": 0,
          "STOCK_CODE": "",
          "DESIGN_CODE": "",
          "RCVD_PURE_WT": 0,
          "SIZE_CODE": "",
          "WIDTH_CODE": "",
          "LOSS_QTY": 0,
          "LOSS_PURE_WT": 0,
          "PARTIAL_TREE_REF": "",
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "UNIQUEID": 0,
          "AUTHORIZE_TIME": "2023-10-21T07:22:12.302Z",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": ""
        }
      ],
      "JOB_TREESTOCK_DETAIL_DJ": [
        {
          "DT_VOCTYPE": "str",
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": 0,
          "STOCK_CODE": "",
          "SUB_STOCK_CODE": "",
          "DIVCODE": "",
          "GROSS_WT": 0,
          "PURITY": 0,
          "PURE_WT": 0,
          "TYPE": "",
          "LOCTYPE_CODE": "",
          "PCS": 0,
          "PARTIAL_TREE_REF": "",
          "UNIQUEID": 0
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
              this.treeDownFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    this.treeDownFrom.controls.vocType.setValue(this.commonService.getqueryParamVocType())
    this.treeDownFrom.controls.vocDate.setValue(this.commonService.currentDate)
    this.treeDownFrom.controls.MAIN_VOCTYPE.setValue(
      this.commonService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
  }


  update() {

    if (this.submitValidations(this.treeDownFrom.value)) return;
    // if (this.treeDownFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'JobTreeMasterDJ/UpdateJobTreeMasterDJ/' + this.treeDownFrom.value.branchCode + this.treeDownFrom.value.voctype + this.treeDownFrom.value.vocno + this.treeDownFrom.value.yearMonth;
    let postData = {
      "MID": 0,
      "VOCTYPE": this.treeDownFrom.value.vocType,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.treeDownFrom.value.vocNo,
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.treeDownFrom.value.vocDate,
      "DOCTIME": "2023-10-21T07:22:12.302Z",
      "SMAN": this.treeDownFrom.value.enteredBy,
      "REMARKS": "",
      "NAVSEQNO": 0,
      "KARAT_CODE": this.treeDownFrom.value.karatCode,
      "COLOR": this.treeDownFrom.value.color,
      "METAL_WT": 0,
      "STONE_WT": this.treeDownFrom.value.stoneWt,
      "BASE_WT": 0,
      "TREE_WT": this.treeDownFrom.value.tree,
      "WAX_WT": this.treeDownFrom.value.waxWt,
      "WORKER_CODE": this.treeDownFrom.value.worker,
      "PROCESS_CODE": this.treeDownFrom.value.processCode,
      "CONV_FACT": this.treeDownFrom.value.convFact,
      "STOCK_CODE": "",
      "RCVD_MET_WT": this.treeDownFrom.value.reqMetal,
      "PRINT_COUNT": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "CYLINDER_CODE": this.treeDownFrom.value.cylinder,
      "FROM_PROCESS_CODE": "",
      "FROM_WORKER_CODE": "",
      "TRANSREF": "",
      "TREE_NO": this.treeDownFrom.value.treeNo,
      "SALESPERSON_CODE": "",
      "PARTIAL_TREE_REF": "",
      "SYSTEM_DATE": "2023-10-21T07:22:12.302Z",
      "JOB_TREEJOB_DETAIL_DJ": [
        {
          "DT_VOCTYPE": "str",
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": 0,
          "JOB_NUMBER": "",
          "UNQ_JOB_ID": "",
          "UNQ_DESIGN_ID": "",
          "GROSS_WT": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "KARAT_CODE": "",
          "RCVD_GROSS_WT": 0,
          "RCVD_METAL_WT": 0,
          "PURITY": 0,
          "PURE_WT": 0,
          "COLOR": "",
          "PCS": 0,
          "STOCK_CODE": "",
          "DESIGN_CODE": "",
          "RCVD_PURE_WT": 0,
          "SIZE_CODE": "",
          "WIDTH_CODE": "",
          "LOSS_QTY": 0,
          "LOSS_PURE_WT": 0,
          "PARTIAL_TREE_REF": "",
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "UNIQUEID": 0,
          "AUTHORIZE_TIME": "2023-10-21T07:22:12.302Z",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": ""
        }
      ],
      "JOB_TREESTOCK_DETAIL_DJ": [
        {
          "DT_VOCTYPE": "str",
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": 0,
          "STOCK_CODE": "",
          "SUB_STOCK_CODE": "",
          "DIVCODE": "",
          "GROSS_WT": 0,
          "PURITY": 0,
          "PURE_WT": 0,
          "TYPE": "",
          "LOCTYPE_CODE": "",
          "PCS": 0,
          "PARTIAL_TREE_REF": "",
          "UNIQUEID": 0
        }
      ]
    };

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
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
              this.treeDownFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
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
        let API = 'JobTreeMasterDJ/DeleteJobTreeMasterDJ/' + this.treeDownFrom.value.branchCode + this.treeDownFrom.value.voctype + this.treeDownFrom.value.vocno + this.treeDownFrom.value.yearMonth;
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
                    this.treeDownFrom.reset()
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
                    this.treeDownFrom.reset()
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
    if (this.treeDownFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'processCode':
        this.overlayprocessCodeSearch.showOverlayPanel(event);
        break;
      case 'cylinder':
        this.overlaycylinderSearch.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkerSearch.showOverlayPanel(event);
        break;
      case 'toProcess':
        this.overlaytoProcessSearch.showOverlayPanel(event);
        break;
      case 'enteredBy':
        this.overlayenteredBySearch.showOverlayPanel(event);
        break;
      case 'karatCode':
        this.overlaykaratCodeSearch.showOverlayPanel(event);
        break;
      case 'toWorker':
        this.overlaytoWorkerSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
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
          this.treeDownFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'processCode' || FORMNAME === 'cylinder' || FORMNAME === 'worker' || FORMNAME === 'toProcess' || FORMNAME === 'enteredBy' || FORMNAME === 'karatCode' || FORMNAME === 'toWorker' || FORMNAME === 'color') {
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


}

