import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-labour-charge-master',
  templateUrl: './labour-charge-master.component.html',
  styleUrls: ['./labour-charge-master.component.scss']
})
export class LabourChargeMasterComponent implements OnInit {

  labourTypeList: any[] = [];
  divisionMS: any = 'ID';
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }
  formSubmit(){
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  diamondlabourMasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    code: [''],
    description: [''],
    metal: [''],
    color: [''],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes : [''],
    divCode : [''],
   
  });

  metallabourMasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    code: [''],
    description: [''],
    metal: [''],
    color: [''],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes : [''],
    divCode : [''],
   
  });

}