import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPaseosPage } from './crear-paseos.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPaseosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPaseosPageRoutingModule {}
