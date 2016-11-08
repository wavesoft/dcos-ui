import { addErrorLoggingToSchema } from 'graphql-tools';
import koa from 'koa';
import graphQLHTTP from 'koa-graphql';
import mount from 'koa-mount';

import models from './api/models';
import schema from './api';

// Just copy in cookie from browser for now
const authToken = 'dcos-acs-auth-cookie=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0NzkwNTU5MzUsInVpZCI6ImJvb3RzdHJhcHVzZXIifQ.hB0To6gTiuNrstGMfMQGG16h3SFwpXd92guIT6ACLqrlFUKNA-1_MxZfQmZ0A3jVrgZmUvtB_BroxyRWJl4wFt44-SA6xX05lYvx0cnaBJtzvv9Lh_XCL1NGfdOP2sb2rUoH7CFg3X7eTlFtiCFodbPEJWob8zRrvR9ooiHECgBQ8R8NcB-u6a6hQLzpE7mz3Iaa4aankoPwhBTaYysc8Sem6Pn9M4ZH46tFS5OdP8H9lgWG5LNSYfRetfiXsPpa4FiUFYEj6xmf0eWcJPZSlmkjCXrJH5ocD48TkXjuq4vnxImFhtBXRZPtC7xED9t0LHucxviJLfeZ7_4amQNAQQ';

const GRAPHQL_PORT = 4000;

// Expose a GraphQL endpoint
const graphQLServer = koa();

const logger = { log: (e) => console.error(e.stack) };

addErrorLoggingToSchema(schema, logger);

graphQLServer.use(function *(next) {
  if (this.query && this.query.length > 2000) {
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }
  this.models = models(authToken);

  yield next;
});

graphQLServer.use(mount('/', graphQLHTTP({
  schema,
  pretty: true,
  graphiql: true
})));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
