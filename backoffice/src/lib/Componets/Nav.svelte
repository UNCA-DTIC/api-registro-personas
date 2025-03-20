<script>
    export let name = "John Doe";
    export let role = "Admin";
    export let avatar =
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32";
    import { link } from "svelte5-router";
    export let title = import.meta.env.VITE_APP_NAME;

    let listLinks = [
           { name: "Usuarios", href: "/users" },
           { name: "Agentes", href: "/agentes" },
    ];

    let isSidebarOpen = false;
    let isDropdownOpen = false;
    let darkMode = false;

    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
    };

    const toggleDropdown = () => {
        isDropdownOpen = !isDropdownOpen;
    };

    // Mantener el tema almacenado
    if (localStorage.getItem("theme") === "dark") {
        darkMode = true;
        document.documentElement.classList.add("dark");
    }
</script>

<nav
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30 top-0"
>
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <button
                    on:click={toggleSidebar}
                    class="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
                    aria-label="Toggle Sidebar"
                >
                    <svg
                        class="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </button>
                <span
                    class="text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white"
                    >{title}</span
                >
            </div>
            <div class="flex items-center gap-4">
                <div
                    class="hidden md:flex items-center text-sm text-gray-600 dark:text-gray-300"
                >
                    <span class="font-medium mr-2">{name}</span>
                    <span
                        class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >{role}</span
                    >
                </div>
                <!--  
                 <button   on:click={toggleDarkMode}  class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5" aria-label="Toggle Dark Mode">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                </button>
                -->
                <div class="relative">
                    <button
                        on:click={toggleDropdown}
                        class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        aria-label="User Menu"
                    >
                        <img
                            class="w-8 h-8 rounded-full"
                            src={avatar}
                            alt="user"
                        />
                    </button>
                    {#if isDropdownOpen}
                        <div
                            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1"
                        >
                            <!-- svelte-ignore a11y_invalid_attribute -->
                            <a
                                href="#"
                                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >Configuración de perfil</a
                            >
                            <!-- svelte-ignore a11y_invalid_attribute -->
                            <a
                                href="#"
                                class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >Salir</a
                            >
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</nav>

<aside
    class="fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-20 z-20 transition-transform duration-300 transform lg:translate-x-0"
    class:translate-x-[-100%]={!isSidebarOpen}
>
    <nav class="space-y-1 px-3">
        {#each listLinks as link2}
            <a
                href={link2.href}
                class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                use:link
            >
                {link2.name}</a
            >
        {/each}
    </nav>
</aside>
