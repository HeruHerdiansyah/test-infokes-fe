<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { FolderStructure } from '../types/folder';
import FolderItem from './FolderItem.vue';

// Props
const props = defineProps<{
  folderStructure: FolderStructure[],
  activePath?: number[]
}>();

// Emits
const emit = defineEmits<{
  'folder-selected': [folderId: number | null]
}>();

// State untuk folder yang di-expand
const expandedFolders = ref<Record<number, boolean>>({});

// Ketika folder di-toggle expand/collapse
const toggleFolder = (folderId: number, event: Event) => {
  event.stopPropagation();
  expandedFolders.value[folderId] = !expandedFolders.value[folderId];
};

// Ketika folder dipilih
const selectFolder = (folderId: number | null) => {
  if (folderId !== null) {
    expandedFolders.value[folderId] = true; // Selalu expand folder yang diklik
    // Expand parent folders ketika subfolder dipilih
    expandParentFolders(folderId);
  }
  emit('folder-selected', folderId);
};

// Fungsi untuk expand parent folders
const expandParentFolders = (folderId: number) => {
  // Cari parent dari folder yang dipilih
  const findAndExpandParents = (folders: FolderStructure[], targetId: number) => {
    for (const folder of folders) {
      // Cek di subfolder
      if (folder.subfolders && folder.subfolders.length > 0) {
        // Cek apakah folder saat ini adalah parent dari target
        const foundInSubfolders = folder.subfolders.some(sub => sub.id === targetId);
        if (foundInSubfolders) {
          // Expand parent folder
          expandedFolders.value[folder.id] = true;
          return true;
        }
        
        // Cek lebih dalam di subfolder
        for (const subfolder of folder.subfolders) {
          if (subfolder.id === targetId) {
            // Target ditemukan, expand parent
            expandedFolders.value[folder.id] = true;
            return true;
          }
          
          if (subfolder.subfolders && subfolder.subfolders.length > 0) {
            // Cek di subfolder yang lebih dalam
            const found = findAndExpandParents([subfolder], targetId);
            if (found) {
              // Expand parent folder jika ditemukan di subfolder
              expandedFolders.value[folder.id] = true;
              return true;
            }
          }
        }
      }
    }
    return false;
  };
  
  findAndExpandParents(props.folderStructure, folderId);
};

// Semua folder collapse saat pertama kali komponen dimuat
onMounted(() => {
  // Semua folder dalam keadaan collapse di awal
  const setAllFoldersCollapsed = (folders: FolderStructure[]) => {
    folders.forEach(folder => {
      expandedFolders.value[folder.id] = false;
      if (folder.subfolders && folder.subfolders.length > 0) {
        setAllFoldersCollapsed(folder.subfolders);
      }
    });
  };
  
  setAllFoldersCollapsed(props.folderStructure);
  
  // Jika ada active path, expand folder pada jalur tersebut
  if (props.activePath && props.activePath.length > 0) {
    props.activePath.forEach(folderId => {
      expandedFolders.value[folderId] = true;
    });
  }
});

// Watch perubahan pada active path
watch(() => props.activePath, (newPath) => {
  if (newPath && newPath.length > 0) {
    // Expand semua folder pada jalur aktif
    newPath.forEach(folderId => {
      expandedFolders.value[folderId] = true;
    });
  }
}, { deep: true });
</script>

<template>
  <div class="folder-explorer">
    <!-- Folder structure recursive rendering -->
    <div class="folder-structure">
      <folder-item
        v-for="folder in folderStructure"
        :key="folder.id"
        :folder="folder"
        :expanded-folders="expandedFolders"
        :active-path="activePath"
        :level="0"
        @select-folder="selectFolder"
        @toggle-folder="toggleFolder"
      />
    </div>
  </div>
</template>

<style scoped>
.folder-explorer {
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: auto;
}

.folder-structure {
  width: 100%;
}
</style> 