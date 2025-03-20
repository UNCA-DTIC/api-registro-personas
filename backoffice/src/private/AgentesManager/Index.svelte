<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Edit from "./Edit.svelte";
  import Panel from "../../lib/layout/Panel.svelte";
  import Modal from "$lib/Componets/Modal.svelte";
  import Table from "../../lib/Componets/Table/Table.svelte";
  import LayoutPage from "../layout/LayoutPage.svelte";

  const API_URL = import.meta.env.VITE_API_HOST_AGENTES;
  const LIMITE_POR_PAGINA = 5;

  let data = writable([]);
  const paginaActual = writable(1);
  const totalPaginas = writable(1);
  let totalRows = writable(0);

  const listLabels = [
    { label: "Cuit", key: "cuit" },
    { label: "Apellido", key: "apellido" },
    { label: "Nombre", key: "nombre" },
    { label: "Fecha de Nacimiento", key: "fechaNacimiento" },
    { label: "Nacionalidad", key: "nacionalidad" },
    { label: "Sexo", key: "sexo" },
    { label: "Estado Civil", key: "estadoCivil" },
  ];

  const persona = writable({
    cuit: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    nacionalidad: "",
    sexo: "O",
    estadoCivil: "SOLTERO",
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
          cuit
          fechaNacimiento
          nacionalidad
          sexo
          estadoCivil
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
      // Filtramos valores nulos
      const personasFiltradas = result.data.personas.filter(Boolean);

      // Convertimos fechaNacimiento al formato esperado
      personasFiltradas.forEach((persona) => {
        if (persona.fechaNacimiento) {
          try {
            persona.fechaNacimiento = persona.fechaNacimiento
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/");
          } catch (e) {
            console.error("Error al formatear fecha:", e);
          }
        }
      });

      data.set(personasFiltradas);
      totalRows.set(result.data.totalPersonas);
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

  async function updatePersona(rowSelected) { 
   const fec = rowSelected.fechaNacimiento
    console.log("🚀 ~ updatePersona ~ fec:", fec)
    try {
      const mutation = `
        mutation {
          actualizarPersona(
            id: ${rowSelected.id},
            nombre: "${rowSelected.nombre}",
            apellido: "${rowSelected.apellido}",
            fechaNacimiento: "${rowSelected.fechaNacimiento}",
            nacionalidad: "${rowSelected.nacionalidad}",
            sexo: "${rowSelected.sexo}",
            estadoCivil: "${rowSelected.estadoCivil}"
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
      console.log("🚀 ~ updatePersona ~ result:", result)
      if (result.data) {
        fetchPersonas();
      } else {
        console.error("Error al actualizar persona:", result.errors);
      }
    } catch (error) {
      console.error("Error en updatePersona:", error);
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

  function paginate(direccion) {
    paginaActual.update((n) => {
      const nuevaPagina = n + direccion;
      return nuevaPagina > 0 ? nuevaPagina : 1;
    });
    fetchPersonas();
  }

  onMount(fetchPersonas);

  function selectPanel(state) {
    showPanel = state;
  }

  let hiddenEnable = false;
  $: hiddenEnable;

  let showPanel = 1;
  $: showPanel;

  let rowSelected = {};
  $: rowSelected;
</script>

<LayoutPage>
  {#if showPanel === 1}
    <Panel>
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Gestión de Agentes</h1>
      <Table
        title="Agentes"
        itemsPerPage={5}
        showSearch="true"
        showAddButton="true"
        pagination={{
          page: $paginaActual,
          perPage: LIMITE_POR_PAGINA,
          totalRows: $totalRows,
          total: $totalPaginas,
        }}
        getRow={(row) => {
          rowSelected = row;
          showPanel = 2;
        }}
        listenAddButton={() => {
          hiddenEnable = true;
        }}
        labelData={listLabels}
        data={$data}
        {paginate}
        search={(query) => {
          console.log("🚀 ~ query:", query);
        }}
      />
    </Panel>
  {/if}
  {#if showPanel === 2}
    <Edit {rowSelected} />
  
    <div class="flex justify-end gap-2 pt-4">
      <button
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        onclick={selectPanel(1)}>
        Cancelar
      </button>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onclick={async () => await updatePersona(rowSelected)}>
        Guardar
      </button>
    </div>
  {/if}
</LayoutPage>

<Modal
  title={"Nuevo Agente"}
  {hiddenEnable}
  listenclose={() => {
    hiddenEnable = false;
  }}
>
  <div id="modalContent" class="mb-4">
    <form id="agentForm" class="space-y-4">
      <div class="flex flex-col">
        <label for="cuit" class="text-sm font-semibold text-gray-600">
          Cuit
        </label>
        <input
          type="text"
          id="cuit"
          name="cuit"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          bind:value={$persona.cuit}
        />
      </div>
      <div class="flex flex-col">
        <label for="apellido" class="text-sm font-semibold text-gray-600">
          Apellido
        </label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          bind:value={$persona.apellido}
        />
      </div>
      <div class="flex flex-col">
        <label for="nombre" class="text-sm font-semibold text-gray-600">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          bind:value={$persona.nombre}
        />
      </div>
      <div class="flex flex-col">
        <label
          for="fechaNacimiento"
          class="text-sm font-semibold text-gray-600"
        >
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          id="fechaNacimiento"
          name="fechaNacimiento"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          bind:value={$persona.fechaNacimiento}
        />
      </div>
      <div class="flex flex-col">
        <label for="nacionalidad" class="text-sm font-semibold text-gray-600">
          Nacionalidad
        </label>
        <input
          type="text"
          id="nacionalidad"
          name="nacionalidad"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          bind:value={$persona.nacionalidad}
        />
      </div>
      <div class="flex flex-col">
        <label for="sexo" class="text-sm font-semibold text-gray-600">
          Sexo
        </label>
        <select
          id="sexo"
          name="sexo"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          bind:value={$persona.sexo}
        >
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="estadoCivil" class="text-sm font-semibold text-gray-600">
          Estado Civil
        </label>
        <select
          id="estadoCivil"
          name="estadoCivil"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          bind:value={$persona.estadoCivil}
        >
          <option value="SOLTERO">Soltero</option>
          <option value="CASADO">Casado</option>
          <option value="DIVORCIADO">Divorciado</option>
          <option value="VIUDO">Viudo</option>
        </select>
      </div>
    </form>
  </div>
  <div class="flex justify-end gap-2">
    <button
      onclick={() => {
        hiddenEnable = false;
      }}
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
    >
      Cancelar
    </button>
    <button
      id="modalAction"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      onclick={crearPersona}
    >
      Guardar
    </button>
  </div>
</Modal>
