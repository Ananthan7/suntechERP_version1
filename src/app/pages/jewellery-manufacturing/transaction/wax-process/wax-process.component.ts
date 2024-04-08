import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './wax-process.component.html',
  styleUrls: ['./wax-process.component.scss']
})
export class WaxProcessComponent implements OnInit {

  // columnhead:any[] = ['SR No','Job Number','Design', 'Party','SO','SO Date ','Del Date','Gross Wt','Metal Wt','Stone Wt','Ord Pcs','Issue Pcs'];
  branchCode?: String;
  yearMonth?: String;
  @Input() content!: any;
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  isReadOnly:boolean=true;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  //waxprocessFrom!: FormGroup

  userName = localStorage.getItem('username');
  userbranch = localStorage.getItem('userbranch');
  branchParmeter:any= localStorage.getItem('BRANCH_PARAMETER');
  strBranchcode:any= '';

  
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

  jobNumberCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'JOB NUMBER',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  ProcessCodeData: MasterSearchModel = {
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
  description: any;

 

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private suntechApi: SuntechAPIService,
  ) { 
    this.strBranchcode = localStorage.getItem('userbranch');
  }

  ngOnInit(): void {
    this.waxprocessFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    this.waxprocessFrom.controls.vocdate.setValue(this.commonService.currentDate)
    this.waxprocessFrom.controls.vocno.setValue('1')
    // console.log(this.branchParmeter);
    let data = this.branchParmeter.split(',');
    this.description = data[4].substring(15);
  
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    
    this.getJobNumberDetails();
    // console.log(this.content);
    if (this.content) {
      this.setFormValues()
    }

  }

  getJobNumberDetails() {   
    this.suntechApi.getDynamicAPI(`GetWaxIssueJobs/GetWaxIssueJobs?strBranch_Code=${this.strBranchcode}&strJobNumber=14529`).subscribe((result) => {
      // console.log(this.tableData);
      console.log(result.dynamicData);
      this.tableData = result.dynamicData
    });
  }

  userDataSelected(value: any) {
    console.log(value);
    this.waxprocessFrom.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.processcode.setValue(e.Process_Code);

  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.waxprocessFrom.controls.workercode.setValue(e.WORKER_CODE);
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  jobNumberDataSelected(data: any, value: any) {
    console.log(value);
    console.log(data);
    this.tableData[value.data.SRNO - 1].job_number = data.job_number;
    this.tableData[value.data.SRNO - 1].design = data.job_description;
  //   this.tableData[value.data.SRNO - 1].job_number = data.jobNumber;
   }

  designtextevent(data: any, value: any) {
   this.tableData[value.data.SRNO - 1].design = data.job_description;
  }

  partytextevent(data: any, value: any) {
     this.tableData[value.data.SRNO - 1].party = data.target.value;
   }

  Sotextevent(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].So = data.target.value;
  }

  SoDatetextevent(data: any, value: any) {
     this.tableData[value.data.SRNO - 1].SoDate = data.target.value;
  }

  DelDatetextevent(data: any, value: any) {
     this.tableData[value.data.SRNO - 1].DelDate = data.target.value;
  }

  GrossWttextevent(data: any, value: any) {
   this.tableData[value.data.SRNO - 1].GrossWt = data.target.value;
   }

  MetalWttextevent(data: any, value: any) {
     this.tableData[value.data.SRNO - 1].MetalWt = data.target.value;
  }

  StoneWttextevent(data: any, value: any) {
     this.tableData[value.data.SRNO - 1].StoneWt = data.target.value;
  }

  OrderPcstextevent(data: any, value: any) {
    // this.tableData[value.data.SRNO - 1].OrderPcs = data.OrderPcs;
  }

  IssuePcstextevent(data: any, value: any) {
    // this.tableData[value.data.SRNO - 1].IssuePcs = data.IssuePcs;
  }

 

  waxprocessFrom: FormGroup = this.formBuilder.group({
    voctype: ['',[Validators.required]],
    vocdate: ['',[Validators.required]],
    vocno: ['',[Validators.required]],
    processcode: ['',[Validators.required]],
    workercode: ['',[Validators.required]],
    enteredBy: [''],
    remarks: [''],
  });


  setFormValues() {
    if (!this.content) return
    this.waxprocessFrom.controls.job_number.setValue(this.content.APPR_CODE)
    this.waxprocessFrom.controls.design.setValue(this.content.job_description)


    this.dataService.getDynamicAPI('JobWaxIssue/GetJobWaxIssue/' + this.content.job_number).subscribe((data) => {
      if (data.status == 'Success') {
        this.tableData = data.response.WaxProcessDetails;
      }
    });

  }



  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data = {
      "UNIQUEID": 12345,
      "WAX_CODE": "test",
      "SRNO": srno,
      "job_number": "",
      "design": "",
      "party": "",
      "So": "",
      "SoDate": "",
      "DelDate": "",
      "GrossWt": "0.000",
      "MetalWt": "0.000",
      "StoneWt": "0.000",
      "OrderPcs": "",
      "IssuePcs": ""

    };
    this.tableData.push(data);
  }
  removedata() {
    this.tableData.pop();
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.waxprocessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobWaxIssue/InsertJobWaxIssue'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.waxprocessFrom.value.vocno,
      "VOCDATE": this.waxprocessFrom.value.vocdate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-20T10:24:24.037Z",
      "PROCESS_CODE": this.waxprocessFrom.value.processcode,
      "WORKER_CODE": this.waxprocessFrom.value.workercode,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_STONE_WT": 0,
      "SMAN": this.waxprocessFrom.value.enteredBy,
      "REMARKS": this.waxprocessFrom.value.remarks,
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "SYSTEM_DATE": "2023-10-20T10:24:24.037Z",
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_VOCTYPE": "str",
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "SRNO": 0,
          "job_number": "",
          "design": "",
          "party": "",
          "So": "",
          "SoDate": "",
          "DelDate": "",
          "GrossWt": "0.000",
          "MetalWt": "0.000",
          "StoneWt": "0.000",
          "OrderPcs": "",
          "IssuePcs": ""
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
                this.waxprocessFrom.reset()
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

  update() {
    if (this.waxprocessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ApprovalMaster/UpdateApprovalMaster/' + this.content.APPR_CODE
    let postData = {
      "APPR_CODE": this.waxprocessFrom.value.code || "",
      "APPR_DESCRIPTION": this.waxprocessFrom.value.description || "",
      "MID": this.content.MID,
      "approvalDetails": this.tableData,
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
                this.waxprocessFrom.reset()
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
    if (!this.content.MID) {
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
        let API = 'ApprovalMaster/DeleteApprovalMaster/' + this.content.APPR_CODE
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
                    this.waxprocessFrom.reset()
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
                    this.waxprocessFrom.reset()
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

