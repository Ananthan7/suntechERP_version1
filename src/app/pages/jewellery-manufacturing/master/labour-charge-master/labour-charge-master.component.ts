import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-labour-charge-master',
  templateUrl: './labour-charge-master.component.html',
  styleUrls: ['./labour-charge-master.component.scss']
})
export class LabourChargeMasterComponent implements OnInit {
  @Input() content!: any;
  viewMode: boolean = false;
  forDesignOnlyTrue:boolean = true;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branch = localStorage.getItem('userbranch');
  private subscriptions: Subscription[] = [];

  methodList: any[] = [];
  labourTypeList: any[] = [];
  DialabourTypeList: any[] = [];
  unitList: any[] = [];
  currencyList: any[] = [];
  settingTypeList: any[] = [];
  divisionMS: any = 'ID';


  diamondlabourMasterForm: FormGroup = this.formBuilder.group({
    mid: [],
    divisions: ['', [Validators.required]],
    labour_code: ['', [Validators.required]],
    labour_description: ['', [Validators.required]],
    shape: ['', [Validators.required]],
    process: ['', [Validators.required]],
    size_from: ['', [Validators.required]],
    labour_ac: ['', [Validators.required]],
    size_to: ['', [Validators.required]],
    cost_rate: ['', [Validators.required]],
    sieve: ['', [Validators.required]],
    selling_rate: ['', [Validators.required]],
    sieve_desc: [''],
    selling: ['', [Validators.required]],
    ctWtFrom: ['', [Validators.required]],
    ctWtTo: ['', [Validators.required]],
    settingType: [''],
    labourType: ['', [Validators.required]],
    unitList: [''],
    method: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    accessories: [''],


  });

  metallabourMasterForm: FormGroup = this.formBuilder.group({
    mid: [],
    metalDivision: ['', [Validators.required]],
    stock_code: [''],
    metallabour_code: ['', [Validators.required]],
    metallabour_description: ['', [Validators.required]],
    metallabourType: ['', [Validators.required]],
    metalcurrency: ['', [Validators.required]],
    karat: [''],
    labourAc: ['', [Validators.required]],
    color: [''],
    metalcost_rate: [''],
    typecode: [''],
    metalselling_rate: [''],
    category: [''],
    metalSelling: [''],
    subCategory: [''],
    wastage: [''],
    brand: [''],
    metalunitList: ['', [Validators.required]],
    purity: [''],
    wtFrom: [''],
    wtTo: [''],
    onGrossWt: [false, [Validators.required]],
    forDesignOnly: [false, [Validators.required]]
  });

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 33,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  sizeFromCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size From',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  sizeToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size To',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  labouracCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Labour A/C',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  // metallabourMasterForm
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'BRAND MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }



