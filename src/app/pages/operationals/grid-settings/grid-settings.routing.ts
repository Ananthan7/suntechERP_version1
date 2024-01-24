import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridSettingsComponent } from './grid-settings.component';

const routes: Routes = [
  {
    path: '',
    component: GridSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GridSettingsRoutingModule { }
