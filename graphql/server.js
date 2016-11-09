import { addErrorLoggingToSchema } from 'graphql-tools';
import koa from 'koa';
import graphQLHTTP from 'koa-graphql';
import mount from 'koa-mount';

import models from './api/models';
import schema from './api';

const GRAPHQL_PORT = 4000;
const graphQLServer = koa();

if (process.env.GRAPHQL_ENV === 'development') {
  addErrorLoggingToSchema(schema, {
    log: (e) => console.error(e.stack)
  });
}

graphQLServer.use(function *(next) {
  if (this.query && this.query.length > 2000) {
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }
  // Get auth token from request
  let authToken = this.cookies.get('dcos-acs-auth-cookie');
  // Use token set by `npm config set dcosauthtoken [TOKEN]`
  if (process.env.GRAPHQL_ENV === 'development'
    && process.env.npm_config_dcosauthtoken) {

    authToken = process.env.npm_config_dcosauthtoken;
  }

  this.models = models(`dcos-acs-auth-cookie=${authToken}`);

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
