import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchPerformanceRoutingModule } from './branch-performance.routing';
import { BranchkeyMetricsComponent } from './branchkey-metrics/branchkey-metrics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectedBranchComponent } from './selected-branch/selected-branch.component';
import { SalesMonitoringComponent } from './sales-monitoring/sales-monitoring.component';
import { CurrentmonthLastyearComponent } from './currentmonth-lastyear/currentmonth-lastyear.component';
import { SelectedBranchcomparisonComponent } from './selected-branchcomparison/selected-branchcomparison.component';
import { YtdBranchComparisonComponent } from './ytd-branch-comparison/ytd-branch-comparison.component';
import { DaywiseBranchComparisonComponent } from './daywise-branch-comparison/daywise-branch-comparison.component';
import { TableGridComponent } from './table-grid/table-grid.component';
import { OverallBranchAnalysisComponent } from './overall-branch-analysis/overall-branch-analysis.component';


@NgModule({
  declarations: [
    BranchkeyMetricsComponent,
    SelectedBranchComponent,
    SalesMonitoringComponent,
    CurrentmonthLastyearComponent,
    SelectedBranchcomparisonComponent,
    YtdBranchComparisonComponent,
    DaywiseBranchComparisonComponent,
    TableGridComponent,
    OverallBranchAnalysisComponent
  ],
  imports: [
    CommonModule,
    BranchPerformanceRoutingModule,
    SharedModule
  ]
})
export class BranchPerformanceModule { }
