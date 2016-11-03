import AgentStore from './agents';
import GroupsStore from './groups';
import TaskStore from './tasks';

export default function createStore(endpoints) {
  return {
    Agents: new AgentStore({ endpoints }),
    Groups: new GroupsStore({ endpoints }),
    Tasks: new TaskStore({ endpoints })
  };
}
