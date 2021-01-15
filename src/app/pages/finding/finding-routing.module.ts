import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindingPage } from './finding.page';

const routes: Routes = [
  {
    path: '',
    component: FindingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindingPageRoutingModule {}
