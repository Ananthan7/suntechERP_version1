import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {
  @Output() closebtnClick = new EventEmitter();

  lineItemForm: FormGroup;
  //variables
  public newDictionary: any;
  divisionMS:any;
  taxType:number = 1;
  viewOnly: boolean = false;
  pos_div_modelerrmsg:any;
  li_stone_rate_val:any;
  li_stone_amount_val:any;
  li_tag_val:any;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) {
    this.lineItemForm = this.formBuilder.group({
      fcn_li_item_code: [{ value: '', autofocus: true }, Validators.required],
      fcn_li_item_desc: ['', Validators.required],
      fcn_li_division: ['', Validators.required],
      fcn_li_location: [''],
      fcn_li_pcs: [{ value: 0 }, [Validators.required, Validators.min(1)]],
      fcn_li_gross_wt: ['', [Validators.required, Validators.min(0.1)]],
      fcn_li_stone_wt: [0, Validators.required],
      fcn_li_net_wt: [0, Validators.required],
      fcn_li_rate: [{ value: 0 }, [Validators.required, Validators.min(0.1)]],
      fcn_li_total_amount: [0, [Validators.required, Validators.min(1)]],
      fcn_li_discount_percentage: [0],
      fcn_li_discount_amount: [0],
      fcn_li_gross_amount: [0, [Validators.required, Validators.min(1)]],
      fcn_li_tax_percentage: [0, Validators.required],
      fcn_li_tax_amount: [0, Validators.required],
      fcn_li_net_amount: [0, [Validators.required, Validators.min(1)]],
      fcn_li_purity: [{ value: 0 }, Validators.required],
      fcn_li_pure_wt: [{ value: 0 }, Validators.required],
      fcn_ad_pcs: [0],
      fcn_ad_cts: [''],
      fcn_ad_gms: [0],
      fcn_ad_rate_type: [''],
      fcn_ad_rate: [0],
      fcn_ad_amount: [0],
      fcn_tab_details: [''],
      fcn_ad_making_rate: [0],
      fcn_ad_making_amount: [0],
      fcn_ad_stone_rate: [0],
      fcn_ad_stone_amount: [0],
      fcn_ad_metal_rate: [0],
      fcn_ad_metal_amount: [0],
    });
   }

  ngOnInit(): void {
  }
  getStockDesc(value:any){

  }
  changePCS(value:any){

  }
  changeGrossWt(value:any){

  }
  changeStoneWt(event:any) {

  }
  changeNettWt(event:any) {

  }
  changeRate(event:any) {

  }
  changeTotalAmt(event:any) {

  }
  changeDisPer(event:any) {

  }
  changeDisAmount(event:any) {

  }
  changeGrossAmt(event:any) {

  }
  changeNettAmt(event:any) {

  }
  changeStoneRate(event:any) {

  }
  changeStoneAmt(event:any) {

  }
  setValToLocalStorage(event:any,name:string) {

  }
  enforceMinMax(value:any){
    return this.commonService.enforceMinMax(value)
  }
  getMsgByID(value:any){
    return this.commonService.getMsgByID(value)
  }

  /**USE: close modal window */
  close() {
    this.closebtnClick.emit()
  }

}
