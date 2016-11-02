import AgentStore from './agents';
import TaskStore from './tasks';

export default function createStore(endpoints) {
  return {
    Agents: new AgentStore({ endpoints }),
    Tasks: new TaskStore({ endpoints })
  };
}
