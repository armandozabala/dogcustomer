import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindingPageRoutingModule } from './finding-routing.module';

import { FindingPage } from './finding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindingPageRoutingModule
  ],
  declarations: [FindingPage]
})
export class FindingPageModule {}
