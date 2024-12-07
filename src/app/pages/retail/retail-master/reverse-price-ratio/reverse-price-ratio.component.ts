import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-reverse-price-ratio',
  templateUrl: './reverse-price-ratio.component.html',
  styleUrls: ['./reverse-price-ratio.component.scss']
})
export class ReversePriceRatioComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private modalService: NgbModal,
  ) { 
    
  }

  ngOnInit(): void {
  }


  reversepriceratioForm: FormGroup = this.formBuilder.group({
    code:[],


  });

  formSubmit(){


  }


  deleteRecord(){

  }


  close(data?: any){
    this.activeModal.close(data);
  }

}
