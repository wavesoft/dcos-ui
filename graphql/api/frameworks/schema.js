import Pagination from '../../helpers/pagination/schema';

const Frameworks = `
  # A Framework
  type Framework {
    # The ID of an object
    id: String!

    # Framework name
    name: String!
  }

  # A connection to a list of Frameworks.
  type FrameworkConnection {
    # Information to aid in pagination.
    pageInfo: PageInfo!

    # A list of edges.
    edges: [FrameworkEdge]
  }

  # An edge in a connection.
  type FrameworkEdge {
    # The item at the end of the edge
    node: Framework

    # A cursor for use in pagination
    cursor: String!
  }
`;

export default () => [Frameworks, Pagination];
