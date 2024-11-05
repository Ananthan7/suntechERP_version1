import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
  selector: 'app-fixing-commodity-master',
  templateUrl: './fixing-commodity-master.component.html',
  styleUrls: ['./fixing-commodity-master.component.scss']
})
export class FixingCommodityMasterComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }




  fixingcommodityForm: FormGroup = this.formBuilder.group({
    code:[],


  });



  karatcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  karatcodeSelected(e: any) {
    
  }

  formSubmit(){


  }


  deleteRecord(){

  }


  close(data?: any){
    this.activeModal.close(data);
  }

}
