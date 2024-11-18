import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { JewelleryPurchaseDetailComponent } from './jewellery-purchase-detail/jewellery-purchase-detail.component';
import { JewelleryPurchaseOtherAmountComponent } from './jewellery-purchase-other-amount/jewellery-purchase-other-amount.component';

@Component({
  selector: 'app-jewellerypurchase',
  templateUrl: './jewellerypurchase.component.html',
  styleUrls: ['./jewellerypurchase.component.scss']
})
export class JewellerypurchaseComponent implements OnInit {

  selectedTabIndex = 0;
  tableData: any = [];
  modalReference!: NgbModalRef;

  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  JewellerypurchaseMasterForm: FormGroup = this.formBuilder.group({
    code: [''],
    Branch: [''],
    address: [''],
    CountryCode: [''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  BranchDataSelected(e: any) {

  }

  openNewJewelleryPurchaseDetails() {
    this.modalReference = this.modalService.open(JewelleryPurchaseDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  AddNewOtherAmountTableData(){
    this.modalReference = this.modalService.open(JewelleryPurchaseOtherAmountComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  deleteTableData() { }
}
