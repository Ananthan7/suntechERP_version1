import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-consumable-master',
  templateUrl: './consumable-master.component.html',
  styleUrls: ['./consumable-master.component.scss']
})
export class ConsumableMasterComponent implements OnInit {

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
