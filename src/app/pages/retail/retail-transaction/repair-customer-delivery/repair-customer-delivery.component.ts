import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { Code } from 'angular-feather/icons';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';

@Component({
  selector: 'app-repair-customer-delivery',
  templateUrl: './repair-customer-delivery.component.html',
  styleUrls: ['./repair-customer-delivery.component.scss']
})
export class RepairCustomerDeliveryComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  firstTableWidth : any;
  secondTableWidth : any;
  columnheadItemDetails:any[] = ['Srno','Division','Stone Type','Stock Code','Karat','Color','Shape','Sieve','Size','Pcs','Wt/Ct','Setting Type','Pointer Wt','Remarks'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails2:any[] = ['Repair Narration']
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  isdisabled:boolean=true;
  private subscriptions: Subscription[] = [];
  table: any;
  status: boolean= true;
  viewMode: boolean = false;
  selectedTabIndex = 0;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  formattedTime: any;
  maxTime: any;
  standTime: any;
  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    this.setvaluesdata()
    if (this.content) {
      // this.setFormValues()  
      this.setAllInitialValues()
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      }
    }
    
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    if (this.content) {
      this.setFormValues()
    }
    this.repairCustomerDeliveryForm.controls.deliveryOnDate = new FormControl({value: '', disabled: this.isdisabled})
  
  }

  private handleResize(): void {
    // Access screen size here using window.innerWidth and window.innerHeight
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenWidth > 1200) {
      this.firstTableWidth = 800
      this.secondTableWidth = 450
    } else if (screenWidth >= 768 && screenWidth < 1200) {
      this.firstTableWidth = 700
      this.secondTableWidth = 350
    }
  }


  repairCustomerDeliveryForm: FormGroup = this.formBuilder.group({
    voctype: [,''],
    vocNo: [''],
    vocDate: [''],
    salesMan: [''],
    customer: [''],
    customerDesc: [''],
    tel: [''],
    mobile: [''],
    nationality: [''],
    type:[''],
    remarks:[''],
    currency:[''],
    currencyDesc:[''],
    email:[''],
    address:[''],
    check1:[''],
    check2:[''],

    process: ['',''],
    worker: ['PARIMA',''],
    narration: [''],
    soNumber: [''],    //no
    design:['', [Validators.required]],
    completed:[''], //no
    toWorker:['', [Validators.required]],
    toProcess:['', [Validators.required]],
    job:[''],
    subJobId:[''],
    timeTaken:[new Date().getDay()+':'+new Date().getHours()+':'+new Date().getMinutes()],
    userId:[''], // No
    date:[''],
    copy:[''], // no
    reason:[''], //no
    attachments:[''], //no
    deliveryOn:[''],
    deliveryOnDays:[''],
    deliveryOnDate:[{disabled: true,value:''}],
    salesPersonCode:[''],
    StockCode: ['', [Validators.required]],
  });

  setvaluesdata(){
    console.log(this.comService);
    this.repairCustomerDeliveryForm.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.repairCustomerDeliveryForm.controls.vocNo.setValue('1')
    this.repairCustomerDeliveryForm.controls.vocDate.setValue(this.comService.currentDate)
    this.repairCustomerDeliveryForm.controls.completed.setValue(this.comService.currentDate)
    this.repairCustomerDeliveryForm.controls.date.setValue(this.comService.currentDate)
    this.repairCustomerDeliveryForm.controls.deliveryOnDate.setValue(this.comService.currentDate)
  }

  
  
  setAllInitialValues() {
    if (!this.content) return
    let API = `JobCadProcessDJ/GetJobCadProcessDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          data.Details.forEach((element:any) => {
            this.tableData.push({
              Srno: element.SRNO,
              Division:element.DIVCODE,
              StoneType:element.METALSTONE,
              Karat:element.KARAT_CODE,
              Sieve:element.SIEVE,
              Color:element.COLOR,
              Shape:element.SHAPE,
              Size:element.SIZE,
              Pcs:element.PCS,
              Remarks:element.D_REMARKS,
              PointerWt:element.POINTER_WT,
              StockCode: element.STOCK_CODE
              
             

            })
          });
          console.log(this.tableDatas)
          data.Components.forEach((element:any) => {
            this.tableDatas.push({
              Srno:element.SRNO,
              CompCode:element.COMP_CODE,
              Description:element.COMP_DESCRIPTION,
              Pcs:element.PCS,
              SizeSet:element.COMPSIZE_CODE,
              SizeCode:element.COMPSET_CODE,
              Type:element.TYPE_CODE,
              Category:element.CATEGORY_CODE,
              Shape:element.COMP_SHAPE,
              Height:element.HEIGHT,
              Width:element.WIDTH,
              Length:element.LENGTH,
              Radius:element.RADIUS,
              Remarks:element.REMARKS

            
            })
          }); 
          this.repairCustomerDeliveryForm.controls.vocNo.setValue(data.VOCNO)
          this.repairCustomerDeliveryForm.controls.voctype.setValue(data.VOCTYPE)
          this.repairCustomerDeliveryForm.controls.design.setValue(data.DESIGN_CODE)
          this.repairCustomerDeliveryForm.controls.job.setValue(data.JOB_NUMBER)
          this.repairCustomerDeliveryForm.controls.toWorker.setValue(data.TO_WORKER_CODE)
          this.repairCustomerDeliveryForm.controls.toProcess.setValue(data.TO_PROCESS_CODE)
          this.repairCustomerDeliveryForm.controls.soNumber.setValue(data.JOB_SO_NUMBER)
          this.repairCustomerDeliveryForm.controls.subJobId.setValue(data.JOB_SO_MID)
          this.repairCustomerDeliveryForm.controls.narration.setValue(data.REMARKS)
         
          
        } else {
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openFileExplorer() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  handleFileInput(event: any) {
    const selectedFile = event.target.files[0];
    
    // Assuming you want to display the file path in the input field
    this.repairCustomerDeliveryForm.get('attachments')?.setValue(selectedFile.name);

    // You can also handle the file in other ways, such as uploading it
  }


  onFileChanged(event:any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result; 
      };
    }
  }

  setFormValues() {
    if (!this.content) return
    this.repairCustomerDeliveryForm.controls.job_number.setValue(this.content.JOB_NUMBER)
    this.repairCustomerDeliveryForm.controls.design.setValue(this.content.DESIGN_CODE)
    this.dataService.getDynamicAPI('/JobCadProcessDJ/GetJobCadProcessDJ/' + this.content.job_number).subscribe((data) => {
      if (data.status == 'Success') {
        this.tableData = data.response.WaxProcessDetails;
      }
    });
    
  }
  updateStandardTime(duration: any) {
    // this.yourContent.standardTime.totalDays = duration[0] || 0;
    // this.yourContent.standardTime.totalHours = duration[1] || 0;
    // this.yourContent.standardTime.totalMinutes = duration[2] || 0;

    this.formattedTime = duration;

    // console.log(this.formattedTime);

    console.log(duration)
  }
  yourContent = {
    standardTime: {
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
    }
  }
 
 

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "Srno": srno,
      "Division": "",
      "StoneType": "",
      "StockCode": "",
      "Karat": "",
      "Color": "",
      "Shape": "",
      "Sieve": "",
      "Size": 0,
      "Pcs": 0,
      "WtCt": 0,
      "SettingType": 0,
      "PointerWt": 0,
      "Remarks": "",
    };
  
    this.tableData.push(data);
   
}

divisiontemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Division = data.target.value;
}

stonetypetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].StoneType = data.target.value;
}

stockcodetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].StockCode = data.target.value;
}

karattemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Karat = data.target.value;
}

colortemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Color = data.target.value;
}

shapetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Shape = data.target.value;
}

sievetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Sieve = data.target.value;
}

sizetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Size = data.target.value;
}

Pcstemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Pcs = data.target.value;
}

wtcttemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].WtCt = data.target.value;
}

settingtypetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].SettingType = data.target.value;
}

pointerwttemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].PointerWt = data.target.value;
}

remarkstemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Remarks = data.target.value;
}
stoneTypeSelected(event: any, value: any) {
  this.tableData[value.data.Srno - 1].StoneType = event.CODE;
}
DivisionSelected(event: any, value: any) {
  console.log(event);
  this.tableData[value.data.Srno - 1].Division = event.DIVISION_CODE;
}

onHoverstoneType({ data }: any) {
  this.generalMaster.WHERECONDITION = `TYPES = 'STONE TYPE MASTER' AND DIV_${data.DIVCODE}=1`
}
stockCodeSelected(event: any, value: any) {
  console.log(event)
  this.tableData[value.data.Srno - 1].StockCode = event.STOCK_CODE;
}
colorCodeSelected(event: any, value: any) {
  this.tableData[value.data.Srno - 1].Color = event.CODE;
}
shapeSelected(event: any, value: any) {
  this.tableData[value.data.Srno - 1].Shape = event.CODE;
}
sieveSelected(event: any, value: any) {
  this.tableData[value.data.Srno - 1].Sieve = event.CODE;
}
categortySelected(event: any, value: any) {
  this.tableDatas[value.data.Srno - 1].Category = event.CODE;
}
shapeSelected1(event: any, value: any) {
  this.tableDatas[value.data.Srno - 1].Shape = event.CODE;
}
karatCodeSelected(event: any, value: any ) {
  console.log(event)
    this.tableData[value.data.Srno - 1].Karat = event['Karat Code'];
}
onHoverStockCode({ data }: any) {
  this.stockCode.LOOKUPID = 23
 }

 onHoverColorCode({ data }: any) {
  this.generalMaster.WHERECONDITION = `TYPES = 'COLOR MASTER' AND DIV_${data.DIVCODE}=1`
}
onHoverShape({ data }: any) {
  this.generalMaster.WHERECONDITION = `TYPES = 'SHAPE MASTER' AND  DIV_${data.DIVCODE}=1`
}
onHoverSieve({data}:any){
  this.generalMaster.WHERECONDITION = `TYPES = 'SHAPE MASTER' AND  DIV_${data.DIVCODE}=1`
}
onHoverCategory({data}:any){
  this.generalMaster.WHERECONDITION = `TYPES = 'SHAPE MASTER' AND  DIV_${data.DIVCODE}=1`
}
onHoverKaratCode({data}:any){
  this.karatCodeData.WHERECONDITION = `TYPES = 'SHAPE MASTER' AND  DIV_${data.DIVCODE}=1`
}


adddatas() {
  let length = this.tableDatas.length;
  let srno = length + 1;
  let data2=  {
    "Srno": srno,
    "CompCode": "",
    "Description": "",
    "Pcs": "",
    "SizeSet": "",
    "SizeCode": "",
    "Type": "",
    "Category": "",
    "Shape": 0,
    "Height": 0,
    "Width": 0,
    "Length": 0,
    "Radius": 0,
    "Remarks": "",
  };
  this.tableDatas.push(data2);
 
}

compcodetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].CompCode = data.target.value;
}

descriptiontemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Description = data.target.value;
}
Pcs2temp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Pcs = data.target.value;
}

sizesettemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].SizeSet = data.target.value;
}

sizecodetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].SizeCode = data.target.value;
}

typetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Type = data.target.value;
}

categorytemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Category = data.target.value;
}

shape2temp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Shape = data.target.value;
}

heighttemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Height = data.target.value;
}

widthtemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Width = data.target.value;
}

lengthtemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Length = data.target.value;
}

radiustemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Radius = data.target.value;
}

remarks2temp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Remarks = data.target.value;
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}
setDetaills(){
  let Details:any=[]
  this.tableData.forEach((Element: any)=> {
    Details.push(
      {
        "UNIQUEID": 0,
        "DT_BRANCH_CODE": this.branchCode,
        "DT_VOCTYPE": this.repairCustomerDeliveryForm.value.voctype,
        "DT_VOCNO": 0,
        "DT_YEARMONTH": this.yearMonth,
        "SRNO": Element.Srno,
        "METALSTONE": this.comService.nullToString(Element.METALSTONE),
        "DIVCODE": this.comService.nullToString(Element.DIVCODE),
        "STONE_TYPE": Element.StoneType,
        "KARAT_CODE": this.comService.nullToString(Element.KARAT_CODE),
        "SIEVE_SET": "",
        "SIEVE": Element.Sieve,
        "COLOR": Element.Color,
        "CLARITY": "",
        "SHAPE": Element.Shape,
        "SIZE": this.comService.nullToString(Element.Size),
        "PCS": this.comService.emptyToZero(Element.Pcs),
        "GROSS_WT": 0,
        "D_REMARKS": Element.Remarks,
        "PROCESS_TYPE": "",
        "POINTER_WT": Element.PointerWt,
        "STOCK_CODE": this.comService.nullToString(Element.StockCode),
        "COMP_CODE": ""
      }
    )
    
  }
  )
  return Details  
}

componentSet(){
  let Components:any=[]
  this.tableDatas.forEach((item: any)=>{
    Components.push(
       {
          "REFMID": 0,
          "SRNO": item.Srno,
          "COMP_CODE": item.CompCode,
          "COMP_DESCRIPTION": item.Description,
          "COMP_SHAPE": "",
          "TYPE_CODE": item.Type,
          "CATEGORY_CODE": item.Category,
          "COMPSIZE_CODE": "string",
          "COMPSET_CODE": "string",
          "HEIGHT": item.Height,
          "WIDTH": item.Width,
          "LENGTH": item.Length,
          "RADIUS": item.Radius,
          "PCS": this.comService.emptyToZero(item.PCS),
          "REMARKS": item.Remarks,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCTYPE": this.repairCustomerDeliveryForm.value.voctype,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth
        }

    ) 
  }
  )
  return Components
}

  


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }

    if (this.repairCustomerDeliveryForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobCadProcessDJ/InsertJobCadProcessDJ'
    let postData ={
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.repairCustomerDeliveryForm.value.voctype,
      "vocNo": this.repairCustomerDeliveryForm.value.vocNo,
      "YEARMONTH": this.yearMonth,
      "SALESPERSON_CODE": "string",
      "SYSTEM_DATE": this.repairCustomerDeliveryForm.value.date,
      "MACHINEID": "",
      "DOC_REF": "",
      "REMARKS": this.repairCustomerDeliveryForm.value.remarks,
      "VOCDATE": this.repairCustomerDeliveryForm.value.vocDate,
      "NAVSEQNO": 0,
      "PROCESS_CODE": this.repairCustomerDeliveryForm.value.process,
      "WORKER_CODE": this.repairCustomerDeliveryForm.value.worker,
      "JOB_NUMBER": this.repairCustomerDeliveryForm.value.job,
      "UNQ_JOB_ID": "",
      "JOB_SO_NUMBER": this.repairCustomerDeliveryForm.value.subJobId,
      "DESIGN_CODE": this.repairCustomerDeliveryForm.value.design,
      "UNQ_DESIGN_ID": "",
      "PART_CODE": "",
      "PCS": 0,
      "TIME_TAKEN": this.comService.emptyToZero(this.repairCustomerDeliveryForm.value.TIME_TAKEN),
      "JOB_SO_MID": 0,
      "CAD_STATUS": "",
      "APPR_CODE": "",
      "APPR_TYPE": this.comService.emptyToZero(this.repairCustomerDeliveryForm.value.type),
      "TRANS_REF": "",
      "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
      "TO_PROCESS_CODE": this.comService.nullToString(this.repairCustomerDeliveryForm.value.toProcess),
      "TO_WORKER_CODE": this.comService.nullToString(this.repairCustomerDeliveryForm.value.toWorker),
      "SO_DELIVERY_TYPE": this.repairCustomerDeliveryForm.value.deliveryOn,
      "SO_DELIVERY_DAYS": this.comService.emptyToZero(this.repairCustomerDeliveryForm.value.deliveryOnDays),
      "SO_DELIVERY_DATE": this.repairCustomerDeliveryForm.value.deliveryOnDate,
      "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
      "SO_CR_DAYS": 0,
      "Details":this.setDetaills(),

      "Components":this.componentSet(),
       
     
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
                this.repairCustomerDeliveryForm.reset()
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

  updateMeltingType() {
    console.log(this.branchCode,'working')
    let API = `JobCadProcessDJ/UpdateJobCadProcessDJ/${this.branchCode}/${this.repairCustomerDeliveryForm.value.voctype}/${this.repairCustomerDeliveryForm.value.vocNo}/${this.comService.yearSelected}` ;
      let postData ={
          "MID": 0,
          "BRANCH_CODE": this.branchCode,
          "VOCTYPE": this.repairCustomerDeliveryForm.value.voctype,
          "vocNo": this.repairCustomerDeliveryForm.value.vocNo,
          "YEARMONTH": this.yearMonth,
          "SALESPERSON_CODE": "string",
          "SYSTEM_DATE": this.repairCustomerDeliveryForm.value.date,
          "MACHINEID": "",
          "DOC_REF": "",
          "REMARKS": this.repairCustomerDeliveryForm.value.narration,
          "VOCDATE": this.repairCustomerDeliveryForm.value.vocDate,
          "NAVSEQNO": 0,
          "PROCESS_CODE": this.repairCustomerDeliveryForm.value.process,
          "WORKER_CODE": this.repairCustomerDeliveryForm.value.worker,
          "JOB_NUMBER": this.repairCustomerDeliveryForm.value.job,
          "UNQ_JOB_ID": "",
          "JOB_SO_NUMBER": this.repairCustomerDeliveryForm.value.subJobId,
          "DESIGN_CODE": this.repairCustomerDeliveryForm.value.design,
          "UNQ_DESIGN_ID": "",
          "PART_CODE": "",
          "PCS": 0,
          "TIME_TAKEN": this.comService.emptyToZero(this.repairCustomerDeliveryForm.value.TIME_TAKEN),
          "JOB_SO_MID": 0,
          "CAD_STATUS": "",
          "APPR_CODE": "",
          "APPR_TYPE": this.comService.emptyToZero(this.repairCustomerDeliveryForm.value.type),
          "TRANS_REF": "",
          "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
          "TO_PROCESS_CODE": this.comService.nullToString(this.repairCustomerDeliveryForm.value.toProcess),
          "TO_WORKER_CODE": this.comService.nullToString(this.repairCustomerDeliveryForm.value.toWorker),
          "SO_DELIVERY_TYPE": this.repairCustomerDeliveryForm.value.deliveryOn,
          "SO_DELIVERY_DAYS": this.comService.emptyToZero(this.repairCustomerDeliveryForm.value.deliveryOnDays),
          "SO_DELIVERY_DATE": this.repairCustomerDeliveryForm.value.deliveryOnDate,
          "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
          "SO_CR_DAYS": 0,
          "Details":this.setDetaills(),
    
          "Components":this.componentSet(),
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
                  this.repairCustomerDeliveryForm.reset()
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
        let API = '/JobCadProcessDJ/DeleteJobCadProcessDJ/' + this.repairCustomerDeliveryForm.value.brnachCode + this.repairCustomerDeliveryForm.value.voctype + this.repairCustomerDeliveryForm.value.vocNo + this.repairCustomerDeliveryForm.value.yearMoth;
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
                    this.repairCustomerDeliveryForm.reset()
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
                    this.repairCustomerDeliveryForm.reset()
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
  generalMaster: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'GENERAL MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  divisionMaster: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  stockCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 4,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'STOCK CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
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

  processSelected(e:any){
    console.log(e);
    this.repairCustomerDeliveryForm.controls.process.setValue(e.Process_Code);
  }
  
  toprocessCodeData: MasterSearchModel = {
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

  toProcessSelected(e:any){
    this.repairCustomerDeliveryForm.controls.toProcess.setValue(e.Process_Code);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code ',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workedSelected(e:any){
    console.log(e);
    this.repairCustomerDeliveryForm.controls.worker.setValue(e.WORKER_CODE);
  }
  
  toWorkedSelected(e:any){
  console.log(e);
  this.repairCustomerDeliveryForm.controls.toWorker.setValue(e.WORKER_CODE);
  }
////////////////////////////////////////////////////////////////////////////////////////////////////
  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code ',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  salesManSelected(e:any){
    console.log(e);
    this.repairCustomerDeliveryForm.controls.worker.setValue(e.WORKER_CODE);
  }

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code ',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  customerSelected(e:any){
    console.log(e);
    this.repairCustomerDeliveryForm.controls.worker.setValue(e.WORKER_CODE);
  }


  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(AlloyAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData(){
 
    
  }

}
