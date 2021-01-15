import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
// Import the Angularfire Module
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
} from "@angular/fire/analytics";
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFireDatabaseModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    ScreenTrackingService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
