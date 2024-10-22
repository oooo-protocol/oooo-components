<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './table'
import { valueUpdater } from 'oooo-components/lib/utils'
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  columns: Array<ColumnDef<TData, TValue>>
  data: TData[]
  loading?: boolean
}>()

const sorting = ref<SortingState>([])

const table = useVueTable({
  defaultColumn: {
    size: 0,
    minSize: 0
  },
  get data () { return props.data },
  get columns () { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => { valueUpdater(updaterOrValue, sorting) },
  state: {
    get sorting () { return sorting.value }
  }
})
</script>

<template>
  <Table class="border-separate border-spacing-y-[6px]">
    <TableHeader>
      <TableRow
        class="bg-none"
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <TableHead
          v-for="header in headerGroup.headers"
          :key="header.id"
          :width="header.getSize() !== 0 ? header.getSize() : undefined"
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody class="relative">
      <template v-if="table.getRowModel().rows?.length">
        <TableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :data-state="row.getIsSelected() ? 'selected' : undefined"
        >
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell
            :colspan="columns.length"
            class="h-24 text-center"
          >
            NO RESULTS.
          </TableCell>
        </TableRow>
      </template>
      <div
        class="absolute top-0 flex justify-center items-center w-full h-full bg-background/50"
        v-if="loading"
      >
        <Loader2 class="w-6 h-6 animate-spin" />
      </div>
    </TableBody>
  </Table>
</template>
