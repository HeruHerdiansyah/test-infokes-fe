<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import FolderExplorer from '../components/FolderExplorer.vue';
import FolderContent from '../components/FolderContent.vue';
import { useFolderStore } from '../stores/folderStore';

// Store untuk akses ke data folder
const folderStore = useFolderStore();

// State untuk folder yang dipilih
const selectedFolder = ref<number | null>(null);

// State untuk jalur folder yang sedang aktif (untuk expand parent folders)
const activeFolderPath = ref<number[]>([]);

// Handler ketika folder dipilih
const handleFolderSelect = (folderId: number | null) => {
  selectedFolder.value = folderId;
  folderStore.setSelectedFolder(folderId);
  
  // Update jalur folder aktif
  if (folderId !== null) {
    updateActiveFolderPath(folderId);
  } else {
    activeFolderPath.value = [];
  }
};

// Fungsi untuk memperbarui jalur folder aktif
const updateActiveFolderPath = (folderId: number) => {
  // Cari jalur dari root ke folder yang dipilih
  const path = [];
  const findPath = (folders, targetId, currentPath = []) => {
    for (const folder of folders) {
      const newPath = [...currentPath, folder.id];
      
      if (folder.id === targetId) {
        return newPath;
      }
      
      if (folder.subfolders && folder.subfolders.length > 0) {
        const result = findPath(folder.subfolders, targetId, newPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const result = findPath(folderStore.folderStructure, folderId);
  if (result) {
    activeFolderPath.value = result;
  }
};

// Muat struktur folder saat komponen dimount
onMounted(async () => {
  await folderStore.fetchFolderStructure();
  
  // Jika ada folder yang dipilih, update jalur folder aktif
  if (selectedFolder.value !== null) {
    updateActiveFolderPath(selectedFolder.value);
  }
});

// Fungsi untuk menemukan jalur breadcrumb ke folder yang dipilih
const breadcrumbPath = computed(() => {
  if (selectedFolder.value === null) {
    return [];
  }

  const path = [];
  const findPath = (folders, targetId, currentPath = []) => {
    for (const folder of folders) {
      // Cek folder saat ini
      const newPath = [...currentPath, { id: folder.id, name: folder.name }];
      
      if (folder.id === targetId) {
        return newPath;
      }
      
      // Cek subfolder jika ada
      if (folder.subfolders && folder.subfolders.length > 0) {
        const result = findPath(folder.subfolders, targetId, newPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const result = findPath(folderStore.folderStructure, selectedFolder.value);
  return result || [];
});

// Handler untuk navigasi breadcrumb
const navigateToBreadcrumb = (folderId) => {
  handleFolderSelect(folderId);
};

// Watch perubahan pada folderStructure untuk update jalur folder aktif
watch(() => folderStore.folderStructure, () => {
  if (selectedFolder.value !== null) {
    updateActiveFolderPath(selectedFolder.value);
  }
}, { deep: true });
</script>

<template>
  <div class="explorer-container">
    <!-- Breadcrumb navigation -->
    <div class="breadcrumb" v-if="selectedFolder !== null">
      <span class="breadcrumb-home" @click="handleFolderSelect(null)">Home</span>
      <span class="breadcrumb-separator" v-if="breadcrumbPath.length > 0"> &gt; </span>
      <template v-for="(item, index) in breadcrumbPath" :key="item.id">
        <span 
          class="breadcrumb-item" 
          @click="navigateToBreadcrumb(item.id)"
        >
          {{ item.name }}
        </span>
        <span class="breadcrumb-separator" v-if="index < breadcrumbPath.length - 1"> &gt; </span>
      </template>
    </div>
    
    <div class="explorer-panels">
      <!-- Panel kiri - Struktur folder lengkap -->
      <div class="folder-tree-panel">
        <div v-if="folderStore.loading" class="loading"></div>
        <div v-else-if="folderStore.error" class="error"></div>
        <FolderExplorer 
          v-else 
          :folderStructure="folderStore.folderStructure" 
          :active-path="activeFolderPath"
          @folder-selected="handleFolderSelect"
        />
      </div>
      
      <!-- Panel kanan - Subfolder langsung dari folder yang dipilih -->
      <div class="folder-content-panel">
        <div v-if="!selectedFolder && !folderStore.loading" class="no-selection"></div>
        <FolderContent 
          v-else 
          :folderId="selectedFolder" 
          @update-active-folder="handleFolderSelect"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.explorer-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.breadcrumb {
  background-color: #f0f0f0;
  padding: 8px 15px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.breadcrumb-home, .breadcrumb-item {
  cursor: pointer;
  color: #0078D7;
}

.breadcrumb-home:hover, .breadcrumb-item:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #666;
}

.explorer-panels {
  display: flex;
  width: 100%;
  flex: 1;
  overflow: hidden;
}

.folder-tree-panel {
  width: 30%;
  border-right: 1px solid #ddd;
  background-color: #f5f5f5;
  overflow: auto;
  height: 100%;
}

.folder-content-panel {
  width: 70%;
  background-color: white;
  overflow: auto;
  height: 100%;
}

.loading, .error, .no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" stroke="%23007ACC"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg>') center center no-repeat;
}

.error {
  background-color: rgba(255, 0, 0, 0.05);
}
</style> 