import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branch = localStorage.getItem('userbranch');
  private subscriptions: Subscription[] = [];


  labourTypeList: any[] = [];
  unitList: any[] = [];
  currencyList : any[] = [];
  divisionMS: any = 'ID';
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }



  ngOnInit(): void {
    if(this.content){
      this.setFormValues()
    }
    this.getcurrencyOptions()
    this.labourTypeList =[
      {
        'name':'MAKING',
        'value':'MAKING'
      },
      {
        'name':'POLISH',
        'value':'POLISH'
      },
      {
        'name':'FINISHING',
        'value':'FINISHING'
      },
      {
        'name':'CASTING',
        'value':'CASTING'
      },
      {
        'name':'GENERAL',
        'value':'GENERAL'
      },
      {
        'name':'RHODIUM',
        'value':'RHODIUM'
      },
      {
        'name':'STAMPING',
        'value':'STAMPING'
      },
      {
        'name':'WASTAGE',
        'value':'WASTAGE'
      },
    ]
    this.unitList= [
      {
      'name':'Lumpsum ',
      'value':'Lumpsum '
    },
    {
      'name':'PCS',
      'value':'PCS'
    },
    {
      'name':'Grams',
      'value':'Grams'
    },
    {
      'name':'Carat',
      'value':'Carat'
    },
    {
      'name':'Hours',
      'value':'Hours'
    }
    ]
  }

   // USE: get select options Process TypeMaster
   private getcurrencyOptions():void {
    let API = '/BranchCurrencyMaster/GetBranchCurrencyMasterDetail/'+this.branch;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if(result.response){
        this.currencyList = result.response;
      }
    });
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if(!this.content) return
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
  }


   
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){
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
      "CODE": this.diamondlabourMasterForm.value.labour_code,
      "DESCRIPTION":  this.diamondlabourMasterForm.value.labour_description,
      "LABTYPE":  this.diamondlabourMasterForm.value.labourType || "",
      "METHOD":  this.diamondlabourMasterForm.value.method  || "",
      "DIVISION":  this.diamondlabourMasterForm.value.division,
      "SHAPE":  this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM":  this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO":  this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE":  this.diamondlabourMasterForm.value.currency  || "",
      "UNITCODE":  this.diamondlabourMasterForm.value.unitList  || "",
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate,
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate,
      "LAST_COST_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE":  "",
      "DIVISION_CODE": this.metallabourMasterForm.value.division,
      "CURRENCY_CODE":  this.metallabourMasterForm.value.currency  || "",
      "SELLING_PER": this.diamondlabourMasterForm.value.selling,
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom || 0,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo || 0,
      "SIEVE":  this.diamondlabourMasterForm.value.sieve,
      "WASTAGE_PER": this.metallabourMasterForm.value.wastage,
      "WASTAGE_AMT": 0,
      "TYPE_CODE":  this.diamondlabourMasterForm.value.typecode||"",
      "CATEGORY_CODE":  this.metallabourMasterForm.value.category,
      "SUB_CATEGORY_CODE":  this.metallabourMasterForm.value.subCategory,
      "BRAND_CODE": this.metallabourMasterForm.value.brand,
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process,
      "KARAT_CODE": this.metallabourMasterForm.value.karat,
      "METALSTONE": "s",
      "STOCK_CODE":  this.metallabourMasterForm.value.stock_code,
      "PURITY": this.metallabourMasterForm.value.purity,
      "COLOR":  this.metallabourMasterForm.value.color,
      "FOR_DESIGN": this.metallabourMasterForm.value.forDesignOnly,
      "SIEVEFROM_DESC":  this.diamondlabourMasterForm.value.sieve_desc,
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

  updatelabourChargeMaster(){
    let API = 'LabourChargeMasterDj/UpdateLabourChargeMaster/'+ this.diamondlabourMasterForm.value.mid;
    let postData = {
      "MID": 0,
      "SRNO": 0,
      "CODE": this.diamondlabourMasterForm.value.labour_code,
      "DESCRIPTION":  this.diamondlabourMasterForm.value.labour_description,
      "LABTYPE":  this.diamondlabourMasterForm.value.labourType || "",
      "METHOD":  this.diamondlabourMasterForm.value.method  || "",
      "DIVISION":  this.diamondlabourMasterForm.value.division,
      "SHAPE":  this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM":  this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO":  this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE":  this.diamondlabourMasterForm.value.currency  || "",
      "UNITCODE":  this.diamondlabourMasterForm.value.unitList  || "",
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate || "",
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate || "",
      "LAST_COST_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE":  "",
      "DIVISION_CODE": this.metallabourMasterForm.value.metalDivision,
      "CURRENCY_CODE":  this.metallabourMasterForm.value.currency  || "",
      "SELLING_PER": this.diamondlabourMasterForm.value.selling || "",
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom || 0,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo || 0,
      "SIEVE":  this.diamondlabourMasterForm.value.sieve || "",
      "WASTAGE_PER": this.metallabourMasterForm.value.wastage || "",
      "WASTAGE_AMT": 0,
      "TYPE_CODE":  this.diamondlabourMasterForm.value.typecode||"",
      "CATEGORY_CODE":  this.metallabourMasterForm.value.category || "",
      "SUB_CATEGORY_CODE":  this.metallabourMasterForm.value.subCategory || "",
      "BRAND_CODE": this.metallabourMasterForm.value.brand || "",
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process || "",
      "KARAT_CODE": this.metallabourMasterForm.value.karat || "0",
      "METALSTONE": "s",
      "STOCK_CODE":  this.metallabourMasterForm.value.stock_code || "",
      "PURITY": this.metallabourMasterForm.value.purity || 0,
      "COLOR":  this.metallabourMasterForm.value.color || "",
      "FOR_DESIGN": this.metallabourMasterForm.value.forDesignOnly,
      "SIEVEFROM_DESC":  this.diamondlabourMasterForm.value.sieve_desc || "",
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

 

  diamondlabourMasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    division: [''],
    labour_code: [''],
    labour_description: [''],
    shape: [''],
    process: [''],
    size_from: [''],
    labour_ac: [''],
    size_to: [''],
    cost_rate : [''],
    sieve : [''],
    selling_rate : [''],
    sieve_desc : [''],
    selling : [''],
    ctWtFrom : [''],
    ctWtTo : [''],
    settingType : [''],
    labourType : [''],
    unitList : [''],
    method : [''],
    currency : [''],
    accessories : [''],
   
  });

  metallabourMasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    metalDivision: [''],
    stock_code: [''],
    metallabour_code: [''],
    metallabour_description: [''],
    metallabourType: [''],
    metalcurrency: [''],
    karat: [''],
    labourAc: [''],
    color : [''],
    costRate : [''],
    typecode : [''],
    metalselling_rate : [''],
    category : [''],
    metalSelling : [''],
    subCategory : [''],
    wastage : [''],
    brand : [''],
    metalunitList : [''],
    purity : [''],
    wtFrom : [''],
    wtTo : [''],
    onGrossWt : [false],
    forDesignOnly : [false]
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

  divisionCodeSelected(e:any){
    console.log(e); 
    this.diamondlabourMasterForm.controls.division.setValue(e.DIVISION);
  }

  metaldivisionCodeSelected(e:any){
    this.metallabourMasterForm.controls.metalDivision.setValue(e.DIVISION);
  }

 shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  shapeCodeSelected(e:any){
    console.log(e); 
    this.diamondlabourMasterForm.controls.shape.setValue(e.CODE);
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

  processCodeSelected(e:any){
    console.log(e); 
    this.diamondlabourMasterForm.controls.process.setValue(e.Process_Code);
  }

sizeFromCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size From',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizeFromCodeSelected(e:any){
  console.log(e); 
  this.diamondlabourMasterForm.controls.size_from.setValue(e.CODE);
  }

  sizeToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size To',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizeToCodeSelected(e:any){
    console.log(e); 
    this.diamondlabourMasterForm.controls.size_to.setValue(e.CODE);
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

  labouracSelected(e:any){
    console.log(e); 
    this.diamondlabourMasterForm.controls.labour_ac.setValue(e.ACCODE);
  }

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Sieve',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveSelected(e:any){
    console.log(e); 
    this.diamondlabourMasterForm.controls.sieve.setValue(e.ACCODE);
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

  stockCodeSelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.stock_code.setValue(e.STOCK_CODE);
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

  currencyCodeSelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.metalcurrency.setValue(e.CURRENCY_CODE);
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

  karatCodeSelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
  }

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  colorCodeSelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.color.setValue(e.CODE);
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  typeCodeSelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.typecode.setValue(e.CODE);
  }

  masterCodeData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Master Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  categorySelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.category.setValue(e.CODE);
  }

  subcategorySelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.subCategory.setValue(e.CODE);
  }

  brandSelected(e:any){
    console.log(e); 
    this.metallabourMasterForm.controls.brand.setValue(e.CODE);
  }
}


