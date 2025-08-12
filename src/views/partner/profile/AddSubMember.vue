<template>
  <Dialog :open="true" @update:open="handleClose">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <BaseDialogContent
        class="p-0 bg-transparent fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] xl:translate-y-[-50%] duration-200 w-[95vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-[90vh]"
      >
        <!-- Modal Wrapper -->
        <div
          class="w-full h-full bg-[#07102e]/5 backdrop-blur-md border border-white/50 rounded-lg flex flex-col overflow-hidden"
        >
          <!-- Modal Header with gradient -->
          <div
            class="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 flex-shrink-0 relative"
          >
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="px-2 py-1.5 sm:px-3 sm:py-2 bg-green-500/20 rounded-lg">
                <i class="fas fa-user-plus text-green-400 text-xs sm:text-sm"></i>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-white">
                  {{ t("partner.tab.addSubMember") }}
                </h2>
                <p class="text-xs text-gray-400">Create new sub member</p>
              </div>
            </div>

            <!-- Custom Close Button -->
            <button
              type="button"
              @click="handleClose"
              class="custom-close-button absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
            >
              <X
                class="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
              />
            </button>
          </div>

          <!-- Scrollable Form Content -->
          <div
            class="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            style="max-height: calc(90vh - 80px)"
          >
            <!-- Add Member Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
              <!-- User Type Selection -->
              <div class="space-y-2 sm:space-y-3">
                <div class="flex items-center space-x-2">
                  <Users class="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <label class="text-white font-medium text-sm sm:text-base">{{
                    t("partner.type")
                  }}</label>
                </div>
                <div
                  class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <label
                    v-for="type in userTypes"
                    :key="String(type.value)"
                    class="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      :value="type.value"
                      v-model="form.isshop"
                      class="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                    />
                    <span class="text-white text-sm sm:text-base">{{ type.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Basic Information Section -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <!-- Username -->
                <div class="space-y-1.5 sm:space-y-2">
                  <div class="flex items-center space-x-2">
                    <User class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <label class="text-white font-medium text-sm sm:text-base">{{
                      t("register.username")
                    }}</label>
                  </div>
                  <Input
                    v-model="form.username"
                    type="text"
                    :placeholder="t('register.usernamePlaceholder')"
                    :class="{ 'border-red-500': errors.username }"
                    class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
                  />
                  <p v-if="errors.username" class="text-red-400 text-xs sm:text-sm">
                    {{ errors.username }}
                  </p>
                </div>

                <!-- Nickname -->
                <div class="space-y-1.5 sm:space-y-2">
                  <div class="flex items-center space-x-2">
                    <UserCheck class="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    <label class="text-white font-medium text-sm sm:text-base">{{
                      t("register.name")
                    }}</label>
                  </div>
                  <Input
                    v-model="form.nickname"
                    type="text"
                    :placeholder="t('register.namePlaceholder')"
                    :class="{ 'border-red-500': errors.nickname }"
                    class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
                  />
                  <p v-if="errors.nickname" class="text-red-400 text-xs sm:text-sm">
                    {{ errors.nickname }}
                  </p>
                </div>

                <!-- Password -->
                <div class="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                  <div class="flex items-center space-x-2">
                    <Lock class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <label class="text-white font-medium text-sm sm:text-base">{{
                      t("register.password")
                    }}</label>
                  </div>
                  <div class="relative">
                    <Input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      :placeholder="t('register.passwordPlaceholder')"
                      :class="{ 'border-red-500': errors.password }"
                      class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 pr-12 text-sm sm:text-base h-9 sm:h-10"
                    />
                    <button
                      type="button"
                      @click="togglePassword"
                      class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                    >
                      <EyeOff v-if="showPassword" class="w-4 h-4 sm:w-5 sm:h-5" />
                      <Eye v-else class="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <p v-if="errors.password" class="text-red-400 text-xs sm:text-sm">
                    {{ errors.password }}
                  </p>
                </div>
              </div>

              <!-- Member Information (shown when not shop member) -->
              <div v-if="!form.isshop" class="space-y-3 sm:space-y-4">
                <h3
                  class="text-base sm:text-lg font-semibold text-white border-b border-white/10 pb-2"
                >
                  {{ t("register.accountInformation") }}
                </h3>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                  <!-- Phone -->
                  <div class="space-y-1.5 sm:space-y-2">
                    <div class="flex items-center space-x-2">
                      <Phone class="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <label class="text-white font-medium text-sm sm:text-base">{{
                        t("register.mobileNumber")
                      }}</label>
                    </div>
                    <Input
                      v-model="form.telno"
                      type="text"
                      :placeholder="t('register.mobileNumberPlaceholder')"
                      :class="{ 'border-red-500': errors.telno }"
                      class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
                    />
                    <p v-if="errors.telno" class="text-red-400 text-xs sm:text-sm">
                      {{ errors.telno }}
                    </p>
                  </div>

                  <!-- Bank Name -->
                  <div class="space-y-1.5 sm:space-y-2">
                    <div class="flex items-center space-x-2">
                      <Building class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <label class="text-white font-medium text-sm sm:text-base">{{
                        t("register.bankName")
                      }}</label>
                    </div>
                    <select
                      v-model="form.bank_name"
                      :class="{ 'border-red-500': errors.bank_name }"
                      class="w-full bg-white/10 border border-white/20 rounded-lg text-white px-2 sm:px-3 py-1.5 sm:py-2 focus:border-blue-500 focus:outline-none text-sm sm:text-base h-9 sm:h-10"
                    >
                      <option
                        v-for="bank in banks"
                        :key="bank"
                        :value="bank"
                        class="bg-gray-800 text-white"
                      >
                        {{ bank }}
                      </option>
                    </select>
                    <p v-if="errors.bank_name" class="text-red-400 text-xs sm:text-sm">
                      {{ errors.bank_name }}
                    </p>
                  </div>

                  <!-- Bank Account Name -->
                  <div class="space-y-1.5 sm:space-y-2">
                    <div class="flex items-center space-x-2">
                      <UserCheck class="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <label class="text-white font-medium text-sm sm:text-base">{{
                        t("register.bankAccountName")
                      }}</label>
                    </div>
                    <Input
                      v-model="form.bank_account_name"
                      type="text"
                      :placeholder="t('register.bankAccountNamePlaceholder')"
                      :class="{ 'border-red-500': errors.bank_account_name }"
                      class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
                    />
                    <p
                      v-if="errors.bank_account_name"
                      class="text-red-400 text-xs sm:text-sm"
                    >
                      {{ errors.bank_account_name }}
                    </p>
                  </div>

                  <!-- Bank Account -->
                  <!-- <div class="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                <div class="flex items-center space-x-2">
                  <CreditCard class="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  <label class="text-white font-medium text-sm sm:text-base">{{ t("register.bankAccount") }}</label>
                </div>
                <Input
                  v-model="form.bank_account"
                  type="text"
                  :placeholder="t('register.bankAccountPlaceholder')"
                  :class="{ 'border-red-500': errors.bank_account }"
                  class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
                />
                <p v-if="errors.bank_account" class="text-red-400 text-xs sm:text-sm">{{ errors.bank_account }}</p>
              </div> -->
                </div>
              </div>

              <!-- Commission Settings -->
              <div class="space-y-3 sm:space-y-4">
                <h3
                  class="text-base sm:text-lg font-semibold text-white border-b border-white/10 pb-2"
                >
                  {{ t("commission.settings") }}
                </h3>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                  <!-- Rolling Type -->
                  <div class="space-y-1.5 sm:space-y-2">
                    <div class="flex items-center space-x-2">
                      <Settings class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                      <label class="text-white font-medium text-sm sm:text-base">{{
                        t("commission.typeRolling")
                      }}</label>
                    </div>
                    <select
                      v-model="form.type_rolling"
                      disabled
                      class="w-full bg-white/5 border border-white/10 rounded-lg text-gray-400 px-2 sm:px-3 py-1.5 sm:py-2 cursor-not-allowed text-sm sm:text-base h-9 sm:h-10"
                    >
                      <option
                        v-for="type in rollingTypes"
                        :key="type.value"
                        :value="type.value"
                        class="bg-gray-800"
                      >
                        {{ type.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Casino Rolling -->
                  <div class="space-y-1.5 sm:space-y-2">
                    <div class="flex items-center space-x-2">
                      <Dices class="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      <label class="text-white font-medium text-sm sm:text-base">{{
                        t("commission.casinoRollingPercent")
                      }}</label>
                    </div>
                    <Input
                      v-model="form.pct_roll_casino"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      :class="{ 'border-red-500': errors.pct_roll_casino }"
                      class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
                    />
                    <p
                      v-if="errors.pct_roll_casino"
                      class="text-red-400 text-xs sm:text-sm"
                    >
                      {{ errors.pct_roll_casino }}
                    </p>
                  </div>

                  <!-- Slot Rolling -->
                  <div class="space-y-1.5 sm:space-y-2">
                    <div class="flex items-center space-x-2">
                      <Gamepad2 class="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <label class="text-white font-medium text-sm sm:text-base">{{
                        t("commission.slotRollingPercent")
                      }}</label>
                    </div>
                    <Input
                      v-model="form.pct_roll_slot"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      :class="{ 'border-red-500': errors.pct_roll_slot }"
                      class="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
                    />
                    <p
                      v-if="errors.pct_roll_slot"
                      class="text-red-400 text-xs sm:text-sm"
                    >
                      {{ errors.pct_roll_slot }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Test Content to Force Scrolling -->
              <!-- <div class="space-y-4 py-8">
                <div
                  class="h-20 bg-blue-500/20 rounded-lg flex items-center justify-center"
                >
                  <span class="text-blue-400 font-medium">Test Content 1</span>
                </div>
                <div
                  class="h-20 bg-green-500/20 rounded-lg flex items-center justify-center"
                >
                  <span class="text-green-400 font-medium">Test Content 2</span>
                </div>
                <div
                  class="h-20 bg-purple-500/20 rounded-lg flex items-center justify-center"
                >
                  <span class="text-purple-400 font-medium">Test Content 3</span>
                </div>
                <div
                  class="h-20 bg-orange-500/20 rounded-lg flex items-center justify-center"
                >
                  <span class="text-orange-400 font-medium">Test Content 4</span>
                </div>
              </div> -->

              <!-- Form Actions -->
              <div
                class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10"
              >
                <button
                  type="button"
                  @click="handleClose"
                  class="px-4 sm:px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-200 border border-white/20 text-sm sm:text-base"
                >
                  {{ t("changePassword.cancel") }}
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-1 sm:mr-2"></i>
                  <i v-else class="fas fa-user-plus mr-1 sm:mr-2"></i>
                  {{ t("partner.tab.addSubMember") }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </BaseDialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { z } from "zod";
import Swal from "sweetalert2";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent as BaseDialogContent, DialogPortal, DialogOverlay } from "reka-ui";
import { Input } from "@/components/ui/input";
import {
  User,
  Users,
  UserCheck,
  Lock,
  Phone,
  Building,
  CreditCard,
  Settings,
  Dices,
  Gamepad2,
  Eye,
  EyeOff,
  X,
} from "lucide-vue-next";
import ApiService from "@/services/ApiService";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";

// Emits
const emit = defineEmits<{
  close: [];
  refresh: [];
}>();

// Composables
const { t } = useI18n();
const authStore = useAuthStore();
const appStore = useAppStore();

// Form state
const isSubmitting = ref(false);
const showPassword = ref(false);

const form = reactive({
  username: "",
  nickname: "",
  password: "",
  telno: "",
  bank_name: "KB국민은행",
  bank_account_name: "",
  bank_account: "",
  pct_roll_casino: 0,
  pct_roll_slot: 0,
  type_rolling: 1,
  isshop: false,
});

const errors = reactive<Record<string, string>>({});

// Options
const userTypes = [
  { value: false, label: t("partner.normalMember") },
  { value: true, label: t("partner.shopMember") },
];

const banks = [
  "KB국민은행",
  "신한은행",
  "우리은행",
  "KEB하나은행",
  "카카오뱅크",
  "카카오증권",
  "KDB산업은행",
  "IBK기업은행",
  "NH농협은행",
  "수협은행",
  "대구은행",
  "BNK부산은행",
  "BNK경남은행",
  "광주은행",
  "전북은행",
  "제주은행",
  "농·축협",
  "농협",
  "축협",
  "새마을금고",
  "우체국",
  "신용협동조합",
  "산림조합",
  "HSBC은행",
  "한국씨티은행",
  "한국스탠다드차타드은행",
  "미래애셋",
  "SC제일은행",
];

const rollingTypes = [
  { value: 4, label: t("partner.rollingType.4") },
  { value: 2, label: t("partner.rollingType.2") },
  { value: 1, label: t("partner.rollingType.1") },
];

// Master settlement data
const masterSettlement = ref({
  type_roll: 1,
  type_lose: 0,
  pct_roll_casino: 0,
  pct_roll_slot: 0,
  pct_lose_casino: 0,
  pct_lose_slot: 0,
});

// Validation schema based on RegisterPage patterns
const validationSchema = computed(() => {
  const baseSchema = {
    username: z
      .string()
      .min(1, t("register.errors.usernameRequired"))
      .min(3, t("register.errors.usernameMinLength"))
      .max(7, t("register.errors.usernameMaxLength"))
      .regex(/^[a-z0-9]+$/i, t("register.errors.usernameFormat")),
    nickname: z
      .string()
      .min(1, t("register.errors.nameRequired"))
      .min(2, t("register.errors.nameMinLength"))
      .max(7, t("register.errors.nameMaxLength")),
    password: z
      .string()
      .min(1, t("register.errors.passwordRequired"))
      .min(5, "Password must be at least 5 characters"),
    pct_roll_casino: z
      .number()
      .min(0, t("Partner.Validation.Required"))
      .max(100, "Maximum 100%"),
    pct_roll_slot: z
      .number()
      .min(0, t("Partner.Validation.Required"))
      .max(100, "Maximum 100%"),
  };

  if (!form.isshop) {
    return z.object({
      ...baseSchema,
      telno: z
        .string()
        .min(1, t("register.errors.mobileNumberRequired"))
        .min(8, t("register.errors.mobileNumberMinLength"))
        .max(12, t("register.errors.mobileNumberMaxLength"))
        .regex(/^[0-9]+$/, t("register.errors.mobileNumberFormat")),
      bank_name: z.string().min(1, t("register.errors.bankNameRequired")),
      bank_account_name: z
        .string()
        .min(1, t("register.errors.bankAccountNameRequired")),
      bank_account: z
        .string()
        .min(1, t("register.errors.bankAccountRequired"))
        .min(10, t("register.errors.bankAccountMinLength"))
        .regex(/^[0-9]+$/, t("register.errors.bankAccountFormat")),
    });
  }

  return z.object(baseSchema);
});

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Get master settlement data
const getMasterSettlementTypes = async () => {
  if (authStore.user.id) {
    try {
      const response = await ApiService.get(
        `/partner/member/settlement-type/${authStore.user.id}`
      );
      masterSettlement.value = response.data;
      form.type_rolling = masterSettlement.value.type_roll;
      form.pct_roll_casino = masterSettlement.value.pct_roll_casino;
      form.pct_roll_slot = masterSettlement.value.pct_roll_slot;
    } catch (error) {
      console.error("Error fetching master settlement:", error);
    }
  }
};

// Validation based on RegisterPage pattern
const validateForm = (): boolean => {
  try {
    validationSchema.value.parse({
      username: form.username,
      nickname: form.nickname,
      password: form.password,
      telno: form.telno,
      bank_name: form.bank_name,
      bank_account_name: form.bank_account_name,
      bank_account: form.bank_account,
      pct_roll_casino: Number(form.pct_roll_casino),
      pct_roll_slot: Number(form.pct_roll_slot),
    });

    // Clear all errors
    Object.keys(errors).forEach((key) => {
      delete errors[key];
    });
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
    }
    return false;
  }
};

