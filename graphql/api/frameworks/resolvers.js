import { toGlobalId } from '../../utils/globalId';

export default {
  Task: {
    id(task) {
      return toGlobalId('task', task.id);
    }
  }
};
