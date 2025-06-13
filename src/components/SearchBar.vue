<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFolderStore } from '../stores/folderStore';

const searchQuery = ref('');
const folderStore = useFolderStore();
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Watch perubahan pada searchQuery dan lakukan pencarian dengan debounce
watch(searchQuery, (newQuery) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Debounce pencarian (tunggu 500ms setelah user berhenti mengetik)
  searchTimeout = setTimeout(async () => {
    if (newQuery.trim() === '') {
      folderStore.resetSearch();
    } else {
      await folderStore.searchFolderAndFiles(newQuery);
    }
  }, 500);
});

// Reset pencarian dan search query
const resetSearch = () => {
  searchQuery.value = '';
  folderStore.resetSearch();
}
</script>

<template>
  <div class="search-bar">
    <div class="search-bar-container">
      <div class="search-input-container">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="search-input" 
          placeholder="Cari folder atau file..."
        />
        <button 
          v-if="searchQuery" 
          class="search-clear" 
          @click="resetSearch"
          title="Hapus kata kunci pencarian"
        >
          ✕
        </button>
      </div>
      
      <!-- Tombol Cancel untuk kembali ke mode browsing normal -->
      <button 
        v-if="folderStore.isSearching" 
        class="search-cancel-button" 
        @click="resetSearch"
        title="Kembali ke mode browsing normal"
      >
        <span class="cancel-icon">✕</span>
        <span class="cancel-text">Batal</span>
      </button>
    </div>
    
    <div class="search-status" v-if="folderStore.isSearching && folderStore.searchResults">
      <span class="search-results-count">
        {{ folderStore.searchResults.folders.length + folderStore.searchResults.files.length }} hasil ditemukan
      </span>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.search-bar-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input-container {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 8px;
  flex: 1;
}

.search-icon {
  color: #666;
  margin-right: 6px;
}

.search-input {
  flex: 1;
  border: none;
  padding: 8px 0;
  outline: none;
  font-size: 14px;
  background-color: transparent;
}

.search-clear {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
  font-size: 14px;
}

.search-clear:hover {
  color: #333;
}

/* Style untuk tombol cancel */
.search-cancel-button {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-cancel-button:hover {
  background-color: #e0e0e0;
}

.cancel-icon {
  font-size: 12px;
  margin-right: 4px;
  font-weight: bold;
}

.cancel-text {
  font-size: 13px;
}

.search-status {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
}

.search-results-count {
  display: inline-block;
  padding: 2px 6px;
  background-color: #e6f2ff;
  border-radius: 10px;
  font-size: 11px;
}
</style> 