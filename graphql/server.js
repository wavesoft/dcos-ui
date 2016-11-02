import { addErrorLoggingToSchema } from 'graphql-tools';
import koa from 'koa';
import graphQLHTTP from 'koa-graphql';
import mount from 'koa-mount';

import models from './api/models';
import schema from './api';

// Just copy in cookie from browser for now
const authToken = 'dcos-acs-auth-cookie=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDc4NDYzMDczfQ.LVZdfvCANS3DsKu23iLSdbWHqQggmGdwwBenctcZD8-rEz6Liy075cl2vY5D-1SwFf75M5ZPqPxjG7tUEeaQU5hLo4IOF5KSa4F8NVROVt4s1GdWCF5WrJ55jb3TRgpiuoMWoYraPlnKHE-7XRV55u5_69WkIJeAM6O7_j5U6caaIXpq311I2OhsLg7OyC95oC_fm179jceMxQIvBkVJEWwD5qYQYfRGbY63yF5gjh5Ui8mcPkMwva0jimrhAAaADydJ38MzO31u8LHu8_v3PuK9tDx2I0FhWQf0Saja_ayU5Ka8OLaPe4bbmbikBgvrRDC-Jxbw5uXOvEDEeA2zqA';

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
