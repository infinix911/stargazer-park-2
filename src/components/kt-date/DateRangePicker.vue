<template>
  <!-- Date Range Picker -->
  <el-date-picker
    style="width: 100%"
    v-model="daterange"
    type="daterange"
    unlink-panels
    range-separator="~"
    :start-placeholder="t('dateRange.start')"
    :end-placeholder="t('dateRange.end')"
    :shortcuts="shortcuts"
    @change="onChange"
  >
  </el-date-picker>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";

export default defineComponent({
  name: "DateRangePicker",
  emits: ["changedate", "update:modelValue"],
  props: {
    initial: { type: String },
    modelValue: { type: Object, default: null }, // v-model support
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    // Initialize daterange based on props.modelValue or initial prop
    const getInitialDateRange = () => {
      if (props.modelValue) {
        return [
          moment(props.modelValue.start).toDate(),
          moment(props.modelValue.end).toDate(),
        ];
      }

      if (props.initial) {
        if (props.initial === "month") {
          return [
            moment().startOf("month").toDate(),
            moment().toDate(),
          ];
        } else if (props.initial == "week") {
          return [
            moment().subtract(7, "days").toDate(),
            moment().toDate(),
          ];
        } else if (props.initial === "monthyesterday") {
          if (Number(moment().format("D")) === 1) {
            return [
              moment()
                .subtract(1, "month")
                .startOf("month")
                .add(15, "day")
                .toDate(),
              moment().subtract(1, "day").toDate(),
            ];
          } else {
            return [
              moment().startOf("month").toDate(),
              moment().subtract(1, "day").toDate(),
            ];
          }
        }
      }

      return [new Date(), new Date()];
    };

    const daterange = ref(getInitialDateRange());
    const syncingFromProps = ref(false);

    // Watch for external changes to modelValue
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue) {
          syncingFromProps.value = true;
          daterange.value = [
            moment(newValue.start).toDate(),
            moment(newValue.end).toDate(),
          ];
          // Small timeout to ensure Element Plus internal state settles
          setTimeout(() => {
            syncingFromProps.value = false;
          }, 0);
        }
      },
      { deep: true }
    );

    const shortcuts = ref([
      {
        text: t("dateRange.today"),
        value: (() => {
          const end = new Date();
          const start = new Date();
          return [start, end];
        })(),
      },
      {
        text: t("dateRange.yesterday"),
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
          return [start, end];
        })(),
      },
      {
        text: t("dateRange.lastWeek"),
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end];
        })(),
      },
    ]);

    const emitSelectedDates = () => {
      const selectedDates = daterange.value;
      const start = moment(selectedDates[0]).format("YYYY-MM-DD");
      const end = moment(selectedDates[1]).format("YYYY-MM-DD");
      const dateRange = { start, end };

      emit("changedate", dateRange);
      emit("update:modelValue", dateRange); // Emit for v-model
    };

    const onChange = () => {
      if (syncingFromProps.value) return;
      emitSelectedDates();
    };

    return {
      t,
      daterange,
      shortcuts,
      emitSelectedDates,
      onChange,
    };
  },
});
</script>
<style>
.el-range-editor.el-input__wrapper {
  display: block;
}
</style>
