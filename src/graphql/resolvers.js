const { PrismaClient } = require("@prisma/client");
const { ApolloError, UserInputError } = require('apollo-server');

const prisma = new PrismaClient();

const max = 5;
const resolvers = {
  Query: {
    // Obtener todas las personas con sus relaciones
    // Obtener todas las personas con paginación
    personas: async (_, { skip = 0, take = max }) => {
      try {
        const personas = await prisma.persona.findMany({
          skip,
          take,
          include: { domicilios: true, telefonos: true, emails: true },
        });
        return personas;
      } catch (error) {
        throw new ApolloError('Error al obtener las personas', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Obtener el número total de personas (útil para paginación)
    totalPersonas: async () => {
      return await prisma.persona.count();
    },

    // Obtener una persona por ID
    persona: async (_, { id }) => {
      const persona = await prisma.persona.findUnique({
        where: { id: Number(id) },
        include: { domicilios: true, telefonos: true, emails: true },
      });
      if (!persona) {
        throw new ApolloError('Persona no encontrada', 'NOT_FOUND');
      }
      return persona;
    },

    // Obtener una persona por cuit
    personaPorcuit: async (_, { cuit }) => {
      if (!cuit) {
        throw new UserInputError('Faltan datos obligatorios', {
          invalidArgs: ['cuit'],
        });
      }
      return await prisma.persona.findFirst({
        where: { cuit },
        include: { domicilios: true, telefonos: true, emails: true },
      });
    },

    // Obtener todos los domicilios
    domicilios: async () => {
      return await prisma.domicilio.findMany({ include: { persona: true } });
    },

    // Obtener un domicilio por ID
    domicilio: async (_, { id }) => {
      return await prisma.domicilio.findUnique({
        where: { id: Number(id) },
        include: { persona: true },
      });
    },

    // Obtener todos los teléfonos
    telefonos: async () => {
      return await prisma.telefono.findMany({ include: { persona: true } });
    },

    // Obtener un teléfono por ID
    telefono: async (_, { id }) => {
      return await prisma.telefono.findUnique({
        where: { id: Number(id) },
        include: { persona: true },
      });
    },

    // Obtener todos los emails
    emails: async () => {
      return await prisma.email.findMany({ include: { persona: true } });
    },

    // Obtener un email por ID
    email: async (_, { id }) => {
      return await prisma.email.findUnique({
        where: { id: Number(id) },
        include: { persona: true },
      });
    },
  },

  Mutation: {
    // Crear una nueva persona
    crearPersona: async (_, { cuit, nombre, apellido, fechaNacimiento, nacionalidad, sexo, estadoCivil }) => {
      try {
        return await prisma.persona.create({
          data: {
            cuit,
            nombre: nombre.trim().toUpperCase(),
            apellido: apellido.trim().toUpperCase(),
            // fechaNacimiento: "1990-05-15", 
            fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
            nacionalidad: nacionalidad?.trim().toUpperCase() || null,
            sexo: sexo?.trim().toUpperCase() || null,
            estadoCivil: estadoCivil?.trim().toUpperCase() || null,
          },
        });
      } catch (error) {
        console.error("Error al crear la persona:", error.message);
        return null;
      }
    },


    // Actualizar persona
    actualizarPersona: async (_, { id, nombre, apellido, fechaNacimiento, nacionalidad, sexo, estadoCivil }) => {
      return await prisma.persona.update({
        where: { id: Number(id) },
        data: {
          nombre: nombre?.toUpperCase(),
          apellido: apellido?.toUpperCase(),
          fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
          nacionalidad: nacionalidad?.toUpperCase(),
          sexo: sexo?.toUpperCase(),
          estadoCivil: estadoCivil?.toUpperCase(),
        },
      });
    },

    // Eliminar persona
    eliminarPersona: async (_, { id }) => {
      return await prisma.persona.delete({
        where: { id: Number(id) },
      });
    },

    // Agregar un domicilio
    agregarDomicilio: async (_, { personaId, calle, numero, ciudad, provincia, pais, codigoPostal }) => {
      return await prisma.domicilio.create({
        data: {
          personaId: Number(personaId),
          calle,
          numero,
          ciudad,
          provincia,
          pais,
          codigoPostal,
          fechaActualizacion: new Date(),
        },
      });
    },

    // Actualizar un domicilio
    actualizarDomicilio: async (_, { id, calle, numero, ciudad, provincia, pais, codigoPostal }) => {
      return await prisma.domicilio.update({
        where: { id: Number(id) },
        data: {
          calle,
          numero,
          ciudad,
          provincia,
          pais,
          codigoPostal,
          fechaActualizacion: new Date(),
        },
      });
    },

    // Eliminar un domicilio
    eliminarDomicilio: async (_, { id }) => {
      return await prisma.domicilio.delete({
        where: { id: Number(id) },
      });
    },

    // Agregar un teléfono
    agregarTelefono: async (_, { personaId, telefono, tipo }) => {
      return await prisma.telefono.create({
        data: {
          personaId: Number(personaId),
          telefono,
          tipo,
          fechaActualizacion: new Date(),
        },
      });
    },

    // Actualizar un teléfono
    actualizarTelefono: async (_, { id, telefono, tipo }) => {
      return await prisma.telefono.update({
        where: { id: Number(id) },
        data: {
          telefono,
          tipo,
          fechaActualizacion: new Date(),
        },
      });
    },

    // Eliminar un teléfono
    eliminarTelefono: async (_, { id }) => {
      return await prisma.telefono.delete({
        where: { id: Number(id) },
      });
    },

    // Agregar un email
    agregarEmail: async (_, { personaId, email, tipo }) => {
      return await prisma.email.create({
        data: {
          personaId: Number(personaId),
          email,
          tipo,
          fechaActualizacion: new Date(),
        },
      });
    },

    // Actualizar un email
    actualizarEmail: async (_, { id, email, tipo }) => {
      return await prisma.email.update({
        where: { id: Number(id) },
        data: {
          email,
          tipo,
          fechaActualizacion: new Date(),
        },
      });
    },

    // Eliminar un email
    eliminarEmail: async (_, { id }) => {
      return await prisma.email.delete({
        where: { id: Number(id) },
      });
    },
  },
};

module.exports = resolvers;
