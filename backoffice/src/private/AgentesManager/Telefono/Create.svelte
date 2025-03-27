<script>
  // @ts-nocheck
  let { telefono } = $props();
</script>
<div class="mb-4">
  <form id="domicilioForm" class="space-y-4">
    <div class="flex flex-col">
      <label for="Telefono" class="text-sm font-semibold text-gray-600">
        Telefono
      </label>
      <input
        type="text"
        id="Telefono"
        name="Telefono"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$telefono.telefono}
      />
    </div>
    <div class="flex flex-col">
      <label for="tipo" class="text-sm font-semibold text-gray-600">
        Tipo
      </label>
      <input
        type="text"
        id="tipo"
        name="tipo"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$telefono.tipo}
      />  
  </form>
</div>