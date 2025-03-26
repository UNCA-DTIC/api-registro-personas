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
       const a= await prisma.persona.findFirst({
        where: {
          cuit: {
            startsWith: cuit, // Busca cualquier cuit que empiece con el valor dado
          },
        },
        include: { domicilios: true, telefonos: true, emails: true },
      });
      return a;
    },

    // Obtener todos los domicilios
    domicilios: async () => {
      console.log("🚀 ~ domicilios: ~ prisma:")
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
    crearPersona: async (_, {
      cuit, nombre, apellido, razonSocial, fechaInicio, nacionalidad, sexo, estadoCivil, tipoPersona, representanteCuit,
    }) => {
      if (!cuit || !nombre || !apellido) {
        throw new UserInputError('Faltan datos obligatorios', { invalidArgs: ['cuit', 'nombre', 'apellido'] });
      }

      try {
        return await prisma.persona.create({
          data: {
            cuit,
            nombre: nombre.trim().toUpperCase(),
            apellido: apellido.trim().toUpperCase(),
            razonSocial: razonSocial?.trim().toUpperCase() || "0", 
            fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(0),
            nacionalidad: nacionalidad?.trim().toUpperCase() || "N",
            sexo: sexo?.trim().toUpperCase() || "N",
            estadoCivil: estadoCivil?.trim().toUpperCase() || "N",
            tipoPersona: tipoPersona?.trim().toUpperCase() || "N",
            representanteCuit: representanteCuit?.trim().toUpperCase() || "0",
          },
        });
      } catch (error) {
        console.error("Error al crear la persona:", error.message);
        throw new ApolloError('Error al crear la persona', 'INTERNAL_SERVER_ERROR');
      }
    },

    actualizarPersona: async (_, {
      id, nombre, apellido, razonSocial, fechaInicio, nacionalidad, sexo, estadoCivil, tipoPersona, representanteCuit,
    }) => {
      if (!id) {
        throw new UserInputError('El ID es obligatorio', { invalidArgs: ['id'] });
      }

      try {
        const personaExistente = await prisma.persona.findUnique({ where: { id: Number(id) } });

        if (!personaExistente) {
          throw new ApolloError('Persona no encontrada', 'NOT_FOUND');
        }

        return await prisma.persona.update({
          where: { id: Number(id) },
          data: {
            nombre: nombre?.trim().toUpperCase(),
            apellido: apellido?.trim().toUpperCase(),
            razonSocial: razonSocial?.trim().toUpperCase() || "0",
            fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
            nacionalidad: nacionalidad?.trim().toUpperCase() || null,
            sexo: sexo?.trim().toUpperCase() || null,
            estadoCivil: estadoCivil?.trim().toUpperCase() || null,
            tipoPersona: tipoPersona?.trim().toUpperCase() || null,
            representanteCuit: representanteCuit?.trim().toUpperCase() || "0",
          },
        });
      } catch (error) {
        console.error("Error al actualizar la persona:", error.message);
        throw new ApolloError('Error al actualizar la persona', 'INTERNAL_SERVER_ERROR');
      }
    },

    eliminarPersona: async (_, { id }) => {
      if (!id) {
        throw new UserInputError('El ID es obligatorio', { invalidArgs: ['id'] });
      }

      try {
        const personaExistente = await prisma.persona.findUnique({ where: { id: Number(id) } });

        if (!personaExistente) {
          throw new ApolloError('Persona no encontrada', 'NOT_FOUND');
        }

        return await prisma.persona.delete({
          where: { id: Number(id) },
        });
      } catch (error) {
        console.error("Error al eliminar la persona:", error.message);
        throw new ApolloError('Error al eliminar la persona', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Agregar un domicilio
    agregarDomicilio: async (_, { personaId, calle, numero, ciudad, provincia, pais, codigoPostal }) => {

      try {
      return await prisma.domicilio.create({
        data: {
          personaId: 11,
          calle:"sa",
          numero:"ss",
          ciudad:"aaa",
          provincia:"aaa",
          pais:"aaa",
          codigoPostal:"aaa",
          fechaActualizacion: new Date(),
        },
      });
    } catch (error) {
      console.error("Error al agregar el domicilio:", error.message);
      throw new ApolloError('Error al agregar el domicilio', 'INTERNAL_SERVER_ERROR');  
    }

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
