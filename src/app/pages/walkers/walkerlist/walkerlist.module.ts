import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkerlistPageRoutingModule } from './walkerlist-routing.module';

import { WalkerlistPage } from './walkerlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalkerlistPageRoutingModule
  ],
  declarations: [WalkerlistPage]
})
export class WalkerlistPageModule {}
