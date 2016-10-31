import Pagination from '../../helpers/pagination/schema';

const Applications = `
  # An Application
  type Application {
    # The ID of an object
    id: String!

    # Application name
    name: String!
  }

  # A connection to a list of Applications.
  type ApplicationConnection {
    # Information to aid in pagination.
    pageInfo: PageInfo!

    # A list of edges.
    edges: [ApplicationEdge]
  }

  # An edge in a connection.
  type ApplicationEdge {
    # The item at the end of the edge
    node: Application

    # A cursor for use in pagination
    cursor: String!
  }
`;

export default () => [Applications, Pagination];
