import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { AttachmentUploadComponent } from "src/app/shared/common/attachment-upload/attachment-upload.component";

@Component({
  selector: "app-job-creation",
  templateUrl: "./job-creation.component.html",
  styleUrls: ["./job-creation.component.scss"],
})
export class JobCreationComponent implements OnInit {
  @ViewChild('overlayuserName') overlayuserName!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];
  divisionMS: any;
  columnhead: any[] = ["SL No", "Date", "Stock Code", "Party", "Delivery Date", "Partyname", "Remarks", "Pending Days", "Design Code", "Description", "Pcs Order", "Balance Pcs", "No Bags", "Metal Wt", "Stone Wt", "Gross Wt", "Unq Design", "SRNO"];
  columnheader: any[] = ["SL No", "Orders", "Design Code", "Stock Code", "Job Number", "Job Description", "Karat", "Total Pcs", "Stone Wt", "Metal Wt", "Gross Wt", "Category", "Sub Category", "Brand Code", "Metal Color", "Type", "Seq.Code", "Actualpcs", "YEARMONTH", "PartyCode", "DSO_SRNO"];
  @Input() content!: any;
  tableData: any[] = [];
  branchCode?: String;
  yearMonth?: String;
  viewMode: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  userName = localStorage.getItem("username");
  private subscriptions: Subscription[] = [];
  currentDate = new FormControl(new Date());
  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "User",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private comService: CommonServiceService,
  ) {}

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;    
    this.userName = this.commonService.userName; 
    this.yearMonth = this.commonService.yearSelected;
    this.setvaluesdata()
  }

  jobCreationFrom: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocDate : [""],
    vocNo: [""],
    userName : [""],
    processCode: ["",[Validators.required]],
    docRef: [""],
    narration: [""],
  });

  setvaluesdata(){
    console.log(this.comService);
    this.jobCreationFrom.controls.vocType.setValue(this.comService.getqueryParamVocType())
    this.jobCreationFrom.controls.vocNo.setValue('1')
    this.jobCreationFrom.controls.vocDate.setValue(this.comService.currentDate)
  
  }

  

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  removedata() {
    this.tableData.pop();
  }

  userDataSelected(value: any) {
    console.log(value);
       this.jobCreationFrom.controls.userName.setValue(value.UsersName);
  }

  ProcessCodeSelected(e:any){
    console.log(e);
    this.jobCreationFrom.controls.processCode.setValue(e.Process_Code);
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.processCode) == '') {
      this.commonService.toastErrorByMsgId('MSG1680')// processCode  CANNOT BE EMPTY
      return true
    }
    return false;
  }


  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.submitValidations(this.jobCreationFrom.value)) return;
    // if (this.jobCreationFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }

    let API = "JobAllocationMaster/InsertJobAllocationMaster/";
    let postData = {
        "VOCTYPE": this.jobCreationFrom.value.vocType,
        "BRANCH_CODE":  this.branchCode,
        "VOCNO": this.jobCreationFrom.value.vocNo ,
        "VOCDATE": this.jobCreationFrom.value.vocDate,
        "YEARMONTH": this.yearMonth,
        "DOCTIME": "2023-10-16T09:16:15.410Z",
        "SMAN": this.jobCreationFrom.value.docRef,
        "REMARKS": this.jobCreationFrom.value.narration,
        "NAVSEQNO": 0,
        "MID": 0,
        "AUTOPOSTING": true,
        "POSTDATE": "string",
        "PRINT_COUNT": 0,
        "SYSTEM_DATE": "2023-10-16T09:16:15.410Z",
        "HTUSERNAME":  this.jobCreationFrom.value.userName,
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
            "DEL_DATE": "2023-10-16T09:16:15.410Z"
          }
        ]
      };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
           if (result && result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.jobCreationFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }else {
              this.comService.toastErrorByMsgId('MSG3577')
            }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  setFormValues() {
    if (!this.content) return;
    console.log(this.content);
    this.jobCreationFrom.controls.vocType.setValue(this.content.VOCTYPE);
    this.jobCreationFrom.controls.vocNo.setValue(this.content.VOCNO);
    this.jobCreationFrom.controls.vocDate.setValue(this.content.VOCDATE);
    this.jobCreationFrom.controls.processCode.setValue(this.content.PROCESS_CODE);
    this.jobCreationFrom.controls.docRef.setValue(this.content.SMAN);
    this.jobCreationFrom.controls.narration.setValue(this.content.REMARKS);
    this.jobCreationFrom.controls.userName.setValue(this.content.HTUSERNAME);
  }

  update() {
    // if (this.jobCreationFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }
    if (this.submitValidations(this.jobCreationFrom.value)) return;

    let API ="JobAllocationMaster/UpdateJobAllocationMaster/"+this.jobCreationFrom.value.vocType+this.jobCreationFrom.value.branchCode+this.jobCreationFrom.value.yearMonth + this.jobCreationFrom.value.vocno;
    let postData = {
      "VOCTYPE": this.jobCreationFrom.value.vocType,
      "BRANCH_CODE":  this.branchCode,
      "VOCNO": this.jobCreationFrom.value.vocNo,
      "VOCDATE": this.jobCreationFrom.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-16T09:16:15.410Z",
      "SMAN": this.jobCreationFrom.value.docRef,
      "REMARKS": this.jobCreationFrom.value.narration,
      "NAVSEQNO": 0,
      "MID": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "SYSTEM_DATE": "2023-10-16T09:16:15.410Z",
      "HTUSERNAME":  this.jobCreationFrom.value.userName,
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
          "DEL_DATE": "2023-10-16T09:16:15.410Z"
        }
      ]
    };


    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
            if (result && result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.jobCreationFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
            else {
              this.comService.toastErrorByMsgId('MSG3577')
            }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleteRecord() {
    if (!this.content.VOCTYPE) {
      Swal.fire({
        title: "",
        text: "Please Select data to delete!",
        icon: "error",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        let API ="JobAllocationMaster/DeleteJobAllocationeMaster/"+this.jobCreationFrom.value.vocType+this.jobCreationFrom.value.branchCode+this.jobCreationFrom.value.yearMonth + this.jobCreationFrom.value.vocno;
        let Sub: Subscription = this.dataService
          .deleteDynamicAPI(API)
          .subscribe(
            (result) => {
              if (result) {
                if (result.status == "Success") {
                  Swal.fire({
                    title: result.message || "Success",
                    text: "",
                    icon: "success",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.jobCreationFrom.reset();
                      this.tableData = [];
                      this.close("reloadMainGrid");
                    }
                  });
                } else {
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.jobCreationFrom.reset();
                      this.tableData = [];
                      this.close();
                    }
                  });
                }
              } else {
                this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    if (this.jobCreationFrom.value[formControlName] != '') return;

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
          this.jobCreationFrom.controls[FORMNAME].setValue('')
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
  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
