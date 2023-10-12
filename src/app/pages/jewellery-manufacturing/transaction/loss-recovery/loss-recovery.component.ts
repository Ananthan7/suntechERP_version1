import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-loss-recovery',
  templateUrl: './loss-recovery.component.html',
  styleUrls: ['./loss-recovery.component.scss']
})
export class LossRecoveryComponent implements OnInit {
  divisionMS: any = 'ID';
  columnhead:any[] = ['',];
  columnheader:any[] = ['Sn No','Type','Worker Code','Process Code','Loss Qty','Recovery','Reco.Pure','Net Loss','Location To','Job Number','Job SO No','Design Code','Scrap UNQ Job'];

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,   
  ) { }

  ngOnInit(): void {
  }


  close(data?: any) {
    this.activeModal.close(data);
  }
 


  lossRecoveryFrom: FormGroup = this.formBuilder.group({

  });
  formSubmit() {

  }
}
