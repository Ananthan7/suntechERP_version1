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
    designDescription: ['', [Validators.required]],
    StockCode: [''],
    StockCodeDesc: ['', [Validators.required]],
    DeliveryType: ['', [Validators.required]],
    DeliveryType2: ['', [Validators.required]],
    ProductionDate: ['', [Validators.required]],
    DeliveryOnDate: ['', [Validators.required]],
    Remarks: [''],
    StockBOM: [false, [Validators.required]],
    Pcs: ['', [Validators.required]],
    MetalWeight: ['', [Validators.required]],
    Rate: ['', [Validators.required]],
    StoneWeight: ['', [Validators.required]],
    Amount: ['', [Validators.required]],
    GrossWeight: ['', [Validators.required]],
    STOCK_CODE: ['', [Validators.required]],
    CATEGORY_CODE: ['', [Validators.required]],

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
  designCodeSelected(data: any) {
    this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
    this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
    this.designCodeValidate({target: { value: data.DESIGN_CODE }})
  }
  /**use: design code change fn to fetch data with design code */
  designCodeValidate(event: any) {
    if (event.target.value == '') return
    this.snackBar.open('Loading...')
    let API = `DesignMaster/GetDesignMasterDetails/${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.response) {
          let data = result.response
          this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
          this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
          this.diamondSalesDetailForm.controls.CATEGORY_CODE.setValue(data.CATEGORY_CODE)
          this.diamondSalesDetailForm.controls.CATEGORY_CODE.setValue(data.SubCategory_Code)

          if(data.PCS == 0){
            this.diamondSalesDetailForm.controls.Pcs.setValue(1)
          }
          this.diamondSalesDetailForm.controls.Rate.setValue(data.RATE)
          this.diamondSalesDetailForm.controls.Rate.setValue(data.METALWT)
          this.diamondSalesDetailForm.controls.STOCK_CODE.setValue(data.STOCK_CODE)
        } else {
          this.toastr.error('Design Code not found', result.Message ? result.Message : '', {
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
