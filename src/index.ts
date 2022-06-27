import { Boom } from '@hapi/boom';
import { createServer, initializePlugins } from './server';
import enturClient from './service/impl/entur';
import { enturClient_v3 } from './service/impl/entur';

import geocoderService from './service/impl/geocoder';
import stopsService from './service/impl/stops';
import journeyService from './service/impl/journey';
import departuresService from './service/impl/departures';
import tripsService from './service/impl/trips';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';
import healthRoutes from './api/health';
import enrollmentRoutes from './api/enrollment';
import tripsRoutes from './api/trips';
import departureRoutes from './api/departures';

import serviceJourneyRoutes, {
  serviceJourneyRoutes_v2
} from './api/servicejourney';
import serviceJourneyService, {
  serviceJourneyService_v2
} from './service/impl/service-journey';

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(-1);
});

(async () => {
  try {
    console.info('⏳ Starting server...');

    const port = process.env['PORT'] || '8080';
    const server = createServer({
      port: port
    });
    const enturService = enturClient();
    await initializePlugins(server);
    server.route({
      method: '*',
      path: '/{any*}',
      handler: (request, h) =>
        new Boom('The requested resource was not found.', { statusCode: 404 })
    });

    const js = journeyService(enturService);
    healthRoutes(server);
    stopsRoutes(server)(stopsService(enturService));
    geocoderRoutes(server)(geocoderService(enturService));
    journeyRoutes(server)(js);
    serviceJourneyRoutes(server)(serviceJourneyService(enturService));
    enrollmentRoutes(server)();

    // JP3
    tripsRoutes(server)(tripsService());
    departureRoutes(server)(departuresService());
    serviceJourneyRoutes_v2(server)(serviceJourneyService_v2());

    await server.initialize();
    await server.start();

    console.info('✅ Server started at http://localhost:' + port);
  } catch (error) {
    console.error(
      `failed to initialize server: ${error?.message}, terminating process.`
    );
    process.exit(-1);
  }
})();
