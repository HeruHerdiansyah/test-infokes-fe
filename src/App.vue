<script setup lang="ts">
// App.vue sebagai root komponen
</script>

<template>
  <div class="app-container">
    <main class="app-content">
      <!-- Router view untuk menampilkan komponen sesuai dengan rute -->
      <router-view />
    </main>
  </div>
</template>

<style>
/* Reset dan style dasar */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f0f0;
  color: #333;
}

/* Layout aplikasi */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.app-content {
  flex: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
