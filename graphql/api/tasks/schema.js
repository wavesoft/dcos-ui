import Agents from '../agents/schema';
import Status from '../../helpers/status/schema';
import Pagination from '../../helpers/pagination/schema';

const Tasks = `
  # A Task
  type Task {
    # The ID of an object
    id: String!

    # Task name
    name: String!

    # Status of Task
    health: HEALTH!

    # Agent task belongs to
    agent: Agent!
  }

  # A connection to a list of Tasks.
  type TaskConnection {
    # Information to aid in pagination.
    pageInfo: PageInfo!

    # A list of edges.
    edges: [TaskEdge]
  }

  # An edge in a connection.
  type TaskEdge {
    # The item at the end of the edge
    node: Task

    # A cursor for use in pagination
    cursor: String!
  }
`;

export default () => [
  Tasks, Agents, Status, Pagination
];
