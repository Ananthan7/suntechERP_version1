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
import { MetalReturnComponent } from './metal-return/metal-return.component';
import { CastingTreeUpComponent } from './casting-tree-up/casting-tree-up.component';
import { MetalReturnDetailsComponent } from './metal-return/metal-return-details/metal-return-details.component';
import { MouldMakingComponent } from './mould-making/mould-making.component';

import { MeltingIssueComponent } from './melting-issue/melting-issue.component';
import { MeltingIssueDetailsComponent } from './melting-issue/melting-issue-details/melting-issue-details.component';
import { ProcessTransferComponent } from './process-transfer/process-transfer.component';
import { JobClosingComponent } from './job-closing/job-closing.component';
import { JewelleryAltrationComponent } from './jewellery-altration/jewellery-altration.component';
import { JewelleryAltrationDetailsComponent } from './jewellery-altration/jewellery-altration-details/jewellery-altration-details.component';
import { ProcessTransferDetailsComponent } from './process-transfer/process-transfer-details/process-transfer-details.component';
import { AlloyAllocationComponent } from './cad-processing/alloy-allocation/alloy-allocation.component';
import { ProductionMfgComponent } from './production-mfg/production-mfg.component';
import { ProductionEntryDetailsComponent } from './production-mfg/production-entry-details/production-entry-details.component';
import { QuotationProcessComponent } from './quotation-process/quotation-process.component';
import { JewelleryDismantlingComponent } from './jewellery-dismantling/jewellery-dismantling.component';
import { JewelleryAssemblingComponent } from './jewellery-assembling/jewellery-assembling.component';
import { JewelleryAssemblingDetailsComponent } from './jewellery-assembling/jewellery-assembling-details/jewellery-assembling-details.component';
import { TreeDownComponent } from './tree-down/tree-down.component';
import { MeltingProcessDetailsComponent } from './melting-process/melting-process-details/melting-process-details.component';
import { LossRecoveryComponent } from './loss-recovery/loss-recovery.component';
import { ProductionStockDetailComponent } from './production-mfg/production-stock-detail/production-stock-detail.component';
import { CompanyDetailComponent } from './diamond-salesorder/company-detail/company-detail.component';
import { DiamondJobBoqIssueComponent } from './diamond-job-boq-issue/diamond-job-boq-issue.component';
import { DiamondJobBoqReceiptComponent } from './diamond-job-boq-receipt/diamond-job-boq-receipt.component';
import { JobAllocationComponent } from './job-allocation/job-allocation.component';
import { JobTransactionsComponent } from './job-transactions/job-transactions.component';



@NgModule({
  declarations: [
    TransactionComponent,
    CADProcessingComponent,
    CastingTreeUpComponent,
    DiamondSalesorderComponent,
    DiamondQuotationComponent,
    AddNewdiamondquotationComponent,
    JobCardComponent,
    JobCreationComponent,
    MeltingProcessComponent,
    MetalIssueComponent,
    MetalIssueDetailsComponent,
    MetalReturnComponent,
    MetalReturnDetailsComponent,
    StoneIssueComponent,
    StoneIssueDetailComponent,
    StoneReturnComponent,
    StoneReturnDetailsComponent,
    WaxProcessComponent,    
    WaxProcessReturnComponent,
    AddNewdetailComponent, 
    CastingTreeUpComponent,
    MeltingIssueComponent,
    ProductionMfgComponent,
    MeltingIssueDetailsComponent,
    ProcessTransferComponent,
    MouldMakingComponent,
    JobClosingComponent,
    TreeDownComponent,
    JewelleryAltrationComponent,
    JewelleryAltrationDetailsComponent,
    ProcessTransferDetailsComponent,
    AlloyAllocationComponent,
    ProductionEntryDetailsComponent,
    QuotationProcessComponent,
    JewelleryDismantlingComponent,
    JewelleryAssemblingComponent,
    JewelleryAssemblingDetailsComponent,
    MeltingProcessDetailsComponent,
    LossRecoveryComponent,
    ProductionStockDetailComponent,
    CompanyDetailComponent,
    DiamondJobBoqIssueComponent,
    DiamondJobBoqReceiptComponent,
    JobAllocationComponent,
    JobTransactionsComponent,

  ],
  imports: [
  CommonModule,
    TransactionRoutingModule,
    SharedModule
  ]
})
export class TransactionModule { }
