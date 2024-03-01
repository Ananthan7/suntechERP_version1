import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-creditcard-posting',
  templateUrl: './pos-creditcard-posting.component.html',
  styleUrls: ['./pos-creditcard-posting.component.scss']
})
export class PosCreditcardPostingComponent implements OnInit {

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
