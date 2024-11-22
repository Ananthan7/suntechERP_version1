import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { retry } from 'rxjs/operators';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-reverse-price-ratio',
  templateUrl: './reverse-price-ratio.component.html',
  styleUrls: ['./reverse-price-ratio.component.scss']
})
export class ReversePriceRatioComponent implements OnInit {

  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  editMode: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { 
    
  }

  ngOnInit(): void {
    if (this.content?.FLAG) {
      console.log(this.content)
      this.setFormValues();
     if (this.content.FLAG == 'VIEW') {
       this.viewMode = true;
     } else if (this.content.FLAG == 'EDIT') {
       this.viewMode = false;
       this.editMode = true;
      
     } else if (this.content?.FLAG == 'DELETE') {
       this.viewMode = true;
       this.delete()
     }
   }
  }


  reversepriceratioForm: FormGroup = this.formBuilder.group({
    metalDiamond:[''],
    branchCode:[''],
    divisioncode:[''],
    directPropotion:[false],
    metalRatio:[false],
    metalRatioDetail:[''],
    stoneRatio:[false],
    stoneRatioDetail:[''],
    labourRatio:[false],
    labourRatioDetail:[''],
    kundanRatio:[false],
    kundanRatioDetail:[''],
    wastageRatio:[false],
    wastageRatioDetail:[''],
    total:[false],
    totalDetail:[''],


    directPropotionDia:[''],
    metalRatioDia:[''],
    metalRatioDiaDetail:[''],
    stoneRatioDia:[''],
    stoneRatioDiaDetail:[''],
    labourRatioDia:[''],
    labourRatioDiaDetail:[''],
    totalDia:[''],
    totalDiaDetail:[''],


    stoneSplittingRatio:[false],
    LooseSplittingRatio:[false],
    LooseSplittingRatioDetail:[''],
    colorstoneRatio:[false],
    colorstoneRatioDetail:[''],
    pearlsRatio:[false],
    pearlsRatioDetail:[''],
    zirconRatio:[false],
    zirconRatioDetail:[''],


    totalDiaone:[''],
    totalDiaoneDetail:[''],


  });


  setFormValues() {
    if (!this.content) return;
       this.reversepriceratioForm.controls.metalDiamond.setValue(this.content.METAL_DIAMOND == 'Y' ? true : false);
       this.reversepriceratioForm.controls.divisioncode.setValue(this.content.DIVISION_CODE);
       this.reversepriceratioForm.controls.directPropotion.setValue(this.content.DIRECT_RATIO == 'Y' ? true : false);
       this.reversepriceratioForm.controls.metalRatio.setValue(this.content.METAL == 'Y' ? true : false);
       this.reversepriceratioForm.controls.stoneRatio.setValue(this.content.STONE == 'Y' ? true : false);
       this.reversepriceratioForm.controls.labourRatio.setValue(this.content.LABOUR == 'Y' ? true : false);
       this.reversepriceratioForm.controls.kundanRatio.setValue(this.content.KUNDAN == 'Y' ? true : false);
       this.reversepriceratioForm.controls.wastageRatio.setValue(this.content.WASTAGE == 'Y' ? true : false);
       this.reversepriceratioForm.controls.metalRatioDetail.setValue(this.content.METAL_RATIO);
       this.reversepriceratioForm.controls.stoneRatioDetail.setValue(this.content.STONE_RATIO);
       this.reversepriceratioForm.controls.labourRatioDetail.setValue(this.content.LABOUR_RATIO);
       this.reversepriceratioForm.controls.kundanRatioDetail.setValue(this.content.KUNDAN_RATIO);
       this.reversepriceratioForm.controls.wastageRatioDetail.setValue(this.content.WASTAGE_RATIO);
       this.reversepriceratioForm.controls.LooseSplittingRatio.setValue(this.content.DIV_L == 'Y' ? true : false);
       this.reversepriceratioForm.controls.colorstoneRatio.setValue(this.content.DIV_C == 'Y' ? true : false);
       this.reversepriceratioForm.controls.pearlsRatio.setValue(this.content.DIV_P == 'Y' ? true : false);
       this.reversepriceratioForm.controls.zirconRatio.setValue(this.content.DIV_Z == 'Y' ? true : false);
       this.reversepriceratioForm.controls.total.setValue(this.content.DIV_N == 'Y' ? true : false);
       this.reversepriceratioForm.controls.LooseSplittingRatioDetail.setValue(this.content.DIV_L_RATIO);
       this.reversepriceratioForm.controls.colorstoneRatioDetail.setValue(this.content.DIV_C_RATIO);
       this.reversepriceratioForm.controls.pearlsRatioDetail.setValue(this.content.DIV_P_RATIO);
       this.reversepriceratioForm.controls.zirconRatioDetail.setValue(this.content.DIV_Z_RATIO);
       this.reversepriceratioForm.controls.totalDetail.setValue(this.content.DIV_N_RATIO);
       this.reversepriceratioForm.controls.stoneSplittingRatio.setValue(this.content.STONE_SPLIT_RATIO == 'Y' ? true : false);
       this.reversepriceratioForm.controls.branchCode.setValue(this.content.BRANCH_CODE);

       }

       

