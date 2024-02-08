import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-casting-tree-up',
  templateUrl: './casting-tree-up.component.html',
  styleUrls: ['./casting-tree-up.component.scss']
})
export class CastingTreeUpComponent implements OnInit {
  selectedTabIndex = 0;
  divisionMS: any = 'ID';
  branchCode?: String;
  yearMonth?: String;
  modalReference:any;
  closeResult:any;
  pageTitle: any;
  currentFilter: any;
  currentDate = new Date();
  // columnhead:any[] = ['Job Code','Unique job ID','Design Code','Gross Weight','Metal Weight','Stone Weight','RCVD Gross Weight','Karat Code','Purity','Pure Weight','Metal Color','RCVD Pure Weight','Stock Code','Pieces','Job Pcs','Loss Wt','Loss Pure'];
  // columnheader : any[] = ['Type','Location Code','Stock Code','Sub Stock Code','Divcode','Gross Weight','Party','Pure Weiht','Balance','Pcs','','']

   @Input() content!: any;

   tableData: any[] = [];
   tableData1: any[] = [];

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
     private comService: CommonServiceService,
   ) { }
 
   ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.castingTreeUpFrom.controls.vocType.setValue(this.commonService.getqueryParamVocType())

    console.log(this.content);
    if(this.content){
      this.setFormValues()
      // this.setAllInitialValues()
    }
   }
 
   close(data?: any) {
     //TODO reset forms and data before closing
     this.activeModal.close(data);
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
    console.log(this.tableData,'working')
    if (!this.content) return
    let API = `JobTreeMasterDJ/GetJobTreeMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          data.Details.forEach((element:any) => {
            this.tableData.push({
              SRNO: element.SRNO,
              Job_Code:element.JOB_CODE,
              Unique_job_ID:element.UNIQUEID,
              Design_Code:element.DESIGN_CODE,
              Gross_Weight:element.GROSS_WT,
              Metal_Weight:element.METAL_WT,
              Stone_Weight:element.STONE_WT,
              RCVD_Gross_Weight:element.RCVD_GROSS_WT,
              Karat_Code:element.KARAT_CODE,
              Purity:element.PURITY,
              Pure_Weight:element.PURE_WT,
              Metal_Color: element.COLOR,
              RCVD_Pure_Weight:element.RCVD_PURE_WT,
              Stock_Code:element.STOCK_CODE,
              Pieces:element.PCS,
              Job_Pcs:element.JOB_PCS,
              Loss_Wt:element.LOSSWT,
              Loss_Pure:element.LOSS_PURE_WT

            })
          });
          this.castingTreeUpFrom.controls.vocNo.setValue(data.VOCNO)
          this.castingTreeUpFrom.controls.vocType.setValue(data.VOCTYPE)
          this.castingTreeUpFrom.controls.processCode.setValue(data.PROCESS_CODE)
          this.castingTreeUpFrom.controls.cylinder.setValue(data.CYLINDER_CODE)
          this.castingTreeUpFrom.controls.worker.setValue(data.WORKER)
          this.castingTreeUpFrom.controls.toProcess.setValue(data.TO_PROCESS_CODE)
          this.castingTreeUpFrom.controls.toWorker.setValue(data.TO_WORKER_CODE)
          this.castingTreeUpFrom.controls.color.setValue(data.COLOR)
         
          
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if(!this.content) return
   

    // this.dataService.getDynamicAPI('JobTreeMasterDJ/GetJobTreeMasterDJ'+this.content.APPR_CODE).subscribe((data) => {
    //   if (data.status == 'Success') {

    //     this.tableData = data.response.approvalDetails;
       

      }
  //   });
   
  // }
 
 
   castingTreeUpFrom: FormGroup = this.formBuilder.group({
    vocType:[''],
    vocNo:['1',[Validators.required]],
    vocDate:[''],
    processCode:[''],
    cylinder:[''],
    tree:[''],
    stoneWt:[''],
    treeNo:[''],
    worker:[''],
    convFact:[''],
    waxWt:[''],
    reqMetal:[''],
    toProcess : [''],
    enteredBy : [''],
    karatCode : [''],
    base : [''],
    recMetal :[''],
    toWorker : [''],
    color : [''],
   });
 
   adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "UNIQUEID": 12345,
      "APPR_CODE": "string",
      "SRNO": srno,
      "Job_Code": this.castingTreeUpFrom.value.Job_Code,
      'Unique_job_ID': this.castingTreeUpFrom.value.Unique_job_ID,
      'Design_Code': this.castingTreeUpFrom.value.Design_Code,
      'Gross_Weight': this.castingTreeUpFrom.value.Gross_Weight,
      'Metal_Weight': this.castingTreeUpFrom.value.Metal_Weight,
      'Stone_Weight': this.castingTreeUpFrom.value.Stone_Weight,
      'RCVD_Gross_Weight': this.castingTreeUpFrom.value.RCVD_Gross_Weight,
      'Karat_Code': this.castingTreeUpFrom.value.Karat_Code,
      'Purity': this.castingTreeUpFrom.value.Purity,
      'Pure_Weight': this.castingTreeUpFrom.value.Pure_Weight,
      'Metal_Color': this.castingTreeUpFrom.value.Metal_Color,
      'RCVD_Pure_Weight': this.castingTreeUpFrom.value.RCVD_Pure_Weight,
      'Stock_Code': this.castingTreeUpFrom.value.Stock_Code,
      'Pieces': this.castingTreeUpFrom.value.Pieces,
      'Job_Pcs': this.castingTreeUpFrom.value.Job_Pcs,
      'Loss_Wt': this.castingTreeUpFrom.value.Loss_Wt,
      'Loss_Pure': this.castingTreeUpFrom.value.Loss_Pure,
      "EMAIL_ID": this.castingTreeUpFrom.value.EMAIL_ID,
    };
    this.tableData.push(data);
 }

 adddatas() {
 let length1 = this.tableData1.length;
    let srno1 = length1 + 1;
    let data1 =  {
      "UNIQUEID": 12345,
      "APPR_CODE": "test",
      "SRNO": srno1,
      'Type':"string",
      'Location_Code': "string",
      'Stock_Code': "string",
      'Sub_Stock_Code': "string",
      'Divcode': "string",
      'Gross_Weight': "string",
      'Party': "string",
      'Pure_Weiht': "string",
      'Balance': "string",
      'Pcs': "string",
      
    };
    
    this.tableData1.push(data1);
  }

 processCodeSelected(e:any){
  console.log(e);
  this.castingTreeUpFrom.controls.processCode.setValue(e.Process_Code);
  this.castingTreeUpFrom.controls.toProcess.setValue(e.Process_Code)
}

WorkerCodeSelected(e:any){
  console.log(e);
  this.castingTreeUpFrom.controls.worker.setValue(e.WORKER_CODE);
  this.castingTreeUpFrom.controls.toWorker.setValue(e.WORKER_CODE);
}

userDataSelected(value: any) {
  console.log(value);
     this.castingTreeUpFrom.controls.enteredBy.setValue(value.UsersName);
}

 cylinderCodeSelected(e:any){
  console.log(e);
  this.castingTreeUpFrom.controls.cylinder.setValue(e.CODE);
}

colorDataSelected(data: any) {
  this.castingTreeUpFrom.controls.color.setValue(data.CODE)
}


karatCodeSelected(e:any){
  console.log(e);
  this.castingTreeUpFrom.controls.karatCode.setValue(e['Karat Code']);
}

addTableData(){ 
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
  let data =  {};
  this.tableData.push(data);
}

deleteTableData(){
  this.tableData.pop();
}

 removedata(){
   this.tableData.pop();
 }

 removedatas(){
  this.tableData.pop();
}

   formSubmit(){
    console.log(this.update,'working')
     if(this.content && this.content.FLAG == 'EDIT'){
       this.update()
       return
     }
    //  if (this.castingTreeUpFrom.invalid) {
    //    this.toastr.error('select all required fields')
    //    return
    //  }

     let API = 'JobTreeMasterDJ/InsertJobTreeMasterDJ'
     let postData = {
      "MID": 0,
      "VOCTYPE": this.comService.nullToString(this.castingTreeUpFrom.value.vocType),
      "BRANCH_CODE": this.branchCode,
      "VOCNO": 0,
      "YEARMONTH": this.yearMonth,
      "VOCDATE":this.comService.formatDateTime(this.currentDate),
      "DOCTIME": "2023-10-21T07:22:12.302Z",
      "SMAN": this.comService.nullToString(this.castingTreeUpFrom.value.SMAN),
      "REMARKS": "",
      "NAVSEQNO": 0,
      "KARAT_CODE": this.castingTreeUpFrom.value.karatCode,
      "COLOR": this.castingTreeUpFrom.value.color,
      "METAL_WT": 0,
      "STONE_WT": this.castingTreeUpFrom.value.stoneWt,
      "BASE_WT": 0,
      "TREE_WT": this.comService.emptyToZero(this.castingTreeUpFrom.value.TREE_WT),
      "WAX_WT": this.comService.emptyToZero(this.castingTreeUpFrom.value.WAX_WT),
      "WORKER_CODE": this.castingTreeUpFrom.value.worker,
      "PROCESS_CODE": this.castingTreeUpFrom.value.processCode,
      "CONV_FACT": this.castingTreeUpFrom.value.convFact,
      "STOCK_CODE": "",
      "RCVD_MET_WT": this.castingTreeUpFrom.value.RCVD_MET_WT,
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
      "JOB_TREEJOB_DETAIL_DJ": [
        {
          "DT_VOCTYPE": this.comService.nullToString(this.castingTreeUpFrom.value.vocType),
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": 0,
          "JOB_NUMBER": "",
          "UNQ_JOB_ID": "",
          "UNQ_DESIGN_ID": "",
          "GROSS_WT": 0,
          "METAL_WT": 0,
          "STONE_WT": this.comService.emptyToZero(this.castingTreeUpFrom.value.stoneWt),
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
          "ATTACHMENT_FILE": "",
          "D_REMARKS": "string",
          "ENGRAVE_TEXT": "string",
          "IS_AUTHORISE": true,
          "JOB_PCS": 0
        }
      ],
      "JOB_TREESTOCK_DETAIL_DJ": [
        {
          "DT_VOCTYPE":this.commonService.nullToString(this.castingTreeUpFrom.value.vocType),
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
                 this.castingTreeUpFrom.reset()
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
 
  //  setFormValues() {
  //    if(!this.content) return
  //    console.log(this.content);
  //  }
 
 
   update(){
     if (this.castingTreeUpFrom.invalid) {
       this.toastr.error('select all required fields')
       return
     }
   
     let API = `JobTreeMasterDJ/UpdateJobTreeMasterDJ//${this.branchCode}/${this.castingTreeUpFrom.value.vocType}/${this.castingTreeUpFrom.value.vocNo}/${this.comService.yearSelected}` ;
     let postData = {
      "MID": 0,
      "VOCTYPE": this.castingTreeUpFrom.value.vocType,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.castingTreeUpFrom.value.vocNo,
      "YEARMONTH": this.yearMonth,
      "VOCDATE":this.comService.formatDateTime(this.currentDate),
      "DOCTIME": "2023-10-21T07:22:12.302Z",
      "SMAN": this.castingTreeUpFrom.value.enteredBy,
      "REMARKS": "",
      "NAVSEQNO": 0,
      "KARAT_CODE": this.castingTreeUpFrom.value.karatCode,
      "COLOR": this.castingTreeUpFrom.value.color,
      "METAL_WT": 0,
      "STONE_WT": this.comService.emptyToZero(this.castingTreeUpFrom.value.stoneWt),
      "BASE_WT": 0,
      "TREE_WT": this.castingTreeUpFrom.value.tree,
      "WAX_WT": this.castingTreeUpFrom.value.waxWt,
      "WORKER_CODE": this.castingTreeUpFrom.value.worker,
      "PROCESS_CODE": this.castingTreeUpFrom.value.processCode,
      "CONV_FACT": this.castingTreeUpFrom.value.convFact,
      "STOCK_CODE": "",
      "RCVD_MET_WT": this.comService.nullToString(this.castingTreeUpFrom.value.reqMetal),
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
                 this.castingTreeUpFrom.reset()
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
         let API = 'JobTreeMasterDJ/DeleteJobTreeMasterDJ/'+ this.castingTreeUpFrom.value.branchCode + this.castingTreeUpFrom.value.voctype + this.castingTreeUpFrom.value.vocno + this.castingTreeUpFrom.value.yearMonth;
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
               this.toastr.error('Not deleted')
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
}
