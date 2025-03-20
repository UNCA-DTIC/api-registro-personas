<script>
  import Panel from "$lib/layout/Panel.svelte";

  let { rowSelected } = $props();
</script>

<Panel>
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-4 col-start-2 ...">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Editar Usuario</h1>
      <div class="flex flex-col">
        <label for="cuil" class="text-sm font-semibold text-gray-600">
          Cuil
        </label>
        <input
          type="text"
          id="cuil"
          name="cuil"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.users}
        />
        <label for="name" class="text-sm font-semibold text-gray-600">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.name}
        />
        <label for="lastName" class="text-sm font-semibold text-gray-600">
          Apellido
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.lastName}
        />
        <label for="email" class="text-sm font-semibold text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.email}
        />
        <label for="role" class="text-sm font-semibold text-gray-600">
          Rol
        </label>
        <select
          id="role"
          name="role"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.role}
        >
          <option value="admin">Administrador</option>
          <option value="user">Prestador</option>
          <option value="moderator">Gestor</option>
        </select>
        <label for="status" class="text-sm font-semibold text-gray-600">
          Estado
        </label>
        <select
          id="status"
          name="status"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected.status}
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
    </div>
  </div>
</Panel>
