import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-costcentre-consumable',
  templateUrl: './costcentre-consumable.component.html',
  styleUrls: ['./costcentre-consumable.component.scss']
})
export class CostcentreConsumableComponent implements OnInit {

  columnhead:any[] = ['Branch','Opening' ,'Purchase','Purchase','Sales (W)','Sales Return','Sales (Return)','Sales Return','Branch','Branch','Closing','Purchase','Imppr'];
  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  addTableData(){

  }
  
  deleteTableData(){
   
  }

}
