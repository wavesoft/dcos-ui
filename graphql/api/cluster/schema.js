import Agents from '../agents/schema';

const Cluster = `
  type Cluster {
    agent(
      # The ID of an object
      id: String!
    ): Agent

    # Agents in the cluster
    agents(after: String, first: Int, before: String, last: Int): AgentConnection
  }
`;

export default () => [Cluster, Agents]
