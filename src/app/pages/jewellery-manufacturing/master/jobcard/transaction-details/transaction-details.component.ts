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
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {

  tableDataProcess: any[] = [];
  tableDataProcessMetalReturn: any[] = [];
  tableDataProcessStoneIssue: any[] = [];
  tableDataProcessStoneReturn: any[] = [];
  tableDataProcesstransaction: any[] = [];
  tableDataproduction: any[] = [];
  selectedTabIndex = 0;
  columnhead: any[] = [''];
  columnhead2: any[] = [''];
  columnhead3: any[] = ['VOCDATE', 'VOCTYPE', 'VOCNO', 'UNQ_JOB', 'DESIGN', 'FRM_PROCESS', 'FRM_WROKER', 'TO_PROCESS', 'TO_WROKER', 'METAL_PCS', 'METAL_WT', 'STONE_PCS', 'STONE_WT', 'LOSS_QTY', 'SCRAP_WT', 'APPROVE', 'PURE_WT', 'IN_DATE', 'OUT_DATE', 'TIME_CO', 'YEARMONTH', 'UNQ_DESIGN'];
  columnhead4: any[] = ['VOCDATE', 'VOCTYPE', 'VOCNO', 'UNQ_JOB', 'DESIGN', 'STOCK_CODE', 'GROSS_WEIGHT', 'METAL_WT', 'STONE_PCS', 'STONE_WT', 'AMOUNTFC', 'PRICE 1FC', 'PROCESS', 'WORKER', 'METAL_AMOUNT', 'STONE_AMOUNT', 'LAB_AMOUNT', 'YEARMONTH', 'UNQ_DESIGN', 'COST_CODE'];
  orders: any = [];
  viewOnly: boolean = false;
  branchCode?: String;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;

    //first result Metal Issue
    //Second result Metal Return
       //three result Stone Issue
    //Four result Stone Return
     //Fifth result Process transaction
       //Sixth result Production

      this.transactionDetails();

  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  removeLineItemsGrid(event: any) {
  }
  editTable(event: any) {
  }

  customizeWeight(data: any) {
    return 'Wt: ' + data['value'];
  }
  customizeQty(data: any) {
  }
  customizeDate(data: any) {
    // return "First: " + new DatePipe("en-US").transform(data.value, 'MMM dd, yyyy');
  }

  transactionDetails(){
    this.commonService.toastSuccessByMsgId('MSG81447');
    //let API = 'JobTransactionsGrid/GetJobTransaction/' + this.branchCode + '/' + 524;
    let API = 'JobTransactionsGrid/GetJobTransaction/'+this.branchCode+'/'+14480;
   
   let Sub: Subscription = this.dataService.getDynamicAPI(API)
     .subscribe(
       (result) => {
         if (result.status === 'Success' && result.dynamicData) {
           this.tableDataProcess = result.dynamicData[0]
           this.tableDataProcessMetalReturn = result.dynamicData[2]
           this.tableDataProcessStoneIssue = result.dynamicData[3]
           this.tableDataProcessStoneReturn = result.dynamicData[4]
           this.tableDataProcesstransaction = result.dynamicData[5]
           this.tableDataproduction = result.dynamicData[0][6]
           console.log(result.dynamicData);
           console.log(this.tableDataProcess);
           console.log(this.tableDataProcessMetalReturn);
           console.log(this.tableDataProcessStoneIssue);
           console.log(this.tableDataProcessStoneReturn);
           console.log(this.tableDataProcesstransaction);
           console.log(this.tableDataproduction);

         } else {
           this.commonService.toastErrorByMsgId('MSG1531');
         }
       },
       err => {
         console.error('Error fetching data:', err);
         this.commonService.toastErrorByMsgId('MSG1531');
       }
     );
  }

  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "051",
      "parameter": {
        'strBranch': this.commonService.nullToString(this.branchCode),
        'strJobNumber': this.commonService.nullToString(event.target.value),

      }
    }
  }

}
