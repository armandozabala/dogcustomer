import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRatingPage } from './modal-rating.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRatingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRatingPageRoutingModule {}
