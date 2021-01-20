import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { DEFAULT_AVATAR } from './constants';
import { Storage } from "@ionic/storage";


@Injectable({
  providedIn: 'root'
})
export class PetsService {

  pets: any = {};

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public storage: Storage
  ) { }


  // update user display name and photo
  createPets(user, pets) {
      const name = pets.name;
      const raza = pets.raza;
      const age = pets.age;
      const photoUrl = pets.photoURL || DEFAULT_AVATAR;

  
      // create or update passenger
      return this.db.list("pets").push({
        name,
        userId: user.uid,
        photoURL: photoUrl,
        raza,
        age
      });
    }


      // update user display name and photo
  async updateUserProfile(pets) {
    const name = pets.name;
    const age = pets.age;
    const raza = pets.raza;
    const photoUrl = pets.photoURL || DEFAULT_AVATAR;

    // create or update passenger
    return this.db.object("pets/" + pets.petId).update({
      name,
      photoURL: photoUrl,
      age,
      raza
    });
  }



    updatePet(petId){
      return this.db.object("pets/"+petId).update({
        petId
      });

    }


    getPetsCustomer(userId) {

      return this.db
        .list("pets", (ref) => ref.orderByChild("userId").equalTo(userId))
        .valueChanges();
    }


    getPet(petId) {
      return this.db.object("pets/" + petId).valueChanges();
    }
}
