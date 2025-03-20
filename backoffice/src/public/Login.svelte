<script>
    import { navigate } from "svelte5-router";
    // @ts-ignore
    import { strapi } from "$lib/api/strapiconec.js";
    import axios from "axios";
    // @ts-ignore
    import { jwt_, strapi_ } from "@globalStore";
    import { onMount } from "svelte";

    let name_app = import.meta.env.VITE_APP_NAME;
    let identifier = "";
    let password = "";

    onMount(async () => {
        console.log("🚀 ~ onMount ~ $jwt_:", $jwt_)
        if ($jwt_ != null && $jwt_ != "" && $jwt_ != undefined && $jwt_ != "null") {
            
            $strapi_ = await strapi();
            $strapi_.axios.defaults.headers.common["Authorization"] =
                `Bearer ${$jwt_}`;
            navigate("/users", { replace: true });
        }
    });
    async function handleLogin(event) {
        $strapi_ = await strapi();
        event.preventDefault();
        try {
            // @ts-ignore
            const response = await axios.post(
                import.meta.env.VITE_API_HOST + `/api/auth/local`,
                {
                    identifier: identifier,
                    password: password,
                },
            );
            $jwt_ = response.data.jwt;
            if ($jwt_ != null) {
                $strapi_.axios.defaults.headers.common["Authorization"] =
                    `Bearer ${$jwt_}`;
                // @ts-ignore
                let usr = await $strapi_.fetchUser();
                navigate("/users", { replace: true });
            }
        } catch (e) {
            console.log(e);
        }
    }
</script>

<!-- Login Section -->
<div
    id="login-section"
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
>
    <div
        class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
    >
        <div>
            <img
                class="mx-auto h-54 w-auto"
                src="/assets/img/Mobile-login-Cristina.jpg"
                alt="Dashboard Logo"
            />
            <h2
                class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
            >
                {name_app}
            </h2>
        </div>
        <form class="mt-8 space-y-6" on:submit={handleLogin}>
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="identifier" class="sr-only">Usuario</label>
                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        bind:value={identifier}
                        required
                        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Usuario"
                    />
                </div>
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        bind:value={password}
                        required
                        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                    />
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >Iniciar</button
                >
            </div>
        </form>
    </div>
</div>
