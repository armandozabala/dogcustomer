import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./services/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { take } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "home",
    },
    {
      title: "Create Pet",
      url: "/create",
      icon: "time",
    },
    {
      title: "Pets",
      url: "/mypets",
      icon: "card",
    },
    {
      title: "Notification",
      url: "/notification",
      icon: "notifications",
    },
    {
      title: "User",
      url: "/user",
      icon: "help-circle",
    },
  ];
  user = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // check for login stage, then redirect
      this.afAuth.authState.pipe(take(1)).subscribe((authData) => {
        if (authData) {
          this.router.navigateByUrl("/home");
          this.user = authData;
        } else {
          this.router.navigateByUrl("/login");
        }
      });
    });
  }

  ngOnInit() {}

  // logout
  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl("/login");
    });
  }
}
