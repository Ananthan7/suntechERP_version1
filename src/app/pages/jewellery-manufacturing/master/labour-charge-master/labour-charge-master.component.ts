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
  private subscriptions: Subscription[] = [];


  labourTypeList: any[] = [];
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
  }
  setFormValues() {
    if(!this.content) return
    this.diamondlabourMasterForm.controls.mid.setValue(this.content.MID);
  }


   
  
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
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
      "LABTYPE":  this.diamondlabourMasterForm.value.labourType,
      "METHOD":  this.diamondlabourMasterForm.value.method,
      "DIVISION":  this.diamondlabourMasterForm.value.division,
      "SHAPE":  this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM":  this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO":  this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE":  this.diamondlabourMasterForm.value.division,
      "UNITCODE":  this.diamondlabourMasterForm.value.unit,
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate,
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate,
      "LAST_COST_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE":  "string",
      "DIVISION_CODE": this.metallabourMasterForm.value.division,
      "CURRENCY_CODE":  this.metallabourMasterForm.value.currency,
      "SELLING_PER": this.diamondlabourMasterForm.value.selling,
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo,
      "SIEVE":  this.diamondlabourMasterForm.value.sieve,
      "WASTAGE_PER": this.metallabourMasterForm.value.wastage,
      "WASTAGE_AMT": 0,
      "TYPE_CODE":  this.diamondlabourMasterForm.value.type,
      "CATEGORY_CODE":  this.metallabourMasterForm.value.category,
      "SUB_CATEGORY_CODE":  this.metallabourMasterForm.value.subCategory,
      "BRAND_CODE": this.metallabourMasterForm.value.brand,
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process ,
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
              this.close()
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
    let API = 'Manufacturing/Master/MeltingType/UpdateMeltingType/'+ this.diamondlabourMasterForm.value.mid;
    let postData = {
      "MID": 0,
      "SRNO": 0,
      "CODE": this.diamondlabourMasterForm.value.labour_code,
      "DESCRIPTION":  this.diamondlabourMasterForm.value.labour_description,
      "LABTYPE":  this.diamondlabourMasterForm.value.labourType,
      "METHOD":  this.diamondlabourMasterForm.value.method,
      "DIVISION":  this.diamondlabourMasterForm.value.division,
      "SHAPE":  this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM":  this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO":  this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE":  this.diamondlabourMasterForm.value.currency,
      "UNITCODE":  this.diamondlabourMasterForm.value.unit,
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate,
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate,
      "LAST_COST_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE":  "string",
      "DIVISION_CODE": this.metallabourMasterForm.value.division,
      "CURRENCY_CODE":  this.metallabourMasterForm.value.currency,
      "SELLING_PER": this.diamondlabourMasterForm.value.selling,
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo,
      "SIEVE":  this.diamondlabourMasterForm.value.sieve,
      "WASTAGE_PER": this.metallabourMasterForm.value.wastage,
      "WASTAGE_AMT": 0,
      "TYPE_CODE":  this.diamondlabourMasterForm.value.type,
      "CATEGORY_CODE":  this.metallabourMasterForm.value.category,
      "SUB_CATEGORY_CODE":  this.metallabourMasterForm.value.subCategory,
      "BRAND_CODE": this.metallabourMasterForm.value.brand,
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process ,
      "KARAT_CODE": this.metallabourMasterForm.value.karat,
      "METALSTONE": "s",
      "STOCK_CODE":  this.metallabourMasterForm.value.stock_code,
      "PURITY": this.metallabourMasterForm.value.purity,
      "COLOR":  this.metallabourMasterForm.value.color,
      "FOR_DESIGN": this.metallabourMasterForm.value.forDesignOnly,
      "SIEVEFROM_DESC":  this.diamondlabourMasterForm.value.sieve_desc,
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
              this.close()
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
          let API = 'Manufacturing/Master/MeltingType/DeleteMeltingType/' + this.content.MID;
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
                      this.close()
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
    unit : [''],
    method : [''],
    currency : [''],

   
  });

  metallabourMasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    division: [''],
    stock_code: [''],
    labour_code: [''],
    labour_description: [''],
    labourType: [''],
    currency: [''],
    karat: [''],
    labourAc: [''],
    color : [''],
    costRate : [''],
    type : [''],
    selling_rate : [''],
    category : [''],
    selling : [''],
    subCategory : [''],
    wastage : [''],
    brand : [''],
    unit : [''],
    purity : [''],
    wtFrom : [''],
    wtTo : [''],
    onGrossWt : [''],
    forDesignOnly : ['']
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
    this.metallabourMasterForm.controls.division.setValue(e.DIVISION);
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
    this.diamondlabourMasterForm.controls.labour_ac.setValue(e['ACCOUNT HEAD']);
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
    this.metallabourMasterForm.controls.currency.setValue(e.CURRENCY_CODE);
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
    this.metallabourMasterForm.controls.type.setValue(e.CODE);
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
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}


