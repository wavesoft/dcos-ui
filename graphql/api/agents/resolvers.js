import { toGlobalId } from '../../utils/globalId';
import { Paginate } from '../../utils/connections';

export default {
  Agent: {
    id(agent) {
      return toGlobalId('agent', agent.id);
    },

    hostname(agent) {
      return agent.hostname;
    },

    tasks(agent, args, ctx) {
      const tasks = ctx.models.Tasks.getByAgentId(agent.id);

      return Paginate(tasks, args);
    }
  }
};
