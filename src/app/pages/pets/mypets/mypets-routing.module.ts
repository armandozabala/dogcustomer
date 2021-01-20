import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MypetsPage } from './mypets.page';

const routes: Routes = [
  {
    path: '',
    component: MypetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypetsPageRoutingModule {}
