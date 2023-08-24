import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})

/**
 * Signup Basic Component
 */
export class BasicComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  submitted = false;
  signupForm!: FormGroup;
  roles: any;
  signupFormData: any;
  public validateState = 0;

  constructor(private formBuilder: FormBuilder,
    private router:Router,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      password: ['', Validators.required],
      mbl_no: ['', Validators.required],
      role: [, Validators.required],
    });
    this.signupForm.controls.name.disable();
    this.signupForm.controls.lastname.disable();
    this.signupForm.controls.password.disable();
    this.signupForm.controls.mbl_no.disable();
    this.signupForm.controls.role.disable();

    this.getRoles();
  //   let postdata = {
  //     "key": "6ed1d00a325a1108f535f23e8b592882",
  //     "data_center": "us9"
  // };
  //   this.apiService.getCampaign(postdata).then((result:any)=>{console.log(result);
  //   })
  }
  getRoles(){
    // this.apiService.getCrmRoles().then((result: any) => {
    //   console.log(result);
    //   if(result != null){
    //     this.roles = result.cRMRoleMasters;
    //   }
    // });
  }
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
   
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    else{
      this.signupFormData = 
      {
        "MID": 1,
        "FIRSTNAME": this.signupForm.value.name,
        "LASTNAME":  this.signupForm.value.lastname,
        "PASSWORD":  this.signupForm.value.password,
        "EMAIL_ID":  this.signupForm.value.email,
        "MOBILE": this.signupForm.value.mbl_no,
        "ISACTIVE": true,
        "USER_ROLE":  this.signupForm.value.role
      };

    //   this.apiService.crmRegister(this.signupFormData).then((result: any) => {
    //         console.log(result);            
    //     if (result.message == 'Success') {
    //       Swal.fire({
    //         title: 'SUCCESS!',
    //         text: 'Registered Successfully!',
    //         icon: 'success',
    //         confirmButtonColor: '#336699',
    //         confirmButtonText: 'Ok'
    //       }).then((result:any)=>{console.log(result);
    //         if(result.value){
    //           this.router.navigate(['/account/login']);
    //         }
    //       });
    //     } else {
    //       Swal.fire('Warning!', 'Data Not Added.', 'warning');
    //     }
    // });
    }
  }
  checkemail(){
    this.toastr.info('Checking Email...');
    if (this.signupForm.value.email != '') {
      // this.snackBarRef = this.snackBar.open('Validating Username ...');

      // this.apiService.userRegisterEmailValidation(this.signupForm.value.email).then((result: any) => {
      //   console.log(result);
      //   if (result.message == 'Success') {
      //     this.toastr.clear();
      //     if (result.cRMUserRegistrations.length == 0) {
      //       this.validateState = 1;
      //       this.signupForm.controls.name.enable();
      //       this.signupForm.controls.lastname.enable();
      //       this.signupForm.controls.password.enable();
      //       this.signupForm.controls.mbl_no.enable();
      //       this.signupForm.controls.role.enable();
      //       // this.renderer.selectRootElement('#password').focus();

      //     } else {
      //       this.signupForm.controls.name.disable();
      //       this.signupForm.controls.lastname.disable();
      //       this.signupForm.controls.password.disable();
      //       this.signupForm.controls.mbl_no.disable();
      //       this.signupForm.controls.role.disable();
      //       this.toastr.error('Email Already Registered');
      //       // this.renderer.selectRootElement('#username').focus();
      //       // this.loginForm.controls.password.disable();
      //     }
      //   }
      //   // this.snackBar.dismiss();
      // });
    }
  }
}
