import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-cost-centre-diamond',
  templateUrl: './cost-centre-diamond.component.html',
  styleUrls: ['./cost-centre-diamond.component.scss']
})
export class CostCentreDiamondComponent implements OnInit {
  columnhead:any[] = ['Division','Description'];
  columnheader:any[] = ['Branch','Opening' ,'Purchase','Purchase','Sales (W)','Sales Return','Sales (Return)','Sales Return','Branch','Branch','Closing','Purchase','Imppr'];
  columnheaderConsignment:any[]=['Branch','Opening' ,'Purchase','Purchase','Sales (W)','Sales Return','Sales (Return)','Sales Return','Branch','Branch']
  divisionMS: any = 'ID';

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
