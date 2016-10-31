import CompositeState from '../../../../src/js/structs/CompositeState';
import EventTypes from '../../../../src/js/constants/EventTypes';
import MesosSummaryStore from '../../../../src/js/stores/MesosSummaryStore';
/**
 * This file is interchangeable and responsible for the actual
 * data fetching.
 *
 * While this graphql server runs in the browser,
 * this connector will resolve to pulling data from our existing
 * stores.
 */

const Store = {
  statesProcessed: MesosSummaryStore.get('statesProcessed'),
  nodes: []
};

function onMesosStateChange () {
  let states = MesosSummaryStore.get('states').lastSuccessful();

  Store.statesProcessed = MesosSummaryStore.get('statesProcessed');
  Store.nodes = CompositeState.getNodesList();
}

class AgentsConnector {
  constructor() {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      onMesosStateChange
    );

    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_REQUEST_ERROR,
      onMesosStateChange
    );
  }
  /**
   * Fetch data
   * @return {Promise} Resolves to [Agent] or rejects with error.
   */
  get() {
    // Fetch from our existing stores to make sure we don't duplicate
    // requests to backend.
    if (Store.statesProcessed) {
      return Store.nodes;
    }

    const promise = new Promise();

    const successListener = () => {
      MesosSummaryStore.removeChangeListener(
        EventTypes.MESOS_SUMMARY_CHANGE,
        successListener
      );
      // Resolve after onMesosStateChange has been called and we have
      // new store data.
      setTimeout(() => promise.resolve(Store.nodes));
    }

    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE,
      successListener
    );

    return promise;
  }
}

export default AgentsConnector;
