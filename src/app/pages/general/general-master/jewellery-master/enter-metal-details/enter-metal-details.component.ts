import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enter-metal-details',
  templateUrl: './enter-metal-details.component.html',
  styleUrls: ['./enter-metal-details.component.scss']
})
export class EnterMetalDetailsComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
   
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
