import { markRaw } from 'vue'
import ChartBlockVue from '~~/components/puck/blocks/ChartBlock.vue'

export const chartComponents = {
  Chart: {
    label: 'Chart',
    defaultProps: {
      chartType: 'line',
      title: '',
      dataSource: {
        mode: 'static',
        url: '',
        method: 'GET',
        staticData: [
          { label: 'Jan', value: 12 },
          { label: 'Feb', value: 19 },
          { label: 'Mar', value: 8 },
          { label: 'Apr', value: 15 },
          { label: 'May', value: 22 },
        ],
      },
      mapping: {
        labelField: 'label',
        valueField: 'value',
      },
      options: {
        legendPosition: 'top',
        height: 300,
        fillArea: false,
        horizontal: false,
        stacked: false,
      },
    },
    fields: {
      chartType: {
        type: 'select',
        label: 'Chart type',
        options: [
          { label: 'Line', value: 'line' },
          { label: 'Bar', value: 'bar' },
          { label: 'Pie', value: 'pie' },
          { label: 'Doughnut', value: 'doughnut' },
        ],
      },
      title: { type: 'text', label: 'Title' },
      dataSource: {
        type: 'object',
        label: 'Data source',
        objectFields: {
          mode: {
            type: 'radio',
            label: 'Mode',
            options: [
              { label: 'Static', value: 'static' },
              { label: 'API', value: 'api' },
            ],
          },
          url: { type: 'text', label: 'API URL', description: 'Used when mode is API' },
          method: {
            type: 'select',
            label: 'Method',
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
            ],
          },
          staticData: {
            type: 'array',
            label: 'Static data',
            description: 'Used when mode is Static. Each item should have label and value (or use mapping).',
            arrayFields: {
              label: { type: 'text', label: 'Label' },
              value: { type: 'number', label: 'Value' },
            },
            defaultItemProps: { label: '', value: 0 },
          },
        },
      },
      mapping: {
        type: 'object',
        label: 'Field mapping',
        objectFields: {
          labelField: { type: 'text', label: 'Label field', description: 'Property name for labels (e.g. label, name)' },
          valueField: { type: 'text', label: 'Value field', description: 'Property name for values (e.g. value, count)' },
        },
      },
      options: {
        type: 'object',
        label: 'Tampilan',
        objectFields: {
          legendPosition: {
            type: 'select',
            label: 'Posisi legend',
            options: [
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' },
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
            ],
          },
          height: { type: 'number', label: 'Tinggi (px)', min: 100, max: 800 },
          // Varian Line: area di bawah garis, stepped nanti
          fillArea: {
            type: 'radio',
            label: 'Area (Line)',
            description: 'Isi area di bawah garis (hanya Line)',
            options: [
              { label: 'Tidak', value: false },
              { label: 'Ya', value: true },
            ],
          },
          // Varian Bar: horizontal vs vertikal
          horizontal: {
            type: 'radio',
            label: 'Orientasi (Bar)',
            description: 'Bar horizontal atau vertikal',
            options: [
              { label: 'Vertikal', value: false },
              { label: 'Horizontal', value: true },
            ],
          },
          // Stacked: line dan bar
          stacked: {
            type: 'radio',
            label: 'Stacked',
            description: 'Tumpuk beberapa series (Line/Bar)',
            options: [
              { label: 'Tidak', value: false },
              { label: 'Ya', value: true },
            ],
          },
        },
      },
    },
    render: markRaw(ChartBlockVue),
  },
} as const
