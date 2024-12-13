import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";

@Component({
  selector: "app-branch-transfer-repair-rtn",
  templateUrl: "./branch-transfer-repair-rtn.component.html",
  styleUrls: ["./branch-transfer-repair-rtn.component.scss"],
})
export class BranchTransferRepairRtnComponent implements OnInit {
  selectedTabIndex = 0;
  selectedTabIndexed = 0;
  columnheadDetails: any = ['Rep Voc No', 'Voc Date', 'Stock Code', 'Bag No', 'Customer Name', 'Mobile No', 'Delivery Date', 'Status']
  columnheadPendingItems: any = ['Div', 'Stock Code', 'Description', 'Bag No', 'Remarks', 'Pcs', 'Rep Type', 'Delivery']
  branchCode?: any = localStorage.getItem("userbranch");
  yearMonth?: any = localStorage.getItem("YEAR") || "";
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  PendingRepairJobsData: any;
  selectedRowKeys: any[] = [];
  rowData: any[] = [];
  viewMode: boolean = false;
  currentDate = new Date();
  userbranch = localStorage.getItem('userbranch');

  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'SALES MAN ',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'BRANCH CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'accode',
    SEARCH_HEADING: 'PARTY CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "accode<>'' AND  AC_OnHold = 0 AND BRANCH_CODE = '" + this.userbranch + "' AND Account_Mode='P'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  columnhead: any[] = [
    "Rep Voc No",
    "Stock Code",
    "Bag No",
    "Customer Name",
    "Mobile",
    "Deliver Date",
    "Status",
  ];

  columnheadDetailslist: any[] = [
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
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) { }

  branchTransferRepairRtnForm: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocNo: [""],
    vocDate: [new Date()],
    salesMan: [""],
    branch: [""],
    branchName: [""],
    partyCode: [""],
    partyName: [""],
    transferRemarks: [""],
  });

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    if(this.content?.FLAG != "VIEW" && this.content?.FLAG != "EDIT"){
    this.generateVocNo();
    }
    this.yearMonth = this.comService.yearSelected;
    this.branchTransferRepairRtnForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
    if (this.content?.FLAG == 'VIEW') {
      this.viewMode = true;
      this.setFormValues();
    } else if (this.content?.FLAG == 'EDIT') {
      this.viewMode = false;
      this.setFormValues();
    }
    // if (this.content?.MID != null){
    //   this.setFormValues();
    // this.viewMode = true;
    // }
    this.getPendingRepairJobs();
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  generateVocNo() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.branchCode
      }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res);

          this.branchTransferRepairRtnForm.controls.vocNo.setValue(res.newvocno);
        }
      });
  }

  getPendingRepairJobs() {
    let API = `ExecueteSPInterface`;
    let bodyData = {
      SPID: "095",
      parameter: {
        STRMAINVOCTYPE: "RET",//this.comService.getqueryParamVocType(),
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


  salesManSelected(e: any) {
    console.log(e);
    this.branchTransferRepairRtnForm.controls.salesMan.setValue(e.SALESPERSON_CODE);
  }

  partyCodeSelected(e: any) {
    console.log(e);
    this.branchTransferRepairRtnForm.controls.partyCode.setValue(e.ACCODE);
    this.branchTransferRepairRtnForm.controls.partyName.setValue(e.ACCOUNT_HEAD);
  }

  branchCodeSelected(data: any) {
    console.log(data);
    this.branchTransferRepairRtnForm.controls.branch.setValue(data.BRANCH_CODE);
    this.branchTransferRepairRtnForm.controls.branchName.setValue(data.BRANCH_NAME);
  }

  setFormValues() {
    // console.log('this.content', this.content);
    let values = this.content;
    const dateParts =values.VOCDATE.split('T')[0].split('-').join('/');
    const formattedDate = new Date(dateParts);
    console.log(dateParts);
    if (!values) return
    this.branchTransferRepairRtnForm.controls.vocNo.setValue(values.VOCNO);
    this.branchTransferRepairRtnForm.controls.branch.setValue(values.BRANCH_CODE);
    this.branchTransferRepairRtnForm.controls.branchName.setValue(values.BRANCHTONAME);
    this.branchTransferRepairRtnForm.controls.vocType.setValue(values.VOCTYPE);
    this.branchTransferRepairRtnForm.controls.vocDate.setValue(formattedDate);
    this.branchTransferRepairRtnForm.controls.partyCode.setValue(values.POSCUSTCODE);
    this.branchTransferRepairRtnForm.controls.partyName.setValue(values.POSCUSTNAME);
    this.branchTransferRepairRtnForm.controls.salesMan.setValue(values.SALESPERSON_CODE);
    this.branchTransferRepairRtnForm.controls.branch.setValue(values.BRANCHTO);
    this.branchTransferRepairRtnForm.controls.transferRemarks.setValue(values.REMARKS);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatebranchTransferRepairRTN()
      return
    }

    if (this.branchTransferRepairRtnForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'RepairTransfer/InsertRepairTransfer'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.branchTransferRepairRtnForm.value.vocType,
      "VOCNO": this.branchTransferRepairRtnForm.value.vocNo,
      "VOCDATE": this.branchTransferRepairRtnForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "SALESPERSON_CODE": this.branchTransferRepairRtnForm.value.salesMan,
      "BRANCHTO": this.branchTransferRepairRtnForm.value.branch,
      "REMARKS": this.branchTransferRepairRtnForm.value.transferRemarks,
      "SYSTEM_DATE": new Date(),
      "NAVSEQNO": 0,
      "STATUS": "",
      "METALVOCNO": 0,
      "METALWEIGHT": 0,
      "METALAMOUNT": 0,
      "METALMID": 0,
      "METALVOCTYPE": "",
      "METALCODE": "",
      "DIAMONDCODE": "",
      "DIAMONDVOCNO": 0,
      "DIAMONDVOCTYPE": "",
      "DIAMONDMID": 0,
      "DIAMONDWGT": 0,
      "DIAMONDAMOUNT": 0,
      "SUPINVDATE": new Date(),
      "SUPINVNO": "",
      "TRANSFERBRANCH": "",
      "AUTOPOSTING": true,
      "BRANCHTONAME": this.branchTransferRepairRtnForm.value.branchName,
      "ISMETALDIAMOND": "",
      "HASJOBDONE": "",
      "PRINT_COUNT": 0,
      "POSCUSTCODE": this.branchTransferRepairRtnForm.value.partyCode,
      "POSCUSTNAME": this.branchTransferRepairRtnForm.value.partyName,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "",
      "JOBDONE": 0,
      "METALANDDIAMOND": 0
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        console.log(result)

        if (result.response) {

          if (result.status.toString().trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              console.log(result)
              if (result.value) {
                this.close('reloadMainGrid')
              }
            });
            this.branchTransferRepairRtnForm.reset()
            this.tableData = []
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  updatebranchTransferRepairRTN() {
    console.log(this.branchCode, 'working');
    let API = `RepairTransfer/UpdateRepairTransfer/${this.branchCode}/${this.branchTransferRepairRtnForm.value.vocType}/${this.branchTransferRepairRtnForm.value.vocNo}/${this.comService.yearSelected}`;
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.branchTransferRepairRtnForm.value.vocType,
      "VOCNO": this.branchTransferRepairRtnForm.value.vocNo,
      "VOCDATE": this.branchTransferRepairRtnForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "SALESPERSON_CODE": this.branchTransferRepairRtnForm.value.salesMan,
      "BRANCHTO": this.branchTransferRepairRtnForm.value.branch,
      "REMARKS":this.branchTransferRepairRtnForm.value.transferRemarks,
      "SYSTEM_DATE": new Date(),
      "NAVSEQNO": 0,
      "STATUS": "",
      "METALVOCNO": 0,
      "METALWEIGHT": 0,
      "METALAMOUNT": 0,
      "METALMID": 0,
      "METALVOCTYPE": "",
      "METALCODE": "",
      "DIAMONDCODE": "",
      "DIAMONDVOCNO": 0,
      "DIAMONDVOCTYPE": "str",
      "DIAMONDMID": 0,
      "DIAMONDWGT": 0,
      "DIAMONDAMOUNT": 0,
      "SUPINVDATE":new Date(),
      "SUPINVNO": "",
      "TRANSFERBRANCH": "",
      "AUTOPOSTING": true,
      "BRANCHTONAME": this.branchTransferRepairRtnForm.value.branchName,
      "ISMETALDIAMOND": "",
      "HASJOBDONE": "",
      "PRINT_COUNT": 0,
      "POSCUSTCODE": this.branchTransferRepairRtnForm.value.partyCode,
      "POSCUSTNAME": this.branchTransferRepairRtnForm.value.partyName,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "",
      "JOBDONE": 0,
      "METALANDDIAMOND": 0
    }


    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim()   == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.branchTransferRepairRtnForm.reset()
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
    if (!this.content.branchCode) {
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
        let API = 'RepairTransfer/DeleteRepairTransfer/' + this.branchTransferRepairRtnForm.value.brnachCode + this.branchTransferRepairRtnForm.value.voctype + this.branchTransferRepairRtnForm.value.vocNo + this.branchTransferRepairRtnForm.value.yearMoth;
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
                    this.branchTransferRepairRtnForm.reset()
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
                    this.branchTransferRepairRtnForm.reset()
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
