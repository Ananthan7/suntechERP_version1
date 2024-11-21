import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-model-master',
  templateUrl: './model-master.component.html',
  styleUrls: ['./model-master.component.scss']
})
export class ModelMasterComponent implements OnInit {

  @Input() content!: any;
  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable:boolean = false;
  private subscriptions: Subscription[] = [];
  currentDate = new Date();
  modelMasterForm: FormGroup = this.formBuilder.group({
    mid: [0], 
    model_code: [''],
    model_description: [''],
    category_code: [''],
    subcategory_code: [''],
    brand_code: [''],
    type_code: [''],
    system_date: [''], 
    branch_code: [''],
    username: [''],
    udf1: [''],
    udf2: [''],
    udf3: [''],
    udf4: [''],
    udf5: [''],
    udf6: [''],
    udf7: [''],
    udf8: [''],
    udf9: [''],
    udf10: [''],
    udf11: [''],
    udf12: [''],
    udf13: [''],
    udf14: [''],
    udf15: [''],
    wastageprice1per: [0],
    wastageprice2per: [0],
    fixed_rate: [0],
    markup_per: [0],
    markup_min_per: [0],
    markup_max_per: [0],
    making_rate_type: [0], 
    std_stone_rate: [0],
    min_stone_rate: [0],
    max_stone_rate: [0],
    cal_stone_on: [''], 
    calc_on_wt: [''] ,
    making_std_rate:[''],
    std_wt:['']
  });
  

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,

  ) {  }

  ngOnInit(): void {

    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == "VIEW") {
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteRecord();
      }
    }
  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);
    
    this.modelMasterForm.controls.model_code.setValue(this.content.MODEL_CODE)
    this.modelMasterForm.controls.model_description.setValue(this.content.MODEL_DESCRIPTION)
    this.modelMasterForm.controls.category_code.setValue(this.content.CATEGORY_CODE)
    this.modelMasterForm.controls.subcategory_code.setValue(this.content.SUBCATEGORY_CODE)
    this.modelMasterForm.controls.brand_code.setValue(this.content.BRAND_CODE)
    this.modelMasterForm.controls.type_code.setValue(this.content.TYPE_CODE)
    this.modelMasterForm.controls.branch_code.setValue(this.content.BRANCH_CODE)
    this.modelMasterForm.controls.username.setValue(this.content.USERNAME)
    this.modelMasterForm.controls.udf1.setValue(this.content.UDF1)
    this.modelMasterForm.controls.udf2.setValue(this.content.UDF2)
    this.modelMasterForm.controls.udf3.setValue(this.content.UDF3)
    this.modelMasterForm.controls.udf4.setValue(this.content.UDF4)
    this.modelMasterForm.controls.udf5.setValue(this.content.UDF5)
    this.modelMasterForm.controls.udf6.setValue(this.content.UDF6)
    this.modelMasterForm.controls.udf7.setValue(this.content.UDF7)
    this.modelMasterForm.controls.udf8.setValue(this.content.UDF8)
    this.modelMasterForm.controls.udf9.setValue(this.content.UDF9)
    this.modelMasterForm.controls.udf10.setValue(this.content.UDF10)
    this.modelMasterForm.controls.udf11.setValue(this.content.UDF11)
    this.modelMasterForm.controls.udf12.setValue(this.content.UDF12)
    this.modelMasterForm.controls.udf13.setValue(this.content.UDF13)
    this.modelMasterForm.controls.udf14.setValue(this.content.UDF14)
    this.modelMasterForm.controls.udf15.setValue(this.content.UDF15)
    this.modelMasterForm.controls.wastageprice1per.setValue(this.content.WASTAGEPRICE1PER)
    this.modelMasterForm.controls.wastageprice2per.setValue(this.content.WASTAGEPRICE2PER)
    this.modelMasterForm.controls.fixed_rate.setValue(this.content.FIXED_RATE)
    this.modelMasterForm.controls.markup_per.setValue(this.content.MARKUP_PER)
    this.modelMasterForm.controls.markup_min_per.setValue(this.content.MARKUP_MIN_PER)
    this.modelMasterForm.controls.markup_max_per.setValue(this.content.MARKUP_MAX_PER)
    this.modelMasterForm.controls.making_rate_type.setValue( this.content.MAKING_RATE_TYPE),
    this.modelMasterForm.controls.std_stone_rate.setValue(this.content.STD_STONE_RATE)
    this.modelMasterForm.controls.min_stone_rate.setValue(this.content.MIN_STONE_RATE)
    this.modelMasterForm.controls.max_stone_rate.setValue(this.content.MAX_STONE_RATE)
    this.modelMasterForm.controls.cal_stone_on.setValue(this.content.CAL_STONE_ON)
    this.modelMasterForm.controls.calc_on_wt.setValue(this.content.CALC_ON_WT)

  }

  BranchDataSelected(e:any){

  }

  setPostData() {
    let form = this.modelMasterForm.value; 
    return {
      MID: 0,
      MODEL_CODE: this.commonService.nullToString(form.model_code),
      MODEL_DESCRIPTION: this.commonService.nullToString(form.model_description),
      CATEGORY_CODE: this.commonService.nullToString(form.category_code),
      SUBCATEGORY_CODE: this.commonService.nullToString(form.subcategory_code),
      BRAND_CODE: this.commonService.nullToString(form.brand_code),
      TYPE_CODE: this.commonService.nullToString(form.type_code),
      SYSTEM_DATE: form.system_date
        ? new Date(form.system_date).toISOString()
        : new Date().toISOString(),
      BRANCH_CODE: this.commonService.nullToString(form.branch_code),
      USERNAME: this.commonService.nullToString(form.username),
      UDF1: this.commonService.nullToString(form.udf1),
      UDF2: this.commonService.nullToString(form.udf2),
      UDF3: this.commonService.nullToString(form.udf3),
      UDF4: this.commonService.nullToString(form.udf4),
      UDF5: this.commonService.nullToString(form.udf5),
      UDF6: this.commonService.nullToString(form.udf6),
      UDF7: this.commonService.nullToString(form.udf7),
      UDF8: this.commonService.nullToString(form.udf8),
      UDF9: this.commonService.nullToString(form.udf9),
      UDF10: this.commonService.nullToString(form.udf10),
      UDF11: this.commonService.nullToString(form.udf11),
      UDF12: this.commonService.nullToString(form.udf12),
      UDF13: this.commonService.nullToString(form.udf13),
      UDF14: this.commonService.nullToString(form.udf14),
      UDF15: this.commonService.nullToString(form.udf15),
      WASTAGEPRICE1PER:this.commonService.emptyToZero (form.wastageprice1per) || 0,
      WASTAGEPRICE2PER:this.commonService.emptyToZero (form.wastageprice2per) || 0,
      FIXED_RATE:this.commonService.emptyToZero (form.fixed_rate) || 0,
      MARKUP_PER: this.commonService.emptyToZero (form.markup_per) || 0,
      MARKUP_MIN_PER: this.commonService.emptyToZero (form.markup_min_per) || 0,
      MARKUP_MAX_PER:this.commonService.emptyToZero (form.markup_max_per) || 0,
      MAKING_RATE_TYPE: true,
      STD_STONE_RATE: this.commonService.emptyToZero( form.std_stone_rate) || 0,
      MIN_STONE_RATE: this.commonService.emptyToZero(form.min_stone_rate) || 0,
      MAX_STONE_RATE: this.commonService.emptyToZero (form.max_stone_rate) || 0,
      CAL_STONE_ON:  true,
      CALC_ON_WT: true
    };
  }
  formSubmit() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }

    console.log(this.tableData);

    let API = "ModelMaster/InsertModelMaster";
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.modelMasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  update() {
    let API = "ModelMaster/UpdateModelMaster/" + this.content.MODEL_CODE;
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.modelMasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleteRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.MODEL_CODE) {
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
        let API = 'ModelMaster/DeleteModelMaster/' + this.content?.MODEL_CODE;
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
                    this.modelMasterForm.reset()
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
                    this.modelMasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
}
