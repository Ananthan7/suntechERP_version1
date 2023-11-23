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
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent implements OnInit {
  @Input() content!: any; 
  favoriteSeason: string = "";


  tableData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];

  currentFilter: any; 
  divisionMS: any = 'ID';

  columnhead:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  columnheader:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  columnheader1:any[] = ['Srno','Division','Stone Type', 'Stock Code','Karat','Shape','Color','Ext.Color','Clarity','Ext.Clarity','Sieve Std.','Description','Sieve From'];
  columnheader2:any[] = ['Comp.Code','Srno','Division','Stone Type', 'Stock Code','Karat','Int.Color','Ext.Color','Shape','Int.Clarity','Ext.Clarity'];
  columnheader3:any[] = ['',];
  columnheader4:any[] = ['SINO','Size Code','Description','Default'];
  column1:any[] = ['SINO','Model No','Description'];
  column2:any[] = ['SINO','Country Code','Description'];
  column3:any[] = ['SINO','Dye Code','Description'];
  column4:any[] = ['SINO','Wax Model Code','Description'];
  column5:any[] = ['Sr.No','Accode','Description','Vend Design','Del.Days','Credit Days','Mode Of Payment'];
  column6:any[] = ['SINO','Color Code','Description'];
  column7:any[] = ['SINO','Comp Code','Description'];
  column8:any[] = ['SINO','Width Code','Description'];
  column9:any[] = ['SINO','Length Code','Description','Default'];
  column10:any[] = ['SINO','Height Code','Description'];
  column11:any[] = ['SINO','Karat Code','Description','Default'];
  column12:any[] = ['SINO','Color Range','Description','Default'];
  column13:any[] = ['SINO','Billing Code','Description'];
  column14:any[] = ['SINO','Finishing Code','Description','Default'];
  column15:any[] = ['Size','Pcs'];
  columnhead1:any[] = ['Srno','Comp.Code','Description','Pcs', 'Size Set Code','Size Code','Type','Category','Shape','Height','Width','Length','Radious'];
  columnhead2:any[] = ['DESIGN_C','PART_CODE','PART_DESCRIPTION','METAL_WT', 'LS_PCS','LS_WT','CS_PCS','CS_WT','PL_PCS','PL_WT','OTH_PCS','OTH_WT','TOTAL_PCS'];

  seasons: string[] = ['Customer Exclusive', 'Keep on Hold', 'Add Steel'];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  ngOnInit(): void {
  }
  
  designmasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    code: [''],
    design: [''],
    costcenter: [''],
    category: [''],
    subcategory: [''],
    type: [''],
    brand: [''],
    style: [''],
    range: [''],
    description: [''],
    metal: [''],
    color: [''],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes : [''],
    divCode : [''],
    country : [''],
    size : [''],
    sizeset : [''],
   
  });

  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Center',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCenterSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.costcenter.setValue(e.COST_CODE);
  }

  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  karatCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.karat.setValue(e.KARAT_CODE);
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.type.setValue(e.CODE);
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  categoryCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.category.setValue(e.CODE);
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subcategoryCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.subcategory.setValue(e.CODE);
  }

  BrandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  brandCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.brand.setValue(e.CODE);
  }

  StyleCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Style Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  StyleCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.style.setValue(e.CODE);
  }

  RangeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Range Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  RangeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.range.setValue(e.CODE);
  }

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 36,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.size.setValue(e.CODE);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  countryCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.country.setValue(e.CODE);
  }

  sizesetCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 36,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizesetCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.sizeset.setValue(e.CODE);
  }


  setFormValues() {
    if(!this.content) return
    console.log(this.content);
    
    this.designmasterForm.controls.mid.setValue(this.content.MID);
    this.designmasterForm.controls.code.setValue(this.content.MELTYPE_CODE);
    this.designmasterForm.controls.description.setValue(this.content.MELTYPE_DESCRIPTION);
    this.designmasterForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.designmasterForm.controls.purity.setValue(this.content.PURITY);
    this.designmasterForm.controls.metal.setValue(this.content.METAL_PER);
    this.designmasterForm.controls.alloy.setValue(this.content.ALLOY_PER);
    this.designmasterForm.controls.color.setValue(this.content.COLOR);
    this.designmasterForm.controls.stockCode.setValue(this.content.STOCK_CODE);
    this.tableData = this.content.MELTING_TYPE_DETAIL;

  }

 updateMeltingType() {
  let API = 'MeltingType/UpdateMeltingType/'+ this.designmasterForm.value.mid;
    let postData=
      {
        "MID": this.designmasterForm.value.mid,
        "MELTYPE_CODE":  this.designmasterForm.value.code,
        "MELTYPE_DESCRIPTION": this.designmasterForm.value.description,
        "KARAT_CODE": this.designmasterForm.value.karat,
        "PURITY": this.commonService.transformDecimalVB(6,this.designmasterForm.value.purity),
        "METAL_PER": this.designmasterForm.value.metal,
        "ALLOY_PER": parseFloat(this.designmasterForm.value.alloy),
        "CREATED_BY": this.userName,
        "COLOR": this.designmasterForm.value.color,
        "STOCK_CODE": this.designmasterForm.value.stockCode,
        "MELTING_TYPE_DETAIL": this.tableData || []
      
    }

    let myData = {}

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
                this.designmasterForm.reset()
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
        let API = 'MeltingType/DeleteMeltingType/' + this.content.MID;
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
                    this.designmasterForm.reset()
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
                    this.designmasterForm.reset()
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

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
