<script>
  import Panel from "$lib/layout/Panel.svelte";
  import { onMount } from "svelte";

  onMount(() => {

  });

  let { rowSelected } = $props();

  function formatDate(date) {
    if (!date) return ""; // Si no hay fecha, retorna vacío
    
    const [day, month, year] = date.split('/'); // Divide la fecha en día, mes y año
    if (!day || !month || !year) return ""; // Si la fecha no tiene los 3 elementos, retorna vacío
    
    // Convierte al formato YYYY-MM-DD
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    return formattedDate;
  }
</script>

<Panel>
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-4 col-start-2 ...">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Editar Agente</h1>
      <div class="flex flex-col">
        <label for="cuit" class="text-sm font-semibold text-gray-600">
          Cuil
        </label>
        <input
          type="text"
          id="cuit"
          nombre="cuit"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.cuit}
        />
        <label for="nombre" class="text-sm font-semibold text-gray-600">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          nombre="nombre"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.nombre}
        />
        <label for="apellido" class="text-sm font-semibold text-gray-600">
          Apellido
        </label>
        <input
          type="text"
          id="apellido"
          nombre="apellido"
          class="px-4 py-2 border border-gray-300 rounded-lg"
          value={rowSelected?.apellido}
        />
        <div class="flex flex-col">
          <label for="fechaNacimiento" class="text-sm font-semibold text-gray-600">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            class="px-4 py-2 border border-gray-300 rounded-lg"
            value={formatDate(rowSelected?.fechaNacimiento)}      
            on:input="{(e) => rowSelected.fechaNacimiento = e.target.value}"   
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
            value={rowSelected?.nacionalidad}
          />
        </div>
        <div class="flex flex-col">
          <label for="sexo" class="text-sm font-semibold text-gray-600"
            >Sexo</label
          >
          <select
            id="sexo"
            name="sexo"
            class="px-4 py-2 border border-gray-300 rounded-lg"
            bind:value={rowSelected.sexo}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label for="estadoCivil" class="text-sm font-semibold text-gray-600"
            >Estado Civil</label
          >
          <select
            id="estadoCivil"
            name="estadoCivil"
            class="px-4 py-2 border border-gray-300 rounded-lg"
            bind:value={rowSelected.estadoCivil}
          >
            <option value="SOLTERO">Soltero</option>
            <option value="CASADO">Casado</option>
            <option value="DIVORCIADO">Divorciado</option>
            <option value="VIUDO">Viudo</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</Panel>
