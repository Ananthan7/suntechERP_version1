import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailTransactionRoutingModule } from './retail-transaction.routing';
import { RetailTransactionComponent } from './retail-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPosComponent } from './add-pos/add-pos.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule, DateAdapter} from '@angular/material/core';

@NgModule({
  declarations: [
    RetailTransactionComponent,
    AddPosComponent
  ],
  imports: [
    CommonModule,
    RetailTransactionRoutingModule,
    SharedModule,
    MatFormFieldModule,MatInputModule,MatAutocompleteModule,MatExpansionModule,
    MatSelectModule,MatDatepickerModule,MatNativeDateModule, MatRippleModule, 
  ]
})
export class RetailTransactionModule { }
