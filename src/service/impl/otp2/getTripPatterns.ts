// console.log('query1 (Travel suggestions):');
// console.log(query);
// try {
//   batchedPublisher.publish(Buffer.from(JSON.stringify(query)), {
// 	environment: ENV
//   });
//   const trips = await service.getTripPatterns(query);
//   console.log('trips 12');
//   console.log(trips);
//   return Result.ok(addIdsToTrips(trips, query));
// } catch (error) {
//   console.log('APIERROR');
//   return Result.err(new APIError(error));
// }

import {
  LegMode,
  Leg,
  TransportMode,
  TransportSubmode,
  TripPattern,
  isBicycle,
  isCar,
  isFoot
} from '@entur/sdk';

import { v4 as uuid } from 'uuid';
import { EnturServiceAPI } from '../entur';
import JOURNEY_PLANNER_QUERY from './query';

interface Otp2TripPattern extends TripPattern {
  systemNotices: {
    tag: string;
    text: string;
  }[];
}
export interface Metadata {
  searchWindowUsed: number;
  nextDateTime: string;
  prevDateTime: string;
}

export async function getOtp2TripPatterns(
  service: EnturServiceAPI,
  query: any
): Promise<[Otp2TripPattern[], Metadata | undefined]> {
  const res = await service.queryJourneyPlanner<{
    trip: { metadata: Metadata; tripPatterns: any[] };
  }>(JOURNEY_PLANNER_QUERY, getTripPatternsVariables(query));

  const { metadata } = res.trip;
  return [res.trip?.tripPatterns || [], metadata];
}

const DEFAULT_MODES: Modes = {
  accessMode: 'foot',
  egressMode: 'foot',
  transportModes: [
    { transportMode: TransportMode.BUS },
    { transportMode: TransportMode.TRAM },
    { transportMode: TransportMode.RAIL },
    { transportMode: TransportMode.METRO },
    { transportMode: TransportMode.WATER },
    { transportMode: TransportMode.AIR }
  ]
};

type StreetMode =
  | 'foot'
  | 'bicycle'
  | 'bike_park'
  | 'bike_rental'
  | 'car'
  | 'car_park'
  | 'taxi'
  | 'car_rental';
interface Modes {
  accessMode: StreetMode;
  egressMode: StreetMode;
  directMode?: StreetMode;
  transportModes: Mode[];
}
export interface Mode {
  transportMode: TransportMode;
  transportSubModes?: TransportSubmode[];
}
function getTripPatternsVariables(params: any): any {
  const {
    from,
    to,
    searchDate = '2021-09-07T11:30:14.714Z',
    arriveBy = false,
    modes = DEFAULT_MODES,
    wheelchairAccessible = false,
    ...rest
  } = params || {};

  return {
    ...rest,
    from,
    to,
    searchDate: '2021-09-07T11:30:14.714Z',
    arriveBy,
    modes,
    wheelchairAccessible
  };
}

export function createParseTripPattern(): (
  rawTripPattern: any
) => Otp2TripPattern {
  let i = 0;
  const sharedId = uuid();
  const baseId = sharedId.substring(0, 23);
  const iterator = parseInt(sharedId.substring(24), 16);

  return (rawTripPattern: any) => {
    i++;
    const id = `${baseId}-${(iterator + i).toString(16).slice(-12)}`;
    return parseTripPattern({ id, ...rawTripPattern });
  };
}

function parseTripPattern(rawTripPattern: any): Otp2TripPattern {
  return {
    ...rawTripPattern,
    id: rawTripPattern.id || uuid(),
    legs: rawTripPattern.legs.map(parseLeg),
    genId: `${new Date().getTime()}:${Math.random().toString(36).slice(2, 12)}`
  };
}

export function parseLeg(leg: Leg): Leg {
  const { fromPlace, fromEstimatedCall } = leg;
  const fromQuayName = fromPlace?.quay?.name || fromEstimatedCall?.quay?.name;
  const parsedLeg =
    isFlexibleLeg(leg) || !fromQuayName
      ? leg
      : {
          ...leg,
          fromPlace: {
            ...fromPlace,
            name: isTransitLeg(leg) ? fromQuayName : fromPlace.name
          }
        };

  return coachLegToBusLeg(parsedLeg);
}
function coachLegToBusLeg(leg: Leg): Leg {
  return {
    ...leg,
    mode: leg.mode === LegMode.COACH ? LegMode.BUS : leg.mode
  };
}

export function isFlexibleLeg({ line }: Leg): boolean {
  return line?.flexibleLineType === 'flexibleAreasOnly';
}

export function isTransitLeg({ mode }: Leg): boolean {
  return !isFoot(mode) && !isBicycle(mode) && !isCar(mode);
}

export function isBikeRentalLeg(leg: Leg): boolean {
  return Boolean(
    leg.fromPlace?.bikeRentalStation && leg.toPlace?.bikeRentalStation
  );
}
