<template>
  <div class="puck-richtext">
    <PuckRichTextMenu v-if="editor" :editor="editor" />
    <EditorContent :editor="editor" class="puck-richtext__content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false }),
  ],
  onUpdate: ({ editor: ed }) => {
    emit('update:modelValue', ed.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val || '', false as any)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.puck-richtext { border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; }
.puck-richtext__content { padding: 8px 12px; min-height: 120px; font-size: 14px; color: #1f2937; }
.puck-richtext__content :deep(.tiptap) { outline: none; min-height: 100px; }
.puck-richtext__content :deep(.tiptap p) { margin: 0 0 0.5em; }
.puck-richtext__content :deep(.tiptap h1) { font-size: 1.5rem; margin: 0 0 0.5em; }
.puck-richtext__content :deep(.tiptap h2) { font-size: 1.25rem; margin: 0 0 0.5em; }
.puck-richtext__content :deep(.tiptap h3) { font-size: 1.1rem; margin: 0 0 0.5em; }
.puck-richtext__content :deep(.tiptap ul, .tiptap ol) { padding-left: 1.5em; }
.puck-richtext__content :deep(.tiptap blockquote) { border-left: 3px solid #e5e7eb; padding-left: 1em; color: #6b7280; }
.puck-richtext__content :deep(.tiptap code) { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-size: 0.9em; }
.puck-richtext__content :deep(.tiptap pre) { background: #1f2937; color: #e5e7eb; padding: 12px; border-radius: 6px; overflow-x: auto; }
</style>
