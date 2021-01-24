import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkerPageRoutingModule } from './walker-routing.module';

import { WalkerPage } from './walker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalkerPageRoutingModule
  ],
  declarations: [WalkerPage]
})
export class WalkerPageModule {}
