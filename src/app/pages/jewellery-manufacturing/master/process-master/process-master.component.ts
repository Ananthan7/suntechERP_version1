import { Component, Input, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-process-master',
  templateUrl: './process-master.component.html',
  styleUrls: ['./process-master.component.scss']
})
export class ProcessMasterComponent implements OnInit {
  @Input() content!: any; 

  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  processType:any[] = [];

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




  processMasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    processCode: [''],
    processDesc: [''],
    processType: [''],
    stand_time: [''],
    wip_ac: [''],
    max_time: [''],
    processPosition: [''],
    trayWeight: [''],
    approvalCode: [''],
    approvalProcess: [''],
    recStockCode: [''],
    labour_charge: [''],

    loss:[],
    recovery:[],
    gain:[],
    standard_start:[],
    standard_end:[],
    min_start:[],
    min_end:[],
    max:[],
    accode_start:[],
    accode_end:[],
    loss_on_gross:[],



   
  })

  constructor(   
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

 

  ngOnInit(): void {
    if(this.content){
      this.setFormValues()
    }
    let API = 'ComboFilter/PROCESS TYPE MASTER';
    this.dataService.getDynamicAPI(API).subscribe((result) => {
      console.log(result); 
      if(result.status == 'Success'){
        this.processType = result.response;
      }
      // console.log('type:',this.processType);
      
    });
  }
  setFormValues() {
    if(!this.content) return
    this.processMasterForm.controls.mid.setValue(this.content.MID);
  }
  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){     
      this.updateProcessMaster()
      return
    }

    if (this.processMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ProcessMasterDj/InsertProcessMasterDJ'
   

    let postData ={
      "MID": 0,
      "PROCESS_CODE": this.processMasterForm.value.processCode || "0123",
      "DESCRIPTION": this.processMasterForm.value.processCode || "0123",
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "LOSS_ACCODE": "string",
      "WIP_ACCODE": "string",
      "CURRENCY_CODE": "stri",     
      "PROCESS_TYPE": "string",
      "UNIT": "string",
      "NO_OF_UNITS": 0,
      "UNIT_RATE": 0,
      "LAB_ACCODE": "string",
      "LAST_NO": "string",
      "REPAIR_PROCESS": 0,
      "FINAL_PROCESS": 0,
      "GAIN_ACCODE": "string",
      "TRAY_WT": 0,
      "SETTING_PROCESS": 0,
      "POINTS": 0,
      "LOCK_WEIGHT": 0,
      "AUTOTRANSFER": 0,
      "MASTER_WEIGHT": 0,
      "MERGE_BLOCK": 0,
      "LAB_PROCESS": 0,
      "WAX_PROCESS": 0,     
      "STD_LOSS_QTY": 0,
      "POSITION": 0,     
      "RECOV_MIN": 0,
      "RECOV_ACCODE": "string",
      "RECOV_STOCK_CODE": "string",      
      "RECOV_VAR1": 0,
      "RECOV_VAR2": 0,
      "DEDUCT_PURE_WT": 0,
      "APPR_PROCESS": "string",
      "APPR_CODE":this.processMasterForm.value.approvalCode || "",
      "ALLOW_GAIN": true,     
      "STD_GAIN": 0,
      "MIN_GAIN": 0,
      "MAX_GAIN": 0,
      "ALLOW_LOSS": true,
      "STD_LOSS": 0,
      "MIN_LOSS": 0,
      "MAX_LOSS": 0,
      "LOSS_ON_GROSS": true,
      "JOB_NUMBER": "string",     
      "LABCHRG_PERHOUR": 0,
     
      "APPLY_SETTING": true,
      "TIMEON_PROCESS": true,
      "STONE_INCLUDED": true,
      "RECOVERY_PROCESS": true,     
      "ALLOW_METAL": true,
      "ALLOW_STONE": true,
      "ALLOW_CONSUMABLE": true,
      "APPROVAL_REQUIRED": true,
      "NON_QUANTITY": true,     
      "DF_REFINERY": true,
      "AUTO_LOSS": true,
      "ISACCUPDT": true,
      "TREE_NO": true,



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
                this.processMasterForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  ApprovalCodeSelected(e:any){
    console.log(e);    
    this.processMasterForm.controls.approvalCode.setValue(e.APPR_CODE);
  }
  ApprovalProcessSelected(e:any){
    console.log(e);
    this.processMasterForm.controls.approvalProcess.setValue(e.Process_Code);    
  }

  updateProcessMaster(){
   

    let API = 'ProcessMasterDj/UpdateProcessMasterDJ/'+this.processMasterForm.value.mid
    let postData = {
      "MID": this.processMasterForm.value.mid,
      "PROCESS_CODE": this.processMasterForm.value.processCode || "0125",
      "DESCRIPTION": this.processMasterForm.value.processCode || "0125",
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "LOSS_ACCODE": "string",
      "WIP_ACCODE": "string",
      "CURRENCY_CODE": "stri",     
      "PROCESS_TYPE": "string",
      "UNIT": "string",
      "NO_OF_UNITS": 0,
      "UNIT_RATE": 0,
      "LAB_ACCODE": "string",
      "LAST_NO": "string",
      "REPAIR_PROCESS": 0,
      "FINAL_PROCESS": 0,
      "GAIN_ACCODE": "string",
      "TRAY_WT": 0,
      "SETTING_PROCESS": 0,
      "POINTS": 0,
      "LOCK_WEIGHT": 0,
      "AUTOTRANSFER": 0,
      "MASTER_WEIGHT": 0,
      "MERGE_BLOCK": 0,
      "LAB_PROCESS": 0,
      "WAX_PROCESS": 0,     
      "STD_LOSS_QTY": 0,
      "POSITION": 0,     
      "RECOV_MIN": 0,
      "RECOV_ACCODE": "string",
      "RECOV_STOCK_CODE": "string",      
      "RECOV_VAR1": 0,
      "RECOV_VAR2": 0,
      "DEDUCT_PURE_WT": 0,
      "APPR_PROCESS": "string",
      "APPR_CODE":this.processMasterForm.value.approvalCode || "",
      "ALLOW_GAIN": true,     
      "STD_GAIN": 0,
      "MIN_GAIN": 0,
      "MAX_GAIN": 0,
      "ALLOW_LOSS": true,
      "STD_LOSS": 0,
      "MIN_LOSS": 0,
      "MAX_LOSS": 0,
      "LOSS_ON_GROSS": true,
      "JOB_NUMBER": "string",     
      "LABCHRG_PERHOUR": 0,
     
      "APPLY_SETTING": true,
      "TIMEON_PROCESS": true,
      "STONE_INCLUDED": true,
      "RECOVERY_PROCESS": true,     
      "ALLOW_METAL": true,
      "ALLOW_STONE": true,
      "ALLOW_CONSUMABLE": true,
      "APPROVAL_REQUIRED": true,
      "NON_QUANTITY": true,     
      "DF_REFINERY": true,
      "AUTO_LOSS": true,
      "ISACCUPDT": true,
      "TREE_NO": true,
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
                this.processMasterForm.reset()
                this.tableData = []
                this.close()
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
        let API = 'ProcessMasterDj/DeleteProcessMasterDJ/' + this.content.WORKER_CODE
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
                    this.close()
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

}
