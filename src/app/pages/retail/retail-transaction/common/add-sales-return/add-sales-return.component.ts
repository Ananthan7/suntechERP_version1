import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-add-sales-return',
  templateUrl: './add-sales-return.component.html',
  styleUrls: ['./add-sales-return.component.scss']
})
export class AddSalesReturnComponent implements OnInit {
  @Output() closebtnClick = new EventEmitter();

  salesReturnForm: FormGroup;
  viewOnly:boolean = false;

  filteredOptions_year: any[] = [];
  filteredSalesReturnBranchOptions: any[] = [];
  vocTypesinExchange: any[] = [];
  sales_returns_items: any[] = [];
  salesReturnsItems_forVoc: any[] = [];

  fcn_returns_voc_date_val:any
  fcn_returns_sales_man_val:any
  fcn_returns_cust_code_val:any
  fcn_returns_cust_mobile_val:any
  sales_returns_total_amt:any
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) {
    this.salesReturnForm = this.formBuilder.group({
      fcn_returns_fin_year: ['', Validators.required],
      fcn_returns_branch: ['', Validators.required],
      fcn_returns_voc_type: ['', Validators.required],
      fcn_returns_voc_no: ['', Validators.required],
      fcn_returns_voc_date: ['', Validators.required],
      fcn_returns_sales_man: ['', Validators.required],
      fcn_returns_cust_code: ['', Validators.required],
      fcn_returns_cust_mobile: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }
  changeBranch(data:any){
  }
  getRetailSReturn_EvnFn(data:any){
  }
  changeRetailSalesReturnVal(data:any){
  }
  checkSelectedVal(stockCode:any, amtval:any, srNo:any) {

    return this.sales_returns_items.find(
      (data) => data.sn_no.toString() == srNo.toString()
      // data.stock_code == stockCode && data.total_amount == amtval
    );
  }
  addSalesReturnOnSelect(event:any, slsReturn:any, index:any) {
  }
  searchVocNoSalRet(){
  }
 
  /**USE: close modal window */
  close() {
    this.closebtnClick.emit();
  }
}
