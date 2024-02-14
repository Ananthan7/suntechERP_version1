import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-order-lock-unlock',
  templateUrl: './order-lock-unlock.component.html',
  styleUrls: ['./order-lock-unlock.component.scss']
})
export class OrderLockUnlockComponent implements OnInit {

  columnhead:any[] = ['NO','BRANCH' ,'VOCTYPE' , 'VOCNO','VOCDATE','YEAR','SALESMAN','PARTY NAME','REMARKS','ORDER AMOUNT'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  formSubmit(){

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
