<script>
  let isVisible = false;

  // Esto es solo un ejemplo de cómo podrías controlar la visibilidad.
  // Podrías vincular isVisible a algún evento o condición.
  import { onMount } from 'svelte';

  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100); // El contenido se hace visible después de 100 ms
  });
</script>

<div class="p-4 lg:ml-52 h-auto pt-20 transition-opacity duration-500 ease-in-out"
  class:opacity-0={isVisible === false} class:opacity-100={isVisible}> 
 <slot></slot>  
</div>
