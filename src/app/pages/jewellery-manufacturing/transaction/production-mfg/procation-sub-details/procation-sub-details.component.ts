import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-procation-sub-details',
  templateUrl: './procation-sub-details.component.html',
  styleUrls: ['./procation-sub-details.component.scss']
})
export class ProcationSubDetailsComponent implements OnInit {
  divisionMS: any = 'ID';
  columnheads : any[] = ["S.no","Stock Code","Design","Cost","Karat","Gross Wt","M.Pcs","St.Wt","St.value","Labour","Wastage","Total Cost"];
  columnhead: any[] = ["Div","Pcs","Gross Wt"];
  labourColumnhead: any[] = ["Code","Div","Pcs","Qty","Rate","Amount","Wastage %","Wastage Qty","Wastage Amt","Lab A/C","Unit","Lab Type"];
  componentsColumnhead: any[] = ["Sr.No","Div","Stock Code","Color","Clarity","Shape","Size","Sileve","Pcs","Gross Wt","Stone","Net Wt","Rate","Amount","%","Qty","Amt","s.Rate","S.Value"];

  productionItemsDetailsFrom: FormGroup = this.formBuilder.group({

  });

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



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

  }

}
