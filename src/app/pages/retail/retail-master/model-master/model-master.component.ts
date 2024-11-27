import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-model-master',
  templateUrl: './model-master.component.html',
  styleUrls: ['./model-master.component.scss']
})
export class ModelMasterComponent implements OnInit {

  @Input() content!: any;
  @ViewChild("overlayTypeCode") overlayTypeCode!: MasterSearchComponent;
  @ViewChild("overlayCategoryCode")
  overlayCategoryCode!: MasterSearchComponent;
  @ViewChild("overlaysubcategoryCode")
  overlaysubcategoryCode!: MasterSearchComponent;
  @ViewChild("overlaybrand")
  overlaybrand!: MasterSearchComponent;
  @ViewChild("overlayuserDefined1Search")
  overlayuserDefined1Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined2Search")
  overlayuserDefined2Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined3Search")
  overlayuserDefined3Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined4Search")
  overlayuserDefined4Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined5Search")
  overlayuserDefined5Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined6Search")
  overlayuserDefined6Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined7Search")
  overlayuserDefined7Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined8Search")
  overlayuserDefined8Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined9Search")
  overlayuserDefined9Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined10Search")
  overlayuserDefined10Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined11Search")
  overlayuserDefined11Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined12Search")
  overlayuserDefined12Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined13Search")
  overlayuserDefined13Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined14Search")
  overlayuserDefined14Search!: MasterSearchComponent;
  @ViewChild("overlayuserDefined15Search")
  overlayuserDefined15Search!: MasterSearchComponent;

  selectedTabIndex = 0;
  tableData:any = [];
  TypeCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  CategoryMaster: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  Brand: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Brand Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='BRAND MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  SubCategoryMaster: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Sub Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  BranchData:MasterSearchModel = {};
  DepartmentData: MasterSearchModel = {}
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable:boolean = false;
  private subscriptions: Subscription[] = [];
  currentDate = new Date();

  UserDefinedData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 131,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 132,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 133,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 134,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined6Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 135,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined7Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 136,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined8Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 137,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined9Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 138,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined10Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 139,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined11Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 140,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined12Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 141,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined13Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 142,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined14Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 143,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  UserDefined15Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 144,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field15'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  
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
      this.modelMasterForm.controls.fixed_rate.setValue(this.content.FIXED_RATE.toString());
      this.modelMasterForm.controls.wastageprice1per.setValue(this.content.WASTAGEPRICE1PER.toString());
      this.modelMasterForm.controls.wastageprice2per.setValue(this.content.WASTAGEPRICE2PER.toString());
      this.modelMasterForm.controls.fixed_rate.disable();
      this.modelMasterForm.controls.wastageprice1per.disable();
      this.modelMasterForm.controls.wastageprice2per.disable();
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

  TypeCodeDataSelected(e:any){
    console.log(e);
    this.modelMasterForm.controls['type_code'].setValue(e.CODE);
  }
  SubCategoryDataSelected(e:any){
    console.log(e);
    this.modelMasterForm.controls['subcategory_code'].setValue(e.CODE);
  }
  CategoryDataSelected(e:any){
    console.log(e);
    this.modelMasterForm.controls['category_code'].setValue(e.CODE);
  }
  BranchCodeDataSelected(e:any){
    console.log(e);
    this.modelMasterForm.controls['branch_code'].setValue(e.CODE);
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
    console.log(this.content.CAL_STONE_ON);
    let API =
    "ModelMaster/GetModelMasterDetailWithCode/" + this.content.MODEL_CODE;
  let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
    (result) => {
      console.log(result.response);
      this.modelMasterForm.controls.cal_stone_on.setValue(result.response.CAL_STONE_ON)
      this.modelMasterForm.controls.calc_on_wt.setValue(result.response.CALC_ON_WT)
      this.modelMasterForm.controls.making_rate_type.setValue(result.response.MAKING_RATE_TYPE),
      this.modelMasterForm.controls.fixed_rate.setValue(result.response.FIXED_RATE.toString())

      this.commonService.closeSnackBarMsg();
    })
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
    this.modelMasterForm.controls.wastageprice1per.setValue(this.content.WASTAGEPRICE1PER.toString())
    this.modelMasterForm.controls.wastageprice2per.setValue(this.content.WASTAGEPRICE2PER.toString())
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
    
    console.log(
      this.modelMasterForm.value.cal_stone_on
    );
    
  
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
      WASTAGEPRICE1PER:this.commonService.emptyToZero (form.wastageprice1per) ,
      WASTAGEPRICE2PER:this.commonService.emptyToZero (form.wastageprice2per) ,
      FIXED_RATE:this.commonService.emptyToZero (form.fixed_rate) ,
      MARKUP_PER: this.commonService.emptyToZero (form.markup_per) || 0,
      MARKUP_MIN_PER: this.commonService.emptyToZero (form.markup_min_per) || 0,
      MARKUP_MAX_PER:this.commonService.emptyToZero (form.markup_max_per) || 0,
      MAKING_RATE_TYPE: true,
      STD_STONE_RATE: this.commonService.emptyToZero( form.std_stone_rate) || 0,
      MIN_STONE_RATE: this.commonService.emptyToZero(form.min_stone_rate) || 0,
      MAX_STONE_RATE: this.commonService.emptyToZero (form.max_stone_rate) || 0,
      CAL_STONE_ON:  form.cal_stone_on = true? true:false,
      CALC_ON_WT: form.calc_on_wt = true? true:false,
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

