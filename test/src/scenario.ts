import {
  departuresScenario,
  departuresScenarioPerformance,
  serviceJourneyScenario,
  tripsScenario
} from './v2/v2Scenario';
import { getNextThursday } from './utils/utils';
import {
  departuresScenarioV1,
  geocoderScenarioV1,
  journeyScenarioV1,
  serviceJourneyScenarioV1
} from './v1/v1Scenario';

//Scenarios
export const scn = (usecase: string): void => {
  switch (usecase) {
    case 'test':
      return test();
    case 'bff':
      return bff();
    case 'bffPerformanceTest':
      return bffPerformanceTest();
  }
};

//Functional test
const bff = (): void => {
  const searchDate = getNextThursday();
  // V1
  departuresScenarioV1(searchDate);
  geocoderScenarioV1();
  journeyScenarioV1(searchDate);
  serviceJourneyScenarioV1(searchDate);

  // V2
  departuresScenario(searchDate);
  tripsScenario(searchDate);
  serviceJourneyScenario(searchDate);
};

//Test
const test = (): void => {
  const searchDate = getNextThursday();
  //departuresScenario(searchDate);
  serviceJourneyScenario(searchDate);
};

//Performance test
const bffPerformanceTest = (): void => {
  const searchDate = getNextThursday();
  if (__ITER === 0) {
    // Some initialization
  }
  departuresScenarioPerformance(searchDate);
};
