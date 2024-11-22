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
  selector: 'app-casting-tree-up',
  templateUrl: './casting-tree-up.component.html',
  styleUrls: ['./casting-tree-up.component.scss']
})
export class CastingTreeUpComponent implements OnInit {
  @ViewChild('overlayProcesscode') overlayProcesscode!: MasterSearchComponent;
  @ViewChild('overlaycylinder') overlaycylinder!: MasterSearchComponent;
  @ViewChild('overlayworker') overlayworker!: MasterSearchComponent;
  @ViewChild('overlayenteredBy') overlayenteredBy!: MasterSearchComponent;
  @ViewChild('overlaykaratCode') overlaykaratCode!: MasterSearchComponent;
  @ViewChild('overlaycolor') overlaycolor!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  selectedTabIndex = 0;
  divisionMS: any = 'ID';
  branchCode?: String;
  yearMonth?: String;
  modalReference: any;
  closeResult: any;
  pageTitle: any;
  currentFilter: any;
  currentDate = new Date();
  viewMode: boolean = false;
  isSaved: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  isloading: boolean = false;
  // columnhead:any[] = ['Job Code','Unique job ID','Design Code','Gross Weight','Metal Weight','Stone Weight','RCVD Gross Weight','Karat Code','Purity','Pure Weight','Metal Color','RCVD Pure Weight','Stock Code','Pieces','Job Pcs','Loss Wt','Loss Pure'];
  // columnheader : any[] = ['Type','Location Code','Stock Code','Sub Stock Code','Divcode','Gross Weight','Party','Pure Weiht','Balance','Pcs','','']

  @Input() content!: any;

  tableData: any[] = [];
  tableData1: any[] = [];

  userName = localStorage.getItem('username');

  private subscriptions: Subscription[] = [];


  salesmanCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman type',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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
    LOAD_ONCLICK: true,
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
    LOAD_ONCLICK: true,
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
    LOAD_ONCLICK: true,
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
    LOAD_ONCLICK: true,
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
    LOAD_ONCLICK: true,
  }


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { 
   this.setInitialValues()
  }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.castingTreeUpFrom.controls.vocType.setValue(this.commonService.getqueryParamVocType())

    
    if (this.content && this.content.FLAG == 'EDIT') {
      this.setFormValues()
      this.setAllInitialValues()
    }
    if (this.content && this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.isSaved = true;
      this.setFormValues()
      this.setAllInitialValues()
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

  setInitialValues(){
  this.castingTreeUpFrom.controls.recMetal.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  this.castingTreeUpFrom.controls.stoneWt.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  this.castingTreeUpFrom.controls.tree.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  this.castingTreeUpFrom.controls.waxWt.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  this.castingTreeUpFrom.controls.reqMetal.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  this.castingTreeUpFrom.controls.base.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  this.castingTreeUpFrom.controls.vocDate.setValue(this.commonService.currentDate)
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
      this.castingTreeUpFrom.controls.startdate.setValue(new Date(date));
    }
  }
  setAllInitialValues() {
    if (!this.content) return
    let API = `JobTreeMasterDJ/GetJobTreeMasterWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
            data.JOB_TREEJOB_DETAIL_DJ.forEach((element: any) => {
            this.tableData.push({
              SRNO: element.SRNO,
              Job_Code: element.JOB_CODE,
              Unique_job_ID: element.UNIQUEID,
              Design_Code: element.DESIGN_CODE,
              Gross_Weight: element.GROSS_WT,
              Metal_Weight: element.METAL_WT,
              Stone_Weight: element.STONE_WT,
              RCVD_Gross_Weight: element.RCVD_GROSS_WT,
              Karat_Code: element.KARAT_CODE,
              Purity: element.PURITY,
              Pure_Weight: element.PURE_WT,
              Metal_Color: element.COLOR,
              RCVD_Pure_Weight: element.RCVD_PURE_WT,
              Stock_Code: element.STOCK_CODE,
              Pieces: element.PCS,
              Job_Pcs: element.JOB_PCS,
              Loss_Wt: element.LOSSWT,
              Loss_Pure: element.LOSS_PURE_WT

            })
          });
          data.JOB_TREESTOCK_DETAIL_DJ.forEach((element: any) => {
            this.tableData1.push({
              SRNO:element.SRNO,
              Stock_Code: element.STOCK_CODE,
              Sub_Stock_Code:element.SUB_STOCK_CODE,
              Divcode: element.DIVCODE,
              Gross_Weight:element.GROSS_WT,
              Pure_Weiht: element.PURE_WT,
              Type:element.TYPE,
              Location_Code: element.LOCTYPE_CODE,
              Pcs: element.PCS,
             
            })
          });
          this.castingTreeUpFrom.controls.vocNo.setValue(data.VOCNO)
          this.castingTreeUpFrom.controls.vocDate.setValue(data.VOCDATE)
          this.castingTreeUpFrom.controls.vocType.setValue(data.VOCTYPE)
          this.castingTreeUpFrom.controls.processCode.setValue(data.PROCESS_CODE)
          this.castingTreeUpFrom.controls.cylinder.setValue(data.CYLINDER_CODE)
          this.castingTreeUpFrom.controls.worker.setValue(data.WORKER_CODE)
          this.castingTreeUpFrom.controls.karatCode.setValue(data.KARAT_CODE)
          this.castingTreeUpFrom.controls.stoneWt.setValue(data.STONE_WT)
          this.castingTreeUpFrom.controls.color.setValue(data.COLOR)
          this.castingTreeUpFrom.controls.treeNo.setValue(data.TREE_NO)
          this.castingTreeUpFrom.controls.tree.setValue(data.TREE_WT)
          this.castingTreeUpFrom.controls.enteredBy.setValue(data.SMAN)
          this.castingTreeUpFrom.controls.convFact.setValue(data.CONV_FACT)
          this.castingTreeUpFrom.controls.waxWt.setValue(data.WAX_WT)
          this.castingTreeUpFrom.controls.reqMetal.setValue(data.CONV_FACT)
          this.castingTreeUpFrom.controls.toProcess.setValue(data.PROCESS_CODE)
          this.castingTreeUpFrom.controls.base.setValue(data.BASE_WT)
          this.castingTreeUpFrom.controls.recMetal.setValue(data.RCVD_MET_WT)
          this.castingTreeUpFrom.controls.toWorker.setValue(data.WORKER_CODE)
   


        

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return


    // this.dataService.getDynamicAPI('JobTreeMasterDJ/GetJobTreeMasterDJ'+this.content.APPR_CODE).subscribe((data) => {
    //   if (data.status == 'Success') {

    //     this.tableData = data.response.approvalDetails;


  }
  //   });

  // }


  castingTreeUpFrom: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocNo: ['1', [Validators.required]],
    vocDate: [''],
    processCode: [''],
    cylinder: [''],
    tree: ['',[Validators.required]],
    stoneWt: ['',[Validators.required]],
    treeNo: ['',[Validators.required]],
    worker: [''],
    convFact: [''],
    waxWt: ['',[Validators.required]],
    reqMetal: [''],
    toProcess: [''],
    enteredBy: [''],
    karatCode: [''],
    base: [''],
    recMetal: [''],
    toWorker: ['',[Validators.required]],
    color: [''],
  });

  adddata() {
    console.log(this.tableData,'eee')
    let length = this.tableData.length;
    let srno = length + 1;
    let data = {
      "UNIQUEID": 12345,
      "APPR_CODE": "string",
      "SRNO": srno,
      "Job_Code": 0,
      'Unique_job_ID': 0,
      'Design_Code': 0,
      'Gross_Weight': 0,
      'Metal_Weight': 0,
      'Stone_Weight': 0,
      'RCVD_Gross_Weight': 0,
      'Karat_Code': 0,
      'Purity': 0,
      'Pure_Weight': 0,
      'Metal_Color': 0,
      'RCVD_Pure_Weight': 0,
      'Stock_Code': 0,
      'Pieces': 0,
      'Job_Pcs': 0,
      'Loss_Wt': 0,
      'Loss_Pure': 0,
      "EMAIL_ID": 0,
    };
    this.tableData.push(data);
    
  }

  adddatas() {
    console.log(this.tableData1,'console')
    let length1 = this.tableData1.length;
    let srno1 = length1 + 1;
    let data1 = {
      "UNIQUEID": 12345,
      "APPR_CODE": "",
      "SRNO": srno1,
      'Type': this.castingTreeUpFrom.value.Type,
      'Location_Code':this.castingTreeUpFrom.value.Location_Code,
      'Stock_Code': this.castingTreeUpFrom.value.Stock_Code,
      'Sub_Stock_Code': this.castingTreeUpFrom.value.Sub_Stock_Code,
      'Divcode': this.castingTreeUpFrom.value.Divcode,
      'Gross_Weight': "",
      'Party': this.castingTreeUpFrom.value.Party,
      'Pure_Weiht': this.castingTreeUpFrom.value.Pure_Weiht,
      'Balance': this.castingTreeUpFrom.value.Balance,
      'Pcs': this.castingTreeUpFrom.value.Pcs,

    };

    this.tableData1.push(data1);
  }

  processCodeSelected(e: any) {
    console.log(e);
    this.castingTreeUpFrom.controls.processCode.setValue(e.Process_Code);
    this.castingTreeUpFrom.controls.toProcess.setValue(e.Process_Code)
  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.castingTreeUpFrom.controls.worker.setValue(e.WORKER_CODE);
    this.castingTreeUpFrom.controls.toWorker.setValue(e.WORKER_CODE);
  }

  salesmanCodeSelected(e: any) {
    console.log(e);
    this.castingTreeUpFrom.controls.enteredBy.setValue(e.SALESPERSON_CODE);
  }

  cylinderCodeSelected(e: any) {
    console.log(e);
    this.castingTreeUpFrom.controls.cylinder.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    this.castingTreeUpFrom.controls.color.setValue(data.CODE)
  }


  karatCodeSelected(e: any) {
    console.log(e);
    this.castingTreeUpFrom.controls.karatCode.setValue(e['Karat Code']);
  }
  lookupKeyPress(event: any, form?: any) {
    if(event.key == 'Tab' && event.target.value == ''){
      this.showOverleyPanel(event,form)
    }
  }
  addTableData() {
    // let data = {
    //   "Job_Code": "str",
    //   "Unique_job_ID": "",
    //   "Design_Code": "",
    //   "Gross_Weight": "",
    //   "Metal_Weight": 0,
    //   "Stone_Weight": 0,
    //   "RCVD_Gross_Weight":0,
    //   "Karat Code": "",
    //   "Purity": 0,
    //   "Pure_Weight": 0,
    //   "Metal_Color": 0,
    //   "RCVD_Pure_Weight": "",
    //   "Stock_Code": "",
    //   "Pieces": 0,
    //   "Job_Pcs": "",
    //   "Loss_Wt": 0,
    //   "Loss_Pure": 0,
    // }
    let length = this.tableData.length;
    let srno = length + 1;
    let data = {};
    this.tableData.push(data);
  }

  deleteTableData() {
    this.tableData.pop();
  }

  removedata() {
    this.tableData.pop();
  }

  removedatas() {
    this.tableData.pop();
  }
  setDetaills() {
    let Details: any = []
    this.tableData.forEach((Element: any) => {
      Details.push(
        {
          "DT_VOCTYPE": this.castingTreeUpFrom.value.vocType,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": Element.SRNO,
          "JOB_NUMBER": this.commonService.nullToString(Element.Job_Code),
          "UNQ_JOB_ID": this.commonService.nullToString(Element.Unique_job_ID),
          "UNQ_DESIGN_ID": this.commonService.nullToString(Element.Design_Code),
          "GROSS_WT": Element.Gross_Weight,
          "METAL_WT": Element.Metal_Weight,
          "STONE_WT": Element.Stone_Weight,
          "KARAT_CODE": this.commonService.nullToString(Element.Karat_Code),
          "RCVD_GROSS_WT": Element.RCVD_Gross_Weight,
          "RCVD_METAL_WT": Element.RCVD_METAL_WT,
          "PURITY": Element.Purity,
          "PURE_WT": Element.Pure_Weight,
          "COLOR": this.commonService.nullToString(Element.Metal_Color),
          "PCS": 0,
          "STOCK_CODE": this.commonService.nullToString(Element.Stock_Code),
          "DESIGN_CODE": "",
          "RCVD_PURE_WT": 0,
          "SIZE_CODE": "",
          "WIDTH_CODE": "",
          "LOSS_QTY": 0,
          "LOSS_PURE_WT": Element.Loss_Pure,
          "PARTIAL_TREE_REF": "",
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "UNIQUEID": 0,
          "AUTHORIZE_TIME": "2023-10-21T07:22:12.302Z",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": "",
          "D_REMARKS": "string",
          "ENGRAVE_TEXT": "string",
          "IS_AUTHORISE": true,
          "JOB_PCS": Element.Job_Pcs
        }
      )

    }
    )
    return Details
  }

  componentSet() {
    let Components: any = []
    this.tableData1.forEach((item: any) => {
      Components.push(
        {
          "DT_VOCTYPE": this.castingTreeUpFrom.value.vocType,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": item.SRNO,
          "STOCK_CODE": item.stockCode,
          "SUB_STOCK_CODE": item.Sub_Stock_Code,
          "DIVCODE": item.Divcode,
          "GROSS_WT": item.Gross_Weight,
          "PURITY": item.purity,
          "PURE_WT": item.Pure_Weiht,
          "TYPE": item.Type,
          "LOCTYPE_CODE": item.Location_Code,
          "PCS": item.Pcs,
          "PARTIAL_TREE_REF": item.PARTIAL_TREE_REF,
          "UNIQUEID": item.Unique_job_ID
        }

      )
    }
    )
    return Components
  }


  submitValidations(form: any) {
    if (this.commonService.nullToString(form.vocNo) == '') {
      this.commonService.toastErrorByMsgId('MSG3661')// vocNo code CANNOT BE EMPTY
      return true
    }
    // else if (this.commonService.nullToString(form.tree) == '') {
    //   this.commonService.toastErrorByMsgId('')//"tree cannot be empty"
    //   return true
    // }
    else if (this.commonService.nullToString(form.stoneWt) == '') {
      this.commonService.toastErrorByMsgId('MSG3746')//"stoneWt cannot be empty"
      return true
    }
    // else if (this.commonService.nullToString(form.treeNo) == '') {
    //   this.commonService.toastErrorByMsgId('')//"treeNo cannot be empty"
    //   return true
    // }
    // else if (this.commonService.nullToString(form.waxWt) == '') {
    //   this.commonService.toastErrorByMsgId('')//"waxWt cannot be empty"
    //   return true
    // }
    else if (this.commonService.nullToString(form.toWorker) == '') {
      this.commonService.toastErrorByMsgId('MSG1912')//"toWorker cannot be empty"
      return true
    }
    return false;
  }


  formSubmit() {
    if (this.content && this.content.FLAG == 'VIEW') {
      return
    }
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.castingTreeUpFrom.value)) return;

    let API = 'JobTreeMasterDJ/InsertJobTreeMasterDJ'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.commonService.nullToString(this.castingTreeUpFrom.value.vocType),
      "BRANCH_CODE": this.branchCode,
      "VOCNO": 0,
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.commonService.formatDateTime(this.currentDate),
      "DOCTIME": "2023-10-21T07:22:12.302Z",
      "SMAN": this.castingTreeUpFrom.value.enteredBy,
      "REMARKS": "",
      "NAVSEQNO": 0,
      "KARAT_CODE": this.castingTreeUpFrom.value.karatCode,
      "COLOR": this.castingTreeUpFrom.value.color,
      "METAL_WT": 0,
      "STONE_WT": this.castingTreeUpFrom.value.stoneWt,
      "BASE_WT": 0,
      "TREE_WT": this.commonService.emptyToZero(this.castingTreeUpFrom.value.tree),
      "WAX_WT": this.commonService.emptyToZero(this.castingTreeUpFrom.value.waxWt),
      "WORKER_CODE": this.castingTreeUpFrom.value.worker,
      "PROCESS_CODE": this.castingTreeUpFrom.value.processCode,
      "CONV_FACT": this.commonService.emptyToZero(this.castingTreeUpFrom.value.CONV_FACT),
      "STOCK_CODE": "",
      "RCVD_MET_WT": this.castingTreeUpFrom.value.recMetal,
      "PRINT_COUNT": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "CYLINDER_CODE": this.castingTreeUpFrom.value.cylinder,
      "FROM_PROCESS_CODE": "",
      "FROM_WORKER_CODE": "",
      "TRANSREF": "",
      "TREE_NO": this.castingTreeUpFrom.value.treeNo,
      "SALESPERSON_CODE": "",
      "PARTIAL_TREE_REF": "",
      "SYSTEM_DATE": "2023-10-21T07:22:12.302Z",
      "JOB_TREEJOB_DETAIL_DJ": this.setDetaills(),
      "JOB_TREESTOCK_DETAIL_DJ": this.componentSet(),

    }

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
                this.castingTreeUpFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  //  setFormValues() {
  //    if(!this.content) return
  //    console.log(this.content);
  //  }


  update() {
 
    if (this.submitValidations(this.castingTreeUpFrom.value)) return;

    let API = `JobTreeMasterDJ/UpdateJobTreeMasterDJ/${this.branchCode}/${this.castingTreeUpFrom.value.vocType}/${this.castingTreeUpFrom.value.vocNo}/${this.commonService.yearSelected}`;
    let postData = {
      "MID": 0,
      "VOCTYPE": this.castingTreeUpFrom.value.vocType,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.castingTreeUpFrom.value.vocNo,
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.commonService.formatDateTime(this.currentDate),
      "DOCTIME": "2023-10-21T07:22:12.302Z",
      "SMAN": this.castingTreeUpFrom.value.enteredBy,
      "REMARKS": "",
      "NAVSEQNO": 0,
      "KARAT_CODE": this.castingTreeUpFrom.value.karatCode,
      "COLOR": this.castingTreeUpFrom.value.color,
      "METAL_WT": 0,
      "STONE_WT": this.commonService.emptyToZero(this.castingTreeUpFrom.value.stoneWt),
      "BASE_WT": this.castingTreeUpFrom.value.base,
      "TREE_WT": this.commonService.emptyToZero(this.castingTreeUpFrom.value.tree),
      "WAX_WT": this.castingTreeUpFrom.value.waxWt,
      "WORKER_CODE": this.castingTreeUpFrom.value.worker,
      "PROCESS_CODE": this.castingTreeUpFrom.value.processCode,
      "CONV_FACT": this.castingTreeUpFrom.value.convFact,
      "STOCK_CODE": "",
      "RCVD_MET_WT": this.commonService.nullToString(this.castingTreeUpFrom.value.reqMetal),
      "PRINT_COUNT": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "CYLINDER_CODE": this.castingTreeUpFrom.value.cylinder,
      "FROM_PROCESS_CODE": "",
      "FROM_WORKER_CODE": "",
      "TRANSREF": "",
      "TREE_NO": this.castingTreeUpFrom.value.treeNo,
      "SALESPERSON_CODE": "",
      "PARTIAL_TREE_REF": "",
      "SYSTEM_DATE": "2023-10-21T07:22:12.302Z",
      "JOB_TREEJOB_DETAIL_DJ": this.setDetaills(),
       
      "JOB_TREESTOCK_DETAIL_DJ":this.componentSet(),
        
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
                this.castingTreeUpFrom.reset()
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
        let API = 'JobTreeMasterDJ/DeleteJobTreeMasterDJ/' + 
        this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
        this.content.VOCNO + '/' + this.content.YEARMONTH
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
                    this.castingTreeUpFrom.reset()
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
                    this.castingTreeUpFrom.reset()
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

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

  calculateReqMetal(event: any) {
    console.log("Input changed: ", event.target.value);
    var convFact = event.target.value;
    var waxWt = this.castingTreeUpFrom.value.waxWt;
    this.castingTreeUpFrom.controls.reqMetal.setValue((convFact * waxWt).toFixed(3));
   
   
}
calculateWaxMetal(event: any){
  console.log("Input changed: ", event.target.value);
  var waxWt = event.target.value;
  var convFact = this.castingTreeUpFrom.value.convFact;
  this.castingTreeUpFrom.controls.reqMetal.setValue((convFact * waxWt).toFixed(3));
  
}
calculateTreeMode(event: any){
  console.log("output changed: ", event.target.value);
  var tree = parseFloat(event.target.value); // Parse as float or integer
  var base = this.castingTreeUpFrom.value.base;
 

  this.castingTreeUpFrom.controls.waxWt.setValue(tree - base);
}

calcualteBaseMode(event: any) {
  console.log("output changed1: ", event.target.value);
  var base = event.target.value;
  var tree = this.castingTreeUpFrom.value.tree;
  this.castingTreeUpFrom.controls.waxWt.setValue(tree - base);
}
showOverleyPanel(event: any, formControlName: string) {
  if (this.castingTreeUpFrom.value[formControlName] != '') return;

  switch (formControlName) {
    case 'processCode':
      this.overlayProcesscode.showOverlayPanel(event);
      break;
    case 'cylinder':
      this.overlaycylinder.showOverlayPanel(event);
      break;
    case 'worker':
      this.overlayworker.showOverlayPanel(event);
      break;
    case 'enteredBy':
      this.overlayenteredBy.showOverlayPanel(event);
      break;
    case 'karatCode':
      this.overlaykaratCode.showOverlayPanel(event);
      break;
    case 'color':
      this.overlaycolor.showOverlayPanel(event);
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
        this.castingTreeUpFrom.controls[FORMNAME].setValue('')
        LOOKUPDATA.SEARCH_VALUE = ''
        if (FORMNAME === 'processCode' || FORMNAME === 'cylinder' || FORMNAME === 'worker' || FORMNAME === 'enteredBy'|| FORMNAME === 'karatCode'|| FORMNAME === 'color') {
          this.showOverleyPanel(event, FORMNAME);
        }
        return
      }

    }, err => {
      this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
    })
  this.subscriptions.push(Sub)
}
}