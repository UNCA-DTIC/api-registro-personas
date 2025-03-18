const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { PrismaClient } = require("@prisma/client");
const { gql } = require("graphql-tag");

const prisma = new PrismaClient();
const app = express();

// Definición del esquema GraphQL
const typeDefs = gql`
  type Persona {
    id: ID!
    cuil: String!
    nombre: String!
    apellido: String!
    fechaNacimiento: String!
    nacionalidad: String
    fechaCreacion: String!
    domicilios: [Domicilio]
    telefonos: [Telefono]
    emails: [Email]
  }

  type Domicilio {
    id: ID!
    calle: String
    numero: String
    ciudad: String
    provincia: String
    pais: String
    codigoPostal: String
  }

  type Telefono {
    id: ID!
    telefono: String!
    tipo: String
  }

  type Email {
    id: ID!
    email: String!
    tipo: String
  }

  type Query {
    personas: [Persona]
    persona(id: ID!): Persona
  }

  type Mutation {
    crearPersona(cuil: String!, nombre: String!, apellido: String!, fechaNacimiento: String!): Persona
    eliminarPersona(id: ID!): Persona
  }
`;

// Resolvers para manejar las operaciones
const resolvers = {
  Query: {
    personas: async () => await prisma.persona.findMany({ include: { domicilios: true, telefonos: true, emails: true } }),
    persona: async (_, { id }) => await prisma.persona.findUnique({ where: { id: Number(id) }, include: { domicilios: true, telefonos: true, emails: true } }),
  },
  Mutation: {
    crearPersona: async (_, { cuil, nombre, apellido, fechaNacimiento }) => {
      return await prisma.persona.create({
        data: { cuil, nombre, apellido, fechaNacimiento: new Date(fechaNacimiento) },
      });
    },
    eliminarPersona: async (_, { id }) => {
      return await prisma.persona.delete({ where: { id: Number(id) } });
    },
  },
};

// Configuración de Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () => console.log("Servidor GraphQL en http://localhost:4000/graphql"));
}

startServer().catch(console.error);
