<script>
    import { Router, Route } from "svelte5-router"; // manejo de rutas
    import Login from "./public/Login.svelte";
    // @ts-ignore
    import UserManagement from "./private/usersManager/Index.svelte";
    import AgentesManagement from "./private/AgentesManager/Index.svelte";


    export let url = "";
</script>

<svelte:head>
    <title>Administración</title>
</svelte:head>
<Router {url}>
    <Route path="/" component={Login} />
    <Route path="/users" component={UserManagement} />
    <Route path="/agentes" component={AgentesManagement} />
</Router>
