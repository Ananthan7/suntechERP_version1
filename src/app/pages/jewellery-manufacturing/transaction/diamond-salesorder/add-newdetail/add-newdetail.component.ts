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
  column1: any[] = ['SRNO', 'DESIGN CODE', 'KARAT', 'METAL_COLOR', 'PCS', 'METAL_WT', 'GROSS_WT', 'RATEFC', 'RATECC'];

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
  })
  summaryDetailForm: FormGroup = this.formBuilder.group({
    CATEGORY_CODE: ['', [Validators.required]],
    SUBCATEGORY_CODE: ['', [Validators.required]],
    COLOR: ['', [Validators.required]],
    KARAT_CODE: ['', [Validators.required]],
    PURITY: ['', [Validators.required]],
    SUPPLIER_CODE: ['', [Validators.required]],
    SEQ_CODE: ['', [Validators.required]],
    BRAND_CODE: ['', [Validators.required]],
    TYPE_CODE: ['', [Validators.required]],
    SIZE: ['', [Validators.required]],
    SURFACEPROPERTY: ['', [Validators.required]],
    WIDTH: ['', [Validators.required]],
    THICKNESS: ['', [Validators.required]],
    ENGRAVING_TEXT: ['', [Validators.required]],
    ENGRAVING_FONT: ['', [Validators.required]],
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
    this.resizeGrid()
  }
  resizeGrid(){
    let resizableDiv:any = document.getElementById('resizableDiv');
    if (resizableDiv) {
      // Do something with the element
      console.log(resizableDiv,'resizableDiv');
    }
    let isResizing:boolean = false;

    resizableDiv.addEventListener('touchstart', (event:any) => {
      isResizing = true;
      event.preventDefault();
    });

    document.addEventListener('touchmove', (event) => {
      if (isResizing) {
        const touch = event.touches[0];
        resizableDiv.style.width = touch.clientX + 'px';
        event.preventDefault();
      }
    });

    document.addEventListener('touchend', () => {
      isResizing = false;
    });
  }
  designCodeSelected(data: any) {
    this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
    this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
    this.designCodeValidate({ target: { value: data.DESIGN_CODE } })
  }
  /**use: design code change fn to fetch data with design code */
  designCodeValidate(event: any) {
    // 'GetDesignStnmtlDetailNet'
    if (event.target.value == '') return
    this.snackBar.open('Loading...')
    let API = 'ExecueteSPInterface'
    let postData = {
      "SPID": "003",
      "parameter": {
        "FLAG": 'VIEW',
	      "DESIGNCODE": event.target.value || '', //TODO 'HM14437' 
        "METAL_COLOR": '',
        "MRG_PERC":'',
        "ACCODE":''
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.dynamicData) {
          let data:any = result.dynamicData[0]
          data = this.commonService.arrayEmptyObjectToString(data)
          data = data[0]
          this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
          this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
          if (data.PCS == 0) {
            this.diamondSalesDetailForm.controls.Pcs.setValue(1)
          }
          this.diamondSalesDetailForm.controls.Rate.setValue(data.RATE)
          this.diamondSalesDetailForm.controls.Rate.setValue(data.METALWT)
          this.diamondSalesDetailForm.controls.STOCK_CODE.setValue(data.STOCK_CODE)

          this.summaryDetailForm.controls.CATEGORY_CODE.setValue(data.CATEGORY_CODE)
          this.summaryDetailForm.controls.SUBCATEGORY_CODE.setValue(data.SUBCATEGORY_CODE)
          this.summaryDetailForm.controls.COLOR.setValue(data.COLOR)
          this.summaryDetailForm.controls.KARAT_CODE.setValue(data.KARAT_CODE)
          this.summaryDetailForm.controls.PURITY.setValue(data.PURITY)
          this.summaryDetailForm.controls.SUPPLIER_CODE.setValue(data.SUPPLIER_CODE)
          this.summaryDetailForm.controls.SEQ_CODE.setValue(data.SEQ_CODE)
          this.summaryDetailForm.controls.BRAND_CODE.setValue(data.BRAND_CODE)
          this.summaryDetailForm.controls.TYPE_CODE.setValue(data.TYPE_CODE)
          this.summaryDetailForm.controls.SIZE.setValue(data.SIZE)
          this.summaryDetailForm.controls.SURFACEPROPERTY.setValue(data.SURFACEPROPERTY)
          this.summaryDetailForm.controls.WIDTH.setValue(data.WIDTH)
          this.summaryDetailForm.controls.THICKNESS.setValue(data.THICKNESS)
          this.summaryDetailForm.controls.ENGRAVING_TEXT.setValue(data.ENGRAVING_TEXT)
          this.summaryDetailForm.controls.ENGRAVING_FONT.setValue(data.ENGRAVING_FONT)
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

  selectionChanged(data: any) {
    console.log(data, 'fireddddd');
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
