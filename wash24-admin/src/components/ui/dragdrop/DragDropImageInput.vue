<script setup lang="ts">
import { onUnmounted, ref, watch, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import { Cropper as VueAdvancedCropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import apiEndpoints from '@/config/config';

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
  previewUrl: {
    type: String,
    default: ''
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
const localImage = ref<string | null>(null); // For locally processed images
const localPreviewUrl = ref<string>(); // Internal preview URL state
const isDialogOpen = ref(false);
const isDragging = ref(false);
const aspectRatio = ref<number | undefined>(undefined);

const aspectRatios = [
  { label: 'Free', value: undefined },
  { label: 'Square (1:1)', value: 1 },
  { label: 'Landscape (16:9)', value: 16/9 },
  { label: 'Portrait (9:16)', value: 9/16 },
];

onMounted(() => {
  localPreviewUrl.value = props.previewUrl || '';
});


// Computed property to determine what to display
const displayImage = computed(() => {
  if (localImage.value) return localImage.value;
  if (localPreviewUrl.value) return apiEndpoints.base + localPreviewUrl.value;
  return null;
});

const clearInternalState = () => {
   if (localImage.value && localImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(localImage.value);
  }
  localImage.value = null;
  localPreviewUrl.value = ''; // Always set to empty string, never null
  if (fileInput.value) fileInput.value.value = '';
};

watch(() => props.previewUrl, (newValue) => {
  if (!localImage.value) {
    localPreviewUrl.value = newValue || ''; // Ensure we never set null
  }
}, { immediate: true });

watch(() => props.modelValue, (newValue) => {
  if (newValue === null || newValue === undefined || newValue === '') {
    clearInternalState();
  } else if (newValue instanceof File) {
    // Convert File to object URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      localImage.value = e.target?.result as string;
      localPreviewUrl.value = ''; // Clear preview URL when we have a new file
    };
    reader.readAsDataURL(newValue);
  } else if (typeof newValue === 'string' && (newValue.startsWith('data:') || newValue.startsWith('blob:'))) {
    // Handle base64 or blob URLs
    localImage.value = newValue;
    localPreviewUrl.value = ''; // Clear preview URL when we have a new data URL
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
  if (!displayImage.value) {
    isDragging.value = true;
  }
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  if (!displayImage.value && e.dataTransfer?.files && e.dataTransfer.files[0]) {
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
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          emit('update:modelValue', file);
          
          // Create preview URL
          localImage.value = URL.createObjectURL(blob);
        }
      }, 'image/jpeg', 0.9);
      isDialogOpen.value = false;
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
  clearInternalState();
  emit('update:modelValue', '');
};

onUnmounted(() => {
  clearInternalState();
});
</script>

<template>
  <div class="pt-1">
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept="image/*"
      @change="handleFileSelect"
    />

    <div
      :id="id"
      class="border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors relative"
      :class="{
        'border-blue-500 bg-blue-50': isDragging && !displayImage,
        'hover:border-blue-400': !isDragging && !displayImage,
        'min-h-[120px] p-4': !displayImage,
        'p-0': displayImage
      }"
      :style="{
        width: width || '100%',
        height: height || (displayImage ? 'auto' : '200px')
      }"
      @click="!displayImage && triggerFileInput()"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop">
      
      <div v-if="!displayImage" class="space-y-2 h-full flex flex-col items-center justify-center">
        <p class="text-sm font-medium">
          {{ placeholder }}
        </p>
      </div>

      <div v-else class="relative w-full h-full">
        <img 
          :src="displayImage" 
          class="rounded-md object-contain w-full h-full"
          :style="{
            width: width || '100%',
            height: height || 'auto'
          }"
        />
        <button
          @click.stop="startOver"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area and click "Crop" when ready
          </DialogDescription>
        </DialogHeader>
        
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

<style>
.cropper {
  background: #f0f0f0;
}

.cropper .cropper-image {
  max-width: none !important;
  max-height: none !important;
}
</style>