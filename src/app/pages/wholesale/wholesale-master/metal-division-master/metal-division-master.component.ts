import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metal-division-master',
  templateUrl: './metal-division-master.component.html',
  styleUrls: ['./metal-division-master.component.scss']
})
export class MetalDivisionMasterComponent implements OnInit {

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
