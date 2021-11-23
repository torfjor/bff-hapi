import {
  TripsDocument,
  TripsQuery,
  TripsQueryVariables
} from './graphql/jp3/trip.graphql-gen';
import { Result } from '@badrap/result';
import { APIError, TripQuery_v3 } from '../../types';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';

export async function getTrips(
  query: TripQuery_v3
): Promise<Result<TripsQuery, APIError>> {
  try {
    console.log("query: ", JSON.stringify(query));

    const result = await journeyPlannerClient_v3.query<
      TripsQuery,
      TripsQueryVariables
    >(
      {query: TripsDocument,
        variables: query
    });

    if (result.errors) {
      return Result.err(new APIError(result.errors));
    }
    return Result.ok(mapTripsData(result.data));
  } catch (error) {
    console.log("error: ", error);
    return Result.err(new APIError(error));
  }
}

function mapTripsData(input: TripsQuery): TripsQuery {
  console.log(input);
  input.trip?.tripPatterns.forEach(pattern => {
    (pattern as any).id = Math.floor(Math.random() * 1000000).toString(24);
  });

  return input;
}
