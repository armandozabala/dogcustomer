import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from "@ionic/storage";
import { DEFAULT_AVATAR } from "./constants";
import * as firebase from "firebase/app";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: any;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public storage: Storage
  ) {}

  // get current user data from firebase
  getUserData() {
    return new Promise((resolve) => {
      this.afAuth.authState.pipe(take(1)).subscribe((authData) => {
        resolve(authData);
      });
    });
  }

  // get passenger by id
  getUser(id) {
    return this.db.object("passengers/" + id).valueChanges();
  }

  // login by email and password
  login(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // login with facebook
 /* async loginWithFacebook() {
    const fbData: FacebookLoginResponse = await this.facebook.login([
      "email",
      "public_profile",
    ]);
    const credential = firebase.auth.FacebookAuthProvider.credential(
      fbData.authResponse.accessToken
    );
    const result = await this.afAuth.auth.signInWithCredential(credential);
    return this.createUserIfNotExist(result);
  }*/

  // login with google
  /*async loginWithGoogle() {
    const res = await this.googlePlus.login({});
    const credential = firebase.auth.GoogleAuthProvider.credential(
      null,
      res.accessToken
    );
    const result = await this.afAuth.auth.signInWithCredential(credential);
    return this.createUserIfNotExist(result);
  }*/

  logout() {
    return this.afAuth.signOut();
  }

  // register new account
  async register(email, password, name, phoneNumber) {
    const authData = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    // update passenger object
    return this.updateUserProfile({
      uid: authData.user.uid,
      name,
      phoneNumber,
      email,
    });
  }

  // update user display name and photo
  async updateUserProfile(user) {
    const name = user.name || user.email;
    const photoUrl = user.photoURL || DEFAULT_AVATAR;
    const userData: any = await this.getUserData();

    userData.updateProfile({
      displayName: name,
      photoURL: photoUrl,
    });

    // create or update passenger
    return this.db.object("passengers/" + user.uid).update({
      name,
      photoURL: photoUrl,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
    });
  }

  // create new user if not exist
  createUserIfNotExist(user) {
    // check if user does not exist
    this.getUser(user.uid)
      .pipe(take(1))
      .subscribe((snapshot) => {
        if (snapshot === null) {
          // update passenger object
          this.updateUserProfile(user);
        }
      });
  }

  // update card setting
  async updateCardSetting(carNumber, exp, cvv, token) {
    const user: any = await this.getUserData();
    this.db.object("passengers/" + user.uid + "/card").update({
      number: carNumber,
      exp,
      cvv,
      token,
    });
  }

  // get card setting
  async getCardSetting() {
    const user: any = await this.getUserData();
    return this.db.object("passengers/" + user.uid + "/card").valueChanges();
  }
}
