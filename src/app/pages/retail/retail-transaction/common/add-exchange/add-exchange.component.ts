import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-add-exchange',
  templateUrl: './add-exchange.component.html',
  styleUrls: ['./add-exchange.component.scss']
})
export class AddExchangeComponent implements OnInit {
  @Output() closebtnClick = new EventEmitter();

  exchangeForm: FormGroup;
  fcn_exchange_division_val:any;
  fcn_exchange_item_desc_val:any;
  _exchangeItemchange: any;

  viewOnly:boolean = true;
  exStockCodeFilteredOptions:any[] = []
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) {
    this.exchangeForm = this.formBuilder.group({
      fcn_exchange_division: ['', Validators.required],
      fcn_exchange_item_code: ['', Validators.required],
      fcn_exchange_item_desc: ['', Validators.required],
      fcn_exchange_pcs: [{ value: 0 }],
      // fcn_exchange_pcs: ['', Validators.required],
      fcn_exchange_gross_wt: [{ value: 0 }, Validators.required],
      fcn_exchange_stone_wt: [{ value: 0 }, Validators.required],
      fcn_exchange_net_wt: [{ value: 0 }, Validators.required],
      fcn_exchange_purity: [{ value: 0 }, Validators.required],
      fcn_exchange_pure_weight: [{ value: 0 }, Validators.required],
      fcn_exchange_purity_diff: [{ value: 0 }, Validators.required],
      fcn_exchange_stone_rate: [{ value: 0 }, Validators.required],
      fcn_exchange_stone_amount: [{ value: 0 }, Validators.required],
      fcn_exchange_metal_rate: [{ value: 0 }, Validators.required],
      fcn_exchange_metal_amount: [{ value: 0 }, Validators.required],
      fcn_exchange_chargeable_wt: [{ value: 0 }, Validators.required],
      fcn_exchange_making_rate: [{ value: 0 }, Validators.required],
      fcn_exchange_making_amt: [{ value: 0 }, Validators.required],
      fcn_exchange_net_amount: [{ value: 0 }, Validators.required],
    });
   }

  ngOnInit(): void {
  }

  enforceMinMax(value:any){
    return this.commonService.enforceMinMax(value)
  }

  getStockforExchange(value:any) {

  }
  exchangeStockCode(value:any) {

  }
  getExchangeNwtWt(value:any) {

  }
  changeExchangeStoneWt(value:any) {

  }
  changeExchangeNettWt(value:any) {

  }
  changeExPurity(value:any) {

  }
  changeExchangeStoneRate(value:any) {

  }
  changeExMakingRate(value:any) {

  }
  changeExchangeMetalAmt(value:any) {

  }
  changeExNetAmt(value:any) {

  }
  /**USE: close modal window */
  close() {
    this.closebtnClick.emit();
  }
}
