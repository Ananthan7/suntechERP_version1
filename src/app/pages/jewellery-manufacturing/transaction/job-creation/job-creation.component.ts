import { Component, Input, OnInit } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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

@Component({
  selector: "app-job-creation",
  templateUrl: "./job-creation.component.html",
  styleUrls: ["./job-creation.component.scss"],
})
export class JobCreationComponent implements OnInit {
  divisionMS: any;
  columnhead: any[] = ["SL No", "Date", "Stock Code", "Party", "Delivery Date", "Partyname", "Remarks", "Pending Days", "Design Code", "Description", "Pcs Order", "Extra Pcs", "Balance Pcs", "Pcs/Bag", "No Bags", "Metal Wt", "Stone Wt", "Gross Wt", "Unq Design", "SRNO"];
  columnheader: any[] = ["SL No", "Orders", "Design Code", "Stock Code", "Job Number", "Job Description", "Karat", "Total Pcs", "Stone Wt", "Metal Wt", "Gross Wt", "Category", "Sub Category", "Brand Code", "Metal Color", "Type", "Seq.Code", "Actualpcs", "YEARMONTH", "PartyCode", "DSO_SRNO"];
  @Input() content!: any;
  tableData: any[] = [];
  branchCode?: String;
  yearMonth?: String;
  userName = localStorage.getItem("username");
  private subscriptions: Subscription[] = [];
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
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;    
    this.userName = this.commonService.userName; 
    this.yearMonth = this.commonService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
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
  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.jobCreationFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

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
          if (result.response) {
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
            }
          } else {
            this.toastr.error("Not saved");
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
    if (this.jobCreationFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

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
          if (result.response) {
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
            }
          } else {
            this.toastr.error("Not saved");
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
                this.toastr.error("Not deleted");
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }
}