  UserDefined1DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf1.setValue(e.CODE);
  }
  UserDefined2DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf2.setValue(e.CODE);
  }
  UserDefined3DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf3.setValue(e.CODE);
  }
  UserDefined4DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf4.setValue(e.CODE);
  }
  UserDefined5DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf5.setValue(e.CODE);
  }
  UserDefined6DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf6.setValue(e.CODE);
  }
  UserDefined7DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf7.setValue(e.CODE);
  }
  UserDefined8DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf8.setValue(e.CODE);
  }
  UserDefined9DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf9.setValue(e.CODE);
  }
  UserDefined10DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf10.setValue(e.CODE);
  }
  UserDefined11DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf11.setValue(e.CODE);
  }
  UserDefined12DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf12.setValue(e.CODE);
  }
  UserDefined13DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf13.setValue(e.CODE);
  }
  UserDefined14DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf14.setValue(e.CODE);
  }
  UserDefined15DataSelected(e: any) {
    console.log(e);
    this.modelMasterForm.controls.udf15.setValue(e.CODE);
  }

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    isCurrencyField: boolean,
    lookupFields?: string[],
    FROMCODE?: boolean
  ) {
    const searchValue = event.target.value?.trim();

    // if (!searchValue || this.flag == "VIEW") return;

    LOOKUPDATA.SEARCH_VALUE = searchValue;

    const param = {
      PAGENO: LOOKUPDATA.PAGENO,
      RECORDS: LOOKUPDATA.RECORDS,
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECONDITION: LOOKUPDATA.WHERECONDITION,
      searchField: LOOKUPDATA.SEARCH_FIELD,
      searchValue: LOOKUPDATA.SEARCH_VALUE,
    };

    this.commonService.showSnackBarMsg("MSG81447");

    const sub: Subscription = this.dataService
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();
          const data = result.dynamicData?.[0];

          console.log("API Response Data:", data);

          if (data?.length) {
            console.log("In");

            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Up");

              console.log("Filtered Search Result:", searchResult);

              if (searchResult?.length) {
                const matchedItem = searchResult[0];
                console.log(FORMNAMES);
                console.log(matchedItem);

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    console.log(field);

                    this.modelMasterForm.controls[formName].setValue(
                      matchedItem[field]
                    );
                  } else {
                    console.error(
                      `Property ${field} not found in matched item.`
                    );
                    this.commonService.toastErrorByMsgId("No data found");
                    this.clearLookupData(LOOKUPDATA, FORMNAMES);
                  }
                });
              } else {
                this.commonService.toastErrorByMsgId("No data found");
                this.clearLookupData(LOOKUPDATA, FORMNAMES);
              }
            }
          } else {
            this.commonService.toastErrorByMsgId("No data found");
            this.clearLookupData(LOOKUPDATA, FORMNAMES);
          }
        },
        error: () => {
          this.commonService.toastErrorByMsgId("MSG2272");
          this.clearLookupData(LOOKUPDATA, FORMNAMES);
        },
      });

    this.subscriptions.push(sub);
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.modelMasterForm.controls[formName].setValue("");
    });
  }

  onchangeCheckBoxNum(e: any) {
    // console.log(e);

    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }

  onKeyDown(
    event: KeyboardEvent,
    controllers: string[],
    LOOKUPDATA: MasterSearchModel
  ) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      console.log("DELETE");
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers, LOOKUPDATA);
        }
      }, 0);
    } else if (event.key == "Tab") {
      console.log("Tab");
      console.log(controllers);
      console.log(event);

      this.lookupKeyPress(event, controllers[0]);
    }
  }

  clearRelevantFields(controllers: string[], LOOKUPDATA: MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control = this.modelMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == "Tab" && event.target.value == "") {
      this.showOverleyPanel(event, form);
    }
    if (event.key === "Enter") {
      if (event.target.value == "") this.showOverleyPanel(event, form);
      event.preventDefault();
    }
  }
  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "type_code":
        this.overlayTypeCode.showOverlayPanel(event);
        break;
      case "category_code":
        this.overlayCategoryCode.showOverlayPanel(event);
        break;
      case "subcategory_code":
        this.overlaysubcategoryCode.showOverlayPanel(event);
        break;
      case "branch_code":
        this.overlaybrand.showOverlayPanel(event);
        break;
      case "udf1":
        this.overlayuserDefined1Search.showOverlayPanel(event);
        break;
      case "udf2":
        this.overlayuserDefined2Search.showOverlayPanel(event);
        break;
      case "udf3":
        this.overlayuserDefined3Search.showOverlayPanel(event);
        break;
      case "udf4":
        this.overlayuserDefined4Search.showOverlayPanel(event);
        break;
      case "udf5":
        this.overlayuserDefined5Search.showOverlayPanel(event);
        break;
      case "udf6":
        this.overlayuserDefined6Search.showOverlayPanel(event);
        break;
      case "udf7":
        this.overlayuserDefined7Search.showOverlayPanel(event);
        break;
      case "udf8":
        this.overlayuserDefined8Search.showOverlayPanel(event);
        break;
      case "udf9":
        this.overlayuserDefined9Search.showOverlayPanel(event);
        break;
      case "udf10":
        this.overlayuserDefined10Search.showOverlayPanel(event);
        break;
      case "udf11":
        this.overlayuserDefined11Search.showOverlayPanel(event);
        break;
      case "udf12":
        this.overlayuserDefined12Search.showOverlayPanel(event);
        break;
      case "udf13":
        this.overlayuserDefined13Search.showOverlayPanel(event);
        break;
      case "udf14":
        this.overlayuserDefined14Search.showOverlayPanel(event);
        break;
      case "udf15":
        this.overlayuserDefined15Search.showOverlayPanel(event);
        break;
      default:
    }
  }
}
