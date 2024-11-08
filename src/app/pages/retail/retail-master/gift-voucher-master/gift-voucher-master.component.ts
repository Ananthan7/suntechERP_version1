import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-gift-voucher-master',
  templateUrl: './gift-voucher-master.component.html',
  styleUrls: ['./gift-voucher-master.component.scss']
})
export class GiftVoucherMasterComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();

  
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


  giftVoucherMasterForm: FormGroup = this.formBuilder.group({

    pricecode: [""],
    currency: [""]


  })


  PLACCodeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'P/L Ac Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  formSubmit(){}


  deleteRecord() {}


  dobValueSetting(event: any) {
  }

  PLACCodeCodeSelected(e:any){
    console.log(e);
   
  }

}
