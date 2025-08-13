<template>
  <Dialog :open="isModalVisible" @update:open="handleClose">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
             <BaseDialogContent
         class="p-0 bg-transparent fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] duration-200 w-[95vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
       >
        <!-- Modal Wrapper -->
        <div
          class="w-full bg-[#07102e]/5 backdrop-blur-md border border-white/50 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg overflow-hidden"
        >
          <!-- Modal Header with gradient -->
          <div
            class="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 -mx-3 sm:-mx-4 md:-mx-6 -mt-3 sm:-mt-4 md:-mt-6 mb-3 sm:mb-4 md:mb-6 relative"
          >
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-500/20 rounded-lg">
                <i class="fas fa-wallet text-blue-400 text-xs sm:text-sm"></i>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-white">
                  {{ t(`partner.storeMoney${type}`) }}
                </h2>
                <p class="text-xs text-gray-400">
                  {{ type === "ADD" ? t("partner.add") : t("partner.subtract") }}
                  {{ t("partner.transaction") }}
                </p>
              </div>
            </div>

            <!-- Custom Close Button -->
            <button
              type="button"
              @click="handleClose"
              class="custom-close-button absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
            >
              <X class="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

                  <!-- Transaction Form -->
        <form @submit.prevent="handleSubmit" class="space-y-2 sm:space-y-3 md:space-y-4">
            <!-- Member Field -->
            <div class="space-y-1 sm:space-y-2">
              <div class="flex items-center space-x-2">
                <User class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <label class="text-white font-medium text-sm sm:text-base">{{
                  t("partnerMenu.member")
                }}</label>
              </div>
              <Input
                v-model="user.username"
                readonly
                class="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <!-- Store Member Field -->
            <div class="space-y-1 sm:space-y-2">
              <div class="flex items-center space-x-2">
                <Users class="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <label class="text-white font-medium text-sm sm:text-base">{{
                  t("partner.storeMember")
                }}</label>
              </div>
              <Input
                v-model="receiver.username"
                readonly
                class="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <!-- Balance Field -->
            <div class="space-y-1 sm:space-y-2">
              <div class="flex items-center space-x-2">
                <Wallet class="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <label class="text-white font-medium text-sm sm:text-base">{{
                  t("partner.shopMemberBalance")
                }}</label>
              </div>
              <Input
                v-model="balanceDisplay"
                readonly
                class="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <!-- Transaction Type Field -->
            <div class="space-y-1 sm:space-y-2">
              <div class="flex items-center space-x-2">
                <ArrowUpDown class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <label class="text-white font-medium text-sm sm:text-base">{{
                  t("partner.transaction")
                }}</label>
              </div>
              <Input
                v-model="transactionTypeDisplay"
                readonly
                class="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            <!-- Transaction Amount Field -->
            <div class="space-y-1 sm:space-y-2">
              <div class="flex items-center space-x-2">
                <DollarSign class="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                <label class="text-white font-medium text-sm sm:text-base">{{
                  t("partner.tranAmount")
                }}</label>
              </div>
              <Input
                v-model="form.amount"
                type="number"
                :placeholder="t('partner.shopTransferNotifAnyAmount')"
                :class="{ 'border-red-500': errors.amount }"
                class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base h-9 sm:h-10"
              />
              <p v-if="errors.amount" class="text-xs sm:text-sm text-red-400">{{ errors.amount }}</p>
            </div>

            <!-- Quick Amount Buttons -->
            <div class="space-y-2">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                <Button
                  v-for="amount in quickAmounts"
                  :key="amount.value"
                  type="button"
                  @click="setAmount(amount.value)"
                  variant="outline"
                  :class="
                    amount.value === 0
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 h-8 sm:h-9'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border-gray-600 hover:border-gray-500 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 shadow-lg h-8 sm:h-9'
                  "
                >
                  {{ t(amount.label) }}
                </Button>
              </div>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-medium py-2.5 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg h-10 sm:h-11 text-sm sm:text-base"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">{{ t("partner.processing") }}</span>
              <span v-else>{{
                type === "ADD" ? t("partner.add") : t("partner.subtract")
              }}</span>
            </Button>
          </form>
        </div>
      </BaseDialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { z } from "zod";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import ApiService from "@/services/ApiService";

