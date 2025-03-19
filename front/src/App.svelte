<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const API_URL = "http://localhost:4000/graphql";

  let persona = {
    cuil: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    nacionalidad: "",
    sexo: "",
    estadoCivil: ""
  };

  let personas = writable([]);

  async function fetchPersonas() {
    const query = `query { personas { id nombre apellido } }`;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    personas.set(result.data.personas);
  }

  async function crearPersona() {
    const mutation = `
      mutation {
        crearPersona(
          cuil: "${persona.cuil}",
          nombre: "${persona.nombre}",
          apellido: "${persona.apellido}",
          fechaNacimiento: "${persona.fechaNacimiento}",
          nacionalidad: "${persona.nacionalidad}",
          sexo: "${persona.sexo}",
          estadoCivil: "${persona.estadoCivil}"
        ) {
          id
          nombre
          apellido
        }
      }
    `;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation })
    });
    fetchPersonas();
  }

  async function eliminarPersona(id) {
    const mutation = `mutation { eliminarPersona(id: ${id}) { id } }`;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation })
    });
    fetchPersonas();
  }

  onMount(fetchPersonas);
</script>

<main>
  <h1>Gestión de Personas</h1>
  <form on:submit|preventDefault={crearPersona}>
    <input bind:value={persona.cuil} placeholder="CUIL" required />
    <input bind:value={persona.nombre} placeholder="Nombre" required />
    <input bind:value={persona.apellido} placeholder="Apellido" required />
    <input type="date" bind:value={persona.fechaNacimiento} required />
    <input bind:value={persona.nacionalidad} placeholder="Nacionalidad" required />
    <input bind:value={persona.sexo} placeholder="Sexo" required />
    <input bind:value={persona.estadoCivil} placeholder="Estado Civil" required />
    <button type="submit">Crear Persona</button>
  </form>

  <h2>Lista de Personas</h2>
  <ul>
    {#each $personas as p}
      <li>
        {p.nombre} {p.apellido}
        <button on:click={() => eliminarPersona(p.id)}>Eliminar</button>
      </li>
    {/each}
  </ul>
</main>
