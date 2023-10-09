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
import { MetalIssueDetailsComponent } from './metal-issue/metal-issue-details/metal-issue-details.component';
import { StoneIssueDetailComponent } from './stone-issue/stone-issue-detail/stone-issue-detail.component';
import { StoneReturnComponent } from './stone-return/stone-return.component';
import { StoneReturnDetailsComponent } from './stone-return/stone-return-details/stone-return-details.component';
import { WaxProcessReturnComponent } from './wax-process-return/wax-process-return.component';
import { CastingTreeUpComponent } from './casting-tree-up/casting-tree-up.component';
import { MeltingIssueComponent } from './melting-issue/melting-issue.component';
import { MeltingIssueDetailsComponent } from './melting-issue/melting-issue-details/melting-issue-details.component';
import { ProcessTransferComponent } from './process-transfer/process-transfer.component';



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
    WaxProcessComponent,
    MetalIssueDetailsComponent,
    StoneIssueDetailComponent,
    StoneReturnComponent,
    StoneReturnDetailsComponent,
    StoneReturnComponent,
    StoneReturnDetailsComponent,
    WaxProcessReturnComponent,
    CastingTreeUpComponent,
    MeltingIssueComponent,
    MeltingIssueDetailsComponent,
    ProcessTransferComponent,
    
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule
  ]
})
export class TransactionModule { }
