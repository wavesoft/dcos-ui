import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/observable/of";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";

import { marbles } from "rxjs-marbles/jest";

import { makeExecutableSchema } from "graphql-tools";
import gql from "graphql-tag";

import { graphqlObservable } from "../graphqlObservable";

const typeDefs = `
  type Shuttle {
    name: String!
    uppercasedName: String!
  }

  type Query {
    launched(name: String): [Shuttle!]!
  }

  type Mutation {
    createShuttle(name: String): Shuttle!
    createShuttleList(name: String): [Shuttle!]!
  }
`;

const mockResolvers = {
  Query: {
    launched: (parent, args, ctx) => {
      const { name } = args;

      // act according with the type of filter
      if (name === undefined) {
        // When no filter is passed
        return ctx.query;
      } else if (typeof name === "string") {
        // When the filter is a value
        return ctx.query.map(els => els.filter(el => el.name === name));
      } else {
        // when the filter is an observable
        return ctx.query
          .combineLatest(name, (res, name) => [res, name])
          .map(els => els[0].filter(el => el.name === els[1]));
      }
    }
  },
  Shuttle: {
    uppercasedName(parent, args, ctx) {
      return parent.name.toUpperCase();
    }
  },
  Mutation: {
    createShuttle: (parent, args, ctx) => {
      return ctx.mutation.map(() => ({
        name: args.name
      }));
    },
    createShuttleList: (parent, args, ctx) => {
      return ctx.mutation.map(() => [
        { name: "discovery" },
        { name: "challenger" },
        { name: args.name }
      ]);
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: mockResolvers
});

// jest helper who binds the marbles for you
const itMarbles = (title, test) => {
  return it(
    title,
    marbles(m => {
      m.bind();
      test(m);
    })
  );
};

describe("graphqlObservable", function() {
  describe("Query", function() {
    itMarbles("solves listing all fields", function(m) {
      const query = gql`
        query {
          launched {
            name
          }
        }
      `;

      const expectedData = [{ name: "discovery" }];
      const dataSource = Observable.of(expectedData);
      const expected = m.cold("(a|)", {
        a: { data: { launched: expectedData } }
      });

      const result = graphqlObservable(query, schema, { query: dataSource });

      m.expect(result.take(1)).toBeObservable(expected);
    });

    itMarbles("filters by variable argument", function(m) {
      const query = gql`
        query {
          launched(name: $nameFilter) {
            name
            firstFlight
          }
        }
      `;

      const expectedData = [{ name: "apollo11" }, { name: "challenger" }];
      const dataSource = Observable.of(expectedData);
      const expected = m.cold("(a|)", {
        a: { data: { launched: [expectedData[0]] } }
      });

      const nameFilter = Observable.of("apollo11");
      const result = graphqlObservable(query, schema, {
        query: dataSource,
        nameFilter
      });

      m.expect(result.take(1)).toBeObservable(expected);
    });

    itMarbles("filters by static argument", function(m) {
      const query = gql`
        query {
          launched(name: "apollo13") {
            name
            firstFlight
          }
        }
      `;

      const expectedData = [{ name: "apollo13" }, { name: "challenger" }];
      const dataSource = Observable.of(expectedData);
      const expected = m.cold("(a|)", {
        a: { data: { launched: [expectedData[0]] } }
      });

      const result = graphqlObservable(query, schema, {
        query: dataSource
      });

      m.expect(result.take(1)).toBeObservable(expected);
    });

    itMarbles("filters out fields", function(m) {
      const query = gql`
        query {
          launched {
            name
          }
        }
      `;

      const expectedData = [{ name: "discovery", firstFlight: 1984 }];
      const dataSource = Observable.of(expectedData);
      const expected = m.cold("(a|)", {
        a: { data: { launched: [{ name: "discovery" }] } }
      });

      const result = graphqlObservable(query, schema, {
        query: dataSource
      });

      m.expect(result.take(1)).toBeObservable(expected);
    });

    itMarbles("resolve with name alias", function(m) {
      const query = gql`
        query {
          launched {
            title: name
          }
        }
      `;

      const expectedData = [{ name: "challenger", firstFlight: 1984 }];
      const dataSource = Observable.of(expectedData);
      const expected = m.cold("(a|)", {
        a: { data: { launched: [{ title: "challenger" }] } }
      });

      const result = graphqlObservable(query, schema, {
        query: dataSource
      });

      m.expect(result.take(1)).toBeObservable(expected);
    });

    itMarbles("supports field resolvers", function(m) {
      const query = gql`
        query {
          launched {
            name
            uppercasedName
          }
        }
      `;
      const expectedData = [{ name: "challenger", firstFlight: 1984 }];
      const dataSource = Observable.of(expectedData);
      const expected = m.cold("(a|)", {
        a: {
          data: {
            launched: [{ name: "challenger", uppercasedName: "CHALLENGER" }]
          }
        }
      });
      const result = graphqlObservable(query, schema, {
        query: dataSource
      });

      m.expect(result.take(1)).toBeObservable(expected);
    });
  });

  describe("Mutation", function() {
    itMarbles("createShuttle adds a shuttle and return its name", function(m) {
      const mutation = gql`
        mutation {
          createShuttle(name: "RocketShip") {
            name
          }
        }
      `;

      const fakeRequest = { name: "RocketShip" };
      const commandContext = Observable.of(fakeRequest);

      const result = graphqlObservable(mutation, schema, {
        mutation: commandContext
      });

      const expected = m.cold("(a|)", {
        a: { data: { createShuttle: { name: "RocketShip" } } }
      });

      m.expect(result).toBeObservable(expected);
    });

    itMarbles(
      "createShuttleList adds a shuttle and return all shuttles",
      function(m) {
        const mutation = gql`
          mutation {
            createShuttleList(name: "RocketShip") {
              name
            }
          }
        `;

        const commandContext = Observable.of("a request");

        const result = graphqlObservable(mutation, schema, {
          mutation: commandContext
        });

        const expected = m.cold("(a|)", {
          a: {
            data: {
              createShuttleList: [
                { name: "discovery" },
                { name: "challenger" },
                { name: "RocketShip" }
              ]
            }
          }
        });

        m.expect(result).toBeObservable(expected);
      }
    );

    itMarbles("accept alias name", function(m) {
      const mutation = gql`
        mutation {
          shut: createShuttle(name: $name) {
            name
          }
        }
      `;

      const commandContext = Observable.of("a resquest");

      const result = graphqlObservable(mutation, schema, {
        mutation: commandContext,
        name: "RocketShip"
      });

      const expected = m.cold("(a|)", {
        a: { data: { shut: { name: "RocketShip" } } }
      });

      m.expect(result).toBeObservable(expected);
    });
  });
});
