import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class SettingService {
  constructor(public db: AngularFireDatabase, public storage: Storage) {}

  getPrices() {
    return this.db.object("master_settings/prices").valueChanges();
  }
}
