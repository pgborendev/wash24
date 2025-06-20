<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { Cropper as VueAdvancedCropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
   modelValue: {
    type: [String, File, null] as PropType<string | File | null>,
    default: null
  },
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref<HTMLInputElement | null>(null);
const cropper = ref<InstanceType<typeof VueAdvancedCropper> | null>(null);
const imageSrc = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
const isDialogOpen = ref(false);
const isDragging = ref(false);
const aspectRatio = ref<number | undefined>(undefined);

const aspectRatios = [
  { label: 'Free', value: undefined },
  { label: 'Square (1:1)', value: 1 },
  { label: 'Landscape (16:9)', value: 16/9 },
  { label: 'Portrait (9:16)', value: 9/16 },
];

const clearInternalState = () => {
  if (croppedImage.value && croppedImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(croppedImage.value);
  }
  croppedImage.value = null;
  if (fileInput.value) fileInput.value.value = '';
};


watch(() => props.modelValue, (newValue) => {
  if (newValue === null || newValue === undefined || newValue === '') {
    clearInternalState();
  } else if (typeof newValue === 'string') {
    croppedImage.value = newValue;
  }
}, { immediate: true });


const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  if (!croppedImage.value) {
    isDragging.value = true;
  }
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  if (!croppedImage.value && e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processFile(e.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imageSrc.value = e.target?.result as string;
    isDialogOpen.value = true;
  };
  reader.readAsDataURL(file);
};

const confirmCrop = () => {
  if (cropper.value) {
    const { canvas } = cropper.value.getResult();
    if (canvas) {
      croppedImage.value = canvas.toDataURL('image/jpeg', 0.9);
      isDialogOpen.value = false;
      emit('update:modelValue', croppedImage.value);
    }
  }
};

const cancelCrop = () => {
  isDialogOpen.value = false;
  imageSrc.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const startOver = (e: Event) => {
  e.stopPropagation();
  croppedImage.value = null;
  if (fileInput.value) fileInput.value.value = '';
  emit('update:modelValue', null);
};

onUnmounted(() => {
  clearInternalState();
});
</script>

<style>
.cropper {
  background: #f0f0f0;
}

.cropper .cropper-image {
  max-width: none !important;
  max-height: none !important;
}
</style>

<template>
  <!-- DragDropImageInput.vue -->
  <div class="pt-1">
    <!-- File Input (hidden) -->
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept="image/*"
      @change="handleFileSelect"
    />

    <!-- Drag & Drop Zone -->
    <div
      :id="id"
      class="border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors relative"
      :class="{
        'border-blue-500 bg-blue-50': isDragging && !croppedImage,
        'hover:border-blue-400': !isDragging && !croppedImage,
        'min-h-[120px] p-4': !croppedImage,
        'p-0': croppedImage
      }"
      :style="{
        width: width || '100%',
        height: height || (croppedImage ? 'auto' : '200px')
      }"
      @click="!croppedImage && triggerFileInput()"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop">
      <!-- Upload UI -->
      <div v-if="!croppedImage" class="space-y-2 h-full flex flex-col items-center justify-center">
        <!-- <Upload class="w-12 h-12 mx-auto text-gray-400" /> -->
        <p class="text-sm font-medium">
          {{ placeholder }}
        </p>
      </div>

      <!-- Cropped Result -->
      <div v-else class="relative w-full h-full">
        <img 
          :src="croppedImage" class="rounded-md object-contain w-full h-full"
        />
        <!-- Close button -->
        <button
          @click.stop="startOver"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Cropper Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area and click "Crop" when ready
          </DialogDescription>
        </DialogHeader>
        
        <!-- Cropper Area -->
        <div class="h-[400px] relative bg-gray-100 rounded-md overflow-hidden">
          <VueAdvancedCropper
            v-if="imageSrc"
            ref="cropper"
            :src="imageSrc"
            :stencil-props="{
              aspectRatio: aspectRatio,
              handlers: {},
              movable: true,
              resizable: true
            }"
            class="cropper h-full w-full"
          />
        </div>

        <!-- Aspect Ratio Controls -->
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="ratio in aspectRatios"
            :key="ratio.value"
            @click="aspectRatio = ratio.value"
            variant="outline"
            :class="{
              'bg-accent text-accent-foreground': aspectRatio === ratio.value
            }"
          >
            {{ ratio.label }}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="cancelCrop">
            Cancel
          </Button>
          <Button @click="confirmCrop">
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

