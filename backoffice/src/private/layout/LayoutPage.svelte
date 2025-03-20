<script>
  import DashBoard from "../../lib/layout/DashBoard.svelte";
  import Nav from "../../lib/Componets/Nav.svelte";
</script>

<Nav></Nav>
<DashBoard>
  <slot></slot>
</DashBoard>
