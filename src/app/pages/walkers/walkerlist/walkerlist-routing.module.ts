import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalkerlistPage } from './walkerlist.page';

const routes: Routes = [
  {
    path: '',
    component: WalkerlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalkerlistPageRoutingModule {}
