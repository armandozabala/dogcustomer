import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Place } from "./place";
import { AngularFireDatabase } from "@angular/fire/database";

@Injectable({
  providedIn: "root",
})
export class TripService {
  private id: any;
  private trips: any;
  private currency: string;
  private origin: any;
  private destination: any;
  private distance: number;
  private fee: number;
  private note: string;
  private paymentMethod: any = "cash";
  private vehicle: any;
  private pets:any;
  // vehicle's icon
  private icon: any;
  private availableDrivers: Array<any> = [];

  constructor(
    public db: AngularFireDatabase,
    public authService: AuthService
  ) {}

  getAll() {
    return this.trips;
  }

  setId(id) {
    return (this.id = id);
  }

  getId() {
    return this.id;
  }

  setCurrency(currency) {
    return (this.currency = currency);
  }

  getCurrency() {
    return this.currency;
  }

  setOrigin(vicinity, lat, lng) {
    const place = new Place(vicinity, lat, lng);
    return (this.origin = place.getFormatted());
  }

  getOrigin() {
    return this.origin;
  }

  setDestination(vicinity, lat, lng) {
    const place = new Place(vicinity, lat, lng);

    return (this.destination = place.getFormatted());
  }

  getDestination() {
    return this.destination;
  }

  setDistance(distance) {
    return (this.distance = distance);
  }

  getDistance() {
    return this.distance;
  }

  setFee(fee) {
    return (this.fee = fee);
  }

  getFee() {
    return this.fee;
  }

  setPets(pets){
    return (this.pets = pets);
  }

  getPets() {
    return this.pets;
  }


  setNote(note) {
    return (this.note = note);
  }

  getNote() {
    return this.note;
  }

  setPaymentMethod(method) {
    return (this.paymentMethod = method);
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

  setVehicle(vehicle) {
    return (this.vehicle = vehicle);
  }

  getVehicle() {
    return this.vehicle;
  }

  setIcon(icon) {
    return (this.icon = icon);
  }

  getIcon() {
    return this.icon;
  }

  setAvailableDrivers(vehicles) {
    this.availableDrivers = vehicles;
  }

  getAvailableDrivers() {
    return this.availableDrivers;
  }

  getTrip(id) {
    return this.db.object("trips/" + id).valueChanges();
  }

  async getTrips() {
    const user: any = await this.authService.getUserData();

    return this.db
      .list("trips", (ref) => ref.orderByChild("passengerId").equalTo(user.uid))
      .snapshotChanges();
  }

  rateTrip(tripId, stars) {
    return this.db.object("trips/" + tripId).update({
      rating: stars,
    });
  }
}
