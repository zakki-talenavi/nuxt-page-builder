<template>
  <div class="puck-richtext-menu">
    <button
      v-for="btn in buttons"
      :key="btn.name"
      class="puck-richtext-menu__btn"
      :class="{ active: btn.isActive?.() }"
      :title="btn.title"
      @click="btn.action"
    >
      <span v-html="btn.icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor }>()

const buttons = computed(() => {
  const ed = props.editor
  if (!ed) return []
  return [
    { name: 'bold', title: 'Bold', icon: '<b>B</b>', isActive: () => ed.isActive('bold'), action: () => ed.chain().focus().toggleBold().run() },
    { name: 'italic', title: 'Italic', icon: '<i>I</i>', isActive: () => ed.isActive('italic'), action: () => ed.chain().focus().toggleItalic().run() },
    { name: 'underline', title: 'Underline', icon: '<u>U</u>', isActive: () => ed.isActive('underline'), action: () => ed.chain().focus().toggleUnderline().run() },
    { name: 'strike', title: 'Strikethrough', icon: '<s>S</s>', isActive: () => ed.isActive('strike'), action: () => ed.chain().focus().toggleStrike().run() },
    { name: 'sep1', title: '', icon: '|', action: () => {} },
    { name: 'h1', title: 'Heading 1', icon: 'H1', isActive: () => ed.isActive('heading', { level: 1 }), action: () => ed.chain().focus().toggleHeading({ level: 1 }).run() },
    { name: 'h2', title: 'Heading 2', icon: 'H2', isActive: () => ed.isActive('heading', { level: 2 }), action: () => ed.chain().focus().toggleHeading({ level: 2 }).run() },
    { name: 'h3', title: 'Heading 3', icon: 'H3', isActive: () => ed.isActive('heading', { level: 3 }), action: () => ed.chain().focus().toggleHeading({ level: 3 }).run() },
    { name: 'sep2', title: '', icon: '|', action: () => {} },
    { name: 'bulletList', title: 'Bullet List', icon: '&bull;', isActive: () => ed.isActive('bulletList'), action: () => ed.chain().focus().toggleBulletList().run() },
    { name: 'orderedList', title: 'Ordered List', icon: '1.', isActive: () => ed.isActive('orderedList'), action: () => ed.chain().focus().toggleOrderedList().run() },
    { name: 'blockquote', title: 'Blockquote', icon: '&ldquo;', isActive: () => ed.isActive('blockquote'), action: () => ed.chain().focus().toggleBlockquote().run() },
    { name: 'code', title: 'Code', icon: '&lt;/&gt;', isActive: () => ed.isActive('code'), action: () => ed.chain().focus().toggleCode().run() },
  ]
})
</script>

<style scoped>
.puck-richtext-menu {
  display: flex; flex-wrap: wrap; gap: 1px; padding: 4px;
  border-bottom: 1px solid #e5e7eb; background: #f9fafb;
}
.puck-richtext-menu__btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 28px; height: 28px; padding: 0 4px; border: none;
  background: transparent; cursor: pointer; border-radius: 4px;
  font-size: 12px; font-weight: 600; color: #6b7280; transition: all 0.1s;
}
.puck-richtext-menu__btn:hover { background: #e5e7eb; color: #1f2937; }
.puck-richtext-menu__btn.active { background: #6366f1; color: #fff; }
</style>
