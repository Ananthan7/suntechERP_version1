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
  selectedTabIndexed =0;
  columnheadDetails:any=['Rep Voc No','Voc Date', 'Stock Code','Bag No','Customer Name','Mobile No','Delivery Date','Status']
  columnheadPendingItems:any=['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep Type','Delivery']
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = []; 
  viewMode: boolean = false;
  currentDate = new Date();

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
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'PARTY CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  branchTransferRepairRtnForm: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocNo: ["1"],
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
    this.yearMonth = this.comService.yearSelected;
    this.branchTransferRepairRtnForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.setFormValues();
    } else if (this.content.FLAG == 'EDIT') {
      this.viewMode = false;
      this.setFormValues();
    }
    // if (this.content?.MID != null){
    //   this.setFormValues();
    // this.viewMode = true;
    // }
  }

  salesManSelected(e:any){
    console.log(e);
    this.branchTransferRepairRtnForm.controls.salesMan.setValue(e.SALESPERSON_CODE);
  }

  partyCodeSelected(e:any){
    console.log(e);
  }
  
  branchCodeSelected(data: any) {
    console.log(data); 
    this.branchTransferRepairRtnForm.controls.branch.setValue(data.BRANCH_CODE);
    this.branchTransferRepairRtnForm.controls.branchName.setValue(data.BRANCH_NAME);    
  }

  setFormValues(){
    console.log('this.content', this.content);
    if (!this.content) return
    this.branchTransferRepairRtnForm.controls.branchCode.setValue(this.content.BRANCH_CODE);
    this.branchTransferRepairRtnForm.controls.vocType.setValue(this.content.VOCTYPE);
    this.branchTransferRepairRtnForm.controls.vocNo.setValue(this.content.VOCNO);
    this.branchTransferRepairRtnForm.controls.vocDate.setValue(this.content.VOCDATE);
    this.branchTransferRepairRtnForm.controls.yearMonth.setValue(this.content.YEARMONTH);
    this.branchTransferRepairRtnForm.controls.salesMan.setValue(this.content.SALESPERSON_CODE);
    this.branchTransferRepairRtnForm.controls.branch.setValue(this.content.BRANCHTO);
    this.branchTransferRepairRtnForm.controls.transferRemarks.setValue(this.content.REMARKS);
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
      "SYSTEM_DATE": "2024-03-06T13:12:01.635Z",
      "NAVSEQNO": 0,
      "STATUS": "string",
      "METALVOCNO": 0,
      "METALWEIGHT": 0,
      "METALAMOUNT": 0,
      "METALMID": 0,
      "METALVOCTYPE": "str",
      "METALCODE": "string",
      "DIAMONDCODE": "string",
      "DIAMONDVOCNO": 0,
      "DIAMONDVOCTYPE": "str",
      "DIAMONDMID": 0,
      "DIAMONDWGT": 0,
      "DIAMONDAMOUNT": 0,
      "SUPINVDATE": "2024-03-06T13:12:01.635Z",
      "SUPINVNO": "string",
      "TRANSFERBRANCH": "string",
      "AUTOPOSTING": true,
      "BRANCHTONAME": "string",
      "ISMETALDIAMOND": "string",
      "HASJOBDONE": "string",
      "PRINT_COUNT": 0,
      "POSCUSTCODE": "string",
      "POSCUSTNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "string",
      "JOBDONE": 0,
      "METALANDDIAMOND": 0
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
  console.log(this.branchCode,'working')
  let API = `RepairTransfer/UpdateRepairTransfer/${this.branchCode}/${this.branchTransferRepairRtnForm.value.voctype}/${this.branchTransferRepairRtnForm.value.vocNo}/${this.comService.yearSelected}` ;
  let postData = {
    "MID": 0,
    "BRANCH_CODE": this.branchCode,
    "VOCTYPE": this.branchTransferRepairRtnForm.value.vocType,
    "VOCNO": this.branchTransferRepairRtnForm.value.vocNo,
    "VOCDATE": this.branchTransferRepairRtnForm.value.vocDate,
    "YEARMONTH": this.yearMonth,
    "SALESPERSON_CODE": this.branchTransferRepairRtnForm.value.salesMan,
    "BRANCHTO": this.branchTransferRepairRtnForm.value.branch,
    "REMARKS": "string",
    "SYSTEM_DATE": "2024-03-06T13:12:01.635Z",
    "NAVSEQNO": 0,
    "STATUS": "string",
    "METALVOCNO": 0,
    "METALWEIGHT": 0,
    "METALAMOUNT": 0,
    "METALMID": 0,
    "METALVOCTYPE": "str",
    "METALCODE": "string",
    "DIAMONDCODE": "string",
    "DIAMONDVOCNO": 0,
    "DIAMONDVOCTYPE": "str",
    "DIAMONDMID": 0,
    "DIAMONDWGT": 0,
    "DIAMONDAMOUNT": 0,
    "SUPINVDATE": "2024-03-06T13:12:01.635Z",
    "SUPINVNO": "string",
    "TRANSFERBRANCH": "string",
    "AUTOPOSTING": true,
    "BRANCHTONAME": "string",
    "ISMETALDIAMOND": "string",
    "HASJOBDONE": "string",
    "PRINT_COUNT": 0,
    "POSCUSTCODE": "string",
    "POSCUSTNAME": "string",
    "PRINT_COUNT_ACCOPY": 0,
    "PRINT_COUNT_CNTLCOPY": 0,
    "HTUSERNAME": "string",
    "JOBDONE": 0,
    "METALANDDIAMOND": 0
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
}
