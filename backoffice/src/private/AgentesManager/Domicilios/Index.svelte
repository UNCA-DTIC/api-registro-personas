<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    import Panel from "../../../lib/layout/Panel.svelte";
    import Modal from "$lib/Componets/Modal.svelte";
    import Table from "../../../lib/Componets/Table/Table.svelte";
    import LayoutPage from "../../layout/LayoutPage.svelte";

    import { toast } from "@zerodevx/svelte-toast";

    const API_URL = import.meta.env.VITE_API_HOST_AGENTES;
    const LIMITE_POR_PAGINA = 5;
  
    let { cuit } = $props();
    let data = writable([]);
    let paginaActual = writable(1);
    let totalPaginas = writable(1);
    let totalRows = writable(0);

    const hiddenEnable = writable(false); // ✅ Convertido en writable para reactividad

    const listLabels = [
        { label: "Calle", key: "calle" },
        { label: "Numero", key: "numero" },
        { label: "Ciudad", key: "ciudad" },
        { label: "Provincia", key: "provincia" },
        { label: "Pais", key: "pais" },
        { label: "Codigo Postal", key: "codigoPostal" },
    ];

    async function fetchDomicilios() {
        try {         
            const query = `
                query {
                    personaPorcuit(cuit: "${cuit}") {
                        domicilios {
                            id
                            calle
                            numero
                            ciudad
                            provincia
                            pais
                            codigoPostal
                        }
                    }
                }
            `;
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
            console.log("🚀 ~ fetchDomicilios ~ result:", result);

            if (result.data) {
                data.set(result.data.personaPorcuit.domicilios);
                totalRows.set(result.data.totaldomicilios || 0);
                totalPaginas.set(
                    Math.ceil((result.data.totaldomicilios || 0) / LIMITE_POR_PAGINA)
                );
                notificar("Domicilios cargados con éxito", "success");
            } else {
                console.error("Error al obtener domicilios:", result.errors);
                notificar("Error al cargar domicilios", "error");
            }
        } catch (error) {
            console.error("Error en fetchDomicilios:", error);
            notificar("Error en la conexión", "error");
        }
    }

    function paginate(direccion) {
        paginaActual.update((n) => Math.max(n + direccion, 1));
        fetchDomicilios();
    }

    function notificar(text, type) {
        toast.push(text, {
            theme: {
                "--toastBackground": type === "success" ? "green" :
                                     type === "error" ? "red" : "orange",
                "--toastColor": "white",
            },
        });
    }

    function abrirModal() {
        hiddenEnable.set(true); // ✅ Se cambia el estado de manera reactiva
    }

    function cerrarModal() {
        hiddenEnable.set(false); // ✅ Se cierra el modal de forma reactiva
    }

    onMount(fetchDomicilios);
</script>

<Table
    title="Domicilios"
    itemsPerPage={LIMITE_POR_PAGINA}
    showSearch={false}
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
    listenAddButton={abrirModal} 
    labelData={listLabels}
    data={$data}
    {paginate}
/>

<Modal
  title="Nuevo Agente"
  hiddenEnable={$hiddenEnable} 
  listenclose={cerrarModal} 
>
  <div id="modalContent" class="mb-4"></div>
  
  <div class="flex justify-end gap-2">
    <button
      onclick={cerrarModal} 
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
    >
      Cancelar
    </button>
    <button
      id="modalAction"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
   
    >
      Guardar
    </button>
  </div>
</Modal>
