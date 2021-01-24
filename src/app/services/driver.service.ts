import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DriverService {
  constructor(public db: AngularFireDatabase) {}

  // get driver by id
  getDriver(id) {
    return this.db.object("drivers/" + id).valueChanges();
  }

  getDrivers() {
    return this.db.list("drivers").valueChanges();
  }

  getLikes(driverId, userId) {
   

    /*return this.db
      .object("drivers/" + driverId + "/likes/"+userId)
      .valueChanges();*/
  

      return new Promise((resolve) => {
      
        this.db
          .object("drivers/" + driverId + "/likes/" + userId)
          .valueChanges()
          .subscribe((authData) => {
            resolve(authData);
          });
      });
      /*return this.db
        .list("drivers/likes", (ref) => ref.orderByChild(userId).equalTo(true))
        .valueChanges();*/
  }

  setLike(id, userId, lista) {
    let list = {};

    list[userId] = true;
 
    let likes = {};

    likes = Object.assign(lista, list);

  
    return this.db.object("drivers/" + id ).update({
      likes
    });
  }

  unsetLike(id, userId, likes) {

    delete likes[userId];

    return this.db.object("drivers/" + id).update({
      likes,
    });
  }

  // get driver position
  getDriverPosition(locality, vehicleType, id) {
    return this.db
      .object("localities/" + locality + "/" + vehicleType + "/" + id)
      .valueChanges();
  }

  getActiveDriver(locality, vehicleType) {
    return this.db
      .list("localities/" + locality + "/" + vehicleType)
      .snapshotChanges();
  }

  // calculate vehicle angle
  calcAngle(oldLat, oldLng, lat, lng) {
    let brng = Math.atan2(lat - oldLat, lng - oldLng);
    brng = brng * (180 / Math.PI);

    return brng;
  }

  // return icon suffix by angle
  getIconWithAngle(vehicle) {
    const angle = this.calcAngle(
      vehicle.oldLat,
      vehicle.oldLng,
      vehicle.lat,
      vehicle.lng
    );

    if (angle >= -180 && angle <= -160) {
      return "_left";
    }

    if (angle > -160 && angle <= -110) {
      return "_bottom_left";
    }

    if (angle > -110 && angle <= -70) {
      return "_bottom";
    }

    if (angle > -70 && angle <= -20) {
      return "_bottom_right";
    }

    if (angle >= -20 && angle <= 20) {
      return "_right";
    }

    if (angle > 20 && angle <= 70) {
      return "_top_right";
    }

    if (angle > 70 && angle <= 110) {
      return "_top";
    }

    if (angle > 110 && angle <= 160) {
      return "_top_left";
    }

    if (angle > 160 && angle <= 180) {
      return "_left";
    }
  }
}
