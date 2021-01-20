import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PetsService } from 'src/app/services/pets.service';
import { Storage } from "@ionic/storage";
import { DEFAULT_AVATAR } from 'src/app/services/constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  pets:any = {
    photoURL:  DEFAULT_AVATAR
  }
  user:any;


  constructor(private storage: AngularFireStorage,
              private petsService: PetsService,
              public router: Router,
              public toastCtrl: ToastController,
              public authService: AuthService,
              public loadingCtrl: LoadingController ) { 

                this.getData();

              }

  ngOnInit() {
  }


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

      let con = this.petsService.createPets(this.user, this.pets);
      this.petsService.updatePet(con.key);

      const toast = await this.toastCtrl.create({
        message: "Your profile has been updated",
        duration: 3000,
        position: "middle",
      });
      await toast.present();

      this.router.navigateByUrl("/mypets");
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
        const path = "/pets/" + Date.now() + `${selectedFile.name}`;
        const iRef = storageRef.child(path);
        iRef.put(selectedFile).then((snapshot) => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            loading.dismiss();
            this.pets.photoURL = downloadURL;
          });
        });
      }
    }

}
