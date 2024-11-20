import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-component-size-master',
  templateUrl: './component-size-master.component.html',
  styleUrls: ['./component-size-master.component.scss']
})
export class ComponentSizeMasterComponent implements OnInit {
  // subscriptions: any;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  radius!: number;
  viewMode: boolean = false;
  editableMode: boolean = false;
  codeEnable: boolean = true;


  componentsizemasterForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    desc: ['', [Validators.required]],
    height: ['', [Validators.required]],
    width: ['', [Validators.required]],
    length: [''],
    radius: ['']
  });
  options: any;
  descEdited: boolean = false;
  lastHeight: number = 0;
  lastWidth: number = 0;
  lastLength: number = 0;
  lastRadius: number = 0;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,

  ) { }

  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();
    this.codeEnable = true;
    this.updateDescription();    
    this.subscribeToFormChanges();
    // Set up a listener to detect manual edits to the `desc` field
    this.componentsizemasterForm.get('desc')?.valueChanges.subscribe((value) => {
        const autoDesc = this.generateAutoDescription(); 
        this.descEdited = value === autoDesc; 
    });

    this.setInitialValues();
    if (this.content?.FLAG) {
      this.setFormValues()
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.editableMode = true;
        this.codeEnable = false;
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }



  }

  private calculateRadius1(): number {
    const form = this.componentsizemasterForm.value;
    const height = this.commonService.emptyToZero(form.height);
    const width = this.commonService.emptyToZero(form.width);

    if (height !== null && width !== null) {    
      const radiusValue = Math.pow(((width * width) / (8 * height) + (height / 2)), 3 / 3);
      
      console.log(this.commonService.decimalQuantityFormat(radiusValue, 'METAL'));      
      return parseFloat(this.commonService.decimalQuantityFormat(radiusValue, 'METAL')); 
    } else {
      return 0; 
    }
  }

  private subscribeToFormChanges() {
    this.componentsizemasterForm.valueChanges.subscribe((formValues) => {
      
      if (
        formValues.height !== this.lastHeight ||
        formValues.width !== this.lastWidth ||
        formValues.length !== this.lastLength ||
        formValues.radius !== this.lastRadius
      ) {
        this.updateDescription();
    
        this.lastHeight = formValues.height;
        this.lastWidth = formValues.width;
        this.lastLength = formValues.length;
        this.lastRadius = formValues.radius;
      }
    });
  }

  private updateDescription() {
    const height = this.componentsizemasterForm.value.height || 0;
    const width = this.componentsizemasterForm.value.width || 0;
    const length = this.componentsizemasterForm.value.length || 0;

    let radius: number = this.calculateRadius1();
    if (isNaN(radius)) {
      radius = 0;
    } else {
      radius = this.setDecimalPoints(radius);
    }

    // const formattedRadius = radius.toFixed(3);
    const formattedRadius = this.commonService.decimalQuantityFormat(radius, 'METAL');
    
    const autoDesc = this.generateAutoDescription();

    // Update form with calculated `desc` only if it has not been manually edited
    if (!this.descEdited) {
      this.componentsizemasterForm.patchValue(
        {
          radius: radius,
          desc: autoDesc,
        },
        { emitEvent: false } // Prevent loop
      );
    }
  }

  // Helper function to generate the auto-generated `desc` text
  private generateAutoDescription(): string {
    const height = this.componentsizemasterForm.value.height || 0;
    const width = this.componentsizemasterForm.value.width || 0;
    const length = this.componentsizemasterForm.value.length || 0;

    let radius: number = this.calculateRadius1();
    if (isNaN(radius)) {
      radius = 0;
    } else {
      radius = this.setDecimalPoints(radius);
    }

    // const formattedRadius = radius.toFixed(3);
    const formattedRadius = this.commonService.decimalQuantityFormat(radius, 'METAL');
    return `H${Number(height)}#,W${Number(width)}#,L${Number(length)}#,R${Number(formattedRadius)}#`;
  }

  setDecimalPoints(value: number): number {
    // Logic to set decimal point
    console.log(value);
   return (this.commonService.decimalQuantityFormat(value, 'METAL'))
    // return parseFloat(value.toFixed(3)); // Return the value with exactly three decimal places
  }


  private setInitialValues() {
    this.componentsizemasterForm.controls.height.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentsizemasterForm.controls.width.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentsizemasterForm.controls.length.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentsizemasterForm.controls.radius.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))

  }

  codeValidate(event : any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }
    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }
    const code = this.componentsizemasterForm.value.code;
    console.log(code);

    if (!code) return;
    let API = 'ComponentSizeMaster/GetComponentSizeMasterDetail/' + this.componentsizemasterForm.value.code;
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          this.commonService.toastErrorByMsgId('MSG1121')//Code Already Exists
          this.componentsizemasterForm.controls.code.setValue('')
          this.renderer.selectRootElement('#code')?.focus();
        }
      });
    this.subscriptions.push(Sub)
  }

  checkCode(): boolean {
    if (this.componentsizemasterForm.value.code == '') {
      this.commonService.toastErrorByMsgId('Please enter the Code')
      return true
    }
    return false
  }

  codeEnabled() {
    if (this.componentsizemasterForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }

  }


  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.componentsizemasterForm.controls.code.setValue(this.content.COMPSIZE_CODE)
    this.componentsizemasterForm.controls.desc.setValue(this.content.DESCRIPTION)
    this.componentsizemasterForm.controls.height.setValue(this.setDecimalPoint(this.content.HEIGHT))
    this.componentsizemasterForm.controls.width.setValue(this.setDecimalPoint(this.content.WIDTH))
    this.componentsizemasterForm.controls.length.setValue(this.setDecimalPoint(this.content.LENGTH))
    this.componentsizemasterForm.controls.radius.setValue(this.setDecimalPoint(this.content.RADIUS))
  }

  setDecimalPoint(data: any) {
    let number = this.commonService.decimalQuantityFormat(data, 'THREE')
    return this.commonService.commaSeperation(number)
  }






  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {
    console.log(this.componentsizemasterForm.value);

    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {

      this.update()
      return
    }

    if (this.componentsizemasterForm.value.height > this.componentsizemasterForm.value.width / 2) {
      this.toastr.error('The Height must be Less than the Half of the Width')
      return;
    }


    if (this.componentsizemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ComponentSizeMaster/InsertComponentSizeMaster'
    let postData = this.setPostData()

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
                this.componentsizemasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          // this.toastr.error('Not saved')
          Swal.fire({
            title: '',
            text: 'This Component Size Detail Already Exists',
            icon: 'error',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          })
        }
      }, err => alert(err))
    this.subscriptions.push(Sub);
  }

  setPostData() {
    let form = this.componentsizemasterForm.value
    return {
      "MID": this.content?.MID || 0,
      "COMPSIZE_CODE": this.commonService.nullToString(form.code),
      "DESCRIPTION": this.commonService.nullToString(form.desc),
      "RADIUS": this.commonService.nullToString(form.radius) || 0,
      "LENGTH": this.commonService.nullToString(form.length) || 0,
      "WIDTH": this.commonService.nullToString(form.width),
      "HEIGHT": this.commonService.nullToString(form.height),
    }

  }

  update() {
    if (this.componentsizemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    if (this.componentsizemasterForm.value.height > this.componentsizemasterForm.value.width / 2) {
      this.toastr.error('The Height must be Less than the Half of the Width')
      return;
    }


    let API = 'ComponentSizeMaster/UpdateComponentSizeMaster/' + this.content.COMPSIZE_CODE
    let postData = this.setPostData()


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
                this.componentsizemasterForm.reset()
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
  deleteRecord() {
    if (!this.content.MID) {
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
        let API = 'ComponentSizeMaster/DeleteComponentSizeMaster/' + this.content.COMPSIZE_CODE
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
                    this.componentsizemasterForm.reset()
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
                    this.componentsizemasterForm.reset()
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

  onInputChange(event: any, controlName: string, maxLength: number) {
    const inputValue = event.target.value;

    if (inputValue.length > maxLength) {
      this.componentsizemasterForm.get(controlName)!.setValue(inputValue.slice(0, maxLength));
    }
  }
}
