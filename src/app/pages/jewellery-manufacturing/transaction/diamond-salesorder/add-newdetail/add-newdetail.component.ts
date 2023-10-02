import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-add-newdetail',
  templateUrl: './add-newdetail.component.html',
  styleUrls: ['./add-newdetail.component.scss']
})
export class AddNewdetailComponent implements OnInit {

  favoriteSeason: string = ''
  seasons: string[] = ['Metal', 'Stones'];
  season2: string[] = ['Metal', 'Stones', 'Total'];
  currentFilter: any;
  divisionMS: any = 'ID';
  private subscriptions: Subscription[] = [];

  columnheads: any[] = ['Div', 'Stone T', 'Comp C', 'Karat', 'PCS', 'Amount', 'Shape', 'Sieve', 'Lab.Rate', 'Wast', 'wast', 'wast', 'Lab.Amount', 'Sieve Desc', 'Size', 'Color'];
  columnhead: any[] = ['', '', '', '', '', '', '', '', '', '', '', '', ''];
  columnheader: any[] = ['', '', '', '', '', '', '', '', '', '', '', '', ''];
  columnheaders: any[] = ['Code', 'Div', 'Pcs', 'Qty', 'Rate', 'Amount', 'Wst %', 'Wst Amt', 'Lab Type'];
  columnheadmain: any[] = ['Stock Code', 'Stone Size', 'Stone Pcs', 'Stone Weight'];
  DesignCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  diamondSalesDetailForm: FormGroup = this.formBuilder.group({
    designCode: ['', [Validators.required]],
    voucherDESC: [''],
    voucherDate: ['', [Validators.required]],
    orderType: ['', [Validators.required]],
    PartyCode: ['', [Validators.required]],

  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }
  designCodeSelected(event: any) {
    this.diamondSalesDetailForm.controls.designCode.setValue(event.DESIGN_CODE)
  }
  //party Code Change
  partyCodeChange(event: any) {
    if (event.target.value == '') return
    this.snackBar.open('Loading...')
    let API = `AccountMaster/${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.response) {
          let data = result.response
          if (data.CURRENCY_CODE) {
            this.diamondSalesDetailForm.controls.partyCurrencyType.setValue(data.CURRENCY_CODE)
            this.diamondSalesDetailForm.controls.ItemCurrency.setValue(data.CURRENCY_CODE)
          }
        } else {
          this.toastr.error('PartyCode not found in Account Master', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.snackBar.dismiss()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
    this.subscriptions.push(Sub)
  }
 
  close() {
    this.activeModal.close();
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
