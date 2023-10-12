import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MeltingProcessDetailsComponent } from './melting-process-details/melting-process-details.component';
@Component({
  selector: 'app-melting-process',
  templateUrl: './melting-process.component.html',
  styleUrls: ['./melting-process.component.scss']
})
export class MeltingProcessComponent implements OnInit {
  columnhead:any[] = ['Job Code','Unique job ID','Design Code','Gross Wt.','Metal Wt','Stone Wt','RCVD Gross Weight','RCVD Metal Weight','Process code','Worker Code',];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  meltingIssueFrom: FormGroup = this.formBuilder.group({

  });
  openaddmeltingprocess() {
    const modalRef: NgbModalRef = this.modalService.open(MeltingProcessDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }
  formSubmit(){

  }

}

