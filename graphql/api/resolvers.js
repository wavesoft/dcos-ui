import AgentsResolvers from './agents/resolvers';
import ClusterResolvers from './cluster/resolvers';
import TasksResolvers from './tasks/resolvers';

// Merge all resolvers
const resolvers = Object.assign(
  {},
  AgentsResolvers,
  ClusterResolvers,
  TasksResolvers
);

export default resolvers;
