import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { JewelleryPurchaseDetailComponent } from './jewellery-purchase-detail/jewellery-purchase-detail.component';
import { JewelleryPurchaseOtherAmountComponent } from './jewellery-purchase-other-amount/jewellery-purchase-other-amount.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jewellerypurchase',
  templateUrl: './jewellerypurchase.component.html',
  styleUrls: ['./jewellerypurchase.component.scss']
})
export class JewellerypurchaseComponent implements OnInit {

  selectedTabIndex = 0;
  tableData: any = [{
    SRNO: 1,
    DIVISION_CODE: 'A1',
    STOCK_CODE: 'SC001',
    METAL_WT: 5.50,
    PURITY: 95.000000,
    PURE_WT: 5.22,
    DIA_PCS: 10,
    DIA_CARAT: 3.22,
    STN_PCS: 15,
    STN_CARAT: 4.80,
    RATE: 500.00,
    AMOUNT: 2600.00
  },
  {
    SRNO: 2,
    DIVISION_CODE: 'B2',
    STOCK_CODE: 'SC002',
    METAL_WT: 10.50,
    PURITY: 92.000000,
    PURE_WT: 9.66,
    DIA_PCS: 20,
    DIA_CARAT: 6.50,
    STN_PCS: 25,
    STN_CARAT: 8.12,
    RATE: 600.00,
    AMOUNT: 5100.00
  },];
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
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.findDistance('689101','686574')
  }

  getCoordinates(pincode: string) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`;
    return this.http.get(apiUrl);
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }
  
  distance:any;

  findDistance(pincode1: string, pincode2: string) {
    Promise.all([
      this.getCoordinates(pincode1).toPromise(),
      this.getCoordinates(pincode2).toPromise(),
    ]).then((responses: any[]) => {
      const lat1 = responses[0][0].lat;
      const lon1 = responses[0][0].lon;
      const lat2 = responses[1][0].lat;
      const lon2 = responses[1][0].lon;
  
      this.distance = this.calculateDistance(Number(lat1), Number(lon1), Number(lat2), Number(lon2));
      console.log(this.distance);
    }).catch(error => console.error('Error fetching coordinates:', error));
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

  onCellPrepared(e: any) {
    if (e.rowType === 'header') {
        e.cellElement.style.textAlign = 'center';
    }
}


}
