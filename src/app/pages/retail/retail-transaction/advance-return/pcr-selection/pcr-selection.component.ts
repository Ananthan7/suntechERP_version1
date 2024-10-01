import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { ItemDetailService } from 'src/app/services/modal-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-pcr-selection',
  templateUrl: './pcr-selection.component.html',
  styleUrls: ['./pcr-selection.component.scss']
})
export class PcrSelectionComponent implements OnInit {
  strBranchcode: any = '';
  shouldClose: boolean = true;
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
    private suntechApi: SuntechAPIService,
    private dialogService:ItemDetailService,
    private comService: CommonServiceService,) {
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
        this.pcrSelectionData = result.dynamicData[0].map((item:any, index:any) => {
          return { ...item, id: index + 1 }; 
        });

        this.pcrSelectionData.sort((a, b) => {
          const dateA = new Date(a.VOCDATE.split('/').reverse().join('/'));
          const dateB = new Date(b.VOCDATE.split('/').reverse().join('/'));
        
          return dateB.getTime() - dateA.getTime(); 
        });
        
        console.log(this.pcrSelectionData);
      }
    });
  }

  confirmSelection() {
    this.selectionConfirmed.emit(this.selectedRows);
  
    if (this.shouldClose) {
      this.close();
    }
  }

  onSelectionChanged(event: any) {
    this.selectedRows = event.selectedRowsData;
  }

  close(data?: any,isModalClose?:any) {
    if ((data||this.selectedRows.length) && !isModalClose) {
      this.activeModal.close(data);
    } else {
      const dialogRef = this.dialogService.openDialog('Warning', this.comService.getMsgByID('MSG1215'), false);
      
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action == 'Yes') {
          this.activeModal.close();
        }
      });
    }
  }


}
