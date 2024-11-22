import { Component, ComponentFactory, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AlloyAllocationComponent } from './alloy-allocation/alloy-allocation.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { Code } from 'angular-feather/icons';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-cad-processing',
  templateUrl: './cad-processing.component.html',
  styleUrls: ['./cad-processing.component.scss']
})
export class CADProcessingComponent implements OnInit {
  @ViewChild('overlayprocesscode') overlayprocesscode!: MasterSearchComponent;
  @ViewChild('overlayworkercode') overlayworkercode!: MasterSearchComponent;
  @ViewChild('overlaytoworkercode') overlaytoworkercode!: MasterSearchComponent;
  @ViewChild('overlaytoProcesscode') overlaytoProcesscode!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;
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
  columnheadItemDetails3:any[] = ['Comp Code','Srno','Division','Stone Type','Stock Code','Karat','Color','Shape','Sieve Std','Sieve Set'];
  columnheadItemDetails2:any[] = ['']
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
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  maxTime: any;
  standTime: any;
  formattedMaxTime: number = 0;
  codeEnable: boolean = true;
  // setAllInitialValues: any;

  maxContent = {
    maximumTime: {
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
    }
  }

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
    this.cadProcessingForm.controls.deliveryOnDate = new FormControl({value: '', disabled: this.isdisabled})
  
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


