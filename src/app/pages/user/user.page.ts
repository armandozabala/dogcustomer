import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";

import { take } from "rxjs/operators";
import * as firebase from "firebase";
import { AuthService } from "src/app/services/auth.service";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"],
})
export class UserPage implements OnInit {
  user = {
    photoURL: "",
    name: "",
    phoneNumber: "",
    email: ""
  };

  constructor(
    public router: Router,
    public authService: AuthService,
    public toastCtrl: ToastController,
    private storage: AngularFireStorage,
    public loadingCtrl: LoadingController
  ) {
    this.getData();
  }

  ngOnInit() {}

  async getData() {
    const loggedInUser: any = await this.authService.getUserData();
    this.authService
      .getUser(loggedInUser.uid)
      .pipe(take(1))
      .subscribe((snapshot: any) => {
        snapshot.uid = loggedInUser.uid;
        this.user = snapshot;
      });
  }

  // save user info
  async save() {
    this.authService.updateUserProfile(this.user);
    this.router.navigateByUrl("/home");
    const toast = await this.toastCtrl.create({
      message: "Your profile has been updated",
      duration: 3000,
      position: "middle",
    });
    await toast.present();
  }

  // choose file for upload
  chooseFile() {
    document.getElementById("avatar").click();
  }

  // upload thumb for item
  async upload() {
    // Create a root reference
    const storageRef = this.storage.ref("users");
    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await loading.present();

    for (const selectedFile of [
      (document.getElementById("avatar") as HTMLInputElement).files[0],
    ]) {
      const path = "/users/" + Date.now() + `${selectedFile.name}`;
      const iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          loading.dismiss();
          this.user.photoURL = downloadURL;
        });
      });
    }
  }
}
