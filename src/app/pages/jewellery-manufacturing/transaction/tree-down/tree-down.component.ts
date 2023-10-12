import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tree-down',
  templateUrl: './tree-down.component.html',
  styleUrls: ['./tree-down.component.scss']
})
export class TreeDownComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,   
  ) { }

  ngOnInit(): void {
  }


  close(data?: any) {
    this.activeModal.close(data);
  }
  columnhead:any[] = ['Job Code','Unique job ID','Design Code','Gross Wt.','Metal Wt','Stone Wt','RCVD Gross Weight','RCVD Metal Weight','Process code','Worker Code',];


  castingTreeDownFrom: FormGroup = this.formBuilder.group({

  });
  formSubmit() {

  }

}
