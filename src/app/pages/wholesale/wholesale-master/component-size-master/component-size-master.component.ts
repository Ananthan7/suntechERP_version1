import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-component-size-master',
  templateUrl: './component-size-master.component.html',
  styleUrls: ['./component-size-master.component.scss']
})
export class ComponentSizeMasterComponent implements OnInit {

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
