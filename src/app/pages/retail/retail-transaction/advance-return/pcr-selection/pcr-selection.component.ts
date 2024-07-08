import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-pcr-selection',
  templateUrl: './pcr-selection.component.html',
  styleUrls: ['./pcr-selection.component.scss']
})
export class PcrSelectionComponent implements OnInit {
  strBranchcode: any = '';
  @Input() customerCode: any;
  @Output() selectionConfirmed = new EventEmitter<any[]>();

  columnsList: any[] = [
    { title: 'Voc No.', field: 'VOCNO' },
    { title: 'Voc Date', field: 'VOCDATE' },
    { title: 'Amount', field: 'AMOUNTFC' },
    { title: 'Balance Amount', field: 'BALANCE_FC' },
  ];
  pcrSelectionData: any[] = [];
  selectedRows: any[] = [];

  constructor(private activeModal: NgbActiveModal,
    private suntechApi: SuntechAPIService) {
    this.strBranchcode = localStorage.getItem('userbranch');
  }

  ngOnInit(): void {
    this.getPcrSelectionData();
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
