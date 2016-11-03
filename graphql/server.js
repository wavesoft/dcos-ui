import { addErrorLoggingToSchema } from 'graphql-tools';
import koa from 'koa';
import graphQLHTTP from 'koa-graphql';
import mount from 'koa-mount';

import models from './api/models';
import schema from './api';

// Just copy in cookie from browser for now
const authToken = 'dcos-acs-auth-cookie=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0Nzg1NDc2NzUsInVpZCI6ImJvb3RzdHJhcHVzZXIifQ.PORzJaBGZiJFekvF7wmcTRKx_YxVU5n2BIqdrqglT5OhOzm8sbZ7LOWzFMXt2id2CaggodWcunBxH1M3QlmfzCGoC6KY23gtL7_QAlLeY3POjSDDbt_GvdPtNAYIMBwlXiKLyIhfKfH3OAIWGR87U8jsJIXM6l7zR6MK0SEPlHu22MUSkhuPHQHhio3IEAvItYSDHAoo2oJnhC1MCb2-O5ssVcLeEkDsAVf2vV4Fw0kgfr13wllSPkRCuQJSH6ya-bCGXm8u--dnl1WFKGzoKMdrGh1MTy-ghJIFU0hyUTtkFoxCYs2pH7ufqmfrhZWyXNu9RANszDS5FjhoEifb9g';

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
