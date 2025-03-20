<script>
  import Edit from "./Edit.svelte";

  import Panel from "../../lib/layout/Panel.svelte";
  import Table from "../../lib/Componets/Table/Table.svelte";
  import Modal from "$lib/Componets/Modal.svelte";
  import LayoutPage from "../layout/LayoutPage.svelte";
  
  import { fade, slide } from "svelte/transition";

  const listLabels = [
    { label: "Usuario", key: "users" },
    { label: "Nombre", key: "name" },
    { label: "Apellido", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Rol", key: "role" },
    { label: "Estado", key: "status" },
  ];

  const data = [
    {
      users: "user01",
      name: "Juan",
      lastName: "Perez",
      email: "juan.perez@example.com",
      role: "Administrador",
      status: "Activo",
    },
    {
      users: "user02",
      name: "Maria",
      lastName: "Gomez",
      email: "maria.gomez@example.com",
      role: "Usuario",
      status: "Inactivo",
    },
    {
      users: "user03",
      name: "Carlos",
      lastName: "Lopez",
      email: "carlos.lopez@example.com",
      role: "Moderador",
      status: "Activo",
    },
    {
      users: "user04",
      name: "Ana",
      lastName: "Martinez",
      email: "ana.martinez@example.com",
      role: "Usuario",
      status: "Activo",
    },
    {
      users: "user05",
      name: "Pedro",
      lastName: "Garcia",
      email: "pedro.garcia@example.com",
      role: "Administrador",
      status: "Inactivo",
    },
    {
      users: "user06",
      name: "Lucia",
      lastName: "Sanchez",
      email: "lucia.sanchez@example.com",
      role: "Usuario",
      status: "Activo",
    },
    {
      users: "user07",
      name: "Jorge",
      lastName: "Ramirez",
      email: "jorge.ramirez@example.com",
      role: "Moderador",
      status: "Activo",
    },
    {
      users: "user08",
      name: "Elena",
      lastName: "Torres",
      email: "elena.torres@example.com",
      role: "Usuario",
      status: "Inactivo",
    },
    {
      users: "user09",
      name: "Ricardo",
      lastName: "Diaz",
      email: "ricardo.diaz@example.com",
      role: "Administrador",
      status: "Activo",
    },
    {
      users: "user10",
      name: "Sofia",
      lastName: "Fernandez",
      email: "sofia.fernandez@example.com",
      role: "Moderador",
      status: "Activo",
    },
  ];

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
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Gestión de Usuarios</h1>
      <Table
        title="Usuarios"
        labelData={listLabels}
        showSearch="true"
        showAddButton="true"
        addButtonLabel="Nuevo Usuario"
        {data}
        getRow={(row) => {
          rowSelected = row;
          showPanel = 2;
        }}
        listenAddButton={() => {
          hiddenEnable = true;
        }}
        paginate={(page) => {
          console.log("🚀 ~ page:", page);
        }}
        search={(query) => {
          console.log("🚀 ~ query:", query);
        }}
      />
    </Panel>
  {/if}
  {#if showPanel === 2}
    <Edit  {rowSelected}/>
    <div class="flex justify-end gap-2 pt-4">
      <button
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        onclick={() => {
          showPanel = 1;
        }}
      >
        Cancelar
      </button>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Guardar
      </button>
    </div>
  {/if}
</LayoutPage>

<Modal
  title={"Nuevo Usuario"}
  {hiddenEnable}
  listenclose={() => {
    hiddenEnable = false;
  }}
>
  <div id="modalContent" class="mb-4">
    <form id="userForm" class="space-y-4">
      <div class="flex flex-col">
        <label for="cuil" class="text-sm font-semibold text-gray-600">
          Cuil
        </label>
        <input
          type="text"
          id="cuil"
          name="cuil"
          class="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div class="flex flex-col">
        <label for="name" class="text-sm font-semibold text-gray-600">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          class="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div class="flex flex-col">
        <label for="lastName" class="text-sm font-semibold text-gray-600">
          Apellido
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          class="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div class="flex flex-col">
        <label for="email" class="text-sm font-semibold text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          class="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div class="flex flex-col">
        <label for="role" class="text-sm font-semibold text-gray-600">
          Rol
        </label>
        <select
          id="role"
          name="role"
          class="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="admin">Administrador</option>
          <option value="user">Prestador</option>
          <option value="moderator">Gestor</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="status" class="text-sm font-semibold text-gray-600">
          Estado
        </label>
        <select
          id="status"
          name="status"
          class="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
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
      >Cancel</button
    >
    <button
      id="modalAction"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >Guardar</button
    >
  </div>
</Modal>
