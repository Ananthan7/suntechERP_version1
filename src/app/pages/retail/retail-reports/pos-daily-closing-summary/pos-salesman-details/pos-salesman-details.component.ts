import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
  selector: 'app-pos-salesman-details',
  templateUrl: './pos-salesman-details.component.html',
  styleUrls: ['./pos-salesman-details.component.scss']
})
export class PosSalesmanDetailsComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


}
