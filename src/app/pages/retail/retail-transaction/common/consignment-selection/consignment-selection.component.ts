import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-consignment-selection',
  templateUrl: './consignment-selection.component.html',
  styleUrls: ['./consignment-selection.component.scss']
})
export class ConsignmentSelectionComponent implements OnInit {
  strBranchcode: any = '';
  @Input() customerCode: any;
  @Output() selectionConfirmed = new EventEmitter<any[]>();

  columnsList: any[] = [
    { title: 'Stock Code', field: 'stockCode' },
    { title: 'From', field: 'from' },
    { title: 'Supplier', field: 'supplier' },
    { title: 'Curr.Code', field: 'currCode' },

    { title: 'Curr.Rate', field: 'currRate' },
    { title: 'Pcs', field: 'pcs' },
    { title: 'Stock Qty', field: 'stockQty' },
    { title: 'Rtn/Pur', field: 'purRtn' },
    { title: 'Rate', field: 'rate' },
    { title: 'Disc %', field: 'discPerc' },

    { title: 'Net Rate', field: 'netRate' },
    { title: 'Mkg Cost', field: 'mkgCost' },
    { title: 'Landed Cost', field: 'landCost' },
    { title: 'Allocation Ref', field: 'allocRef' },
    

  ];
  pcrSelectionData: any[] = [];
  selectedRows: any[] = [];

  constructor(private activeModal: NgbActiveModal,
    private suntechApi: SuntechAPIService) {
    this.strBranchcode = localStorage.getItem('userbranch');
  }

  ngOnInit(): void {
    // this.getPcrSelectionData();
  }

  getPcrSelectionData() {
    const postData = {
      "BranchCode": this.strBranchcode,
      "CustomerCode": this.customerCode
    }
    this.suntechApi.postDynamicAPI('AdvanceReceipt/GetPOSPCRSelection', postData).subscribe((result) => {
      console.log(result);
      if (result.status == 'Success') {
        this.pcrSelectionData = result.dynamicData[0];
      }
    });
  }

  confirmSelection() {
    this.selectionConfirmed.emit(this.selectedRows);
    this.close();
  }

  onSelectionChanged(event: any) {
    this.selectedRows = event.selectedRowsData;
  }

  close(data?: any) {
    this.activeModal.close(data);
  }
}
