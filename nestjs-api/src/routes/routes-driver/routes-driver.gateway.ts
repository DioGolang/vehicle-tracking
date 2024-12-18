import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RoutesService } from '../routes.service';

@WebSocketGateway({
  cors: {
    origin: '*', // não configurar em produção dessa forma.
  },
})
export class RoutesDriverGateway {
  constructor(private routeService: RoutesService) {}

  @SubscribeMessage('client:new-points')
  async handleMessage(client: any, payload: any) {
    //client.broadcast.emit('message', payload); // broadcast envia para todos cnectados ao 'message'
    // client.emit('message', payload); // envia para que enviou a message
    const { route_id } = payload;
    const route = await this.routeService.findOne(route_id);
    // @ts-expect-error - routes has not been defined
    const { steps } = route.directions.routes[0].legs[0];
    for (const step of steps) {
      const { lat, lng } = step.start_location;
      client.broadcast.emit(`server:new-points/${route_id}:list`, {
        route_id,
        lat,
        lng,
      });
      await sleep(2000);
      const { lat: lat2, lng: lng2 } = step.end_location;
      client.emit(`server:new-points/${route_id}:list`, {
        route_id,
        lat: lat2,
        lng: lng2,
      });
      await sleep(2000);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
