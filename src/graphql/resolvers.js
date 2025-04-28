const { PrismaClient } = require("@prisma/client");
const { ApolloError, UserInputError } = require('apollo-server');

const prisma = new PrismaClient();

const max = 5;
const resolvers = {
  Query: {
    // Obtener todas las personas con sus relaciones
    // Obtener todas las personas con paginación
    personas: async (_, { skip = 0, take = max,where  }) => {
      try {
        const personas = await prisma.persona.findMany({
          skip,
          take,
          where: where ?? undefined, // si where no viene, Prisma ignora el filtro
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
      const a = await prisma.persona.findFirst({
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
      if (!cuit) {
        throw new UserInputError('Faltan datos obligatorios', { invalidArgs: ['cuit'] });
      }
      // Validaciones según el tipo de persona
      if (tipoPersona === "JURIDICA") {
        if (!razonSocial || razonSocial.trim() === "") {
          throw new UserInputError("Debe ingresar la razón social", { invalidArgs: ['razonSocial'] });
        }
        if (!representanteCuit || representanteCuit.trim() === "") {
          throw new UserInputError("Debe ingresar el CUIT del representante", { invalidArgs: ['representanteCuit'] });
        }
        // buscar el cuit del representante 
        const personaExistente = await prisma.persona.findUnique({ where: { cuit: representanteCuit } });
        if (!personaExistente) {
          throw new ApolloError('Persona representante no encontrada', 'NOT_FOUND');
        }
        apellido = "N";
        nombre = "N";
        sexo = "N";
        estadoCivil = "N";
        nacionalidad = "";
      }
      if (tipoPersona === "FISICA") {
        if (!nombre || nombre.trim() === "") {
          throw new UserInputError("Debe ingresar el nombre", { invalidArgs: ['nombre'] });
        }
        if (!apellido || apellido.trim() === "") {
          throw new UserInputError("Debe ingresar el apellido", { invalidArgs: ['apellido'] });
        }
        // buscar el cuit si existe 
        const personaExistente = await prisma.persona.findUnique({ where: { cuit } });
        if (personaExistente) {
          throw new ApolloError('Persona ya existe', 'ALREADY_EXISTS');
        }
        razonSocial = "N";
        representanteCuit = "0";
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
    }
    ,
    actualizarPersona: async (_, {
      id, nombre, apellido, razonSocial, fechaInicio, nacionalidad, sexo, estadoCivil, tipoPersona, representanteCuit,
    }) => {
      if (!id) {
        throw new UserInputError('El ID es obligatorio', { invalidArgs: ['id'] });
      }

      if (tipoPersona === "JURIDICA") {
        if (!razonSocial || razonSocial.trim() === "") {
          throw new UserInputError("Debe ingresar la razón social", { invalidArgs: ['razonSocial'] });
        }
        if (!representanteCuit || representanteCuit.trim() === "") {
          throw new UserInputError("Debe ingresar el CUIT del representante", { invalidArgs: ['representanteCuit'] });
        }
        // buscar el cuit del representante 
        const personaExistente = await prisma.persona.findUnique({ where: { cuit: representanteCuit } });
        if (!personaExistente) {
          throw new ApolloError('Persona representante no encontrada', 'NOT_FOUND');
        }
        apellido = "N";
        nombre = "N";
        sexo = "N";
        estadoCivil = "N";
        nacionalidad = "";
      }
      if (tipoPersona === "FISICA") {
        if (!nombre || nombre.trim() === "") {
          throw new UserInputError("Debe ingresar el nombre", { invalidArgs: ['nombre'] });
        }
        if (!apellido || apellido.trim() === "") {
          throw new UserInputError("Debe ingresar el apellido", { invalidArgs: ['apellido'] });
        }
        razonSocial = "N";
        representanteCuit = "0";
      }
      try {
        const personaExistente = await prisma.persona.findUnique({ where: { id: Number(id) } });

        if (!personaExistente) {
          throw new ApolloError('Persona no encontrada', 'NOT_FOUND');
        }

        return await prisma.persona.update({
          where: { id: Number(id) },
          data: {
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
        console.error("Error al actualizar la persona:", error.message);
        throw new ApolloError('Error al actualizar la persona', 'INTERNAL_SERVER_ERROR');
      }
    }
    ,

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
      if (!personaId) {
        throw new UserInputError('Faltan datos obligatorios', { invalidArgs: ['personaId'] });
      }
      if (!calle || calle.trim() === "") {
        throw new UserInputError("Debe ingresar la calle", { invalidArgs: ['calle'] });
      }
      if (!numero || numero.trim() === "") {
        throw new UserInputError("Debe ingresar el número", { invalidArgs: ['numero'] });
      }
      if (!ciudad || ciudad.trim() === "") {
        throw new UserInputError("Debe ingresar la ciudad", { invalidArgs: ['ciudad'] });
      }
      if (!provincia || provincia.trim() === "") {
        throw new UserInputError("Debe ingresar la provincia", { invalidArgs: ['provincia'] });
      }
      if (!pais || pais.trim() === "") {
        throw new UserInputError("Debe ingresar el país", { invalidArgs: ['pais'] });
      }
      if (!codigoPostal || codigoPostal.trim() === "") {
        throw new UserInputError("Debe ingresar el código postal", { invalidArgs: ['codigoPostal'] });
      }

      try {
        return await prisma.domicilio.create({
          data: {
            personaId: Number(personaId),
            calle: calle.trim().toUpperCase(),
            numero: numero.trim().toUpperCase(),
            ciudad: ciudad.trim().toUpperCase(),
            provincia: provincia.trim().toUpperCase(),
            pais: pais.trim().toUpperCase(),
            codigoPostal: codigoPostal.trim().toUpperCase(),
            fechaActualizacion: new Date(),
          },
        });
      } catch (error) {
        console.error("Error al crear el domicilio:", error.message);
        throw new ApolloError('Error al crear el domicilio', 'INTERNAL_SERVER_ERROR');
      }

    },

    // Actualizar un domicilio
    actualizarDomicilio: async (_, { id, calle, numero, ciudad, provincia, pais, codigoPostal }) => {
      if (!id) {
        throw new UserInputError('El ID es obligatorio', { invalidArgs: ['id'] });
      }
      if (!calle || calle.trim() === "") {
        throw new UserInputError("Debe ingresar la calle", { invalidArgs: ['calle'] });
      }
      if (!numero || numero.trim() === "") {
        throw new UserInputError("Debe ingresar el número", { invalidArgs: ['numero'] });
      }
      if (!ciudad || ciudad.trim() === "") {
        throw new UserInputError("Debe ingresar la ciudad", { invalidArgs: ['ciudad'] });
      }
      if (!provincia || provincia.trim() === "") {
        throw new UserInputError("Debe ingresar la provincia", { invalidArgs: ['provincia'] });
      }
      if (!pais || pais.trim() === "") {
        throw new UserInputError("Debe ingresar el país", { invalidArgs: ['pais'] });
      }
      if (!codigoPostal || codigoPostal.trim() === "") {
        throw new UserInputError("Debe ingresar el código postal", { invalidArgs: ['codigoPostal'] });
      }
      try {
        const domicilioExistente = await prisma.domicilio.findUnique({ where: { id: Number(id) } });

        if (!domicilioExistente) {
          throw new ApolloError('Domicilio no encontrado', 'NOT_FOUND');
        }

        return await prisma.domicilio.update({
          where: { id: Number(id) },
          data: {
            calle: calle.trim().toUpperCase(),
            numero: numero.trim().toUpperCase(),
            ciudad: ciudad.trim().toUpperCase(),
            provincia: provincia.trim().toUpperCase(),
            pais: pais.trim().toUpperCase(),
            codigoPostal: codigoPostal.trim().toUpperCase(),
            fechaActualizacion: new Date(),
          },
        });
      }catch (error) {
        console.error("Error al actualizar el domicilio:", error.message);
        throw new ApolloError('Error al actualizar el domicilio', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Eliminar un domicilio
    eliminarDomicilio: async (_, { id }) => {
      if (!id) {
        throw new UserInputError('El ID es obligatorio', { invalidArgs: ['id'] });
      }
      try {
        const domicilioExistente = await prisma.domicilio.findUnique({ where: { id: Number(id) } });

        if (!domicilioExistente) {
          throw new ApolloError('Domicilio no encontrado', 'NOT_FOUND');
        }

        return await prisma.domicilio.delete({
          where: { id: Number(id) },
        });
      }	catch (error) {
        console.error("Error al eliminar el domicilio:", error.message);
        throw new ApolloError('Error al eliminar el domicilio', 'INTERNAL_SERVER_ERROR');
      }
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