  cadProcessingForm: FormGroup = this.formBuilder.group({
    voctype: [,''],
    vocNo: [''],
    vocDate: [''],
    process: ['',''],
    worker: [''],
    narration: [''],
    soNumber: [''],    //no
    design:['', [Validators.required]],
    completed:[''], //no
    toWorker:['', [Validators.required]],
    toProcess:['', [Validators.required]],
    job:[''],
    subJobId:[''],
    timeTaken:[new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()],
    userId:[''], // No
    date:[''],
    copy:[''], // no
    type:[''],
    reason:[''], //no
    remarks:[''],
    attachments:[''], //no
    deliveryOn:[''],
    deliveryOnDays:[''],
    deliveryOnDate:[{disabled: true,value:''}],
    salesPersonCode:[''],
    StockCode: ['', [Validators.required]],
  });

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);
    
  }

  setvaluesdata(){
    console.log(this.comService);
    this.cadProcessingForm.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.cadProcessingForm.controls.vocNo.setValue('1')
    this.cadProcessingForm.controls.vocDate.setValue(this.comService.currentDate)
    this.cadProcessingForm.controls.completed.setValue(this.comService.currentDate)
    this.cadProcessingForm.controls.date.setValue(this.comService.currentDate)
    this.cadProcessingForm.controls.deliveryOnDate.setValue(this.comService.currentDate)
  }

  updateMaximumTime(duration: any) {
     this.formattedMaxTime = duration;
    console.log(this.formattedMaxTime);
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
          this.cadProcessingForm.controls.vocNo.setValue(data.VOCNO)
          this.cadProcessingForm.controls.voctype.setValue(data.VOCTYPE)
          this.cadProcessingForm.controls.design.setValue(data.DESIGN_CODE)
          this.cadProcessingForm.controls.job.setValue(data.JOB_NUMBER)
          this.cadProcessingForm.controls.toWorker.setValue(data.TO_WORKER_CODE)
          this.cadProcessingForm.controls.toProcess.setValue(data.TO_PROCESS_CODE)
          this.cadProcessingForm.controls.soNumber.setValue(data.JOB_SO_NUMBER)
          this.cadProcessingForm.controls.subJobId.setValue(data.JOB_SO_MID)
          this.cadProcessingForm.controls.narration.setValue(data.REMARKS)
         
          
        } else {
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
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
  auditTrailClick(){

  }

  openFileExplorer() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  handleFileInput(event: any) {
    const selectedFile = event.target.files[0];
    
    // Assuming you want to display the file path in the input field
    this.cadProcessingForm.get('attachments')?.setValue(selectedFile.name);

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
    this.cadProcessingForm.controls.job_number.setValue(this.content.JOB_NUMBER)
    this.cadProcessingForm.controls.design.setValue(this.content.DESIGN_CODE)
    this.dataService.getDynamicAPI('/JobCadProcessDJ/GetJobCadProcessDJ/' + this.content.job_number).subscribe((data) => {
      if (data.status == 'Success') {
        this.tableData = data.response.WaxProcessDetails;
      }
    });
    
  }
  lookupKeyPress(event: any, form?: any) {
    if(event.key == 'Tab' && event.target.value == ''){
      this.showOverleyPanel(event,form)
    }
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
        "DT_VOCTYPE": this.cadProcessingForm.value.voctype,
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
          "DT_VOCTYPE": this.cadProcessingForm.value.voctype,
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth
        }

    ) 
  }
  )
  return Components
}

  
submitValidations(form: any) {
  if (this.comService.nullToString(form.design) == '') {
    this.comService.toastErrorByMsgId('MSG7965')// design code CANNOT BE EMPTY
    return true
  }
  else if (this.comService.nullToString(form.toWorker) == '') {
    this.comService.toastErrorByMsgId('MSG1912')//"toWorker cannot be empty"
    return true
  }
  else if (this.comService.nullToString(form.toProcess) == '') {
    this.comService.toastErrorByMsgId('MSG1907')//"toProcess cannot be empty"
    return true
  }
  else if (this.comService.nullToString(form.StockCode) == '') {
    this.comService.toastErrorByMsgId('MSG7848')//"StockCode cannot be empty"
    return true
  }
  return false;
}


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }
    if (this.submitValidations(this.cadProcessingForm.value)) return;

    let API = 'JobCadProcessDJ/InsertJobCadProcessDJ'
    let postData ={
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.cadProcessingForm.value.voctype,
      "vocNo": this.cadProcessingForm.value.vocNo,
      "YEARMONTH": this.yearMonth,
      "SALESPERSON_CODE": "string",
      "SYSTEM_DATE": this.cadProcessingForm.value.date,
      "MACHINEID": "",
      "DOC_REF": "",
      "REMARKS": this.cadProcessingForm.value.remarks,
      "VOCDATE": this.cadProcessingForm.value.vocDate,
      "NAVSEQNO": 0,
      "PROCESS_CODE": this.cadProcessingForm.value.process,
      "WORKER_CODE": this.cadProcessingForm.value.worker,
      "JOB_NUMBER": this.cadProcessingForm.value.job,
      "UNQ_JOB_ID": "",
      "JOB_SO_NUMBER": this.cadProcessingForm.value.subJobId,
      "DESIGN_CODE": this.cadProcessingForm.value.design,
      "UNQ_DESIGN_ID": "",
      "PART_CODE": "",
      "PCS": 0,
      "TIME_TAKEN": this.comService.emptyToZero(this.cadProcessingForm.value.TIME_TAKEN),
      "JOB_SO_MID": 0,
      "CAD_STATUS": "",
      "APPR_CODE": "",
      "APPR_TYPE": this.comService.emptyToZero(this.cadProcessingForm.value.type),
      "TRANS_REF": "",
      "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
      "TO_PROCESS_CODE": this.comService.nullToString(this.cadProcessingForm.value.toProcess),
      "TO_WORKER_CODE": this.comService.nullToString(this.cadProcessingForm.value.toWorker),
      "SO_DELIVERY_TYPE": this.cadProcessingForm.value.deliveryOn,
      "SO_DELIVERY_DAYS": this.comService.emptyToZero(this.cadProcessingForm.value.deliveryOnDays),
      "SO_DELIVERY_DATE": this.cadProcessingForm.value.deliveryOnDate,
      "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
      "SO_CR_DAYS": 0,
      "Details":this.setDetaills(),

      "Components":this.componentSet(),
       
     
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
       
          if (result && result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.cadProcessingForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
          else {
            this.comService.toastErrorByMsgId('MSG3577')
          }
        
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  updateMeltingType() {
    console.log(this.branchCode,'working')
    if (this.submitValidations(this.cadProcessingForm.value)) return;
    let API = `JobCadProcessDJ/UpdateJobCadProcessDJ/${this.branchCode}/${this.cadProcessingForm.value.voctype}/${this.cadProcessingForm.value.vocNo}/${this.comService.yearSelected}` ;
      let postData ={
          "MID": 0,
          "BRANCH_CODE": this.branchCode,
          "VOCTYPE": this.cadProcessingForm.value.voctype,
          "vocNo": this.cadProcessingForm.value.vocNo,
          "YEARMONTH": this.yearMonth,
          "SALESPERSON_CODE": "string",
          "SYSTEM_DATE": this.cadProcessingForm.value.date,
          "MACHINEID": "",
          "DOC_REF": "",
          "REMARKS": this.cadProcessingForm.value.narration,
          "VOCDATE": this.cadProcessingForm.value.vocDate,
          "NAVSEQNO": 0,
          "PROCESS_CODE": this.cadProcessingForm.value.process,
          "WORKER_CODE": this.cadProcessingForm.value.worker,
          "JOB_NUMBER": this.cadProcessingForm.value.job,
          "UNQ_JOB_ID": "",
          "JOB_SO_NUMBER": this.cadProcessingForm.value.subJobId,
          "DESIGN_CODE": this.cadProcessingForm.value.design,
          "UNQ_DESIGN_ID": "",
          "PART_CODE": "",
          "PCS": 0,
          "TIME_TAKEN": this.comService.emptyToZero(this.cadProcessingForm.value.TIME_TAKEN),
          "JOB_SO_MID": 0,
          "CAD_STATUS": "",
          "APPR_CODE": "",
          "APPR_TYPE": this.comService.emptyToZero(this.cadProcessingForm.value.type),
          "TRANS_REF": "",
          "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
          "TO_PROCESS_CODE": this.comService.nullToString(this.cadProcessingForm.value.toProcess),
          "TO_WORKER_CODE": this.comService.nullToString(this.cadProcessingForm.value.toWorker),
          "SO_DELIVERY_TYPE": this.cadProcessingForm.value.deliveryOn,
          "SO_DELIVERY_DAYS": this.comService.emptyToZero(this.cadProcessingForm.value.deliveryOnDays),
          "SO_DELIVERY_DATE": this.cadProcessingForm.value.deliveryOnDate,
          "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
          "SO_CR_DAYS": 0,
          "Details":this.setDetaills(),
    
          "Components":this.componentSet(),
        }
       
      
  
      let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result && result.status == "Success") {
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.cadProcessingForm.reset()
                  this.tableData = []
                  this.close('reloadMainGrid')
                }
              });
            
          } else {
            this.comService.toastErrorByMsgId('MSG3577')
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
        let API = '/JobCadProcessDJ/DeleteJobCadProcessDJ/' + this.cadProcessingForm.value.brnachCode + this.cadProcessingForm.value.voctype + this.cadProcessingForm.value.vocNo + this.cadProcessingForm.value.yearMoth;
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
                    this.cadProcessingForm.reset()
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
                    this.cadProcessingForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.comService.toastErrorByMsgId('MSG1880');// Not Deleted
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
    this.cadProcessingForm.controls.process.setValue(e.Process_Code);
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
    this.cadProcessingForm.controls.toProcess.setValue(e.Process_Code);
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
    this.cadProcessingForm.controls.worker.setValue(e.WORKER_CODE);
  }
  
  toWorkedSelected(e:any){
  console.log(e);
  this.cadProcessingForm.controls.toWorker.setValue(e.WORKER_CODE);
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
  showOverleyPanel(event: any, formControlName: string) {
    if (this.cadProcessingForm.value[formControlName] != '') return;
  
    switch (formControlName) {
      case 'process':
        this.overlayprocesscode.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkercode.showOverlayPanel(event);
        break;
      case 'toWorker':
        this.overlaytoworkercode.showOverlayPanel(event);
        break;
      case 'toProcess':
        this.overlaytoProcesscode.showOverlayPanel(event);
        break;
      default:
    }
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.comService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.cadProcessingForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'process' || FORMNAME === 'worker' || FORMNAME === 'toWorker' || FORMNAME === 'toProcess') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
