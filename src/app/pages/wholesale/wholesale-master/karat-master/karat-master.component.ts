import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-karat-master',
  templateUrl: './karat-master.component.html',
  styleUrls: ['./karat-master.component.scss']
})
export class KaratMasterComponent implements OnInit {

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
