import { Paginate } from '../../utils/connections';
import { toGlobalId } from '../../utils/globalId';

export default {
  Group: {
    id(group) {
      return toGlobalId('group', group.id);
    },

    groups(group, args) {
      return Paginate(group.groups, args);
    }
  }
};
