const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar DateTime

  type Persona {
    id: ID!
    cuit: String!
    nombre: String!
    apellido: String!
    razonSocial: String!
    fechaInicio: DateTime!
    nacionalidad: String
    sexo: String
    estadoCivil: String
    fechaCreacion: DateTime!
    tipoPersona: String
    representanteCuit: String
    domicilios: [Domicilio]
    telefonos: [Telefono]
    emails: [Email]
  }

  type Domicilio {
    id: ID!
    persona: Persona!
    calle: String
    numero: String
    ciudad: String
    provincia: String
    pais: String
    codigoPostal: String
    fechaActualizacion: DateTime!
  }

  type Telefono {
    id: ID!
    persona: Persona!
    telefono: String!
    tipo: String
    fechaActualizacion: DateTime!
  }

  type Email {
    id: ID!
    persona: Persona!
    email: String!
    tipo: String
    fechaActualizacion: DateTime!
  }

  type Query {
    # Consultas de Personas
    personas(skip: Int, take: Int): [Persona]
    totalPersonas: Int
    persona(id: ID!): Persona
    # Consultas de Personas por cuit
    personaPorcuit(cuit: String!): Persona

    # Consultas de Domicilios
    domicilios: [Domicilio]
    domicilio(id: ID!): Domicilio

    # Consultas de Teléfonos
    telefonos: [Telefono]
    telefono(id: ID!): Telefono

    # Consultas de Emails
    emails: [Email]
    email(id: ID!): Email
  }

  type Mutation {
    # Mutaciones de Persona
    crearPersona(cuit: String!, nombre: String!, apellido: String!, razonSocial: String!, fechaInicio: DateTime!, nacionalidad: String, sexo: String, estadoCivil: String, tipoPersona: String, representanteCuit: String): Persona
    actualizarPersona(id: ID!,  nombre: String!, apellido: String!, razonSocial: String!, fechaInicio: DateTime!, nacionalidad: String, sexo: String, estadoCivil: String, tipoPersona: String, representanteCuit: String): Persona
    eliminarPersona(id: ID!): Persona

    # Mutaciones de Domicilio
    agregarDomicilio(personaId: ID!, calle: String!, numero: String, ciudad: String!, provincia: String!, pais: String!, codigoPostal: String!): Domicilio
    actualizarDomicilio(id: ID!, calle: String, numero: String, ciudad: String, provincia: String, pais: String, codigoPostal: String): Domicilio
    eliminarDomicilio(id: ID!): Domicilio

    # Mutaciones de Teléfono
    agregarTelefono(personaId: ID!, telefono: String!, tipo: String): Telefono
    actualizarTelefono(id: ID!, telefono: String, tipo: String): Telefono
    eliminarTelefono(id: ID!): Telefono

    # Mutaciones de Email
    agregarEmail(personaId: ID!, email: String!, tipo: String): Email
    actualizarEmail(id: ID!, email: String, tipo: String): Email
    eliminarEmail(id: ID!): Email
  }
`;

module.exports = typeDefs;