  ngOnInit(): void {
    if (this.content) {
      this.setFormValues()
      this.setInitialValues()
    }
  
    // this.diamondlabourMasterForm = this.formBuilder.group({
    //   labourType: new FormControl(''),
    //   settingType: new FormControl({ value: '', disabled: true }),
    //   method: new FormControl({ value: '', disabled: true }),

    // });

    this.diamondlabourMasterForm.get('labourType')?.valueChanges.subscribe((selectedLabourType) => {
      const settingTypeControl = this.diamondlabourMasterForm.get('settingType');
      const methodControl = this.diamondlabourMasterForm.get('method');

      if (selectedLabourType === 'SETTING') {
        settingTypeControl?.enable();
        methodControl?.enable();
      } else {
        settingTypeControl?.disable();
        methodControl?.disable();
      }
    });


    this.metallabourMasterForm.controls['stock_code'].enable();
    this.metallabourMasterForm.controls['color'].enable();
    this.metallabourMasterForm.controls['metallabourType'].enable();

    this.getcurrencyOptions()



    this.DialabourTypeList = [
      {
        'name': 'SETTING',
        'value': 'SETTING'
      },
      {
        'name': 'HANDLING',
        'value': 'HANDLING'
      },
      {
        'name': 'CERTIFICATE',
        'value': 'CERTIFICATE'
      },
      {
        'name': 'GENERAL',
        'value': 'GENERAL'
      },
    ]

    this.settingTypeList = [
      {
        'name': 'GEN',
        'value': 'GEN'
      },
      {
        'name': 'PRESSURE',
        'value': 'PRESSURE'
      },
    ]

    this.labourTypeList = [
      {
        'name': 'MAKING',
        'value': 'MAKING'
      },
      {
        'name': 'POLISH',
        'value': 'POLISH'
      },
      {
        'name': 'FINISHING',
        'value': 'FINISHING'
      },
      {
        'name': 'CASTING',
        'value': 'CASTING'
      },
      {
        'name': 'GENERAL',
        'value': 'GENERAL'
      },
      {
        'name': 'RHODIUM',
        'value': 'RHODIUM'
      },
      {
        'name': 'STAMPING',
        'value': 'STAMPING'
      },
      {
        'name': 'WASTAGE',
        'value': 'WASTAGE'
      },
    ]
    this.unitList = [
      {
        'name': 'Lumpsum ',
        'value': 'Lumpsum '
      },
      {
        'name': 'PCS',
        'value': 'PCS'
      },
      {
        'name': 'Grams',
        'value': 'Grams'
      },
      {
        'name': 'Carat',
        'value': 'Carat'
      },
      {
        'name': 'Hours',
        'value': 'Hours'
      }
    ]
    this.methodList = [
      {
        'name': 'Hand Setting ',
        'value': 'Hand Setting '
      },
      {
        'name': 'Wax Setting',
        'value': 'Wax Setting'
      },
      {
        'name': 'Other Setting',
        'value': 'Other Setting'
      },
      {
        'name': 'GENERAL',
        'value': 'GENERAL'
      },

    ]

  }

