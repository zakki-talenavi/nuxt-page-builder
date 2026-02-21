<template>
  <div class="puck-breadcrumb-block">
    <Breadcrumb
      :home="homeItem"
      :model="breadcrumbItems"
    >
      <template #item="{ item }">
        <a
          v-if="item.url"
          :href="item.url"
          class="puck-breadcrumb-block__link"
        >
          <span v-if="item.icon" :class="['puck-breadcrumb-block__icon', item.icon]" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </a>
        <span v-else class="puck-breadcrumb-block__current">
          <span v-if="item.icon" :class="['puck-breadcrumb-block__icon', item.icon]" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </span>
      </template>
    </Breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Breadcrumb from 'primevue/breadcrumb'

const props = withDefaults(
  defineProps<{
    showHome?: boolean
    homeIcon?: string
    homeLabel?: string
    homeUrl?: string
    items?: { label: string; url: string; icon?: string }[]
  }>(),
  {
    showHome: true,
    homeIcon: 'pi pi-home',
    homeLabel: 'Home',
    homeUrl: '/',
    items: () => [],
  }
)

const homeItem = computed(() => {
  if (!props.showHome) return undefined
  return {
    icon: props.homeIcon || 'pi pi-home',
    label: props.homeLabel || 'Home',
    url: props.homeUrl || '/',
  }
})

const breadcrumbItems = computed(() =>
  (props.items || []).map((item) => ({
    label: item?.label || 'Item',
    url: item?.url || '#',
    icon: item?.icon || '',
  }))
)
</script>

<style scoped>
.puck-breadcrumb-block {
  padding: 8px 0;
  color: var(--puck-color-text, #1f2937);
  background: var(--puck-color-bg, #fff);
  border-radius: 6px;
}
.puck-breadcrumb-block__link,
.puck-breadcrumb-block__current {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--puck-color-text, #1f2937);
  text-decoration: none;
  transition: color 0.15s;
  line-height: 1;
  vertical-align: middle;
}
.puck-breadcrumb-block__link:hover {
  color: var(--puck-color-primary, #6366f1);
}
.puck-breadcrumb-block__current {
  color: var(--puck-color-text-muted, #6b7280);
  font-weight: 500;
}
.puck-breadcrumb-block__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  line-height: 1;
  color: inherit;
}
/* Supaya wrapper PrimeVue ikut sejajar */
:deep(.p-breadcrumb-home .p-link),
:deep(.p-breadcrumb-item .p-link),
:deep(.p-breadcrumb-home a),
:deep(.p-breadcrumb-item a) {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px;
  line-height: 1;
}
/* PrimeVue Breadcrumb: paksa background terang & teks gelap (tema Aura pakai warna gelap) */
:deep(.p-breadcrumb),
:deep(.p-breadcrumb-list),
:deep(.p-breadcrumb-item),
:deep(.p-breadcrumb-chevron),
:deep(.p-breadcrumb-home),
:deep(.p-breadcrumb-home .p-link),
:deep([class*="breadcrumb"]) {
  background: var(--puck-color-bg, #fff) !important;
  color: var(--puck-color-text, #1f2937) !important;
  border-color: var(--puck-color-border, #e5e7eb) !important;
}
:deep(.p-breadcrumb-list),
:deep(.p-breadcrumb-item),
:deep(.p-breadcrumb-home) {
  background: transparent !important;
}
:deep(.p-breadcrumb-home .p-link:hover),
:deep(.p-breadcrumb-item .p-link:hover),
:deep(.p-breadcrumb-item a:hover),
:deep(.p-breadcrumb-home a:hover) {
  color: var(--puck-color-primary, #6366f1) !important;
  background: transparent !important;
}
:deep(.p-breadcrumb-chevron),
:deep([class*="chevron"]) {
  color: var(--puck-color-text-muted, #9ca3af) !important;
}
:deep(.p-breadcrumb-list) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}
:deep(a),
:deep(.p-link) {
  color: var(--puck-color-text, #1f2937) !important;
}
:deep(a:hover),
:deep(.p-link:hover) {
  color: var(--puck-color-primary, #6366f1) !important;
}
</style>
