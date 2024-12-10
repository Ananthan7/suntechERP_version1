import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales-commission-setup',
  templateUrl: './sales-commission-setup.component.html',
  styleUrls: ['./sales-commission-setup.component.scss']
})
export class SalesCommissionSetupComponent implements OnInit {
  maindetails2: any = [];
  maindetails3: any = [];
  maindetails4: any = [];
  viewMode: boolean = false;
  viewOnly: boolean = false;
  editMode: boolean = false;
  metal_drop: any[] = [];
  diamond_drop: any[] = [];
  grouplist: any[] = [];
  private subscriptions: Subscription[] = [];
  unq_id: any;
  @Input() content!: any;
  dyndatas: any;
  disable_code: boolean = false;
  dis_metal: boolean = false;
  dis_diamond: boolean = false;
  flag: any;
  combotype:any[]=[];






  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2
  ) { }

  salescommissionform: FormGroup = this.formBuilder.group({
    code: [''],
    start_date: [ new Date(),''],
    end_date: [new Date(),''],
    group: [''],
    metal_commission: [''],
    diamond_commission: [''],
    dia_division: [''],
    metal_divisions_: [''],
    metal_check: [''],
    diamond_check: [''],
  });

  getmetal_divisionvalues() {
    let API = `POSComissionSetup/POSComissionSetupMetalDivFilter`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        // console.log(result);
        this.metal_drop = result.dynamicData[0]
        // console.log(this.metal_drop)
        const allDivisionCodes = this.metal_drop.map(option => option.DIVISION_CODE);
        const diaDivisionControl = this.salescommissionform?.get('metal_divisions_');
        if (diaDivisionControl) {
          if (this.flag == undefined) {
            diaDivisionControl.setValue(allDivisionCodes);
          }
        }
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
  }

  getdiamond_divisionvalues(){
    let API = `POSComissionSetup/POSComissionSetupDiamondDivFilter`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        // console.log(result);
        this.diamond_drop = result.dynamicData[0]
        // console.log(this.diamond_drop)
        const allDivisionCodes = this.diamond_drop.map(option => option.DIVISION_CODE);
        const diaDivisionControl = this.salescommissionform?.get('dia_division');
        if (diaDivisionControl) {
          if (this.flag == undefined) {
            diaDivisionControl.setValue(allDivisionCodes);
          }
        }
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
  }

  getbranchdata(){

    let API = `POSComissionSetup/POSComissionBranchGrid`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        console.log(result); 
        let branch_data = result.dynamicData[0];
        this.maindetails3.push(...branch_data)
        
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);

  }

  getsalesmandata(){

    let API = `POSComissionSetup/POSComissionSetupSalesmanGrid`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        console.log(result);
        
        let salesman_data = result.dynamicData[0];
        // this.maindetails4.push(...salesman_data)
        this.maindetails4.push(...result.dynamicData[0])
        
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    
  }



  ngOnInit(): void {
    this.getgroupvalues();
    this.getmetal_divisionvalues();
    this.getdiamond_divisionvalues();
    this.unq_id = this.content?.COMMISION_CODE;
    this.flag = this.content?.FLAG;
    console.log(this.content)
    if (this.flag == 'EDIT') {
      this.disable_code = true;
      this.editMode = true;
    } else if (this.flag == 'VIEW') {
      this.viewMode = true;
    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
    if (this.flag == undefined) {
      this.getbranchdata();
      this.getsalesmandata();
    }
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.viewOnly = true;
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  detailsapi(fm_id: any) {
    if (this.flag == 'VIEW') {
      this.viewOnly = true;
    }

    let API = `POSComissionSetup/GetPOSComissionSetupDetail/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);

      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas?.PREFIX_CODE);
  }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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

  editController(DATA: any) {
    this.ViewController(DATA);
  }


  ViewController(DATA: any) {
    this.salescommissionform.controls.partycode.setValue(this.content?.PARTYCODE);
    this.salescommissionform.controls.fin_year.setValue(this.content?.FYEARCODE);
  }

  formSubmit(){

    Object.keys(this.salescommissionform.controls).forEach((controlName) => {
      const control = this.salescommissionform.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.salescommissionform.controls
    ).some((controlName) => {
      const control = this.salescommissionform.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    // let metal_division = this.supplierquotaform.controls.metal_division.value;
    // console.log(metal_division);

    let metal_division = this.salescommissionform.controls.metal_divisions_.value;
    let metal_division_str = metal_division.join(',');

    let dia_division = this.salescommissionform.controls.metal_divisions_.value;
    let dia_division_str = dia_division.join(',');


    const postData = {
      "MID": 0,
      "COMMISION_CODE": this.salescommissionform.controls.code.value,
      "COMM_DISC_GROUP": this.salescommissionform.controls.group.value,
      "METAL_COMM_TYPE": 0,
      "DIAMOND_COMM_TYPE": 0,
      "METAL_DIVISION": metal_division_str,// "string",
      "DIAMOND_DIVISION":  dia_division_str , //"string",
      "START_DATE" : this.salescommissionform.controls.start_date.value,
      "END_DATE" : this.salescommissionform.controls.end_date.value,
      "COMM_EXCLUSIVE": true,
      "COMM_ADDON": true,
      "Details":  this.maindetails2
      // "Details": [
      //   {
      //     "UNIQUEID": 0,
      //     "COMMISION_CODE": "string",
      //     "SRNO": 0,
      //     "GROUP_CODE": "string",
      //     "RANGE_FROM": 0,
      //     "RANGE_TO": 0,
      //     "COMM_RATE": 0,
      //     "COMM_POINTS": 0
      //   }
      // ]
    }


    if (this.flag === "EDIT") {
      let API = `POSComissionSetup/UpdatePOSComissionSetup/${this.unq_id}`;
      let sub: Subscription = this.apiService
        .putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Updated successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            Swal.fire({
              title: "Failed",
              text: result.message ? result.message : "Failed!",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    } else {
      let API = `POSComissionSetup/InsertPOSComissionSetup`;
      let sub: Subscription = this.apiService
        .postDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Inserted successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            Swal.fire({
              title: "Failed",
              text: "Not Inserted Successfully",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    }

  }

  getgroupvalues(){
    this.grouplist = this.getUniqueValues(
    this.commonService.getComboFilterByID("Commission"),
    "ENGLISH"
    );
  }
 

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }
  

  addTableData() {
    let count = this.maindetails2.length + 1;

    let data = {
      "SRNO" : count++,
      "GROUPTYPE" : "",
      "RANGEFROM" : 0,
      "RANGETO" : 0,
      "COMMISSION" : 0,
      "POINTS" : 0
    }

    this.maindetails2.push(data);
    this.salescommissionform.controls.group.disable();

  }

  change_group_type(data: any, event: any) {
    // const updatedSRNO = data.data.SRNO - 1; 
    // this.maindetails2[updatedSRNO].GROUPTYPE = this.commonService.decimalQuantityFormat(event.target.value,'AMOUNT');//             event.target.value;
    // console.log('Updated GROUPTYPE:', this.maindetails2[updatedSRNO].GROUPTYPE);
  }

  change_range_from(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1; 
    this.maindetails2[updatedSRNO].RANGEFROM = this.commonService.decimalQuantityFormat(event.target.value,'METAL');//             event.target.value;
    console.log('Updated RANGEFROM:', this.maindetails2[updatedSRNO].RANGEFROM);
  }

  change_range_to(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1; 
    this.maindetails2[updatedSRNO].RANGETO = this.commonService.decimalQuantityFormat(event.target.value,'METAL');//             event.target.value;
    console.log('Updated RANGETO:', this.maindetails2[updatedSRNO].RANGETO);
  }

  change_comission(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1; 
    this.maindetails2[updatedSRNO].COMMISSION = this.commonService.decimalQuantityFormat(event.target.value,'METAL');//             event.target.value;
    console.log('Updated COMMISSION:', this.maindetails2[updatedSRNO].COMMISSION);
  }


  change_points(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1; 
    this.maindetails2[updatedSRNO].POINTS = this.commonService.decimalQuantityFormat(event.target.value,'METAL');//             event.target.value;
    console.log('Updated POINTS:', this.maindetails2[updatedSRNO].POINTS);
  }

  change_groupname(data: any, event: any) {
    const updatedSRNO = data.data.SRNO1 - 1; 
    this.maindetails4[updatedSRNO].GROUP_NAME = "";
    console.log('Updated GROUP_NAEM:',  this.maindetails4[updatedSRNO].GROUP_NAME );
  }


  deleteTableData() {
    this.maindetails2.pop();
  }

  onSelectionChanged(event: any) {

  }


  DeleteController(DATA?: any) {
    this.ViewController(DATA);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        const API = `POSComissionSetup/DeletePOSComissionSetup/${this.unq_id}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success"
                ? this.close("reloadMainGrid")
                : console.log("Delete Error");
            },
            error: (err: any) => {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the item.",
                icon: "error",
                confirmButtonColor: "#d33",
              });
              console.error(err);
            },
          });
        this.subscriptions.push(Sub);
      } else {
        // this.flag = "VIEW";
        this.activeModal.close("");
      }
    });
  }

  metalcheck() {
    let metal = this.salescommissionform.controls.metal_check;

    if (!metal.value) { 
      this.salescommissionform.controls.dia_division.reset();
      this.salescommissionform.controls.dia_division.disable();
      this.salescommissionform.controls.metal_divisions_.enable();
      this.salescommissionform.controls.diamond_commission.reset();
      this.salescommissionform.controls.diamond_commission.disable();
      this.salescommissionform.controls.metal_commission.enable();
      this.salescommissionform.controls.diamond_check.setValue(false);
  
    }
    
  }
  

  diamondcheck(){
    let diamond = this.salescommissionform.controls.diamond_check;
    if (!diamond.value) { 
      this.salescommissionform.controls.metal_divisions_.reset();
      this.salescommissionform.controls.metal_divisions_.disable();
      this.salescommissionform.controls.dia_division.enable();
      this.salescommissionform.controls.metal_commission.reset();
      this.salescommissionform.controls.metal_commission.disable();
      this.salescommissionform.controls.diamond_commission.enable();
     this.salescommissionform.controls.metal_check.setValue(false);

    } 

  }

}
