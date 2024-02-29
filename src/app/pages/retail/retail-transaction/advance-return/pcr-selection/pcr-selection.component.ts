import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-pcr-selection',
  templateUrl: './pcr-selection.component.html',
  styleUrls: ['./pcr-selection.component.scss']
})
export class PcrSelectionComponent implements OnInit {
  strBranchcode: any = '';
  @Input() customerCode: any;

  columnsList: any[] = [
    { title: 'Voc No.', field: 'VOCNO' },
    { title: 'Voc Date', field: 'VOCDATE' },
    { title: 'Amount', field: 'AMOUNTFC' },
    { title: 'Balance Amount', field: 'BALANCE_FC' },
  ];
  pcrSelectionData: any[] = [];

  constructor(private activeModal: NgbActiveModal,
    private suntechApi: SuntechAPIService) {
    this.strBranchcode = localStorage.getItem('userbranch');
  }

  ngOnInit(): void {
    this.getPcrSelectionData()
  }

  getPcrSelectionData() {
    const postData = {
      "BranchCode": this.strBranchcode,
      // "CustomerCode": "JH225778" // need to change dynamically
      "CustomerCode":this.customerCode
    }
    this.suntechApi.postDynamicAPI('AdvanceReceipt/GetPOSPCRSelection/', postData).subscribe((result) => {
      console.log(result);


      if (result.status == 'Success') {
        this.pcrSelectionData = result.dynamicData[0];
        // this.tableData = result.response;
        // console.log(this.tableData);
      }
    });
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
