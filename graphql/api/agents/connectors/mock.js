import mockResponse from '../../../mock-data/state';

class AgentsConnector {
  get() {
    return Promise.resolve(mockResponse);
  }
}

export default AgentsConnector;
