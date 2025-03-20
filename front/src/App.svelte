<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const API_URL = "http://localhost:4000/graphql";
  const LIMITE_POR_PAGINA = 25;

  const personas = writable([]);
  const paginaActual = writable(1);
  const totalPaginas = writable(1);

  const persona = writable({
    cuit: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    nacionalidad: "",
    sexo: "",
    estadoCivil: "",
  });

  async function fetchPersonas() {
    try {
      let $paginaActual;
      paginaActual.subscribe((value) => ($paginaActual = value))();

      const offset = ($paginaActual - 1) * LIMITE_POR_PAGINA;
      const query = `
        query {
          personas(skip: ${offset}, take: ${LIMITE_POR_PAGINA}) {
            id
            nombre
            apellido
          }
          totalPersonas
        }
      `;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (result.data) {
        personas.set(result.data.personas);
        totalPaginas.set(
          Math.ceil(result.data.totalPersonas / LIMITE_POR_PAGINA),
        );
      } else {
        console.error("Error al obtener personas:", result.errors);
      }
    } catch (error) {
      console.error("Error en fetchPersonas:", error);
    }
  }

  async function crearPersona() {
    try {
      let $persona;
      persona.subscribe((value) => ($persona = value))();

      const mutation = `
        mutation {
          crearPersona(
            cuit: "${$persona.cuit}",
            nombre: "${$persona.nombre}",
            apellido: "${$persona.apellido}",
            fechaNacimiento: "${$persona.fechaNacimiento}",
            nacionalidad: "${$persona.nacionalidad}",
            sexo: "${$persona.sexo}",
            estadoCivil: "${$persona.estadoCivil}"
          ) {
            id
            nombre
            apellido
          }
        }
      `;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();
      if (result.data) {
        fetchPersonas();
        persona.set({
          cuit: "",
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          nacionalidad: "",
          sexo: "",
          estadoCivil: "",
        });
      } else {
        console.error("Error al crear persona:", result.errors);
      }
    } catch (error) {
      console.error("Error en crearPersona:", error);
    }
  }

  async function eliminarPersona(id) {
    try {
      const mutation = `mutation { eliminarPersona(id: ${id}) { id } }`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();
      if (result.data) {
        fetchPersonas();
      } else {
        console.error("Error al eliminar persona:", result.errors);
      }
    } catch (error) {
      console.error("Error en eliminarPersona:", error);
    }
  }

  function cambiarPagina(direccion) {
    paginaActual.update((n) => {
      const nuevaPagina = n + direccion;
      return nuevaPagina > 0 ? nuevaPagina : 1;
    });
    fetchPersonas();
  }

  onMount(fetchPersonas);
</script>

<main>
  <h1>Gestión de Personas</h1>

  <form on:submit|preventDefault={crearPersona} class="formulario">
    <input bind:value={$persona.cuit} placeholder="CUIT" required />
    <input bind:value={$persona.nombre} placeholder="Nombre" required />
    <input bind:value={$persona.apellido} placeholder="Apellido" required />
    <input type="date" bind:value={$persona.fechaNacimiento} required />
    <input
      bind:value={$persona.nacionalidad}
      placeholder="Nacionalidad"
      required
    />
    <input bind:value={$persona.sexo} placeholder="Sexo" required />
    <input
      bind:value={$persona.estadoCivil}
      placeholder="Estado Civil"
      required
    />
    <button type="submit">Crear Persona</button>
  </form>

  <h2>Lista de Personas</h2>
  <table class="tabla">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each $personas as p}
        <tr>
          <td>{p.nombre}</td>
          <td>{p.apellido}</td>
          <td>
            <button on:click={() => eliminarPersona(p.id)}>Eliminar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="paginacion">
    <button on:click={() => cambiarPagina(-1)} disabled={$paginaActual === 1}
      >Anterior</button
    >
    <span>Página {$paginaActual} de {$totalPaginas}</span>
    <button
      on:click={() => cambiarPagina(1)}
      disabled={$paginaActual >= $totalPaginas}>Siguiente</button
    >
  </div>
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }

  .formulario {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 20px;
  }

  .formulario input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .tabla {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .tabla th,
  .tabla td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .paginacion {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
</style>
