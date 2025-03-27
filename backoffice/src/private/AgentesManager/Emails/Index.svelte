<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    import Panel from "../../../lib/layout/Panel.svelte";
    import Modal from "$lib/Componets/Modal.svelte";
    import Table from "../../../lib/Componets/Table/Table.svelte";
    import LayoutPage from "../../layout/LayoutPage.svelte";
    import Create from "./Create.svelte";
    import Delete from "./Delete.svelte";
    import { toast } from "@zerodevx/svelte-toast";

    const API_URL = import.meta.env.VITE_API_HOST_AGENTES;
    const LIMITE_POR_PAGINA = 5;

    let { cuit } = $props();
    let data = writable([]);
    let idpersona = writable(0);

    const email = writable({
        personaId: 0,
        email: "",
        tipo: "",
    });

    let paginaActual = writable(1);
    let totalPaginas = writable(1);
    let totalRows = writable(0);
    const hiddenEnable = writable(false);
    const hiddenEnable2 = writable(false);

    const listLabels = [
        { label: "Email", key: "email" },
        { label: "Tipo", key: "tipo" },  
    ];

    async function fetchEmails() {
        try {
            const query = `
                query {
                    personaPorcuit(cuit: "${cuit}") {
                    id
                    cuit
                        emails {
                            id
                            email
                            tipo
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
            console.log("🚀 ~ fetchEmails ~ result:", result)

            if (result.data) {
                idpersona.set(result.data.personaPorcuit.id);
                data.set(result.data.personaPorcuit.emails);             
                totalPaginas.set(
                    Math.ceil(
                        (result.data.totalEmails || 0) / LIMITE_POR_PAGINA,
                    ),
                );
                notificar("Emails cargados con éxito", "success");
            } else {
                console.error("Error al obtener Emails:", result.errors);
                notificar("Error al cargar Emails", "error");
            }
        } catch (error) {
            console.error("Error en fetchEmails:", error);
            notificar("Error en la conexión", "error");
        }
    }

    async function CreateEmail() {
        const query = `
            mutation {
                agregarEmail(
                    personaId: ${$idpersona},
                    email: "${$email.email}",
                    tipo: "${$email.tipo}"
                ) {
                    id
                    email
                    tipo
                }
            }
        `;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
         
            if (result.errors) {
                console.error("Error al crear email:", result.errors);
                notificar("Error al crear email", "error");
                return;
            } else {
                notificar("Email creado con éxito", "success");
                fetchEmails();
                cerrarModal();
            }
        } catch (error) {
            console.error("Error en CreateEmail:", error);
            notificar("Error en la conexión", "error");
        }
    }

    async function eliminarEmails(id) {
        const query = `
            mutation {
                eliminarEmail(id: ${id}) {
                    id
                }
            }
        `;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
            if (result.errors) {
                console.error("Error al eliminar email:", result.errors);
                notificar("Error al eliminar email", "error");
                return;
            } else {
                notificar("Email eliminado con éxito", "success");
                fetchEmails();
                cerrarModal2();
            }
        } catch (error) {
            console.error("Error en eliminarEmail:", error);
            notificar("Error en la conexión", "error");
        }
    }

    function paginate(direccion) {
        paginaActual.update((n) => Math.max(n + direccion, 1));
        fetchEmails();
    }

    function notificar(text, type) {
        toast.push(text, {
            theme: {
                "--toastBackground":
                    type === "success"
                        ? "green"
                        : type === "error"
                          ? "red"
                          : "orange",
                "--toastColor": "white",
            },
        });
    }

    function abrirModal() {
        hiddenEnable.set(true); // ✅ Se cambia el estado de manera reactiva
    }

    function abrirModal2() {
        hiddenEnable2.set(true); // ✅ Se cambia el estado de manera reactiva
    }

    function cerrarModal() {
        hiddenEnable.set(false); // ✅ Se cierra el modal de forma reactiva
    }

    function cerrarModal2() {
        hiddenEnable2.set(false); // ✅ Se cierra el modal de forma reactiva
    }

    const rowSelected = writable({
        id: 0,
        email: "",
        tipo: "",
    });

    onMount(fetchEmails);
</script>

<Table
    title="Email"
    paginationEnabled={false}
    itemsPerPage={LIMITE_POR_PAGINA}
    showSearch={false}
    showAddButton={true}
    pagination={{
        page: $paginaActual,
        perPage: LIMITE_POR_PAGINA,
        totalRows: $totalRows,
        total: $totalPaginas,
    }}
    getRow={(row) => {       
        rowSelected.set(row);
        abrirModal2();
    }}
    listenAddButton={abrirModal}
    labelData={listLabels}
    data={$data}
    {paginate}
/>

<Modal
    title="Nuevo email"
    hiddenEnable={$hiddenEnable}
    listenclose={cerrarModal}
>
    <div id="modalContent" class="mb-4"></div>
    <Create email={email} />
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
            onclick={CreateEmail}
        >
            Guardar
        </button>
    </div>
</Modal>


<Modal
title={"Eliminar Email"}
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
    onclick={() => eliminarEmails($rowSelected.id)}
  >
    Eliminar
  </button>
</div>
</Modal>