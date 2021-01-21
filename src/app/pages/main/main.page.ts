import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  user:any;

  constructor(private router: Router,
             public authService: AuthService,) {

              this.getData();

        }

  ngOnInit() {

   
  }


  async getData() {
    
    this.user = await this.authService.getUserData();
  
    console.log(this.user.uid);
  }

  programarPaseo(){

    console.log(this.user.uid);

    
    let navigationExtras: NavigationExtras = {
      queryParams: {
          userId: this.user.uid
      }
  };
    this.router.navigate(['crear-paseos'], navigationExtras);
    

    console.log("Progamar Paseo");


  }

  historialPaseos(){

    console.log("Historial Paseo");

  }

}
