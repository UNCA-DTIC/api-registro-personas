const request = require("supertest");

const API_URL = "http://localhost:4000/graphql";

describe("Test de Persona, Domicilio, Teléfono y Email en GraphQL", () => {
    let personaId;
    let domicilioId;
    let telefonoId;
    let emailId;

    // Crear una persona
    it("Debe crear una persona con todos los datos", async () => {
        const mutation = `
        mutation {
            crearPersona(
                cuit: "20123456780",
                nombre: "Juan",
                apellido: "Pérez",
                fechaNacimiento: "1990-05-15",
                nacionalidad: "Argentina"
                sexo: "M"
                estadoCivil: "Soltero"
            ) {
                id
                nombre
                apellido
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });
        expect(response.status).toBe(200);
        expect(response.body.data.crearPersona).toHaveProperty("id");
        personaId = response.body.data.crearPersona.id;

    });

    // Crear un domicilio
    it("Debe agregar un domicilio a la persona", async () => {
        const mutation = `
        mutation {
            agregarDomicilio(
                personaId: ${personaId},
                calle: "Av. Siempre Viva",
                numero: "742",
                ciudad: "Springfield",
                provincia: "Buenos Aires",
                pais: "Argentina",
                codigoPostal: "1234"
            ) {
                id
                calle
                numero
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.agregarDomicilio).toHaveProperty("id");
        domicilioId = response.body.data.agregarDomicilio.id;
    });

    // Crear un teléfono
    it("Debe agregar un teléfono a la persona", async () => {
        const mutation = `
        mutation {
            agregarTelefono(
                personaId: ${personaId},
                telefono: "1122334455",
                tipo: "Móvil"
            ) {
                id
                telefono
                tipo
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.agregarTelefono).toHaveProperty("id");
        telefonoId = response.body.data.agregarTelefono.id;
    });

    // Crear un email
    it("Debe agregar un email a la persona", async () => {
        const mutation = `
        mutation {
            agregarEmail(
                personaId: ${personaId},
                email: "juan@example.com",
                tipo: "Personal"
            ) {
                id
                email
                tipo
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.agregarEmail).toHaveProperty("id");
        emailId = response.body.data.agregarEmail.id;
    });

    // Obtener la persona con sus relaciones
    it("Debe obtener la persona con sus relaciones", async () => {
        const query = `
        query {
            persona(id: ${personaId}) {
                id
                nombre
                apellido
                domicilios {
                    id
                    calle
                }
                telefonos {
                    id
                    telefono
                }
                emails {
                    id
                    email
                }
            }
        }`;

        const response = await request(API_URL).post("").send({ query });

        expect(response.status).toBe(200);
        expect(response.body.data.persona.domicilios.length).toBeGreaterThan(0);
        expect(response.body.data.persona.telefonos.length).toBeGreaterThan(0);
        expect(response.body.data.persona.emails.length).toBeGreaterThan(0);
    });

    // Actualizar un domicilio
    it("Debe actualizar el domicilio", async () => {
        const mutation = `
        mutation {
            actualizarDomicilio(
                id: ${domicilioId},
                calle: "Calle Nueva",
                numero: "123"
            ) {
                id
                calle
                numero
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.actualizarDomicilio.calle).toBe("Calle Nueva");
    });

    // Actualizar un teléfono
    it("Debe actualizar el teléfono", async () => {
        const mutation = `
        mutation {
            actualizarTelefono(
                id: ${telefonoId},
                telefono: "9988776655",
                tipo: "Fijo"
            ) {
                id
                telefono
                tipo
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.actualizarTelefono.telefono).toBe("9988776655");
    });

    // Actualizar un email
    it("Debe actualizar el email", async () => {
        const mutation = `
        mutation {
            actualizarEmail(
                id: ${emailId},
                email: "nuevo@example.com",
                tipo: "Trabajo"
            ) {
                id
                email
                tipo
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.actualizarEmail.email).toBe("nuevo@example.com");
    });

    // Eliminar domicilio
    it("Debe eliminar el domicilio", async () => {
        const mutation = `
        mutation {
            eliminarDomicilio(id: ${domicilioId}) {
                id
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.eliminarDomicilio.id).toBe(domicilioId);
    });

    // Eliminar teléfono
    it("Debe eliminar el teléfono", async () => {
        const mutation = `
        mutation {
            eliminarTelefono(id: ${telefonoId}) {
                id
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.eliminarTelefono.id).toBe(telefonoId);
    });

    // Eliminar email
    it("Debe eliminar el email", async () => {
        const mutation = `
        mutation {
            eliminarEmail(id: ${emailId}) {
                id
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.eliminarEmail.id).toBe(emailId);
    });

    // Eliminar la persona creada
    it("Debe eliminar la persona creada", async () => {
        const mutation = `
        mutation {
            eliminarPersona(id: ${personaId}) {
                id
            }
        }`;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.eliminarPersona.id).toBe(personaId);
    });
});
