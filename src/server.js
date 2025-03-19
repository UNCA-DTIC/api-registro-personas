const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const morgan = require("morgan");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

// Usar morgan para los logs HTTP
app.use(morgan("dev"));

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL listo en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
