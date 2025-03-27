<script>
  // @ts-nocheck
  let { rowSelected } = $props();

</script>
<div class="mb-4">
  <form id="domicilioForm" class="space-y-4">
    <div class="flex flex-col">
      <label for="calle" class="text-sm font-semibold text-gray-600">
        Calle
      </label>
      <input
        type="text"
        id="cuit"
        name="cuit"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$rowSelected.calle}
      />
    </div>
    <div class="flex flex-col">
      <label for="numero" class="text-sm font-semibold text-gray-600">
        Numero
      </label>
      <input
        type="text"
        id="numero"
        name="numero"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$rowSelected.numero}
      />
    </div>
    <div class="flex flex-col">
      <label for="ciudad" class="text-sm font-semibold text-gray-600">
        Ciudad
      </label>
      <input
        type="text"
        id="ciudad"
        name="ciudad"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$rowSelected.ciudad}
      />
    </div>
    <div class="flex flex-col">
      <label for="provincia" class="text-sm font-semibold text-gray-600">
        Provincia
      </label>
      <input
        type="text"
        id="provincia"
        name="provincia"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$rowSelected.provincia}
      />
    </div>
    <div class="flex flex-col">
      <label for="pais" class="text-sm font-semibold text-gray-600">
        Pais
      </label>
      <input
        type="text"
        id="pais"
        name="pais"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$rowSelected.pais}
      />
    </div>
    <div class="flex flex-col">
      <label for="codigoPostal" class="text-sm font-semibold text-gray-600">
        Codigo Postal
      </label>
      <input
        type="text"
        id="codigoPostal"
        name="codigoPostal"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$rowSelected.codigoPostal}
      />
    </div>    
  </form>
</div>