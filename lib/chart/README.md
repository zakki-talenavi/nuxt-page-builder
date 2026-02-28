# Chart — engine-agnostic layer

## Flow

```
ChartSchema (JSON) → Adapter (transform) → Engine (Chart.js)
```

Stored schema never references a library; switching engine = change adapter/engine only.

## File structure

```
types/puck/chart.ts          # ChartSchema, ChartBlockProps, ChartEngineId
lib/chart/
  constants.ts               # DEFAULT_CHART_COLORS, getColorAt
  adapters/
    types.ts                 # BaseChartAdapter interface
    chartjs-adapter.ts       # ChartJsAdapter
    index.ts                 # getChartAdapter(engineId)
composables/
  useChartData.ts            # dataSource + mapping → labels, datasets
  useChartSchema.ts          # block props → ChartSchema
components/
  chart/ChartRenderer.vue    # ClientOnly, lazy load engine, adapter.transform(schema)
components/puck/blocks/
  ChartBlock.vue             # useChartSchema → ChartRenderer
app/config/blocks/
  chart.ts                   # Block config (dataSource, mapping, options)
```

## Validation

- Schema: `type` in ['line','bar','pie','doughnut']; `data.labels` and `data.series[].values` same length for cartesian; pie/doughnut usually one series. Add Zod/Valideer in `lib/chart/validate.ts` if needed.
- Builder still uses DataSource + Mapping; runtime schema is built from that (useChartSchema).

## Bundle & performance

- **Lazy load:** Chart.js is loaded only when ChartRenderer mounts (dynamic `import('chart.js')`). No chart lib in main bundle.
- **SSR:** ChartRenderer is wrapped in `<ClientOnly>`; no chart code runs on server.
- **Large data:** Adapters receive schema as-is; for very large series consider downsampling in useChartData or a dedicated composable before building schema.
- **Future plugin:** Register adapters in `lib/chart/adapters/index.ts`; add `engineId` to block props so builder can choose engine per chart.
