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
  
  alloyMastereForm: FormGroup = this.formBuilder.group({
    mid:[],
    code: [''],
    description: [''],
    metal: [''],
    color: [''],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes : [''],
    divCode : [''],
   
  });

  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  masterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Master Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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

  ColorCodeSelected(e:any){
    console.log(e);
    this.alloyMastereForm.controls.color.setValue(e.CODE);

  }

  vendorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Vendor',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  setFormValues() {
    if(!this.content) return
    console.log(this.content);
    
    this.alloyMastereForm.controls.mid.setValue(this.content.MID);
    this.alloyMastereForm.controls.code.setValue(this.content.MELTYPE_CODE);
    this.alloyMastereForm.controls.description.setValue(this.content.MELTYPE_DESCRIPTION);
    this.alloyMastereForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.alloyMastereForm.controls.purity.setValue(this.content.PURITY);
    this.alloyMastereForm.controls.metal.setValue(this.content.METAL_PER);
    this.alloyMastereForm.controls.alloy.setValue(this.content.ALLOY_PER);
    this.alloyMastereForm.controls.color.setValue(this.content.COLOR);
    this.alloyMastereForm.controls.stockCode.setValue(this.content.STOCK_CODE);
    this.tableData = this.content.MELTING_TYPE_DETAIL;

  }

 updateMeltingType() {
  let API = 'MeltingType/UpdateMeltingType/'+ this.alloyMastereForm.value.mid;
    let postData=
      {
        "MID": this.alloyMastereForm.value.mid,
        "MELTYPE_CODE":  this.alloyMastereForm.value.code,
        "MELTYPE_DESCRIPTION": this.alloyMastereForm.value.description,
        "KARAT_CODE": this.alloyMastereForm.value.karat,
        "PURITY": this.commonService.transformDecimalVB(6,this.alloyMastereForm.value.purity),
        "METAL_PER": this.alloyMastereForm.value.metal,
        "ALLOY_PER": parseFloat(this.alloyMastereForm.value.alloy),
        "CREATED_BY": this.userName,
        "COLOR": this.alloyMastereForm.value.color,
        "STOCK_CODE": this.alloyMastereForm.value.stockCode,
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
                this.alloyMastereForm.reset()
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
                    this.alloyMastereForm.reset()
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
                    this.alloyMastereForm.reset()
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
