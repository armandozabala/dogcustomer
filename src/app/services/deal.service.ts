import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { DEAL_STATUS_PENDING } from "./constants";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DealService {
  constructor(
    public db: AngularFireDatabase,
    public authService: AuthService
  ) {}

  // sort driver by rating & distance
  sortDriversList(drivers: Array<any>) {
    return drivers.sort((a, b) => {
      return a.rating - a.distance / 5 - (b.rating - b.distance / 5);
    });
  }

  // make deal to driver
  async makeDeal(
    driverId,
    origin,
    petsId,
    //distance,
    //fee,
    //currency,
    //note,
    paymentMethod
  ) {
    console.log("Making deal to", driverId);
    const user: any = await this.authService.getUserData();
    return this.db.object("deals/" + driverId).set({
      passengerId: user.uid,
      petsId: petsId,
      origin,
      //destination,
      //distance,
      //fee,
      //note,
      paymentMethod,
      status: DEAL_STATUS_PENDING,
      createdAt: Date.now(),
    });
  }

  // get deal by driverId
  getDriverDeal(driverId) {
    return this.db.object("deals/" + driverId).valueChanges();
  }

  // remove deal
  removeDeal(driverId) {
    return this.db.object("deals/" + driverId).remove();
  }
}
