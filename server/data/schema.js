/* eslint-disable no-unused-vars, no-use-before-define */
import chalk from 'chalk';

import {
  graphql,
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
  cursorForObjectInConnection,
  offsetToCursor,
} from 'graphql-relay';

import { resolver, relay, attributeFields } from 'graphql-sequelize';

import sequelize, { scaffold } from './sequelize';

const {
  SCAFFOLD,
  NODE_ENV,
} = process.env;

const {
  sequelizeNodeInterface,
  sequelizeConnection,
} = relay;

const {
  Issue,
  Feature,
  TodoItem,
  User,
} = sequelize.models;


/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */

const {
  nodeInterface,
  nodeField,
  nodeTypeMapper
} = sequelizeNodeInterface(sequelize);

/**
 * Define your own types here
 */

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    ...attributeFields(User, {
      globalId: true,
    }),
    issues: {
      type: issueConnection.connectionType,
      args: issueConnection.connectionArgs,
      resolve: issueConnection.resolve,
    },
  }),
  interfaces: [nodeInterface]
});

const todoItemType = new GraphQLObjectType({
  name: TodoItem.name,
  fields: () => ({
    ...attributeFields(TodoItem, {
      globalId: true,
    }),
  }),
  interfaces: [nodeInterface]
});

const issueType = new GraphQLObjectType({
  name: Issue.name,
  fields: () => ({
    ...attributeFields(Issue, {
      globalId: true,
    }),
    todoItems: {
      type: new GraphQLList(todoItemType),
      resolve: resolver(Issue.TodoItem),
    },
  }),
  interfaces: [nodeInterface]
});

/**
 * Define your own connection types here
 */

const issueConnection = sequelizeConnection({
  name: Issue.options.name.plural,
  nodeType: issueType,
  target: Issue,
  interfaces: [nodeInterface],
});

const addTodoItem = mutationWithClientMutationId({
  name: 'AddTodoItem',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    issueId: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    todoItem: {
      type: todoItemType,
      resolve: obj => obj,
    },
  },
  async mutateAndGetPayload(input) {
    const {
      issueId,
      ...data,
    } = input;

    const { type, id } = fromGlobalId(issueId);

    const issue = await Issue.findById(id);

    return issue.createTodoItem(data);
  },
});

/**
 * Map nodeTypes
 *
 */
nodeTypeMapper.mapTypes({
  [Issue.name]: issueType,
  User: {
    type: userType,
    resolve(globalId) {
      const { type, id } = fromGlobalId(globalId);
      return User.findById(1);
    },
  },
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => User.findById(1)
    }
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTodoItem,
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});


if (SCAFFOLD) {
  if (NODE_ENV !== 'development') {
    throw new Error('Trying to scaffold in non-development environment.');
  }
  console.log('Scaffolding content'); // eslint-disable-line no-console

  scaffold()
    .then(() => console.log(chalk.green('Scaffolding done'))) // eslint-disable-line no-console
    .then(() => {
      const query = `{
        viewer {
          issues(first:1) {
            edges {
              node {
                id
                name
                todoItems {
                  name
                  completed
                }
              }
            }
          }
        }
      }`;
      console.log(`Executing query ${query}`); // eslint-disable-line no-console
      return graphql(schema, query);
    })
    .then(results => console.log('Results:', JSON.stringify(results, null, 2))) // eslint-disable-line no-console
    .catch(console.error) // eslint-disable-line no-console
    ;
}


export default schema;
