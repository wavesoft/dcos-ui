import { Paginate } from '../../utils/connections';
import { toGlobalId } from '../../utils/globalId';

export default {
  GroupContent: {
    __resolveType(obj){
      switch(obj.__graphQLType__) {
        case 'group':
          return 'Group';

        case 'framework':
          return 'Framework';

        case 'application':
          return 'Application';
      }

      return null;
    }
  },

  Group: {
    id(group) {
      return toGlobalId('group', group.id);
    },

    parentId(group) {
      return group.parentId;
    },

    taskStatus(group) {
      return group.taskStatus;
    },

    contents(group, args, ctx) {
      const mergedContents = Promise.all([
        // Fetch all group content
        ctx.models.Groups.getContents(group.id),
        // Fetch Map of frameworks by name
        ctx.models.Frameworks.getMapByName()
      ]).then(([groupContents, frameworksByName]) => {

        groupContents.forEach((item) => {
          if (item.__graphQLType__ === 'application') {
            const frameworkName = item.labels &&
              item.labels.DCOS_PACKAGE_FRAMEWORK_NAME;

            if (frameworkName && frameworksByName.has(frameworkName)) {
              // Change to Framework
              Object.defineProperty(item, '__graphQLType__', {
                value: 'framework'
              });
              // Attach framework data from mesos
              item.mesosInfo = frameworksByName.get(frameworkName);
            }
          }
        });

        return groupContents;
      });

      return Paginate(mergedContents, args);
    }
  }
};
