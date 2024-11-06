import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  baseCurrencyList:any=[];

  constructor(
    private activeModal: NgbActiveModal,
  private modalService: NgbModal,
  private formBuilder: FormBuilder,
  private dataService: SuntechAPIService,
  private toastr: ToastrService,
  private commonService: CommonServiceService,
  ) { }
  

  ngOnInit(): void {
  }

  currencyMasterMainForm: FormGroup = this.formBuilder.group({

  })



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  formSubmit(){}


  deleteRecord() {}

}
