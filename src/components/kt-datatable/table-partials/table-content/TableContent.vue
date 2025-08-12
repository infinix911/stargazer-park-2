<template>
  <div class="table-responsive w-100 relative">
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg z-20 flex items-center justify-center">
      <div class="text-center">
        <p class="text-white text-sm font-medium animate-pulse">{{ t('common.loading') }}</p>
      </div>
    </div>
    
    <table
      class="table text-white align-middle table-row-dashed fs-6 gy-5 dataTable no-footer w-100"
    >
      <TableHeadRow
        @onSort="onSort"
        @onSelect="selectAll"
        :checkboxEnabledValue="check"
        :checkboxEnabled="checkboxEnabled"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        :header="header"
        :isAccordion="isAccordion"
      />
      <TableBodyRow
        v-if="dataToDisplay.length !== 0"
        @onSelect="itemsSelect"
        :currentlySelectedItems="selectedItems"
        :data="dataToDisplay"
        :header="header"
        :checkbox-enabled="checkboxEnabled"
        :checkbox-label="checkboxLabel"
        :column-sum="columnSum"
        :custom-column-sum="customColumnSum"
        :isAccordion="isAccordion"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
          <slot :name="name" :row="item" />
        </template>
      </TableBodyRow>
      
      <!-- Skeleton Loading Rows -->
      <template v-else-if="loading">
        <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
          <td v-for="(col, colIndex) in header" :key="colIndex" class="py-4">
            <div class="flex items-center space-x-2">
              <div class="h-4 bg-white/20 rounded animate-pulse" :style="{ width: getSkeletonWidth(col) }"></div>
            </div>
          </td>
        </tr>
      </template>
      
      <template v-else>
        <tr class="odd">
          <td :colspan="header.length" class="dataTables_empty">
            {{ t("common.noDataFound") }}
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import TableHeadRow from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRow.vue";
import TableBodyRow from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRow.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import type { TableHeader } from "@/components/kt-datatable/types";
import { useI18n } from 'vue-i18n'


export default defineComponent({
  name: "table-body",
  props: {
    header: { type: Array as () => TableHeader[], required: true },
    data: { type: Array as () => any[], required: true },
    emptyTableText: { type: String, default: "No data found" },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    loading: { type: Boolean, required: false, default: false },
    columnSum: { type: Boolean, default: false },
    customColumnSum: { type: Boolean, default: false },
    isAccordion: { type: Boolean, default: false },
  },
  emits: ["on-sort", "on-items-select"],
  components: {
    TableHeadRow,
    TableBodyRow,
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const selectedItems = ref<Array<unknown>>([]);
    const allSelectedItems = ref<Array<unknown>>([]);
    const check = ref<boolean>(false);

    const dataToDisplay: any = ref(props.data);

    watch(
      () => props.data,
      () => {
        selectedItems.value = [];
        allSelectedItems.value = [];
        check.value = false;
        // eslint-disable-next-line
        props.data.forEach((item: any) => {
          if (item[props.checkboxLabel]) {
            allSelectedItems.value.push(item[props.checkboxLabel]);
          }
        });
        // set data
        dataToDisplay.value = props.data;
      }
    );

    // eslint-disable-next-line
    const selectAll = (checked: any) => {
      check.value = checked;
      if (checked) {
        selectedItems.value = [
          ...new Set([...selectedItems.value, ...allSelectedItems.value]),
        ];
      } else {
        selectedItems.value = [];
      }
    };

    //eslint-disable-next-line
    const itemsSelect = (value: any) => {
      selectedItems.value = [];
      //eslint-disable-next-line
      value.forEach((item:any) => {
        if (!selectedItems.value.includes(item)) selectedItems.value.push(item);
      });
    };

    const onSort = (sort: Sort) => {
      if (sort.order === "asc")
        dataToDisplay.value = dataToDisplay.value.sort((a: any, b: any) =>
          isNaN(a[sort.label ?? "id"])
            ? a[sort.label ?? "id"] > b[sort.label ?? "id"]
              ? 1
              : -1
            : Number(a[sort.label ?? "id"]) > Number(b[sort.label ?? "id"])
            ? 1
            : -1
        );
      else
        dataToDisplay.value = dataToDisplay.value.sort((a: any, b: any) =>
          isNaN(a[sort.label ?? "id"])
            ? a[sort.label ?? "id"] < b[sort.label ?? "id"]
              ? 1
              : -1
            : Number(a[sort.label ?? "id"]) < Number(b[sort.label ?? "id"])
            ? 1
            : -1
        );

      emit("on-sort", sort);
    };

    watch(
      () => [...selectedItems.value],
      (currentValue) => {
        if (currentValue) {
          emit("on-items-select", currentValue);
        }
      }
    );

    onMounted(() => {
      selectedItems.value = [];
      allSelectedItems.value = [];
      check.value = false;
      // eslint-disable-next-line
      props.data.forEach((item: any) => {
        if (item[props.checkboxLabel]) {
          allSelectedItems.value.push(item[props.checkboxLabel]);
        }
      });
    });

    const getSkeletonWidth = (col: any) => {
      // Generate different widths for different column types
      if (col.currency) return '80px';
      if (col.text) return '120px';
      if (col.customslot) return '100px';
      return '150px';
    };

    return {
      t,
      onSort,
      selectedItems,
      selectAll,
      itemsSelect,
      check,
      dataToDisplay,
      getSkeletonWidth,
    };
  },
});
</script>
