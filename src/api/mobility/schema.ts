import Joi from 'joi';
import {FormFactor} from '../../graphql/mobility/mobility-types_v2';
import {
  BikeStationQuery,
  CarStationQuery,
  GeofencingZonesQuery,
  StationsQuery,
  StationsQuery_v2,
  VehicleQuery,
  VehiclesQuery,
  VehiclesQuery_v2,
  ViolationsReportingInitQuery,
  ViolationsReportQuery,
  ViolationsVehicleLookupQuery,
} from '../../service/types';

export const getVehiclesRequest = {
  query: Joi.object<VehiclesQuery>({
    formFactors: Joi.array()
      .items(Joi.string())
      .optional()
      .default(FormFactor.Scooter)
      .single(),
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    range: Joi.number().optional(),
    operators: Joi.array().items(Joi.string()).optional().single(),
  }),
};

export const getVehiclesRequest_v2 = {
  query: Joi.object<VehiclesQuery_v2>({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    range: Joi.number().required(),
    includeBicycles: Joi.boolean().required(),
    bicycleOperators: Joi.array().items(Joi.string()).optional().single(),
    includeScooters: Joi.boolean().required(),
    scooterOperators: Joi.array().items(Joi.string()).optional().single(),
  }),
};

export const getVehicleRequest = {
  query: Joi.object<VehicleQuery>({
    ids: Joi.array().items(Joi.string()).required().single(),
  }),
};

export const getStationsRequest = {
  query: Joi.object<StationsQuery>({
    availableFormFactors: Joi.array()
      .items(Joi.string())
      .optional()
      .default(FormFactor.Bicycle)
      .single(),
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    range: Joi.number().optional().default(500),
    operators: Joi.array().items(Joi.string()).optional().single(),
  }),
};

export const getStationsRequest_v2 = {
  query: Joi.object<StationsQuery_v2>({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    range: Joi.number().required(),
    includeBicycles: Joi.boolean().required(),
    bicycleOperators: Joi.array().items(Joi.string()).optional().single(),
    includeCars: Joi.boolean().required(),
    carOperators: Joi.array().items(Joi.string()).optional().single(),
  }),
};

export const getCarStationRequest = {
  query: Joi.object<CarStationQuery>({
    ids: Joi.array().items(Joi.string()).required().single(),
  }),
};
export const getBikeStationRequest = {
  query: Joi.object<BikeStationQuery>({
    ids: Joi.array().items(Joi.string()).required().single(),
  }),
};

export const getGeofencingZonesRequest = {
  query: Joi.object<GeofencingZonesQuery>({
    systemIds: Joi.array().items(Joi.string()).required().single(),
  }),
};

export const violationsReportingInitRequest = {
  query: Joi.object<ViolationsReportingInitQuery>({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }),
};

export const violationsVehicleLookupRequest = {
  query: Joi.object<ViolationsVehicleLookupQuery>({
    qr: Joi.string(),
  }),
};
export const violationsReportRequest = {
  payload: Joi.object<ViolationsReportQuery>({
    providerId: Joi.number(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    image: Joi.string(),
    imageType: Joi.string(),
    qr: Joi.string(),
    appId: Joi.string(),
    violations: Joi.array().items(Joi.string()).required(),
    timestamp: Joi.date().iso(),
  }),
};
