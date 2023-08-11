import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchkeyMetricsComponent } from './branchkey-metrics/branchkey-metrics.component';
import { CurrentmonthLastyearComponent } from './currentmonth-lastyear/currentmonth-lastyear.component';
import { DaywiseBranchComparisonComponent } from './daywise-branch-comparison/daywise-branch-comparison.component';
import { OverallBranchAnalysisComponent } from './overall-branch-analysis/overall-branch-analysis.component';
import { SalesMonitoringComponent } from './sales-monitoring/sales-monitoring.component';
import { SelectedBranchComponent } from './selected-branch/selected-branch.component';
import { SelectedBranchcomparisonComponent } from './selected-branchcomparison/selected-branchcomparison.component';
import { YtdBranchComparisonComponent } from './ytd-branch-comparison/ytd-branch-comparison.component';

const routes: Routes = [
  {
    path: 'branchkeymetrics',
    component: BranchkeyMetricsComponent
  },
  {
    path: 'SelectedBranch/:branch',
    component: SelectedBranchComponent
  },
  {
    path: 'SalesMonitoring',
    component: SalesMonitoringComponent
  },
  {
    path: 'OverallBranchAnalysis',
    component: OverallBranchAnalysisComponent
  },
  // {
  //   path: 'CurrentmonthLastyear',
  //   component: CurrentmonthLastyearComponent
  // },
  {
    path: 'SelectedBranchcomparison',
    component: SelectedBranchcomparisonComponent
  },
  {
    path: 'YtdBranchComparison',
    component: YtdBranchComparisonComponent
  },
  {
    path: 'DaywiseBranchComparison',
    component: DaywiseBranchComparisonComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchPerformanceRoutingModule { }
