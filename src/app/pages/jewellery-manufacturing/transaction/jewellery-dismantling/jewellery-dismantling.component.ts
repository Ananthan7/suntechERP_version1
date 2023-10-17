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
  selector: 'app-jewellery-dismantling',
  templateUrl: './jewellery-dismantling.component.html',
  styleUrls: ['./jewellery-dismantling.component.scss']
})
export class JewelleryDismantlingComponent implements OnInit {
  divisionMS: any = 'ID';
  columnheads:any[] = ['SrNo','Stock Code','Description', 'Pcs','Metal/Value','Lab Amount','Total Amount','Loss','MFGRE','MFGDATE',' Settings','Remarks','Locations'];
 @Input() content!: any; 
  tableData: any[] = [];
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
  userDataSelected(value: any) {
    console.log(value);
       this.jewellerydismantlingFrom.controls.userName.setValue(value.UsersName);
  }

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



  jewellerydismantlingFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno:[''],
   process:[''],
   worker:[''],
   toworker:[''],
   toprocess:[''],
   waxcode:[''],
    remark:[''],
  });

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "2023-10-07T08:43:49.448Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-07T08:43:49.448Z",
      "PROCESS_CODE": "string",
      "WORKER_CODE": "string",
      "SMAN": "string",
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": "string",
      "TO_WORKER_CODE": "string",
      "DIVISION_CODE": "s",
      "STOCK_CODE": "string",
      "SYSTEM_DATE": "2023-10-07T08:43:49.448Z",
      "HTUSERNAME": "string",
      "UNIQUEID": 0,
      "DT_VOCTYPE": "str",
      "DT_BRANCH_CODE": "string",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "SRNO": 0,
      "JOB_NUMBER": "string",
      "UNQ_JOB_ID": "string",
      "DESIGN_CODE": "string",
      "PARTYCODE": "string",
      "ISSUE_PCS": 0,
      "RETURN_PCS": 0,
      "ISSUE_VOCTYPE": "str",
      "ISSUE_BRANCH_CODE": "string",
      "ISSUE_VOCNO": 0,
      "ISSUE_YEARMONTH": "string",
      "IS_AUTHORISE": true,
      "GROSS_WT": 0,
      "METAL_WT": 0,
      "STONE_WT": 0,
      "WAX_WT": 0,
      "JOB_PCS": 0,
      "AUTHORIZE_TIME": "2023-10-07T08:43:49.448Z",
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
    };
    this.tableData.push(data);
}
removedata(){
  this.tableData.pop();
}
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.jewellerydismantlingFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobWaxReturn/InsertJobWaxReturn'
    let postData = {
      
      "approvalDetails": this.tableData,  
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
                this.jewellerydismantlingFrom.reset()
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
    if(!this.content) return
    console.log(this.content);
    
  

    

  }


  update(){
    if (this.jewellerydismantlingFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobWaxReturn/UpdateJobWaxReturn/'+ this.jewellerydismantlingFrom.value.voctype + this.jewellerydismantlingFrom.value.vocno + this.jewellerydismantlingFrom.value.vocdate
    let postData = {
    
      "approvalDetails": this.tableData,  
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
                this.jewellerydismantlingFrom.reset()
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
        let API = 'JobWaxReturn/DeleteJobWaxReturn/' + this.jewellerydismantlingFrom.value.voctype + this.jewellerydismantlingFrom.value.vocno + this.jewellerydismantlingFrom.value.vocdate
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
                    this.jewellerydismantlingFrom.reset()
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
                    this.jewellerydismantlingFrom.reset()
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
