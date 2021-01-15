import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  private locality: any;

  constructor(public storage: Storage) {}

  // This function takes in latitude and longitude of two location and returns the distance between them as the crow
  // flies (in km)
  calcCrow(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Converts numeric degrees to radians
  toRad(value) {
    return (value * Math.PI) / 180;
  }

  /**
   * Convert geocoder address to place object
   * @param address: Geocoder address result
   */
  formatAddress(address) {
    // console.log(address);
    const components = address.address_components;
    const vicinity = components[0].short_name + ", " + components[1].short_name;

    return {
      location: {
        lat: address.geometry.location.lat(),
        lng: address.geometry.location.lng(),
      },
      vicinity,
    };
  }

  // set locality from geocoder result
  // @param results: Geocoder array results
  setLocalityFromGeocoder(results) {
    for (const address of results) {
      for (const component of address.address_components) {
        if (component.types[0] === "administrative_area_level_1") {
          // if (component.types[0] == 'locality') {
          // escape firebase characters
          const locality = component.short_name.replace(
            /[\%\.\#\$\/\[\]]/,
            "_"
          );
          this.setLocality(locality);

          return locality;
        }
      }
    }

    return false;
  }

  setLocality(locality) {
    return (this.locality = locality);
  }

  getLocality() {
    return this.locality;
  }
}
