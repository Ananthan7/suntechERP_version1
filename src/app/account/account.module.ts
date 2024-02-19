import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { AccountRoutingModule } from './account-routing.module';
import { SigninModule } from './signin/signin.module';
import { SignupModule } from './signup/signup.module';
import { SignoutModule } from './signout/signout.module';
import { LockScreenModule } from './lock-screen/lock-screen.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { TwostepVerificationModule } from './twostep-verification/twostep-verification.module';
import { ThankyouModule } from './thankyou/thankyou.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SigninModule,
    SignupModule,
    SignoutModule,
    LockScreenModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    EmailVerificationModule,
    TwostepVerificationModule,
    ThankyouModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    ToastrModule.forRoot(),

    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule
  ]
})
export class AccountModule { }
