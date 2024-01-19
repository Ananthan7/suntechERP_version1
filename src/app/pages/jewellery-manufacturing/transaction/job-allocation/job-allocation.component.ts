import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job-allocation',
  templateUrl: './job-allocation.component.html',
  styleUrls: ['./job-allocation.component.scss']
})


export class JobAllocationComponent implements OnInit {
  gridData: any[] = [];

  branchCode?: String;
  yearMonth?: String;
  @Input() content!: any; 
  tableData: any[] = [];  
   columnheadItemDetails:any[] = ['Design','Order.No','Process','Worker','Doc.Attachment','Std.Time','Priority','Customer','Job Number','Unq.Job.Id','Pcs',''];
  divisionMS: any = 'ID';
  private subscriptions: Subscription[] = [];
  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private http: HttpClient,) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;

    console.log(this.content);
    if(this.content){
      this.setFormValues()
    }

    this.refreshGridData();
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setFormValues() {
    if(!this.content) return
    this.jobalocationFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.jobalocationFrom.controls.vocno.setValue(this.content.VOCNO)
    this.jobalocationFrom.controls.vocDate.setValue(this.content.VOCDATE)
    this.jobalocationFrom.controls.vocDate.setValue(this.content.DOCTIME)
    this.jobalocationFrom.controls.vocDate.setValue(this.content.REMARKS)

    console.log(this.content);
  }

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
  userNameCodeSelected(e:any){
    console.log(e);
    this.jobalocationFrom.controls.userName.setValue(e.UsersName);
  }

  jobalocationFrom: FormGroup = this.formBuilder.group({
      vocType: ['', [Validators.required]],
      vocNum: ['', [Validators.required]],
      vocDate:[''],
      userName:[''],
      date:[''],
      remarks:['']
  });

  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.jobalocationFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobAllocationMaster/InsertJobAllocationMaster' 
    let postData = {
        "VOCTYPE":  this.jobalocationFrom.value.vocType || "",
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
                  this.jobalocationFrom.reset()
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

    update(){
      if (this.jobalocationFrom.invalid) {
        this.toastr.error('select all required fields')
        return
      }
    
      let API = 'JobAllocationMaster/UpdateJobAllocationMaster/' + this.jobalocationFrom.value.branchCode + this.jobalocationFrom.value.vocType  + this.jobalocationFrom.value.yearMonth + this.jobalocationFrom.value.vocNo;
      let postData = 
      {
        "VOCTYPE":  this.jobalocationFrom.value.vocType || "",
        "BRANCH_CODE": this.branchCode,
        "VOCNO":0,
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
                  this.jobalocationFrom.reset()
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
          let API = 'JobAllocationMaster/DeleteJobAllocationeMaster/'+ this.jobalocationFrom.value.branchCode + this.jobalocationFrom.value.voctype + this.jobalocationFrom.value.vocno + this.jobalocationFrom.value.yearMonth;
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

    refreshGridData(): void {
      const apiUrl = 'http://94.200.156.234:85/api/WebEnquiry/DiamondSalesOrder'; 
  
      this.http.get(apiUrl).subscribe((data: any) => {
       
        this.gridData = data;
      });
    }
  }