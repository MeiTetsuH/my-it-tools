<script setup lang="ts">
import { readSignatureCertificates } from './pdf-signature-checker.service';
import type { SignatureInfo } from './pdf-signature-checker.types';
import { formatBytes } from '@/utils/convert';

const { t } = useI18n();
const signatures = ref<SignatureInfo[]>([]);
const status = ref<'idle' | 'parsed' | 'error' | 'loading'>('idle');
const file = ref<File | null>(null);

async function onVerifyClicked(uploadedFile: File) {
  file.value = uploadedFile;
  status.value = 'loading';
  try {
    const fileBuffer = await uploadedFile.arrayBuffer();
    signatures.value = readSignatureCertificates(fileBuffer);
    status.value = 'parsed';
  }
  catch (e) {
    signatures.value = [];
    status.value = 'error';
  }
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div mx-auto max-w-600px>
      <c-alert mb-4>
        {{ t('tools.pdf-signature-checker.unverified') }}
      </c-alert>

      <c-file-upload title="Drag and drop a PDF file here, or click to select a file" accept=".pdf" @file-upload="onVerifyClicked" />

      <c-card v-if="file" mt-4 flex gap-2>
        <div font-bold>
          {{ file.name }}
        </div>

        <div>
          {{ formatBytes(file.size) }}
        </div>
      </c-card>

      <div v-if="status === 'error'">
        <c-alert mt-4>
          {{ t('tools.pdf-signature-checker.read-error') }}
        </c-alert>
      </div>
    </div>
  </div>

  <div v-if="status === 'parsed' && signatures.length" style="flex: 0 0 100%" mt-5 flex flex-col gap-4>
    <div v-for="(signature, index) of signatures" :key="index">
      <div mb-2 font-bold>
        Signature {{ index + 1 }} certificates :
      </div>

      <pdf-signature-details :signature="signature" />
    </div>
  </div>
</template>
