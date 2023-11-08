import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-costcentre-magkingcharges',
  templateUrl: './costcentre-magkingcharges.component.html',
  styleUrls: ['./costcentre-magkingcharges.component.scss']
})
export class CostcentreMagkingchargesComponent implements OnInit {

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
