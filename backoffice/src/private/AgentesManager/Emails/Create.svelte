<script>
  // @ts-nocheck
  let { email } = $props();
</script>
<div class="mb-4">
  <form id="domicilioForm" class="space-y-4">
    <div class="flex flex-col">
      <label for="email" class="text-sm font-semibold text-gray-600">
        Email
      </label>
      <input
        type="text"
        id="email"
        name="email"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$email.email}
      />
    </div>
    <div class="flex flex-col">
      <label for="tipo" class="text-sm font-semibold text-gray-600">
        Tipo
      </label>
      <input
        type="text"
        id="tipo"
        name="tipo"
        class="px-4 py-2 border border-gray-300 rounded-lg"
        bind:value={$email.tipo}
      />  
  </form>
</div>