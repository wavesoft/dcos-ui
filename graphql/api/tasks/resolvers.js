import { toGlobalId } from '../../utils/globalId';
import assignTaskHealth from '../../utils/TaskHealth';

export default {
  Task: {
    id(task) {
      return toGlobalId('task', task.id);
    },

    name(task) {
      return task.name;
    },

    application(task) {
      return task.application || null;
    },

    framework(task) {
      return task.framework || null;
    },

    health(task) {
      assignTaskHealth(task);

      return task.health;
    },

    agent(task) {
      return task.agent;
    }
  }
};
