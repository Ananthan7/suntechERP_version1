import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction.routing';
import { TransactionComponent } from './transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DiamondSalesorderComponent } from './diamond-salesorder/diamond-salesorder.component';
import { DiamondQuotationComponent } from './diamond-quotation/diamond-quotation.component';
import { JobCardComponent } from './job-card/job-card.component';
import { JobCreationComponent } from './job-creation/job-creation.component';
import { MetalIssueComponent } from './metal-issue/metal-issue.component';
import { StoneIssueComponent } from './stone-issue/stone-issue.component';
import { MeltingProcessComponent } from './melting-process/melting-process.component';
import { CADProcessingComponent } from './cad-processing/cad-processing.component';
import { AddNewdetailComponent } from './diamond-salesorder/add-newdetail/add-newdetail.component';
import { AddNewdiamondquotationComponent } from './diamond-quotation/add-newdiamondquotation/add-newdiamondquotation.component';
import { WaxProcessComponent } from './wax-process/wax-process.component';



@NgModule({
  declarations: [
    TransactionComponent,
    DiamondSalesorderComponent,
    DiamondQuotationComponent,
    JobCardComponent,
    JobCreationComponent,
    MetalIssueComponent,
    StoneIssueComponent,
    MeltingProcessComponent,
    CADProcessingComponent,
    AddNewdetailComponent,
    AddNewdiamondquotationComponent,
    WaxProcessComponent
    
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule
  ]
})
export class TransactionModule { }
