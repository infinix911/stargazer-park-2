// English translations
export default {
  header: {
    sports: 'Sports',
    casino: 'Casino',
    slots: 'Slots',
    holdem: 'Hold\'em',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    myLounge: 'My Lounge'
  },
  topBar: {
    login: 'Login',
    signup: 'Sign Up'
  },
  auth: {
    loginRequired: 'Login Required',
    loginRequiredMessage: 'Please log in to access this feature.',
    loginNow: 'Login Now'
  },
  login: {
    title: 'PRODTEST2',
    subtitle: 'Login Required',
    description: 'Please log in to access the selected service',
    username: 'Username',
    usernamePlaceholder: 'Enter username',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    captcha: 'Captcha',
    captchaPlaceholder: 'Enter captcha',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    noAccount: 'Don\'t have an account?',
    signupLink: 'Sign up',
    errors: {
      usernameRequired: 'Username is required',
      usernameMinLength: 'Username must be at least 3 characters',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      captchaRequired: 'Captcha is required',
      captchaIncorrect: 'Captcha is incorrect'
    },
    successTitle: 'Login Successful!',
    successMessage: 'Welcome back! You have been successfully logged in.',
    refreshCaptchaError: 'Failed to refresh captcha'
  },
  register: {
    title: 'Create an account',
    basicInformation: 'Basic Information',
    accountInformation: 'Account Information',
    username: 'Username',
    usernamePlaceholder: 'Enter username',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm Password',
    name: 'Name',
    namePlaceholder: 'Name',
    mobileNumber: 'Mobile Number',
    mobileNumberPlaceholder: 'Mobile Number',
    bankName: 'Bank Name',
    bankNamePlaceholder: 'Select Bank',
    bankAccountName: 'Bank Account Name',
    bankAccountNamePlaceholder: 'Bank Account Name',
    bankAccount: 'Bank Account',
    bankAccountPlaceholder: 'Bank Account',
    referralCode: 'Referral code',
    referralCodePlaceholder: 'Referral code',
    captcha: 'Captcha',
    captchaPlaceholder: 'Captcha',
    createAccountButton: 'Create Account',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    loginHere: 'Login here',
    errors: {
      usernameRequired: 'Username is required',
      usernameMinLength: 'Username must be at least 3 characters',
      usernameMaxLength: 'Username must be less than 20 characters',
      usernameFormat: 'Username can only contain letters, numbers, and underscores',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordFormat: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      confirmPasswordRequired: 'Please confirm your password',
      passwordsDontMatch: 'Passwords don\'t match',
      nameRequired: 'Name is required',
      nameMinLength: 'Name must be at least 2 characters',
      mobileNumberRequired: 'Mobile number is required',
      mobileNumberFormat: 'Please enter a valid mobile number',
      bankNameRequired: 'Please select a bank',
      bankAccountNameRequired: 'Bank account name is required',
      bankAccountRequired: 'Bank account number is required',
      bankAccountFormat: 'Please enter a valid bank account number',
      captchaRequired: 'Please solve the captcha',
      captchaIncorrect: 'Incorrect captcha answer'
    }
  },
  deposit: {
    title: 'Deposit Request',
    description: 'Please fill in your deposit information below to complete your deposit request.',
    name: 'Name',
    namePlaceholder: 'Name',
    bankAccountName: 'Bank Account Name',
    bankAccountNamePlaceholder: 'Bank Account Name',
    mobileNumber: 'Mobile Number',
    mobileNumberPlaceholder: 'Mobile Number',
    depositAmount: 'Deposit Amount',
    depositAmountPlaceholder: '0',
    reset: 'Reset',
    submit: 'Submit',
    submitting: 'Submitting...',
    errors: {
      nameRequired: 'Name is required',
      nameMinLength: 'Name must be at least 2 characters',
      bankAccountNameRequired: 'Bank account name is required',
      mobileNumberRequired: 'Mobile number is required',
      mobileNumberFormat: 'Please enter a valid mobile number',
      depositAmountRequired: 'Deposit amount is required',
      depositAmountPositive: 'Deposit amount must be greater than 0',
      depositAmountMinimum: 'Minimum deposit amount is 10,000'
    }
  },
  withdrawal: {
    title: 'Withdrawal Request',
    description: 'Please fill in your withdrawal information below to complete your withdrawal request.',
    bankName: 'Bank Name',
    bankNamePlaceholder: 'Bank Name',
    bankAccountName: 'Bank Account Name',
    bankAccountNamePlaceholder: 'Bank Account Name',
    bankAccount: 'Bank Account',
    bankAccountPlaceholder: 'Bank Account',
    balance: 'Balance',
    balancePlaceholder: 'Balance',
    withdrawalAmount: 'Withdrawal Amount',
    withdrawalAmountPlaceholder: '0',
    reset: 'Reset',
    withdraw: 'Withdraw',
    withdrawing: 'Withdrawing...',
    errors: {
      bankNameRequired: 'Bank name is required',
      bankAccountNameRequired: 'Bank account name is required',
      bankAccountRequired: 'Bank account is required',
      bankAccountFormat: 'Please enter a valid bank account number',
      balanceRequired: 'Balance is required',
      withdrawalAmountRequired: 'Withdrawal amount is required',
      withdrawalAmountPositive: 'Withdrawal amount must be greater than 0',
      withdrawalAmountExceedsBalance: 'Withdrawal amount cannot exceed your balance',
      withdrawalAmountMinimum: 'Minimum withdrawal amount is 10,000'
    }
  },
  changePassword: {
    title: 'Change Password',
    description: 'Update your account password securely',
    currentPassword: 'Current password',
    currentPasswordPlaceholder: 'Enter your current password',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter your new password',
    verifyPassword: 'Verify Password',
    verifyPasswordPlaceholder: 'Confirm your new password',
    cancel: 'Cancel',
    changePassword: 'Change password',
    changingPassword: 'Changing password...',
    errors: {
      currentPasswordRequired: 'Current password is required',
      newPasswordRequired: 'New password is required',
      newPasswordMinLength: 'Password must be at least 8 characters',
      newPasswordFormat: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      verifyPasswordRequired: 'Please verify your password',
      passwordsDontMatch: 'Passwords don\'t match'
    }
  },
  pointWithdrawal: {
    title: 'Point Withdrawal',
    description: 'Withdraw points from your account',
    current: 'Current',
    after: 'After',
    point: 'Point',
    balance: 'Balance',
    pointAmount: 'Point Amount',
    pointAmountPlaceholder: '0',
    maxAmount: 'Max Amount',
    reset: 'Reset',
    cancel: 'Cancel',
    transfer: 'Transfer',
    transferring: 'Transferring...',
    errors: {
      pointAmountRequired: 'Point amount is required',
      pointAmountPositive: 'Point amount must be greater than 0',
      pointAmountExceedsPoints: 'Point amount cannot exceed your available points',
      pointAmountExceedsBalance: 'Point amount cannot exceed your balance',
      pointAmountMinimum: 'Minimum withdrawal amount is 10,000'
    }
  },
  sections: {
    casino: 'Casino',
    slots: 'Slots',
    popular: 'Popular'
  },
  banner: {
    slot: {
      title: 'Fun, Thrills, and Jackpots!',
    titleLine2: 'Everything About Slots!',
      subtitle: 'Try your luck! Start playing slots right now.'
    },
    casino: {
      title: 'Thrills Beyond Betting,',
    titleLine2: 'Every Moment is a Battle!',
      subtitle: 'We offer a casino experience worthy of your class.'
    }
  },

  providers: {
    title: 'Our Game Providers',
    subtitle: 'Powered by the world\'s leading game developers'
  },
  notifications: {
    title: 'NOTICE',
    columns: {
      number: 'No.',
      title: 'Title',
      date: 'Date'
    },
    notices: {
      mandatory: '필공지사항 (필독)',
      bankInspection: '※은행점검시간 및 입출금 규정※',
      casinoRegulations: '카지노 및 슬롯 이용규정안내',
      depositWithdrawal: '※입출금 내역 관련 공지※',
      bankCheck: '은행 점검',
      unprocessedRefund: '※미처리, 환급 안내 ※',
      casinoSanctions: '카지노 양방 및 악성배팅 제재안내'
    }
  },
  inquiries: {
    title: 'INQUIRIES',
    columns: {
      number: 'No.',
      title: 'Title',
      date: 'Date',
      status: 'Status'
    },
    buttons: {
      contactUs: 'Contact Us',
      bankInquiry: 'Bank Inquiry',
      delete: 'Delete',
      deleteAll: 'Delete All',
      read: 'Read',
      readAll: 'Read All'
    },
    status: {
      memberRead: 'MEMBER READ',
      unread: 'UNREAD',
      replied: 'REPLIED'
    }
  },
  contactUs: {
    title: 'Contact Us',
    description: 'Please fill in your inquiry details below to contact our support team.',
    fields: {
      title: 'Title',
      titlePlaceholder: 'Enter your inquiry title',
      message: 'Message',
      messagePlaceholder: 'Describe your inquiry in detail...'
    },
    submit: 'Submit',
    submitting: 'Submitting...'
  },
  transactionHistory: {
    title: 'Transaction History',
    search: 'Search',
    noResults: 'No Results Found',
    columns: {
      type: 'Type',
      bankName: 'Bank Name',
      bankAccountName: 'Bank Account Name',
      bankAccount: 'Bank Account',
      amount: 'Amount',
      status: 'Status',
      date: 'Date'
    },
    types: {
      deposit: 'DEPOSIT',
      withdrawal: 'WITHDRAWAL',
      transfer: 'TRANSFER'
    },
    status: {
      completed: 'COMPLETED',
      pending: 'PENDING',
      failed: 'FAILED',
      cancelled: 'CANCELLED'
    }
  },
  transaction: {
    title: 'Transaction History',
    tabs: {
      transHistory: 'Trans History',
      pointHistory: 'Point History'
    }
  },
  footer: {
    company: 'Company',
    copyright: '© Company. All rights reserved.',
    recentPlayed: 'Recently Played',
    nav: {
      casino: 'Casino',
      slots: 'Slots',
      holdem: 'Hold\'em',
      wallet: 'My Wallet',
      notice: 'Notice',
      event: 'Event',
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      inquiry: '1:1 Inquiry'
    },
    support: 'Support',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    responsible: 'Responsible Gaming',
    about: 'About Us',
    contact: 'Contact',
    faq: 'FAQ',
    help: 'Help'
  }
} 