  private setInitialValues() {
    console.log(this.commonService.amtFormat)
    this.metallabourMasterForm.controls.wtFromdeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.wtToDeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))

  }

  divisionCodeSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.divisions.setValue(e.DIVISION_CODE);
  }


  categorySelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.category.setValue(e.CODE);
  }

  subcategorySelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.subCategory.setValue(e.CODE);
  }

  brandSelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.brand.setValue(e.CODE);
  }

  typeCodeSelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.typecode.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    this.metallabourMasterForm.controls.color.setValue(data.CODE)
  }

  metaldivisionCodeSelected(e: any) {
    this.metallabourMasterForm.controls.metalDivision.setValue(e.DIVISION_CODE);
  }

  labouracSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.labour_ac.setValue(e.ACCODE);
  }

  labourAcSelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.labourAc.setValue(e.ACCODE);
  }

  sieveSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.sieve.setValue(e.CODE);
    this.diamondlabourMasterForm.controls.sieve_desc.setValue(e.DESCRIPTION);
    
  }

  stockCodeSelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.stock_code.setValue(e.STOCK_CODE);
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
    this.metallabourMasterForm.controls.purity.setValue(e.STD_PURITY);
  }

  currencyCodeSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.currency.setValue(e.CURRENCY_CODE);

  }

  metalcurrencyCodeSelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.metalcurrency.setValue(e.CURRENCY_CODE);


  }

  karatCodeSelected(e: any) {
    console.log(e);
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
    this.metallabourMasterForm.controls.purity.setValue(e.STD_PURITY);
  }

  shapeCodeSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.shape.setValue(e.CODE);
  }

  processCodeSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.process.setValue(e.Process_Code);
  }

  sizeToCodeSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.size_to.setValue(e.CODE);
  }

  sizeFromCodeSelected(e: any) {
    console.log(e);
    this.diamondlabourMasterForm.controls.size_from.setValue(e.CODE);
  }


  // USE: get select options Process TypeMaster
  private getcurrencyOptions(): void {
    let API = '/BranchCurrencyMaster/GetBranchCurrencyMasterDetail/' + this.branch;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.currencyList = result.response;
      }
    });
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    this.diamondlabourMasterForm.controls.mid.setValue(this.content.MID);
    this.diamondlabourMasterForm.controls.labour_code.setValue(this.content.CODE);
    this.diamondlabourMasterForm.controls.labour_description.setValue(this.content.DESCRIPTION);
    this.metallabourMasterForm.controls.labour_code.setValue(this.content.CODE);
    this.metallabourMasterForm.controls.labour_description.setValue(this.content.DESCRIPTION);
    this.diamondlabourMasterForm.controls.labourType.setValue(this.content.LABTYPE);
    this.diamondlabourMasterForm.controls.method.setValue(this.content.METHOD);
    this.diamondlabourMasterForm.controls.division.setValue(this.content.DIVISION);
    this.diamondlabourMasterForm.controls.shape.setValue(this.content.SHAPE);
    this.diamondlabourMasterForm.controls.size_from.setValue(this.content.SIZE_FROM);
    this.diamondlabourMasterForm.controls.size_to.setValue(this.content.SIZE_TO);
    this.diamondlabourMasterForm.controls.currency.setValue(this.content.CURRENCYCODE);
    this.diamondlabourMasterForm.controls.cost_rate.setValue(this.content.COST_RATE);
    this.diamondlabourMasterForm.controls.selling_rate.setValue(this.content.SELLING_RATE);
    this.metallabourMasterForm.controls.division.setValue(this.content.DIVISION_CODE);
    this.metallabourMasterForm.controls.currency.setValue(this.content.CURRENCY_CODE);
    this.diamondlabourMasterForm.controls.selling.setValue(this.content.SELLING_PER);
    this.diamondlabourMasterForm.controls.ctWtFrom.setValue(this.content.CARATWT_FROM);
    this.diamondlabourMasterForm.controls.ctWtTo.setValue(this.content.CARATWT_TO);
    this.diamondlabourMasterForm.controls.sieve.setValue(this.content.SIEVE);
    this.metallabourMasterForm.controls.wastage.setValue(this.content.WASTAGE_PER);
    this.diamondlabourMasterForm.controls.typecode.setValue(this.content.TYPE_CODE);
    this.metallabourMasterForm.controls.category.setValue(this.content.CATEGORY_CODE);
    this.metallabourMasterForm.controls.subCategory.setValue(this.content.SUB_CATEGORY_CODE);
    this.metallabourMasterForm.controls.brand.setValue(this.content.BRAND_CODE);
    this.diamondlabourMasterForm.controls.process.setValue(this.content.PROCESS_TYPE);
    this.metallabourMasterForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.metallabourMasterForm.controls.stock_code.setValue(this.content.STOCK_CODE);
    this.metallabourMasterForm.controls.purity.setValue(this.content.PURITY);
    this.metallabourMasterForm.controls.color.setValue(this.content.COLOR);
    this.metallabourMasterForm.controls.forDesignOnly.setValue(this.content.FOR_DESIGN);
    this.diamondlabourMasterForm.controls.sieve_desc.setValue(this.content.SIEVEFROM_DESC);
    this.metallabourMasterForm.controls.onGrossWt.setValue(this.content.ON_GROSSWT);
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.content.LAST_COST_RATE);
  }




  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatelabourChargeMaster()
      return
    }

    if (this.diamondlabourMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'LabourChargeMasterDj/InsertLabourChargeMaster'
    let postData = {
      "MID": 0,
      "SRNO": 0,
      "CODE": this.diamondlabourMasterForm.value.labour_code || "str",
      "DESCRIPTION": this.diamondlabourMasterForm.value.labour_description || "str",
      "LABTYPE": this.diamondlabourMasterForm.value.labourType || "",
      "METHOD": this.diamondlabourMasterForm.value.method || "",
      "DIVISION": this.diamondlabourMasterForm.value.division,
      "SHAPE": this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM": this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO": this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE": this.diamondlabourMasterForm.value.currency || "",
      "UNITCODE": this.diamondlabourMasterForm.value.unitList || "",
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate,
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate,
      "LAST_COST_RATE": this.metallabourMasterForm.value.metalcost_rate,
      "LAST_SELLING_RATE": this.metallabourMasterForm.value.metalselling_rate,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE": "",
      "DIVISION_CODE": this.metallabourMasterForm.value.division || "S",
      "CURRENCY_CODE": this.metallabourMasterForm.value.currency || "",
      "SELLING_PER": this.diamondlabourMasterForm.value.selling,
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom || 0,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo || 0,
      "SIEVE": this.diamondlabourMasterForm.value.sieve,
      "WASTAGE_PER": this.metallabourMasterForm.value.wastage,
      "WASTAGE_AMT": 0,
      "TYPE_CODE": this.diamondlabourMasterForm.value.typecode || "",
      "CATEGORY_CODE": this.metallabourMasterForm.value.category,
      "SUB_CATEGORY_CODE": this.metallabourMasterForm.value.subCategory,
      "BRAND_CODE": this.metallabourMasterForm.value.brand,
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process || "",
      "KARAT_CODE": this.metallabourMasterForm.value.karat,
      "METALSTONE": "",
      "STOCK_CODE": this.metallabourMasterForm.value.stock_code,
      "PURITY": this.metallabourMasterForm.value.purity,
      "COLOR": this.metallabourMasterForm.value.color,
      "FOR_DESIGN": this.metallabourMasterForm.value.forDesignOnly,
      "SIEVEFROM_DESC": this.diamondlabourMasterForm.value.sieve_desc,
      "ON_GROSSWT": this.metallabourMasterForm.value.onGrossWt
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.diamondlabourMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  updatelabourChargeMaster() {
    let API = 'LabourChargeMasterDj/UpdateLabourChargeMaster/' + this.diamondlabourMasterForm.value.mid;
    let postData = {
      "MID": 0,
      "SRNO": 0,
      "CODE": this.diamondlabourMasterForm.value.labour_code,
      "DESCRIPTION": this.diamondlabourMasterForm.value.labour_description,
      "LABTYPE": this.diamondlabourMasterForm.value.labourType || "",
      "METHOD": this.diamondlabourMasterForm.value.method || "",
      "DIVISION": this.diamondlabourMasterForm.value.division,
      "SHAPE": this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM": this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO": this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE": this.diamondlabourMasterForm.value.currency || "",
      "UNITCODE": this.diamondlabourMasterForm.value.unitList || "",
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate || "",
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate || "",
      "LAST_COST_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE": "",
      "DIVISION_CODE": this.metallabourMasterForm.value.metalDivision,
      "CURRENCY_CODE": this.metallabourMasterForm.value.currency || "",
      "SELLING_PER": this.diamondlabourMasterForm.value.selling || "",
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom || 0,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo || 0,
      "SIEVE": this.diamondlabourMasterForm.value.sieve || "",
      "WASTAGE_PER": this.metallabourMasterForm.value.wastage || "",
      "WASTAGE_AMT": 0,
      "TYPE_CODE": this.diamondlabourMasterForm.value.typecode || "",
      "CATEGORY_CODE": this.metallabourMasterForm.value.category || "",
      "SUB_CATEGORY_CODE": this.metallabourMasterForm.value.subCategory || "",
      "BRAND_CODE": this.metallabourMasterForm.value.brand || "",
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process || "",
      "KARAT_CODE": this.metallabourMasterForm.value.karat || "0",
      "METALSTONE": "s",
      "STOCK_CODE": this.metallabourMasterForm.value.stock_code || "",
      "PURITY": this.metallabourMasterForm.value.purity || 0,
      "COLOR": this.metallabourMasterForm.value.color || "",
      "FOR_DESIGN": this.metallabourMasterForm.value.forDesignOnly,
      "SIEVEFROM_DESC": this.diamondlabourMasterForm.value.sieve_desc || "",
      "ON_GROSSWT": this.metallabourMasterForm.value.onGrossWt
    }
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.diamondlabourMasterForm.reset()
                this.metallabourMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (!this.content.WORKER_CODE) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'LabourChargeMasterDj/DeleteLabourChargeMaster/' + this.content.MID;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.diamondlabourMasterForm.reset()
                    this.metallabourMasterForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.diamondlabourMasterForm.reset()
                    this.metallabourMasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  onforDesignOnlyChange(event: any) {
    console.log(event);
    if (event.checked === true) {
      this.metallabourMasterForm.controls['stock_code'].disable();
      this.metallabourMasterForm.controls['color'].disable();
      this.metallabourMasterForm.controls['metallabourType'].disable();
    }
    else {
      this.metallabourMasterForm.controls['stock_code'].enable();
      this.metallabourMasterForm.controls['color'].enable();
      this.metallabourMasterForm.controls['metallabourType'].enable();
    }
  }


}
