import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-producation-loss-recovery',
  templateUrl: './producation-loss-recovery.component.html',
  styleUrls: ['./producation-loss-recovery.component.scss']
})
export class ProducationLossRecoveryComponent implements OnInit {

  currentDate = new Date();
  columnhead:any= ['Srno','Type','Worker Code','Process Code','Scrap Gross Wt','Scrap Pure Wt','Location To','Job Number','Job So Number','Design Code','Scrap UNQ Job'];
  columHederMain:any = ['Srno','Worker code','Process Code','Job Number','Balance','Bal.pure','Remaining','Trans','Vocno','JobNumber','Job S','Design','Pcs','Loss Bo']
  constructor(private activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
