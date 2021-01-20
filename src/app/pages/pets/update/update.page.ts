import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PetsService } from 'src/app/services/pets.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  data:any;
  petId:any;
  pets:any;
  loading:any;

  constructor( public route: ActivatedRoute,
               private router: Router,
               private storage: AngularFireStorage,
               private petsService: PetsService,
               public toastCtrl: ToastController,
               public authService: AuthService,
               public loadingCtrl: LoadingController) { }

  async ngOnInit() {

    await this.showLoading();

    this.route.queryParams.subscribe(params => {

      this.petId = params['id'];

      this.petsService.getPet(this.petId).subscribe((res:any) => {


            this.pets = res;

            this.hideLoading();

      });

  });
  }


      // save user info
      async update() {

        console.log(this.pets);

         this.petsService.updateUserProfile(this.pets);
     
        const toast = await this.toastCtrl.create({
          message: "Your Pets has been updated",
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


  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await this.loading.present();
  }

  
  hideLoading() {
    this.loading.dismiss();
  }


}
