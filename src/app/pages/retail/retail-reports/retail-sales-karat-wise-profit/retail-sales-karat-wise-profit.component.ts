import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-retail-sales-karat-wise-profit',
  templateUrl: './retail-sales-karat-wise-profit.component.html',
  styleUrls: ['./retail-sales-karat-wise-profit.component.scss']
})
export class RetailSalesKaratWiseProfitComponent implements OnInit {

  columnhead:any[]=['Branch Code','Voc Type','Voc no','Karat Code','Pos Rate','Board Rate','Sales Gold Qty','Sales Gold Amount','Sales Gold Profit' ];

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
