import DataLoader from 'dataloader';

import config from '../../../config';
import { fetchWithAuth } from '../../../utils/fetch';

export default class FrameworksConnector {
  constructor({ authToken }) {
    this.authToken = authToken;

    this.loader = new DataLoader(fetchWithAuth(authToken), {
      // DCOS API's don't have batching, so we should send requests as
      // soon as we know about them
      batch: false
    });
  }

  get() {
    return this.loader.load(config.endpoints.state);
  }
}
