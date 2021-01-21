import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPaseosPageRoutingModule } from './crear-paseos-routing.module';

import { CrearPaseosPage } from './crear-paseos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPaseosPageRoutingModule
  ],
  declarations: [CrearPaseosPage]
})
export class CrearPaseosPageModule {}
