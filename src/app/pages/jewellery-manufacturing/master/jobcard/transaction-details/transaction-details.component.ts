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

  selectedTabIndex = 0;
  columnhead:any[] = [''];
  columnhead2:any[] = [''];
  columnhead3:any[] = ['VOCDATE','VOCTYPE','VOCNO','UNQ_JOB','DESIGN','FRM_PROCESS','FRM_WROKER','TO_PROCESS','TO_WROKER','METAL_PCS','METAL_WT','STONE_PCS','STONE_WT'];
  columnhead4:any[] = ['VOCDATE','VOCTYPE','VOCNO','UNQ_JOB','DESIGN','STOCK_CODE','GROSS_WEIGHT','METAL_WT','STONE_PCS','STONE_WT','AMOUNTFC','PRICE 1FC','PROCESS'];
  orders: any = [];
  viewOnly: boolean = false;
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

}
