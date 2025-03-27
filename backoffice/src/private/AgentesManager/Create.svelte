<script>
  // @ts-nocheck
  let { persona } = $props();
</script>

<div class="flex space-x-4 mb-4">
  <button
    onclick={() => ($persona.tipoPersona = "FISICA")}
    class="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >Persona Física</button>
  <button
    onclick={() => ($persona.tipoPersona = "JURIDICA")}
    class="px-4 py-2 bg-green-500 text-white rounded-lg"
    >Persona Jurídica</button>
</div>
{#if $persona.tipoPersona === "FISICA"}
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
      <label for="fechaInicio" class="text-sm font-semibold text-gray-600">
        Fecha de Nacimiento
      </label>
      <input
        type="date"
        id="fechaInicio"
        name="fechaInicio"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$persona.fechaInicio}
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
        <option value="N">No especificado</option>
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
        <option value="UNIÓN_LIBRE">Unión libre</option>
      </select>
    </div>
  </form>
{/if}
{#if $persona.tipoPersona === "JURIDICA"}
  <form id="juridicaForm" class="space-y-4">
    <div class="flex flex-col">
      <label for="cuitJuridica" class="text-sm font-semibold text-gray-600"
        >Cuit</label
      >
      <input
        type="text"
        id="cuitJuridica"
        name="cuitJuridica"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$persona.cuit}
      />
    </div>
    <div class="flex flex-col">
      <label for="razonSocial" class="text-sm font-semibold text-gray-600"
        >Razón Social</label
      >
      <input
        type="text"
        id="razonSocial"
        name="razonSocial"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$persona.razonSocial}
      />
    </div>
    <div class="flex flex-col">
      <label for="fechaConstitucion" class="text-sm font-semibold text-gray-600"
        >Fecha de Constitución</label
      >
      <input
        type="date"
        id="fechaConstitucion"
        name="fechaConstitucion"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$persona.fechaInicio}
      />
    </div>  
    <div class="flex flex-col">
      <label for="cuitRepresentante" class="text-sm font-semibold text-gray-600"
        >Cuit Representante</label
      >
      <input
        type="text"
        id="representanteCuit"
        name="representanteCuit"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$persona.representanteCuit}
      />
    </div>
  </form>
{/if}
