const request = require("supertest");
const API_URL = "http://localhost:4000/graphql";

beforeAll(async () => {
   
});

afterAll(async () => {
    
});

describe("Test de Persona en GraphQL", () => {
    let personaId;

    it("Debe crear una persona con todos los datos", async () => {
        const mutation = `
      mutation {
        crearPersona(
          cuil: "20-12345678-9",
          nombre: "Juan",
          apellido: "Pérez",
          fechaNacimiento: "1990-05-15",
          nacionalidad: "Argentina"
          sexo: "M"
          estadoCivil: "Soltero"
        ) {
          id
          cuil
          nombre
          apellido
          fechaNacimiento
          nacionalidad
          sexo
          estadoCivil
        }
      }
    `;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.crearPersona).toHaveProperty("id");
        expect(response.body.data.crearPersona.nombre).toBe("Juan");

        personaId = response.body.data.crearPersona.id;
    });

/*    it("Debe eliminar la persona creada", async () => {
        const mutation = `
      mutation {
        eliminarPersona(id: ${personaId}) {
          id
        }
      }
    `;

        const response = await request(API_URL).post("").send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.eliminarPersona.id).toBe(personaId);
    });*/
});

/*
En este caso, se realizan dos pruebas: una para crear una persona y otra para eliminarla. En la primera prueba, se envía una mutación para crear una persona con todos los datos requeridos. Luego, se verifica que la respuesta sea exitosa y que la persona creada tenga el nombre “Juan”. En la segunda prueba, se envía una mutación para eliminar la persona creada anteriormente. Se verifica que la respuesta sea exitosa y que el ID de la persona eliminada sea el mismo que el de la persona creada. 
Para ejecutar las pruebas, se debe correr el siguiente comando: 
$ npx jest tests/persona.test.js 
Si todo está bien, se debería ver algo similar a esto: 
PASS  tests/persona.test.js
Test de Persona en GraphQL
    ✓ Debe crear una persona con todos los datos (22 ms)
    ✓ Debe eliminar la persona creada (6 ms)
    */