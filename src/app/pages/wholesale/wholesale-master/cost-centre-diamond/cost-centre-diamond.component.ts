import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CostCentreDiamondDetailsComponent } from './cost-centre-diamond-details/cost-centre-diamond-details.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cost-centre-diamond',
  templateUrl: './cost-centre-diamond.component.html',
  styleUrls: ['./cost-centre-diamond.component.scss']
})
export class CostCentreDiamondComponent implements OnInit {
  columnhead:any[] = ['Division','Description'];
  columnheader:any[] = ['Branch','Opening' ,'Purchase','Purchase','Sales (W)','Sales Return','Sales (Return)','Sales Return','Branch','Branch','Closing','Purchase','Imppr'];
  columnheaderConsignment:any[]=['Branch','Opening' ,'Purchase','Purchase','Sales (W)','Sales Return','Sales (Return)','Sales Return','Branch','Branch']
  divisionMS: any = 'ID';

  constructor(
    private activeModal: NgbActiveModal,
    private modalService : NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }
  costcenterdiamondForm: FormGroup = this.formBuilder.group({
    purchase:[],
    sales:[],
    branchtransfer:[],
   

  })

  purchaseCodeData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: 'GST_CODE',
    SEARCH_HEADING: 'Purchase',
    SEARCH_VALUE: '',
    WHERECONDITION: "GST_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  

  salesCodeData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: 'GST_CODE',
    SEARCH_HEADING: 'Sales',
    SEARCH_VALUE: '',
    WHERECONDITION: "GST_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  

  branchtransferCodeData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: 'GST_CODE',
    SEARCH_HEADING: 'Branch Transfer',
    SEARCH_VALUE: '',
    WHERECONDITION: "GST_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
 
  purchaseCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamondForm.controls.purchase.setValue(e.GST_CODE);
  }

  salesCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamondForm.controls.sales.setValue(e.GST_CODE);
  }

  branchtransferDataSelected(data: any) {
    this.costcenterdiamondForm.controls.branchtransfer.setValue(data.GST_CODE)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openCostCentreDiamond(){
    const modalRef: NgbModalRef = this.modalService.open(CostCentreDiamondDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

}
