import * as Types from '../../../graphql/types';

import gql from 'graphql-tag';

export type GetDepartureRealtimeQueryVariables = Types.Exact<{
  quayIds: Array<Types.Maybe<Types.Scalars['String']>>;
  startTime: Types.Scalars['DateTime'];
  timeRange: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type GetDepartureRealtimeQuery = { quays: Array<Types.Maybe<{ id: string, estimatedCalls: Array<Types.Maybe<EstimatedCallFragment>> }>> };

export type EstimatedCallFragment = { realtime?: Types.Maybe<boolean>, expectedArrivalTime?: Types.Maybe<any>, expectedDepartureTime?: Types.Maybe<any>, actualArrivalTime?: Types.Maybe<any>, actualDepartureTime?: Types.Maybe<any>, aimedArrivalTime?: Types.Maybe<any>, aimedDepartureTime?: Types.Maybe<any>, serviceJourney?: Types.Maybe<{ id: string }> };

export const EstimatedCallFragmentDoc = gql`
    fragment estimatedCall on EstimatedCall {
  realtime
  serviceJourney {
    id
  }
  expectedArrivalTime
  expectedDepartureTime
  actualArrivalTime
  actualDepartureTime
  aimedArrivalTime
  aimedDepartureTime
}
    `;
export const GetDepartureRealtimeDocument = gql`
    query GetDepartureRealtime($quayIds: [String]!, $startTime: DateTime!, $timeRange: Int!, $limit: Int!) {
  quays(ids: $quayIds) {
    id
    estimatedCalls(startTime: $startTime, numberOfDepartures: $limit, timeRange: $timeRange, omitNonBoarding: false, includeCancelledTrips: false) {
      ...estimatedCall
    }
  }
}
    ${EstimatedCallFragmentDoc}`;