import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-box-master',
  templateUrl: './box-master.component.html',
  styleUrls: ['./box-master.component.scss']
})
export class BoxMasterComponent implements OnInit {
  itemDetailsData:any =[];

  columnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Box No" },
    { field: "BRANCH_CODE", caption: "Form Serial No" },
    { field: "VOCTYPE", caption: "Pcs" },
    { field: "DIVISION", caption: "Sub Pcs" },
    { field: "QTY", caption: "To Serial No" },
    { field: "amount", caption: "Stock Code" },
    { field: "PROFIT", caption: "Location" },
 
  ];
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

  boxMasterMainForm: FormGroup = this.formBuilder.group({

    boxno: [""],
    formserialno: [""],
    pcs: [""],
    subpcs: [""],
    toserialno: [""],
    location: [""],
    stockcode: [""],
    stockcodedesc: [""]

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

}
