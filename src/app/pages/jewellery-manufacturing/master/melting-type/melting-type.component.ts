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
  selector: 'app-melting-type',
  templateUrl: './melting-type.component.html',
  styleUrls: ['./melting-type.component.scss']
})
export class MeltingTypeComponent implements OnInit {
  @Input() content!: any; 

  tableData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];


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
  
  formSubmit(){
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }

    if (this.meltingTypeForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'MeltingType/InsertMeltingType'
    let postData=
      {
        "MID": 0,
        "MELTYPE_CODE":  this.meltingTypeForm.value.code,
        "MELTYPE_DESCRIPTION": this.meltingTypeForm.value.description,
        "KARAT_CODE": this.meltingTypeForm.value.karat,
        "PURITY": this.commonService.transformDecimalVB(6,this.meltingTypeForm.value.purity),
        "METAL_PER": this.meltingTypeForm.value.metal,
        "ALLOY_PER": this.meltingTypeForm.value.alloy,
        "CREATED_BY": this.userName,
        "COLOR": this.meltingTypeForm.value.color,
        "STOCK_CODE": this.meltingTypeForm.value.stockCode,
        "MELTING_TYPE_DETAIL": this.tableData
      
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
              this.meltingTypeForm.reset()
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
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  columnheads:any[] = ['Sr','Division','Default Alloy','Description','Alloy %'];
  

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ColorCodeSelected(e:any){
    console.log(e);
    this.meltingTypeForm.controls.color.setValue(e.CODE);

  }

  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  KaratCodeSelected(e:any){
    console.log(e);
    this.meltingTypeForm.controls.karat.setValue(e['Karat Code']);
  }

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

  StockCodeSelected(e:any){
    console.log(e);
    this.meltingTypeForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.meltingTypeForm.controls.stockCodeDes.setValue(e.DESCRIPTION);
    this.meltingTypeForm.controls.divCode.setValue(e.DIVISION_CODE);
  }

  meltingTypeForm: FormGroup = this.formBuilder.group({
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

  addTableData(){
    console.log(this.commonService.transformDecimalVB(6,this.meltingTypeForm.value.purity));
    
    let data = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "MELTYPE_CODE":  this.meltingTypeForm.value.code,
      "MELTYPE_DESCRIPTION":  this.meltingTypeForm.value.description,
      "KARAT_CODE":  this.meltingTypeForm.value.karat,
      "PURITY":  this.commonService.transformDecimalVB(6,this.meltingTypeForm.value.purity),
      "DIVISION_CODE":  this.meltingTypeForm.value.divCode,
      "DEF_ALLOY_STOCK":  this.meltingTypeForm.value.stockCode,
      "DEF_ALLOY_DESCRIPTION":  this.meltingTypeForm.value.stockCodeDes,
      "ALLOY_PER":  parseFloat(this.meltingTypeForm.value.alloy)
    }

    this.tableData.push(data);
    console.log(this.tableData);
    
  }

  setFormValues() {
    if(!this.content) return
    console.log(this.content);
    
    this.meltingTypeForm.controls.mid.setValue(this.content.MID);
    this.meltingTypeForm.controls.code.setValue(this.content.MELTYPE_CODE);
    this.meltingTypeForm.controls.description.setValue(this.content.MELTYPE_DESCRIPTION);
    this.meltingTypeForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.meltingTypeForm.controls.purity.setValue(this.content.PURITY);
    this.meltingTypeForm.controls.metal.setValue(this.content.METAL_PER);
    this.meltingTypeForm.controls.alloy.setValue(this.content.ALLOY_PER);
    this.meltingTypeForm.controls.color.setValue(this.content.COLOR);
    this.meltingTypeForm.controls.stockCode.setValue(this.content.STOCK_CODE);
    this.tableData = this.content.MELTING_TYPE_DETAIL;

  }

 updateMeltingType() {
  let API = 'MeltingType/UpdateMeltingType/'+ this.meltingTypeForm.value.mid;
    let postData=
      {
        "MID": this.meltingTypeForm.value.mid,
        "MELTYPE_CODE":  this.meltingTypeForm.value.code,
        "MELTYPE_DESCRIPTION": this.meltingTypeForm.value.description,
        "KARAT_CODE": this.meltingTypeForm.value.karat,
        "PURITY": this.commonService.transformDecimalVB(6,this.meltingTypeForm.value.purity),
        "METAL_PER": this.meltingTypeForm.value.metal,
        "ALLOY_PER": parseFloat(this.meltingTypeForm.value.alloy),
        "CREATED_BY": this.userName,
        "COLOR": this.meltingTypeForm.value.color,
        "STOCK_CODE": this.meltingTypeForm.value.stockCode,
        "MELTING_TYPE_DETAIL": this.tableData || []
      
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
                this.meltingTypeForm.reset()
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
                    this.meltingTypeForm.reset()
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
                    this.meltingTypeForm.reset()
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
