<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useFolderStore } from '../stores/folderStore';
import type { Folder, FileItem } from '../types/folder';

// Props
const props = defineProps<{
  folderId: number | null;
}>();

// Emits
const emit = defineEmits<{
  'update-active-folder': [folderId: number]
}>();

// Store
const folderStore = useFolderStore();

// Memuat subfolder ketika folderId berubah
watch(() => props.folderId, (newFolderId) => {
  if (newFolderId !== undefined && !folderStore.isSearching) {
    folderStore.fetchSubfolders(newFolderId);
  }
}, { immediate: true });

// Ketika komponen di-mount dan folderId telah diatur
onMounted(() => {
  if (props.folderId !== undefined && !folderStore.isSearching) {
    folderStore.fetchSubfolders(props.folderId);
  }
});

// Handler untuk mengklik folder
const handleFolderClick = (folderId: number) => {
  folderStore.setSelectedFolder(folderId);
  // Emit event untuk memperbarui jalur aktif di parent component
  emit('update-active-folder', folderId);
};

// Computed untuk menampilkan teks yang sesuai dalam status pencarian kosong
const emptyStateText = computed(() => {
  if (folderStore.isSearching) {
    return 'Tidak ada hasil yang ditemukan';
  }
  return 'Folder kosong';
});
</script>

<template>
  <div class="folder-content">
    <!-- Loading state -->
    <div v-if="folderStore.loading" class="loading"></div>
    
    <!-- Error state -->
    <div v-else-if="folderStore.error" class="error"></div>
    
    <!-- Empty state -->
    <div v-else-if="folderStore.currentFolderContent.length === 0" class="empty-state">
      <div class="empty-container">
        <div class="empty-icon">{{ folderStore.isSearching ? '🔍' : '📂' }}</div>
        <div class="empty-subtext">{{ emptyStateText }}</div>
      </div>
    </div>
    
    <!-- Hasil Pencarian -->
    <div v-else-if="folderStore.isSearching" class="search-results">
      <!-- Folder results -->
      <div v-if="folderStore.searchResults?.folders.length" class="search-section">
        <div class="search-section-header">
          <span class="search-section-title">Folder</span>
        </div>
        <div class="search-items-grid">
          <div
            v-for="folder in folderStore.searchResults?.folders"
            :key="folder.id"
            class="folder-card"
            @click="handleFolderClick(folder.id)"
          >
            <div class="folder-icon">📁</div>
            <div class="folder-name">{{ folder.name }}</div>
          </div>
        </div>
      </div>

      <!-- File results -->
      <div v-if="folderStore.searchResults?.files.length" class="search-section">
        <div class="search-section-header">
          <span class="search-section-title">File</span>
        </div>
        <div class="search-items-grid">
          <div
            v-for="file in folderStore.searchResults?.files"
            :key="file.id"
            class="file-card"
          >
            <div class="file-icon">📄</div>
            <div class="file-name">{{ file.name }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Folder & File grid (Normal browsing mode) -->
    <div v-else class="subfolder-grid">
      <template v-for="item in folderStore.currentFolderContent" :key="item.id">
        <div
          v-if="'parentId' in item"
          class="folder-card"
          @click="handleFolderClick(item.id)"
          :class="{ 'selected': folderStore.selectedFolderId === item.id }"
        >
          <div class="folder-icon">📁</div>
          <div class="folder-name">{{ item.name }}</div>
        </div>
        <div
          v-else
          class="file-card"
        >
          <div class="file-icon">📄</div>
          <div class="file-name">{{ item.name }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.folder-content {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" stroke="%23007ACC"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg>') center center no-repeat;
}

.error, .empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error {
  background-color: rgba(255, 0, 0, 0.05);
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.empty-icon {
  font-size: 80px;
  color: #d0d0d0;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 20px;
  color: #666;
  font-weight: 500;
  margin-bottom: 10px;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-section-header {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.search-section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.search-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
  width: 100%;
  align-content: flex-start;
}

.subfolder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
  width: 100%;
  height: 100%;
  align-content: flex-start;
}

.folder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: background-color 0.2s, transform 0.1s;
  cursor: pointer;
  border: 1px solid #eee;
  height: auto;
}

.folder-card:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.folder-card.selected {
  background-color: #e0e0ff;
}

.folder-icon {
  font-size: 32px;
  margin-bottom: 5px;
  color: #FFC107;
}

.folder-name {
  text-align: center;
  word-break: break-word;
  font-size: 12px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  border-radius: 4px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  height: auto;
}

.file-icon {
  font-size: 28px;
  margin-bottom: 5px;
  color: #2196F3;
}

.file-name {
  text-align: center;
  word-break: break-word;
  font-size: 12px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}
</style> 