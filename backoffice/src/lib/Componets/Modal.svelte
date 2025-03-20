<script>
    let {title, hiddenEnable = false,listenclose } = $props();
</script>

<div
    id="genericModal"
    class=" {!hiddenEnable
        ? 'hidden'
        : ''} fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
>
    <!-- svelte-ignore slot_element_deprecated -->
    <div
        class="relative bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg mx-4"
    >
        <div class="flex justify-between items-center mb-4">
            <h3
                class="text-lg font-bold text-gray-900 dark:text-white"
                id="modalTitle"
            >
                {title}
            </h3>
            <button
                aria-label="Close modal"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                onclick={listenclose}    
                >
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            </button>
        </div>
        <slot>
            
        </slot>
    </div>
</div>
