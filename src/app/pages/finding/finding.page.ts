import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { take } from "rxjs/operators";
import { DEAL_STATUS_PENDING, DEAL_STATUS_ACCEPTED, DEAL_TIMEOUT } from "src/app/services/constants";
import { DealService } from "src/app/services/deal.service";
import { TripService } from "src/app/services/trip.service";

@Component({
  selector: "app-finding",
  templateUrl: "./finding.page.html",
  styleUrls: ["./finding.page.scss"],
})
export class FindingPage implements OnInit {
  drivers: any;
  driver: any = [];

  constructor(
    public router: Router,
    public tripService: TripService,
    public dealService: DealService
  ) {
    // get list available drivers
    this.drivers = this.tripService.getAvailableDrivers();
    // sort by driver distance and rating
    this.drivers = this.dealService.sortDriversList(this.drivers);

    console.log(this.drivers);

    if (this.drivers) {
      // make deal to first user
      this.makeDeal(0);
    }
  }

  ngOnInit() {}

  // make deal to driver
  makeDeal(index) {
    
    if (this.drivers.length > 0) {
      this.driver = [];
      console.log("DRIVERS");
      console.log(this.drivers);
      console.log(index);

      this.driver.push(this.drivers[index]);

      console.log(this.driver[0]);

      let dealAccepted = false;

      if (this.driver[0] != undefined) {
        this.driver[0].status = "Bidding";
        this.dealService
          .getDriverDeal(this.driver[0].id)
          .pipe(take(1))
          .subscribe(async (snapshot) => {
            // if user is available
            if (!snapshot) {
              // create a record
              // console.log(snapshot);
              debugger
              await this.dealService.makeDeal(
                this.driver[0].id,
                this.tripService.getOrigin(),
                this.tripService.getPets(),
                //this.tripService.getDistance(),
                //this.tripService.getFee(),
                //this.tripService.getCurrency(),
                //this.tripService.getNote(),
                this.tripService.getPaymentMethod()
              );
              console.log("Deal made");
              const sub = this.dealService
                .getDriverDeal(this.driver[0].id)
                .subscribe((snap: any) => {
                  // if record doesn't exist or is accepted
                  if (snap === null || snap.status !== DEAL_STATUS_PENDING) {
                    sub.unsubscribe();

                    // if deal has been cancelled
                    if (snap === null) {
                      this.nextDriver(index);
                    } else if (snap.status === DEAL_STATUS_ACCEPTED) {
                      // if deal is accepted
                      // console.log('accepted', snap.tripId);
                      dealAccepted = true;
                      this.drivers = [];
                      this.tripService.setId(snap.tripId);
                      // go to user page
                      this.router.navigateByUrl("/driver");
                    }
                  }

                  // if timeout
                  setTimeout(() => {
                    if (!dealAccepted) {
                      sub.unsubscribe();
                      // remove record

                      //this.dealService.removeDeal(this.driver[0].id);
                      // make deal to other user

                      this.nextDriver(index);
                    }
                  }, DEAL_TIMEOUT);
                });
            } else {
              this.nextDriver(index);
            }
          });
      } else {
        // show error & try again button
        console.log("No user found");
      }
    }
  }

  // make deal to next driver
  nextDriver(index) {
    this.driver = [];
    this.drivers.splice(index, 1);
    console.log("NEXT");
    console.log(this.drivers);
    this.makeDeal(index);
  }
}
