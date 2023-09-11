import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-labour-charge-master',
  templateUrl: './labour-charge-master.component.html',
  styleUrls: ['./labour-charge-master.component.scss']
})
export class LabourChargeMasterComponent implements OnInit {
  divisionMS: any = 'ID';
  labourTypeList: any[] = [];
  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }
  formSubmit(){
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

}