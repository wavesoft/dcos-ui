import AgentsResolvers from './agents/resolvers';
import ClusterResolvers from './cluster/resolvers';
import GroupsResolvers from './groups/resolvers';
import TasksResolvers from './tasks/resolvers';

// Merge all resolvers
const resolvers = Object.assign(
  {},
  AgentsResolvers,
  ClusterResolvers,
  GroupsResolvers,
  TasksResolvers
);

export default resolvers;
