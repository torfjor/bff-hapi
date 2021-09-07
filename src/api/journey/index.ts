import Hapi from '@hapi/hapi';
import { IJourneyService } from '../../service/interface';
import {
  TripQuery,
  TripPatternsQuery,
  SingleTripPatternQuery
} from '../../service/types';
import {
  postJourneyRequest,
  getJourneyRequest,
  getSingleTripPattern
} from './schema';
import { parseTripPatternId } from '../../utils/journey-utils';
import * as Boom from '@hapi/boom';
import { getOtp2TripPatterns } from '../../service/impl/otp2/getTripPatterns';
import createEnturService from '@entur/sdk/lib/service';
import { ET_CLIENT_NAME } from '../../config/env';

export default (server: Hapi.Server) => (service: IJourneyService) => {
  server.route({
    method: 'GET',
    path: '/bff/v1/journey/trip',
    options: {
      description: 'Find trip patterns with a simple query',
      tags: ['api', 'journey'],
      validate: getJourneyRequest
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as TripQuery;
      return (await service.getTrips(query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v1/journey/trip',
    options: {
      description: 'Find trip patterns',
      tags: ['api', 'journey']
      // validate: postJourneyRequest
    },
    handler: async (request, h) => {
      console.log('request, h');
      console.log(request.payload);
      const query = (request.payload as unknown) as TripPatternsQuery;
      return await getOtp2TripPatterns(
        createEnturService({
          clientName: ET_CLIENT_NAME,
          hosts: {
            journeyPlanner: 'https://api.entur.io/journey-planner/v3'
          }
        }),
        query
      );
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/journey/single-trip',
    options: {
      description: 'Get one specific trip pattern from generated ID',
      tags: ['api', 'journey'],
      validate: getSingleTripPattern
    },
    handler: async (request, h) => {
      const idParam = (request.query as unknown) as SingleTripPatternQuery;
      const idObject = parseTripPatternId(
        idParam.id,
        postJourneyRequest.payload
      );
      return (await service.getTripPattern(idObject)).unwrap(
        value =>
          !value
            ? Boom.resourceGone('Trip not found or is no longer available.')
            : value,
        error => Boom.internal(error.message)
      );
    }
  });
};
