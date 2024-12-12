import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client as GoogleMapsClient,
  DirectionsRequest,
} from '@googlemaps/google-maps-services-js/dist/client';
import { TravelMode } from '@googlemaps/google-maps-services-js';

@Injectable()
export class DirectionsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleMapsClient: GoogleMapsClient,
  ) {}

  async getDirections(originId: string, destinationId: string) {
    const requestParams: DirectionsRequest['params'] = {
      origin: `place_id:${originId}`,
      destination: `place_id:${destinationId}`,
      mode: TravelMode.driving,
      key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
    };

    const { data } = await this.googleMapsClient.directions({
      params: requestParams,
    });

    return {
      ...data,
      request: {
        origin: {
          place_id: requestParams.origin,
          location: {
            lat: data.routes[0].legs[0].start_location.lat,
            lng: data.routes[0].legs[0].start_location.lng,
          },
        },
        destination: {
          place_id: requestParams.destination,
          location: {
            lat: data.routes[0].legs[0].start_location.lat,
            lng: data.routes[0].legs[0].end_location.lng,
          },
        },
        mode: requestParams.mode,
      },
    };
  }
}
