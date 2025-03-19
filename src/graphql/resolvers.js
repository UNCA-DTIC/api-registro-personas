const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    // Obtener todas las personas con sus relaciones
    personas: async () => {
      return await prisma.persona.findMany({
        include: { domicilios: true, telefonos: true, emails: true },
      });
    },

    // Obtener una persona por ID
    persona: async (_, { id }) => {
      return await prisma.persona.findUnique({
        where: { id: Number(id) },
        include: { domicilios: true, telefonos: true, emails: true },
      });
    },
    // Obtener una persona por CUIL
    personaPorCuil: async (_, { cuil }) => {
      return await prisma.persona.findFirst({
        where: { cuil },
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
    crearPersona: async (_, { cuil, nombre, apellido, fechaNacimiento, nacionalidad, sexo, estadoCivil }) => {
      return await prisma.persona.create({
        data: {
          cuil,
          nombre: nombre.toUpperCase(),
          apellido: apellido.toUpperCase(),
          fechaNacimiento: new Date(fechaNacimiento),
          nacionalidad: nacionalidad?.toUpperCase(),
          sexo: sexo?.toUpperCase(),
          estadoCivil: estadoCivil?.toUpperCase(),
        },
      });
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
