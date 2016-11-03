import Pagination from '../../helpers/pagination/schema';

const Groups = `
  # A Group
  type Group {
    # The ID of an object
    id: String!

    # Nested Groups
    groups(after: String, first: Int, before: String, last: Int): GroupConnection

  }

  # A connection to a list of nested Groups.
  type GroupConnection {
    # Information to aid in pagination.
    pageInfo: PageInfo!

    # A list of edges.
    edges: [GroupEdge]
  }

  # An edge in a connection.
  type GroupEdge {
    # The item at the end of the edge
    node: Group

    # A cursor for use in pagination
    cursor: String!
  }
`;

export default () => [Groups];
