import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AlloyAllocationComponent } from './alloy-allocation/alloy-allocation.component';

@Component({
  selector: 'app-cad-processing',
  templateUrl: './cad-processing.component.html',
  styleUrls: ['./cad-processing.component.scss']
})
export class CADProcessingComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  columnheadItemDetails:any[] = ['Srno','Division','Stone Type','Stock Code','Karat','Color','Shape','Sieve','Size','Pcs','Wt/Ct','Setting Type','Pointer Wt','Remarks'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails3:any[] = ['Comp Code','Srno','Division','Stone Type','Stock Code','Karat','Color','Shape','Sieve Std','Sieve Set'];
  columnheadItemDetails2:any[] = ['']
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  isdisabled:boolean=true;
  private subscriptions: Subscription[] = [];
  table: any;
  status: boolean= true;
  selectedTabIndex = 0;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    if (this.content) {
      // this.setFormValues()
      
    }
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    if (this.content) {
      this.setFormValues()
    }
    this.cadProcessingForm.controls.deliveryOnDate = new FormControl({value: '', disabled: this.isdisabled})
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  setFormValues() {
    if (!this.content) return
    this.cadProcessingForm.controls.job_number.setValue(this.content.APPR_CODE)
    this.cadProcessingForm.controls.design.setValue(this.content.job_description)
    this.dataService.getDynamicAPI('/JobCadProcessDJ/GetJobCadProcessDJ/' + this.content.job_number).subscribe((data) => {
      if (data.status == 'Success') {
        this.tableData = data.response.WaxProcessDetails;
      }
    });
  }
  cadProcessingForm: FormGroup = this.formBuilder.group({
    voctype: ['CAD',''],
    vocNo: ['1',''],
    vocDate: [new Date(),''],
    process: ['CAD',''],
    worker: ['PARIMA',''],
    narration: [''],
    soNumber: [''],    //no
    design:['', [Validators.required]],
    completed:[new Date(),''], //no
    toWorker:['', [Validators.required]],
    toProcess:['', [Validators.required]],
    job:[''],
    subJobId:[''],
    timeTaken:['00:00:00',''],
    userId:[''], // No
    date:[new Date(),''],
    copy:[''], // no
    type:[''],
    reason:[''], //no
    remarks:[''],
    attachments:[''], //no
    deliveryOn:[''],
    deliveryOnDays:[''],
    deliveryOnDate:[new Date(),{disabled: true,value:''}],
  });

 

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "Srno": srno,
      "Division": "string",
      "StoneType": "string",
      "StockCode": "string",
      "Karat": "string",
      "Color": "string",
      "Shape": "string",
      "Sieve": "string",
      "Size": 0,
      "Pcs": 0,
      "WtCt": 0,
      "SettingType": 0,
      "PointerWt": 0,
      "Remarks": "string",
    };
  
    this.tableData.push(data);
   
}

divisiontemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Division = data.target.value;
}

stonetypetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].StoneType = data.target.value;
}

stockcodetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].StockCode = data.target.value;
}

karattemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Karat = data.target.value;
}

colortemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Color = data.target.value;
}

shapetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Shape = data.target.value;
}

sievetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Sieve = data.target.value;
}

sizetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Size = data.target.value;
}

Pcstemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Pcs = data.target.value;
}

wtcttemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].WtCt = data.target.value;
}

settingtypetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].SettingType = data.target.value;
}

pointerwttemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].PointerWt = data.target.value;
}

remarkstemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Remarks = data.target.value;
}

adddatas() {
  let length = this.tableDatas.length;
  let srno = length + 1;
  let data2=  {
    "Srno": srno,
    "CompCode": "string",
    "Description": "string",
    "Pcs": "string",
    "SizeSet": "string",
    "SizeCode": "string",
    "Type": "string",
    "Category": "string",
    "Shape": 0,
    "Height": 0,
    "Width": 0,
    "Length": 0,
    "Radius": 0,
    "Remarks": "string",
  };
  this.tableDatas.push(data2);
 
}

compcodetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].CompCode = data.target.value;
}

descriptiontemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Description = data.target.value;
}

Pcs2temp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Pcs = data.target.value;
}

sizesettemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].SizeSet = data.target.value;
}

sizecodetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].SizeCode = data.target.value;
}

typetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Type = data.target.value;
}

categorytemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Category = data.target.value;
}

shape2temp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Shape = data.target.value;
}

heighttemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Height = data.target.value;
}

widthtemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Width = data.target.value;
}

lengthtemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Length = data.target.value;
}

radiustemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Radius = data.target.value;
}

remarks2temp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Remarks = data.target.value;
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.updateMeltingType()
      return
    }

    if (this.cadProcessingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobCadProcessDJ/InsertJobCadProcessDJ'
    let postData ={
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.cadProcessingForm.value.voctype,
      "vocNo": this.cadProcessingForm.value.vocNo,
      "YEARMONTH": this.yearMonth,
      "SALESPERSON_CODE": "string",
      "SYSTEM_DATE": this.cadProcessingForm.value.date,
      "MACHINEID": "string",
      "DOC_REF": "string",
      "REMARKS": this.cadProcessingForm.value.remarks,
      "VOCDATE": this.cadProcessingForm.value.vocDate,
      "NAVSEQNO": 0,
      "PROCESS_CODE": this.cadProcessingForm.value.process,
      "WORKER_CODE": this.cadProcessingForm.value.worker,
      "JOB_NUMBER": this.cadProcessingForm.value.job,
      "UNQ_JOB_ID": "string",
      "JOB_SO_NUMBER": this.cadProcessingForm.value.subJobId,
      "DESIGN_CODE": this.cadProcessingForm.value.design,
      "UNQ_DESIGN_ID": "string",
      "PART_CODE": "string",
      "PCS": 0,
      "TIME_TAKEN": this.cadProcessingForm.value.timeTaken,
      "JOB_SO_MID": 0,
      "CAD_STATUS": "string",
      "APPR_CODE": "string",
      "APPR_TYPE": this.cadProcessingForm.value.type,
      "TRANS_REF": "string",
      "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
      "TO_PROCESS_CODE": this.cadProcessingForm.value.toProcess,
      "TO_WORKER_CODE": this.cadProcessingForm.value.toWorker,
      "SO_DELIVERY_TYPE": this.cadProcessingForm.value.deliveryOn,
      "SO_DELIVERY_DAYS": this.cadProcessingForm.value.deliveryOnDays,
      "SO_DELIVERY_DATE": this.cadProcessingForm.value.deliveryOnDate,
      "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
      "SO_CR_DAYS": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "stri",
          "SRNO": 0,
          "METALSTONE": "s",
          "DIVCODE": "s",
          "STONE_TYPE": "string",
          "KARAT_CODE": "stri",
          "SIEVE_SET": "string",
          "SIEVE": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SHAPE": "string",
          "SIZE": "string",
          "PCS": 0,
          "GROSS_WT": 0,
          "D_REMARKS": "string",
          "PROCESS_TYPE": "string",
          "POINTER_WT": 0,
          "STOCK_CODE": "string",
          "COMP_CODE": "string"
        }
      ],
      "Components": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "COMP_CODE": "string",
          "COMP_DESCRIPTION": "string",
          "COMP_SHAPE": "string",
          "TYPE_CODE": "string",
          "CATEGORY_CODE": "string",
          "COMPSIZE_CODE": "string",
          "COMPSET_CODE": "string",
          "HEIGHT": 0,
          "WIDTH": 0,
          "LENGTH": 0,
          "RADIUS": 0,
          "PCS": 0,
          "REMARKS": "string",
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "stri"
        }
      ]
     
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
                this.cadProcessingForm.reset()
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

  updateMeltingType() {
    let API = '/JobCadProcessDJ/UpdateJobCadProcessDJ'+ this.cadProcessingForm.value.brnachCode + this.cadProcessingForm.value.voctype + this.cadProcessingForm.value.vocNo + this.cadProcessingForm.value.yearMoth ;
      let postData ={
        "MID": 0,
        "BRANCH_CODE": "string",
        "VOCTYPE": this.cadProcessingForm.value.voctype,
        "vocNo": this.cadProcessingForm.value.vocNo,
        "YEARMONTH": "stri",
        "SALESPERSON_CODE": "string",
        "SYSTEM_DATE": this.cadProcessingForm.value.date,
        "MACHINEID": "string",
        "DOC_REF": "string",
        "REMARKS": this.cadProcessingForm.value.remarks,
        "VOCDATE": this.cadProcessingForm.value.VocDate,
        "NAVSEQNO": 0,
        "PROCESS_CODE": this.cadProcessingForm.value.process,
        "WORKER_CODE": this.cadProcessingForm.value.worker,
        "JOB_NUMBER": this.cadProcessingForm.value.job,
        "UNQ_JOB_ID": "string",
        "JOB_SO_NUMBER": this.cadProcessingForm.value.subJobId,
        "DESIGN_CODE": this.cadProcessingForm.value.design,
        "UNQ_DESIGN_ID": "string",
        "PART_CODE": "string",
        "PCS": 0,
        "TIME_TAKEN": this.cadProcessingForm.value.timeTaken,
        "JOB_SO_MID": 0,
        "CAD_STATUS": "string",
        "APPR_CODE": "string",
        "APPR_TYPE": this.cadProcessingForm.value.type,
        "TRANS_REF": "string",
        "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
        "TO_PROCESS_CODE": this.cadProcessingForm.value.toProcess,
        "TO_WORKER_CODE": this.cadProcessingForm.value.toWorker,
        "SO_DELIVERY_TYPE": this.cadProcessingForm.value.deliveryOn,
        "SO_DELIVERY_DAYS": this.cadProcessingForm.value.deliveryOnDays,
        "SO_DELIVERY_DATE": this.cadProcessingForm.value.deliveryOnDate,
        "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
        "SO_CR_DAYS": 0,
        "Details": [
          {
            "UNIQUEID": 0,
            "DT_BRANCH_CODE": "string",
            "DT_VOCTYPE": "str",
            "DT_vocNo": 0,
            "DT_YEARMONTH": "stri",
            "SRNO": 0,
            "METALSTONE": "s",
            "DIVCODE": "s",
            "STONE_TYPE": "string",
            "KARAT_CODE": "stri",
            "SIEVE_SET": "string",
            "SIEVE": "string",
            "COLOR": "string",
            "CLARITY": "string",
            "SHAPE": "string",
            "SIZE": "string",
            "PCS": 0,
            "GROSS_WT": 0,
            "D_REMARKS": "string",
            "PROCESS_TYPE": "string",
            "POINTER_WT": 0,
            "STOCK_CODE": "string",
            "COMP_CODE": "string"
          }
        ]
       
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
                  this.cadProcessingForm.reset()
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
      /**USE: delete Melting Type From Row */
  deleteMeltingType() {
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
        let API = '/JobCadProcessDJ/DeleteJobCadProcessDJ/' + this.cadProcessingForm.value.brnachCode + this.cadProcessingForm.value.voctype + this.cadProcessingForm.value.vocNo + this.cadProcessingForm.value.yearMoth;
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
                    this.cadProcessingForm.reset()
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
                    this.cadProcessingForm.reset()
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
  
  processCodeData: MasterSearchModel = {
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

  processSelected(e:any){
    console.log(e);
    this.cadProcessingForm.controls.process.setValue(e.Process_Code);
  }

  toProcessSelected(e:any){
    this.cadProcessingForm.controls.toProcess.setValue(e.Process_Code);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code ',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workedSelected(e:any){
    console.log(e);
    this.cadProcessingForm.controls.worker.setValue(e.WORKER_CODE);
  }
  
  toWorkedSelected(e:any){
  console.log(e);
  this.cadProcessingForm.controls.toWorker.setValue(e.WORKER_CODE);
  }

  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(AlloyAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData(){
 
    
  }

}
