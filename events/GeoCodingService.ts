import { createClient, GoogleMapsClient } from '@google/maps';

export class GeoCodingService {
  private geoCoder: GoogleMapsClient;

  public constructor() {
    this.geoCoder = createClient({
      key: 'AIzaSyAfPjiiFC9t-ixMAHY9tqf2YJw19TZ0w0k',
    });
  }

  public geocodeAddress(): Promise<google.maps.GeocoderResult[]> {
    const request: google.maps.GeocoderRequest = {
      address: '1600 Amphitheatre Parkway, Mountain View, CA',
    };

    return new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      this.geoCoder.geocode(request, (error, response) => {
        if (error) {
          reject(error);
        }

        resolve(response.json.results);
      });
    });
  }
}