// UI Components
import { Dialog } from "@/components/ui/dialog";
import { DialogContent as BaseDialogContent, DialogPortal, DialogOverlay } from "reka-ui";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button.vue";

// Icons
import { User, Users, Wallet, ArrowUpDown, DollarSign, X } from "lucide-vue-next";

const { t, n } = useI18n();
const authStore = useAuthStore();
const appStore = useAppStore();

// Props
interface Props {
  receiver: {
    id: string;
    username: string;
    wallet: string;
  };
  type: "ADD" | "DEDUCT";
}

const props = defineProps<Props>();
const emit = defineEmits<{
  refresh: [];
}>();

// Form validation schema
const transactionSchema = z.object({
  amount: z
    .number()
    .min(1, t("partner.shopTransferNotifAnyAmount"))
    .positive(t("partner.shopTransferNotifAnyAmount")),
});

type TransactionForm = z.infer<typeof transactionSchema>;

// Form data
const form = reactive<TransactionForm>({
  amount: 0,
});

// Quick amount options
const quickAmounts = [
  { value: 1000, label: "amounts.1K" },
  { value: 10000, label: "amounts.10K" },
  { value: 100000, label: "amounts.100K" },
  { value: 500000, label: "amounts.500K" },
  { value: 1000000, label: "amounts.1M" },
  { value: 0, label: "amounts.reset" },
];

// Form state
const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const isModalVisible = ref(true);

// Computed values
const user = computed(() => authStore.user);

// Display values for readonly inputs
const balanceDisplay = computed(() => {
  if (props.type === "ADD") {
    return n(Number(authStore.user?.wallet || 0));
  } else {
    return n(Number(props.receiver?.wallet || 0));
  }
});

const transactionTypeDisplay = computed(() => {
  return props.type === "ADD" ? t("partner.add") : t("partner.subtract");
});

// Set amount
const setAmount = (amt: number): void => {
  if (amt > 0) {
    form.amount = Number(form.amount) + Number(amt);
  } else {
    form.amount = 0;
  }
};

// Helper function to show SweetAlert with modal visibility management
const showSweetAlert = async (
  title: string,
  message: string,
  icon: "success" | "error" | "warning" | "info" = "info"
): Promise<void> => {
  // Hide the modal before showing SweetAlert
  isModalVisible.value = false;

  try {
    await Swal.fire(title, message, icon);
  } finally {
    // Show the modal again after SweetAlert closes
    isModalVisible.value = true;
  }
};

// Validate form
const validateForm = (): boolean => {
  try {
    transactionSchema.parse(form);
    Object.keys(errors).forEach((key) => {
      delete errors[key as keyof TransactionForm];
    });
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      zodError.issues.forEach((issue) => {
        const field = issue.path[0] as keyof TransactionForm;
        errors[field] = issue.message;
      });
    }
    return false;
  }
};

// Handle form submission
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  // Check wallet balance
  if (props.type === "ADD" && user.value.wallet < form.amount) {
    await showSweetAlert(
      t(`partner.storeMoney${props.type}`),
      t("notif.AMOUNT_GT_WALLET"),
      "error"
    );
    return;
  } else if (props.type === "DEDUCT" && Number(props.receiver.wallet) < form.amount) {
    await showSweetAlert(
      t(`partner.storeMoney${props.type}`),
      t("notif.AMOUNT_GT_WALLET"),
      "error"
    );
    return;
  }

  isSubmitting.value = true;

  try {
    await ApiService.post("/partner/shop/transaction", {
      type: props.type,
      receiver_id: props.receiver.id,
      amount: Number(form.amount),
    });

    await showSweetAlert(
      t(`partner.storeMoney${props.type}`),
      t("notif.StoreMoneySuccess"),
      "success"
    );

    // Close modal and refresh
    appStore.openModal("");
    emit("refresh");
  } catch (e: any) {
    await showSweetAlert(
      t(`partner.storeMoney${props.type}`),
      t(`notif.${e.response?.data?.message || "UnknownError"}`),
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Handle close
const handleClose = (): void => {
  // Close the popup window
  if (window.opener) {
    window.close();
  } else {
    // Fallback for modal usage
    appStore.openModal("");
  }
};
</script>
