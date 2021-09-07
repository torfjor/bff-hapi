import createService from '@entur/sdk';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import pThrottle from 'p-throttle';
import { ET_CLIENT_NAME } from '../../config/env';
import { ArgumentConfig } from '@entur/sdk/lib/config';

// The actual spike limit set in ApiGee is 120/s, do 100/s to be safe.
const RATE_LIMIT_N = 10;
const RATE_LIMIT_RES_MS = 100;

const agent = new Agent({
  keepAlive: true
});

const throttle = pThrottle({
  limit: RATE_LIMIT_N,
  interval: RATE_LIMIT_RES_MS
});

export type EnturServiceAPI = ReturnType<typeof createService>;

const service = (config: ArgumentConfig) => {
  console.log(config.hosts?.journeyPlanner);
  return createService({
    clientName: ET_CLIENT_NAME,
    hosts: config.hosts,
    fetch: throttle((url: RequestInfo, init?: RequestInit | undefined) => {
      return fetch(url, {
        agent,
        ...init
      });
    })
  });
};

export default service;
