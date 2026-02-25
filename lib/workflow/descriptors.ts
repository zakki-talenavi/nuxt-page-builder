/**
 * Node type descriptors for palette and default config.
 * Icon: PrimeIcons class name (e.g. pi-send) or simple name for mapping.
 */
import type { NodeTypeDescriptor } from '~~/types/workflow'

export const NODE_TYPE_DESCRIPTORS: NodeTypeDescriptor[] = [
  // Triggers
  {
    type: 'form_submitted',
    category: 'trigger',
    label: 'Form submitted',
    description: 'Form submission trigger',
    icon: 'pi-file',
    defaultConfig: { formId: '' },
  },
  {
    type: 'schedule_cron',
    category: 'trigger',
    label: 'Schedule (cron)',
    description: 'Run on schedule',
    icon: 'pi-clock',
    defaultConfig: { cron: '0 9 * * *' },
  },
  {
    type: 'webhook_received',
    category: 'trigger',
    label: 'Webhook',
    description: 'Incoming webhook',
    icon: 'pi-link',
    defaultConfig: {},
  },
  {
    type: 'manual_trigger',
    category: 'trigger',
    label: 'Manual',
    description: 'Manual trigger',
    icon: 'pi-play',
    defaultConfig: {},
  },
  // Conditions
  {
    type: 'if_else',
    category: 'condition',
    label: 'If / Else',
    description: 'Branch by condition',
    icon: 'pi-branch',
    branches: ['true', 'false'],
    defaultConfig: { field: 'payload.priority', operator: 'eq', value: '' },
  },
  {
    type: 'switch',
    category: 'condition',
    label: 'Switch',
    description: 'Branch by value',
    icon: 'pi-sitemap',
    branches: ['default'],
    defaultConfig: { field: '', cases: {} },
  },
  {
    type: 'filter_group',
    category: 'condition',
    label: 'Filter group',
    description: 'AND/OR conditions',
    icon: 'pi-filter',
    defaultConfig: { mode: 'and', conditions: [] },
  },
  // Actions
  {
    type: 'send_webhook',
    category: 'action',
    label: 'Send webhook',
    description: 'HTTP request',
    icon: 'pi-send',
    defaultConfig: { url: '', method: 'POST', headers: {}, body: '{}' },
  },
  {
    type: 'approve_or_reject',
    category: 'action',
    label: 'Approval',
    description: 'Approve or reject',
    icon: 'pi-users',
    defaultConfig: {
      requestBy: 'email',
      approvers: [''],
      options: [
        { id: 'approve', label: 'Approve', color: '#16a34a' },
        { id: 'reject', label: 'Reject', color: '#dc2626' },
        { id: 'revise', label: 'Revise', color: '#eab308' },
      ],
      approverInputs: [],
      notificationSubject: '[Action required] Approve submission',
      notificationBody: '',
    },
  },
  {
    type: 'send_email',
    category: 'action',
    label: 'Send email',
    description: 'Send customizable email',
    icon: 'pi-envelope',
    defaultConfig: { to: '', subject: '', body: '' },
  },
  {
    type: 'save_to_database',
    category: 'action',
    label: 'Save to DB',
    description: 'Persist data',
    icon: 'pi-database',
    defaultConfig: { table: '', mapping: {} },
  },
  {
    type: 'delay',
    category: 'action',
    label: 'Delay',
    description: 'Wait before next step',
    icon: 'pi-pause',
    defaultConfig: { delayMs: 60000 },
  },
  {
    type: 'queue_job',
    category: 'action',
    label: 'Queue job',
    description: 'Enqueue job',
    icon: 'pi-list',
    defaultConfig: { queue: '', payload: {} },
  },
]

const byType = new Map<string, NodeTypeDescriptor>()
NODE_TYPE_DESCRIPTORS.forEach((d) => byType.set(d.type, d))

export function getNodeDescriptor(type: string): NodeTypeDescriptor | undefined {
  return byType.get(type)
}

export function getDescriptorsByCategory(
  category: NodeTypeDescriptor['category']
): NodeTypeDescriptor[] {
  return NODE_TYPE_DESCRIPTORS.filter((d) => d.category === category)
}
