import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection
} from 'graphql-relay';

import {
  getCluster,
  getService,
  getServices,
  getTask,
  getTasks
} from './database';

/**
 * Define types
 */

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    return data[type][id];
  },
  (obj) => {
    return obj.ships ? factionType : shipType;
  }
);

const agentType = new GraphQLObjectType({
  name: 'Agent',
  description: 'An agent in the cluster',
  fields: () => ({
    id: globalIdField(),
    hostname: {
      type: GraphQLString,
      description: 'Hostname for the Agent',
      resolve: () => 'test'
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * Define connection types
 */
const { connectionType: agentConnection, edgeType: serviceEdge } = connectionDefinitions({
  name: 'Agent',
  nodeType: agentType
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    agent: {
      type: agentType,
      args: {
        id: globalIdField()
      },
      resolve: (_, {id}) => getService(id)
    },
    agents: {
      type: agentConnection,
      description: 'Agents in the cluster',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getServices(), args)
    },
    node: nodeField
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType
});