  setPostData(){
    return { 
      "MID": this.content?.MID || 0,
      "METAL_DIAMOND": this.reversepriceratioForm.value.metalDiamond,
      "BRANCH_CODE": this.commonService.nullToString(this.reversepriceratioForm.value.branchCode),
      "DIVISION_CODE": this.commonService.nullToString(this.reversepriceratioForm.value.divisioncode), 
      "DIRECT_RATIO": this.reversepriceratioForm.value.directPropotion,
      "METAL": this.reversepriceratioForm.value.metalRatio,
      "STONE": this.reversepriceratioForm.value.stoneRatio,
      "LABOUR":  this.reversepriceratioForm.value.labourRatio,
      "KUNDAN": this.reversepriceratioForm.value.kundanRatio,
      "WASTAGE": this.reversepriceratioForm.value.wastageRatio,
      "METAL_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.metalRatioDetail),
      "STONE_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.stoneRatioDetail),
      "LABOUR_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.labourRatioDetail),
      "KUNDAN_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.kundanRatioDetail),
      "WASTAGE_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.wastageRatioDetail),
      "DIV_L": this.reversepriceratioForm.value.LooseSplittingRatio,
      "DIV_C": this.reversepriceratioForm.value.colorstoneRatio,
      "DIV_P": this.reversepriceratioForm.value.pearlsRatio,
      "DIV_Z": this.reversepriceratioForm.value.zirconRatio,
      "DIV_N": this.reversepriceratioForm.value.total,
      "DIV_L_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.LooseSplittingRatioDetail),
      "DIV_C_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.colorstoneRatioDetail),
      "DIV_P_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.pearlsRatioDetail),
      "DIV_Z_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.zirconRatioDetail),
      "DIV_N_RATIO": this.commonService.emptyToZero(this.reversepriceratioForm.value.totalDetail),
      "SYSTEM_DATE": "2024-11-18T06:08:55.932Z",
      "STONE_SPLIT_RATIO": this.reversepriceratioForm.value.stoneSplittingRatio,
    }
  }

  formSubmit(){

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    let API = 'PriceRatioMaster/InsertPriceRatioMaster/';
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        console.log('result', result)
        if (result.response) {
          if (result.status == 'Success') {
            Swal.fire({
              title: 'Saved Successfully',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok',
            }).then((result: any) => {
              if (result.value) {
                this.reversepriceratioForm.reset();
                this.close('reloadMainGrid');
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);

  }

  update(){

    let API = 'PriceRatioMaster/UpdatePriceRatioMaster/' + this.content.DIVISION_CODE +'/'+this.content.BRANCH_CODE;
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {

          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.reversepriceratioForm.reset();
                this.close('reloadMainGrid')
              }
            });
          }
        
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }


  delete(){

    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'PriceRatioMaster/DeletePriceRatioMaster/' + this.content.BRANCH_CODE +'/'+ this.content.DIVISION_CODE;
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
                    this.reversepriceratioForm.reset()
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
                    this.reversepriceratioForm.reset()
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

}
