import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-branch-transfer-repair-out",
  templateUrl: "./branch-transfer-repair-out.component.html",
  styleUrls: ["./branch-transfer-repair-out.component.scss"],
})
export class BranchTransferRepairOutComponent implements OnInit {
  @Input() content!: any;

  branchCode?: any = localStorage.getItem("userbranch");
  yearMonth?: any = localStorage.getItem("YEAR") || "";
  PendingRepairJobsData: any;
  selectedRowKeys: any[] = [];
  rowData: any[] = [];
  gridData:any;
  isEdit:boolean = false;
  private subscriptions: Subscription[] = [];

  currentDate = new Date();
  tableData: any[] = [];
  strBranchcode: any = "";
  columnhead: any[] = [
    "Rep Voc No",
    "Stock Code",
    "Bag No",
    "Customer Name",
    "Mobile",
    "Deliver Date",
    "Status",
  ];
  columnheadDetails: any[] = [
    "Div",
    "Stock Code",
    "Description",
    "Bag No",
    "Remarks",
    "Pcs",
    "Rep type",
    "Delivery",
  ];
  

  constructor(
    private datePipe: DatePipe,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService
  ) {}
  repairtransferform: FormGroup = this.formBuilder.group({
    voctype: [""],
    vocNo: [""],
    vocdate: [new Date()],
    salesman: [""],
    branchcode: [""],
    branchname: [""],
    remarks: [""],
  });
  ngOnInit(): void {
    console.log(this.content);
    if(this.content?.MID != null) {
      this.getRepairTransferbyid()
    }
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;

    this.repairtransferform.controls.voctype.setValue(
      this.comService.getqueryParamVocType()
    );
    console.log(this.comService.getqueryParamVocType());
    

    this.generateVocNo();
    this.getPendingRepairJobs();
  }
  date(e: any) {
    console.log(e);
    console.log(this.repairtransferform.value.vocdate._d.toISOString())
  }

  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "Salesman type",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  salesManCodeSelected(e: any) {
    this.repairtransferform.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "Salesman type",
    SEARCH_VALUE: "",
    WHERECONDITION: "Branch_Code<>'" + this.branchCode + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  branchCodeSelected(e: any) {
    console.log(e);
    this.repairtransferform.controls.branchcode.setValue(e.BRANCH_CODE);
    this.repairtransferform.controls.branchname.setValue(e.BRANCH_NAME);
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  generateVocNo() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${
      this.branchCode
    }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.repairtransferform.controls.vocNo.setValue(res.newvocno);
        }
      });
  }

  getRepairTransferbyid(){
    console.log(this.content);
    // let DATE = this.datePipe.transform(this.content.VOCDATE, 'dd/MM/yyyy');
    // const vocdate =  new Date(this.content.VOCDATE,'dd-mm-yyyy').toLocaleDateString();
    // console.log(DATE);
    const dateParts = this.content.VOCDATE.split('T')[0].split('-').reverse().join('/');
    this.repairtransferform.controls.voctype.setValue(this.content.VOCNO);
    this.repairtransferform.controls.branchcode.setValue(this.content.BRANCH_CODE);
    this.repairtransferform.controls.branchname.setValue(this.content.BRANCHTONAME);
    this.repairtransferform.controls.vocdate.setValue(new Date(dateParts));
    console.log(this.content.VOCDATE);
    
    this.repairtransferform.controls.salesman.setValue(this.content.SALESPERSON_CODE);
    this.repairtransferform.controls.remarks.setValue(this.content.REMARKS);
  }

  getPendingRepairJobs() {
    let API = `ExecueteSPInterface`;
    let bodyData = {
      SPID: "095",
      parameter: {
        STRMAINVOCTYPE: this.comService.getqueryParamVocType(),
        STRBRANCHCODE: this.branchCode,
        STRJOBSTATUS: "0",
      },
    };

    let sub: Subscription = this.dataService
      .postDynamicAPI(API, bodyData)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res.dynamicData);
const uniqueItems = new Set();

res.dynamicData[0].forEach((item: any) => {
  const identifier = item.MID;

  if (!uniqueItems.has(identifier)) {
    uniqueItems.add(identifier);
  }
});

