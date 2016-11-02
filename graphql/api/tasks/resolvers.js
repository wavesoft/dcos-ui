import { toGlobalId } from '../../utils/globalId';
import assignTaskHealth from '../../utils/TaskHealth';

export default {
  Task: {
    id(task) {
      return toGlobalId('task', task.mesos.id);
    },

    name(task) {
      return task.mesos.name;
    },

    health(task) {
      assignTaskHealth(task);

      return task.mesos.health || task.marathon.health;
    },

    agent(task, args, ctx) {
      const slaveId = task.mesos.slave_id;

      if (!slaveId) {
        return null;
      }

      return ctx.models.Agents.getById(slaveId);
    }
  }
};
