import endpointsConnector from '../data';
import Agents from './api/agents/models';
import Tasks from './api/tasks/models';

export default function models(authToken) {
  // Create a new instances of data loaders for the models
  const data = endpointsConnector(authToken);

  return {
    Agents: new Agents(,
    Tasks
  }
}
