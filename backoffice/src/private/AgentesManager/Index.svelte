<script>
  // @ts-nocheck
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Edit from "./Edit.svelte";
  import Panel from "../../lib/layout/Panel.svelte";
  import Modal from "$lib/Componets/Modal.svelte";
  import Table from "../../lib/Componets/Table/Table.svelte";
  import LayoutPage from "../layout/LayoutPage.svelte";
  import Create from "./Create.svelte";
  import Delete from "./Delete.svelte";
  import Domicilios from "./Domicilios/Index.svelte";
  import Emails from "./Emails/Index.svelte";
  import Telefono from "./Telefono/Index.svelte";

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
    { label: "Razon Social", key: "razonSocial" },
    { label: "Fecha de Inicio", key: "fechaInicio" },
    { label: "Nacionalidad", key: "nacionalidad" },
    { label: "Sexo", key: "sexo" },
    { label: "Estado Civil", key: "estadoCivil" },
    { label: "Tipo Persona", key: "tipoPersona" },
    { label: "Representante Cuit", key: "representanteCuit" },
  ];

  const persona = writable({
    cuit: "",
    nombre: "",
    apellido: "",
    razonSocial: "N",
    fechaInicio: "",
    nacionalidad: "",
    sexo: "N",
    estadoCivil: "N",
    tipoPersona: "FISICA",
    representanteCuit: "0",
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
        cuit,
        nombre,
        apellido,
        razonSocial, 
        fechaInicio, 
        nacionalidad, 
        sexo, 
        estadoCivil,
        tipoPersona, 
        representanteCuit,    
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
        const personasFiltradas = result.data.personas.filter(Boolean);

        personasFiltradas.forEach((persona) => {
          if (persona.fechaInicio) {
            try {
              persona.fechaInicio = persona.fechaInicio
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/");
            } catch (e) {
              console.error("Error al formatear fecha:", e);
            }
          }
          if (persona.razonSocial === "N") persona.razonSocial = "";
          if (persona.representanteCuit === "0") persona.representanteCuit = "";
          if (persona.nombre === "N") persona.nombre = "";
          if (persona.apellido === "N") persona.apellido = "";
          if (persona.nacionalidad === "N") persona.nacionalidad = "";
          if (persona.sexo === "N") persona.sexo = "";
          if (persona.estadoCivil === "N") persona.estadoCivil = "";
        });

        data.set(personasFiltradas);
        totalRows.set(result.data.totalPersonas);
        totalPaginas.set(
          Math.ceil(result.data.totalPersonas / LIMITE_POR_PAGINA),
        );

        notificar({
          text: "Personas cargadas con éxito",
          type: "success",
        });
      } else {
        console.error("Error al obtener personas:", result.errors);
        notificar({ text: "Error al cargar personas", type: "error" });
      }
    } catch (error) {
      console.error("Error en fetchPersonas:", error);
      notificar({ text: "Error en la conexión", type: "error" });
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
          razonSocial: "${$persona.razonSocial}",
          fechaInicio: "${$persona.fechaInicio}",
          nacionalidad: "${$persona.nacionalidad}",
          sexo: "${$persona.sexo}",
          estadoCivil: "${$persona.estadoCivil}"
          tipoPersona: "${$persona.tipoPersona}"
          representanteCuit: "${$persona.representanteCuit}"
        ) {
          id
          cuit
          nombre
          apellido  
          razonSocial
          fechaInicio
          nacionalidad
          sexo
          estadoCivil
          tipoPersona
          representanteCuit 
        }
      }
    `;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });
      const result = await response.json();

      if (result.errors) {
        console.error("Error al crear persona:", result.errors);
        notificar({ text: "Error al crear persona", type: "error" });
      } else {
        fetchPersonas();
        persona.set({
          cuit: "",
          nombre: "",
          apellido: "",
          razonSocial: "N",
          fechaInicio: "",
          nacionalidad: "",
          sexo: "N",
          estadoCivil: "N",
          tipoPersona: "FISICA",
          representanteCuit: "0",
        });
        notificar({ text: "Persona creada con éxito", type: "success" });
      }
    } catch (error) {
      console.error("Error en crearPersona:", error);
      notificar({ text: "Error en la conexión", type: "error" });
    }
    cerrarModal1();
  }

  async function updatePersona(rowSelected) {
    if (typeof rowSelected.fechaInicio === "string") {
      const fechaStr = rowSelected.fechaInicio.trim();
      if (fechaStr.includes("/")) {
        const [day, month, year] = fechaStr.split("/");
        rowSelected.fechaInicio = new Date(year, month - 1, day);
      } else if (fechaStr.includes("-")) {
        const [year, month, day] = fechaStr.split("-");
        rowSelected.fechaInicio = new Date(year, month - 1, day);
      }
    }
    console.log("🚀 ~ updatePersona ~ rowSelected:", rowSelected);
    try {
      const mutation = `
      mutation {
        actualizarPersona(
          id: ${rowSelected.id},
          nombre: "${rowSelected.nombre}",            
          apellido: "${rowSelected.apellido}",
          razonSocial: "${rowSelected.razonSocial}",
          fechaInicio: "${rowSelected.fechaInicio}",
          nacionalidad: "${rowSelected.nacionalidad}",
          sexo: "${rowSelected.sexo}",
          estadoCivil: "${rowSelected.estadoCivil}"
          tipoPersona: "${rowSelected.tipoPersona}"
          representanteCuit: "${rowSelected.representanteCuit}"
        ) {
          id
          cuit
          nombre
          apellido  
          razonSocial
          fechaInicio
          nacionalidad
          sexo
          estadoCivil
          tipoPersona
          representanteCuit          
        }
      }
    `;
      console.log("🚀 ~ updatePersona ~ mutation:", mutation);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();
      console.log("🚀 ~ updatePersona ~ result:", result);
      if (result.errors) {
        console.error("Error al actualizar persona:", result.errors);
        notificar({ text: "Error al actualizar persona", type: "error" });
      } else {
        fetchPersonas();
        notificar({
          text: "Persona actualizada con éxito",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error en updatePersona:", error);
      notificar({ text: "Error en la conexión", type: "error" });
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
        showPanel = 1;
        cerrarModal2();
        notificar({
          text: "Persona eliminada con éxito",
          type: "success",
        });
      } else {
        console.error("Error al eliminar persona:", result.errors);
        notificar({ text: "Error al eliminar persona", type: "error" });
      }
    } catch (error) {
      console.error("Error en eliminarPersona:", error);
      notificar({ text: "Error en la conexión", type: "error" });
    }
  }

  async function searchCuit(cuit) {
    try {
      const query = `
      query {
        personaPorcuit(cuit: "${cuit}") {
          id
          nombre
          apellido
          cuit
          fechaInicio
          nacionalidad
          sexo
          estadoCivil            
        }
      }
    `;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (result.data) {
        const persona = result.data.personaPorcuit;
        if (persona) {
          persona.fechaInicio = persona.fechaInicio
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/");
          data.set([persona]);
          totalRows.set(1);
          totalPaginas.set(1);
          notificar({ text: "Persona encontrada", type: "success" });
        } else {
          data.set([]);
          totalRows.set(0);
          totalPaginas.set(0);
          notificar({
            text: "No se encontró una persona con ese CUIT",
            type: "warning",
          });
        }
      } else {
        console.error("Error al buscar persona por CUIT:", result.errors);
        notificar({ text: "Error al buscar persona", type: "error" });
      }
    } catch (error) {
      console.error("Error en searchCuit:", error);
      notificar({ text: "Error en la conexión", type: "error" });
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

  const hiddenEnable = writable(false);
  const hiddenEnable2 = writable(false);

  function abrirModal1() {
    hiddenEnable.set(true); // ✅ Se cambia el estado de manera reactiva
  }

  function cerrarModal1() {
    hiddenEnable.set(false); // ✅ Se cierra el modal de forma reactiva
  }

  function abrirModal2() {
    hiddenEnable2.set(true); // ✅ Se cambia el estado de manera reactiva
  }

  function cerrarModal2() {
    hiddenEnable2.set(false); // ✅ Se cierra el modal de forma reactiva
  }

  let showPanel = 1;
  $: showPanel;

  let rowSelected = {};
  $: rowSelected;

  function notificar({ text, type }) {
    toast.push(text, {
      theme: {
        "--toastBackground":
          type === "success" ? "green" : type === "error" ? "red" : "orange",
        "--toastColor": "white",
      },
    });
  }
</script>

<LayoutPage>
  {#if showPanel === 1}
    <Panel>
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Gestión de Personas</h1>
      <Table
        searchTitle="Buscar por Cuit..."
        title="Personas"
        itemsPerPage={LIMITE_POR_PAGINA}
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
          abrirModal1();
        }}
        labelData={listLabels}
        data={$data}
        {paginate}
        search={(query) => {
          if (query.length > 5) {
            console.log("🚀 ~ query:", query);
            searchCuit(query);
          } else {
            fetchPersonas();
          }
        }}
      />
    </Panel>
  {/if}
  {#if showPanel === 2}
    <div class=" flex flex-col justify-center items-center">
      <Edit {rowSelected} />
      <div class="flex justify-end gap-2 pt-4 w-[960px] lg:ml-52 p-4">
        <button
          onclick={() => {
            abrirModal2();
          }}
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >Eliminar
        </button>
        <button
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          onclick={selectPanel(1)}
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onclick={async () => await updatePersona(rowSelected)}
        >
          Guardar
        </button>
      </div>
      <Panel>
        <Domicilios cuit={rowSelected.cuit} />
      </Panel>
      <Panel>
        <Emails cuit={rowSelected.cuit} />
      </Panel>
      <Panel>
        <Telefono cuit={rowSelected.cuit} />
      </Panel>
    </div>

   
  {/if}
</LayoutPage>

<Modal
  title={"Crear Persona"}
  hiddenEnable={$hiddenEnable}
  listenclose={() => {
    cerrarModal1();
  }}
>
  <div id="modalContent" class="mb-4">
    <Create {persona} />
  </div>
  <div class="flex justify-end gap-2">
    <button
      onclick={() => {
        cerrarModal1();
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



<Modal
title={"Eliminar Persona"}
hiddenEnable={$hiddenEnable2}
listenclose={() => {
  cerrarModal2();
}}
>
<div id="modalContent" class="mb-4">
  <Delete {rowSelected} />
</div>
<div class="flex justify-end gap-2">
  <button
    onclick={() => {
      cerrarModal2();
    }}
    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
  >
    Cancelar
  </button>
  <button
    id="modalAction"
    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    onclick={eliminarPersona(rowSelected.id)}
  >
    eliminar
  </button>
</div>
</Modal>