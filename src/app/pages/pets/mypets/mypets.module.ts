import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypetsPageRoutingModule } from './mypets-routing.module';

import { MypetsPage } from './mypets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MypetsPageRoutingModule
  ],
  declarations: [MypetsPage]
})
export class MypetsPageModule {}
