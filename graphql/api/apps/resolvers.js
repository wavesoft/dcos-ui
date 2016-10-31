import { toGlobalId } from '../../utils/globalId';

export default {
  Application: {
    id(task) {
      return toGlobalId('task', task.id);
    }
  }
};