// For shop members, use empty/default values since they don't need real bank info
const getShopMemberDefaults = () => ({
  mobile: "",
  bank_name: "KB국민은행",
  bank_account_name: "",
  bank_account: "",
});

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const payload = {
      upper_id: authStore.user.id,
      username: form.username,
      password: form.password,
      name: form.nickname,
      mobile: form.isshop
        ? Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join("")
        : form.telno,
      bank_name: form.isshop ? "카카오방크" : form.bank_name,
      bank_account_name: form.isshop
        ? Math.random().toString(36).substring(2, 9)
        : form.bank_account_name,
      bank_account: form.isshop
        ? Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join("")
        : form.bank_account,
      pct_roll_casino: Number(form.pct_roll_casino),
      pct_roll_slot: Number(form.pct_roll_slot),
      pct_lose_casino: 0,
      pct_lose_slot: 0,
      isshop: form.isshop,
    };

    await ApiService.post("/partner/sub", payload);

    await Swal.fire({
      title: t("Partner.Tab.AddSubMember"),
      text: t("Partner.AddSubSuccess"),
      icon: "success",
      confirmButtonText: "OK",
    });

    emit("refresh");
    handleClose();
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Unknown error occurred";
    await Swal.fire({
      title: t("partner.tab.addSubMember"),
      text: t("partner." + errorMessage),
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Close modal
const handleClose = (): void => {
  appStore.openModal("");
};

// Initialize
onMounted(() => {
  getMasterSettlementTypes();
});
</script>

<style scoped>
/* Custom scrollbar styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Ensure the modal content is properly scrollable */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

/* Force scrollbar to show when content overflows */
.overflow-y-auto::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

/* Force scrollbar to always show */
.overflow-y-auto {
  overflow-y: scroll !important;
}

/* Ensure content area has proper height */
.scrollable-content {
  height: 100%;
  overflow-y: auto;
}
</style>