this.PendingRepairJobsData = Array.from(uniqueItems).map((identifier: any) => {
  return res.dynamicData[0].find((item: any) => item.MID === identifier);
}).map((item: any) => ({
  ...item,
  DELIVERYDATE: new Date(item.DELIVERYDATE).toLocaleDateString(),
}));

        console.log(this.PendingRepairJobsData);

          console.log(this.PendingRepairJobsData.DELIVERYDATE);
        }
      });
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  validateForm() {
    if (this.repairtransferform.invalid) {
      this.toastr.error("Select all required fields");
      return false;
    }
    return true;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.updaterepairtransfer();
      return;
    }
    if (!this.validateForm()) {
      return;
    }

    let API = "RepairTransfer/InsertRepairTransfer";
    let postData = {
      MID: 0,
      BRANCH_CODE: this.repairtransferform.value.branchcode,
      VOCTYPE: this.repairtransferform.value.voctype,
      VOCNO: this.repairtransferform.value.vocNo,
      VOCDATE: this.repairtransferform.value.vocdate,
      YEARMONTH: this.yearMonth,
      SALESPERSON_CODE: this.repairtransferform.value.salesman,
      BRANCHTO: "",
      REMARKS: this.repairtransferform.value.remarks,
      SYSTEM_DATE: new Date().toISOString(),
      NAVSEQNO: 0,
      STATUS: "",
      METALVOCNO: 0,
      METALWEIGHT: 0,
      METALAMOUNT: 0,
      METALMID: 0,
      METALVOCTYPE: "",
      METALCODE: "",
      DIAMONDCODE: "",
      DIAMONDVOCNO: 0,
      DIAMONDVOCTYPE: "",
      DIAMONDMID: 0,
      DIAMONDWGT: 0,
      DIAMONDAMOUNT: 0,
      SUPINVDATE: new Date().toISOString(),
      SUPINVNO: "",
      TRANSFERBRANCH: "",
      AUTOPOSTING: true,
      BRANCHTONAME: this.repairtransferform.value.branchname,
      ISMETALDIAMOND: "",
      HASJOBDONE: "",
      PRINT_COUNT: 0,
      POSCUSTCODE: "",
      POSCUSTNAME: "",
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      HTUSERNAME: "",
      JOBDONE: 0,
      METALANDDIAMOND: 0,
    };

    console.log(postData);

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.repairtransferform.reset();
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

  updaterepairtransfer() {
    if (this.repairtransferform.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API =
      `RepairTransfer/UpdateRepairTransfer/${this.content.BRANCH_CODE}/${this.content.VOCTYPE}/${this.content.VOCNO}/${this.content.YEARMONTH}`;
      
      let postData = {
        MID: 0,
        BRANCH_CODE: this.repairtransferform.value.branchcode,
        VOCTYPE: this.repairtransferform.value.voctype,
        VOCNO: this.repairtransferform.value.vocNo,
        VOCDATE: this.repairtransferform.value.vocdate,
        YEARMONTH: this.yearMonth,
        SALESPERSON_CODE: this.repairtransferform.value.salesman,
        BRANCHTO: "",
        REMARKS: this.repairtransferform.value.remarks,
        SYSTEM_DATE: new Date().toISOString(),
        NAVSEQNO: 0,
        STATUS: "",
        METALVOCNO: 0,
        METALWEIGHT: 0,
        METALAMOUNT: 0,
        METALMID: 0,
        METALVOCTYPE: "",
        METALCODE: "",
        DIAMONDCODE: "",
        DIAMONDVOCNO: 0,
        DIAMONDVOCTYPE: "",
        DIAMONDMID: 0,
        DIAMONDWGT: 0,
        DIAMONDAMOUNT: 0,
        SUPINVDATE: new Date().toISOString(),
        SUPINVNO: "",
        TRANSFERBRANCH: "",
        AUTOPOSTING: true,
        BRANCHTONAME: this.repairtransferform.value.branchname,
        ISMETALDIAMOND: "",
        HASJOBDONE: "",
        PRINT_COUNT: 0,
        POSCUSTCODE: "",
        POSCUSTNAME: "",
        PRINT_COUNT_ACCOPY: 0,
        PRINT_COUNT_CNTLCOPY: 0,
        HTUSERNAME: "",
        JOBDONE: 0,
        METALANDDIAMOND: 0,
      };

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {              
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.repairtransferform.reset();
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

  deleterepairtransfer() {
    if (!this.content.MID) {
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
        let API =
          "/RepairTransfer/DeleteRepairTransfer/" +
          this.repairtransferform.value.branchcode +
          this.repairtransferform.value.voctype +
          this.repairtransferform.value.vocno +
          this.repairtransferform.value.yearmonth;
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
                      this.repairtransferform.reset();
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
                      this.repairtransferform.reset();
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

  onSelectionChanged(selectionInfo: any) {
    console.log(selectionInfo);    
    const selectedRows = selectionInfo.selectedRowsData;  
    selectedRows.forEach((row:any) => {
      if (!this.selectedRowKeys.some(selected => selected.UNIQUEID === row.UNIQUEID)) {
        this.selectedRowKeys.push(row);       
      }
    });
    // console.log(this.rowData.length);
    console.log('Selection changed:', this.selectedRowKeys);
  }

  addTopos(){
    this.rowData =[];
    if(this.selectedRowKeys.length > 0){
    //this.rowData = this.selectedRowKeys;
    this.selectedRowKeys.forEach(element => {
      this.rowData.push(element);      
    });
    }
  }
  

  
  
}
