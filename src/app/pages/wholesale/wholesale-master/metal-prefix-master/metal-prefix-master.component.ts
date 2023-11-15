import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metal-prefix-master',
  templateUrl: './metal-prefix-master.component.html',
  styleUrls: ['./metal-prefix-master.component.scss']
})
export class MetalPrefixMasterComponent implements OnInit {

  constructor( private activeModal: NgbActiveModal,) { }
  divisionMS: any = 'ID';
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
