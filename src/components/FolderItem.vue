<script setup>
import { computed } from 'vue';

const props = defineProps({
  folder: {
    type: Object,
    required: true
  },
  expandedFolders: {
    type: Object,
    required: true
  },
  activePath: {
    type: Array,
    default: () => []
  },
  level: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['select-folder', 'toggle-folder']);

// Cek apakah folder memiliki subfolder
const hasSubfolders = props.folder.subfolders && props.folder.subfolders.length > 0;

// Cek apakah folder ini ada di jalur aktif
const isActive = computed(() => {
  return props.activePath && props.activePath.includes(props.folder.id);
});
</script>

<template>
  <div class="folder-item" :class="{ 'active': isActive }">
    <div 
      class="folder-header" 
      @click="emit('select-folder', folder.id)"
      :class="{ 'active': isActive }"
    >
      <span 
        v-if="hasSubfolders" 
        class="expand-icon"
        @click.stop="emit('toggle-folder', folder.id, $event)"
      >
        {{ expandedFolders[folder.id] ? '▼' : '▶' }}
      </span>
      <span v-else class="placeholder-icon"></span>
      <span class="folder-icon">📁</span>
      <span class="folder-name">{{ folder.name }}</span>
    </div>
    
    <!-- Subfolder rekursif -->
    <div 
      v-if="expandedFolders[folder.id] && hasSubfolders" 
      class="subfolders"
    >
      <div 
        v-for="subfolder in folder.subfolders" 
        :key="subfolder.id" 
        class="folder-item"
        :style="`padding-left: ${10}px;`"
      >
        <folder-item
          :folder="subfolder"
          :expanded-folders="expandedFolders"
          :active-path="activePath"
          :level="level + 1"
          @select-folder="(id) => emit('select-folder', id)"
          @toggle-folder="(id, event) => emit('toggle-folder', id, event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder-header {
  display: flex;
  align-items: center;
  padding: 3px 0;
  cursor: pointer;
  text-align: left;
}

.folder-header:hover {
  background-color: #f0f0f0;
}

.folder-header.active {
  background-color: #e6f2ff;
  font-weight: 500;
}

.expand-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  text-align: center;
  font-size: 8px;
  cursor: pointer;
  margin-right: 0;
}

.placeholder-icon {
  display: inline-block;
  width: 10px;
  margin-right: 0;
}

.folder-icon {
  margin: 0 1px 0 0;
  color: #FFC107;
}

.folder-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.subfolders {
  margin: 0;
}
</style> 