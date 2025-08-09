// Korean translations
export default {
  header: {
    sports: '스포츠',
    casino: '카지노',
    slots: '슬롯',
    holdem: '홀덤',
    deposit: '입금신청',
    withdraw: '출금신청',
    myLounge: '마이 라운지'
  },
  topBar: {
    login: '로그인',
    signup: '회원가입'
  },
  login: {
    title: 'PRODTEST2',
    subtitle: '로그인이 필요합니다',
    description: '선택한 서비스를 이용하시려면 로그인이 필요합니다',
    username: '아이디',
    usernamePlaceholder: '아이디를 입력하세요',
    password: '비밀번호',
    passwordPlaceholder: '비밀번호를 입력하세요',
    captcha: '캡차',
    captchaPlaceholder: '캡차를 입력하세요',
    loginButton: '로그인',
    loggingIn: '로그인 중...',
    noAccount: '아직 계정이 없으세요?',
    signupLink: '회원가입',
    errors: {
      usernameRequired: '아이디를 입력해주세요',
      usernameMinLength: '아이디는 최소 3자 이상이어야 합니다',
      passwordRequired: '비밀번호를 입력해주세요',
      passwordMinLength: '비밀번호는 최소 6자 이상이어야 합니다',
      captchaRequired: '캡차를 입력해주세요',
      captchaIncorrect: '캡차가 올바르지 않습니다'
    },
    successTitle: '로그인 성공!',
    successMessage: '환영합니다! 성공적으로 로그인되었습니다.',
    refreshCaptchaError: '캡차 새로고침에 실패했습니다'
  },
  register: {
    title: '계정 만들기',
    basicInformation: '기본 정보',
    accountInformation: '계정 정보',
    username: '아이디',
    usernamePlaceholder: '아이디를 입력하세요',
    password: '비밀번호',
    passwordPlaceholder: '비밀번호를 입력하세요',
    confirmPassword: '비밀번호 확인',
    confirmPasswordPlaceholder: '비밀번호 확인',
    name: '이름',
    namePlaceholder: '이름',
    mobileNumber: '휴대폰 번호',
    mobileNumberPlaceholder: '휴대폰 번호',
    bankName: '은행명',
    bankNamePlaceholder: '은행을 선택하세요',
    bankAccountName: '예금주명',
    bankAccountNamePlaceholder: '예금주명',
    bankAccount: '계좌번호',
    bankAccountPlaceholder: '계좌번호',
    referralCode: '추천인 코드',
    referralCodePlaceholder: '추천인 코드',
    captcha: '캡차',
    captchaPlaceholder: '캡차',
    createAccountButton: '계정 만들기',
    creatingAccount: '계정 생성 중...',
    alreadyHaveAccount: '이미 계정이 있으세요?',
    loginHere: '로그인하기',
    errors: {
      usernameRequired: '아이디를 입력해주세요',
      usernameMinLength: '아이디는 최소 3자 이상이어야 합니다',
      usernameMaxLength: '아이디는 20자 미만이어야 합니다',
      usernameFormat: '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다',
      passwordRequired: '비밀번호를 입력해주세요',
      passwordMinLength: '비밀번호는 최소 8자 이상이어야 합니다',
      passwordFormat: '비밀번호는 대문자, 소문자, 숫자를 각각 하나 이상 포함해야 합니다',
      confirmPasswordRequired: '비밀번호를 확인해주세요',
      passwordsDontMatch: '비밀번호가 일치하지 않습니다',
      nameRequired: '이름을 입력해주세요',
      nameMinLength: '이름은 최소 2자 이상이어야 합니다',
      mobileNumberRequired: '휴대폰 번호를 입력해주세요',
      mobileNumberFormat: '올바른 휴대폰 번호를 입력해주세요',
      bankNameRequired: '은행을 선택해주세요',
      bankAccountNameRequired: '예금주명을 입력해주세요',
      bankAccountRequired: '계좌번호를 입력해주세요',
      bankAccountFormat: '올바른 계좌번호를 입력해주세요',
      captchaRequired: '캡차를 해결해주세요',
      captchaIncorrect: '캡차가 올바르지 않습니다'
    }
  },
  deposit: {
    title: '입금 신청',
    description: '입금 신청을 완료하려면 아래에 입금 정보를 입력해 주세요.',
    name: '이름',
    namePlaceholder: '이름',
    bankAccountName: '예금주명',
    bankAccountNamePlaceholder: '예금주명',
    mobileNumber: '휴대폰 번호',
    mobileNumberPlaceholder: '휴대폰 번호',
    depositAmount: '입금 금액',
    depositAmountPlaceholder: '0',
    reset: '초기화',
    submit: '제출',
    submitting: '제출 중...',
    errors: {
      nameRequired: '이름을 입력해주세요',
      nameMinLength: '이름은 최소 2자 이상이어야 합니다',
      bankAccountNameRequired: '예금주명을 입력해주세요',
      mobileNumberRequired: '휴대폰 번호를 입력해주세요',
      mobileNumberFormat: '올바른 휴대폰 번호를 입력해주세요',
      depositAmountRequired: '입금 금액을 입력해주세요',
      depositAmountPositive: '입금 금액은 0보다 커야 합니다',
      depositAmountMinimum: '최소 입금 금액은 10,000원입니다'
    }
  },
  withdrawal: {
    title: '출금 신청',
    description: '출금 신청을 완료하려면 아래에 출금 정보를 입력해 주세요.',
    bankName: '은행명',
    bankNamePlaceholder: '은행명',
    bankAccountName: '예금주명',
    bankAccountNamePlaceholder: '예금주명',
    bankAccount: '계좌번호',
    bankAccountPlaceholder: '계좌번호',
    balance: '잔액',
    balancePlaceholder: '잔액',
    withdrawalAmount: '출금 금액',
    withdrawalAmountPlaceholder: '0',
    reset: '초기화',
    withdraw: '출금',
    withdrawing: '출금 중...',
    errors: {
      bankNameRequired: '은행명을 입력해주세요',
      bankAccountNameRequired: '예금주명을 입력해주세요',
      bankAccountRequired: '계좌번호를 입력해주세요',
      bankAccountFormat: '올바른 계좌번호를 입력해주세요',
      balanceRequired: '잔액을 입력해주세요',
      withdrawalAmountRequired: '출금 금액을 입력해주세요',
      withdrawalAmountPositive: '출금 금액은 0보다 커야 합니다',
      withdrawalAmountExceedsBalance: '출금 금액이 잔액을 초과할 수 없습니다',
      withdrawalAmountMinimum: '최소 출금 금액은 10,000원입니다'
    }
  },
  changePassword: {
    title: '비밀번호 변경',
    description: '계정 비밀번호를 안전하게 업데이트하세요',
    currentPassword: '현재 비밀번호',
    currentPasswordPlaceholder: '현재 비밀번호를 입력하세요',
    newPassword: '새 비밀번호',
    newPasswordPlaceholder: '새 비밀번호를 입력하세요',
    verifyPassword: '비밀번호 확인',
    verifyPasswordPlaceholder: '새 비밀번호를 확인하세요',
    cancel: '취소',
    changePassword: '비밀번호 변경',
    changingPassword: '비밀번호 변경 중...',
    errors: {
      currentPasswordRequired: '현재 비밀번호를 입력해주세요',
      newPasswordRequired: '새 비밀번호를 입력해주세요',
      newPasswordMinLength: '비밀번호는 최소 8자 이상이어야 합니다',
      newPasswordFormat: '비밀번호는 대문자, 소문자, 숫자를 각각 하나 이상 포함해야 합니다',
      verifyPasswordRequired: '비밀번호를 확인해주세요',
      passwordsDontMatch: '비밀번호가 일치하지 않습니다'
    }
  },
  pointWithdrawal: {
    title: '포인트 출금',
    description: '계정에서 포인트를 출금하세요',
    current: '현재',
    after: '이후',
    point: '포인트',
    balance: '잔액',
    pointAmount: '출금 금액',
    pointAmountPlaceholder: '0',
    maxAmount: '최대 금액',
    reset: '초기화',
    cancel: '취소',
    transfer: '이체',
    transferring: '이체 중...',
    errors: {
      pointAmountRequired: '출금 금액을 입력해주세요',
      pointAmountPositive: '출금 금액은 0보다 커야 합니다',
      pointAmountExceedsPoints: '출금 금액이 보유 포인트를 초과할 수 없습니다',
      pointAmountExceedsBalance: '출금 금액이 잔액을 초과할 수 없습니다',
      pointAmountMinimum: '최소 출금 금액은 10,000원입니다'
    }
  },
  sections: {
    casino: '카지노',
    slots: '슬롯',
    popular: '인기',
  },
  banner: {
    slot: {
      title: '재미와 스릴, 그리고 잭팟!',
    titleLine2: '슬롯의 모든 것!',
      subtitle: '당신의 행운을 돌려보세요! 지금 바로 슬롯을 시작하세요.'
    },
    casino: {
      title: '베팅 그 이상의 짜릿함,',
    titleLine2: '매 순간이 승부다!',
      subtitle: '당신의 품격에 걸맞은 카지노 경험을 선사합니다.'
    }
  },

  providers: {
    title: '게임 제공업체',
    subtitle: '세계 최고의 게임 개발사들이 제공합니다'
  },
  notifications: {
    title: '공지사항',
    columns: {
      number: '번호',
      title: '제목',
      date: '날짜'
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
    title: '문의사항',
    columns: {
      number: '번호',
      title: '제목',
      date: '날짜',
      status: '상태'
    },
    buttons: {
      contactUs: '문의하기',
      bankInquiry: '은행 문의',
      delete: '삭제',
      deleteAll: '전체 삭제',
      read: '읽음',
      readAll: '전체 읽음'
    },
    status: {
      memberRead: '회원 읽음',
      unread: '읽지 않음',
      replied: '답변 완료'
    }
  },
  contactUs: {
    title: '문의하기',
    description: '고객 지원팀에 문의하려면 아래에 문의 내용을 입력해 주세요.',
    fields: {
      title: '제목',
      titlePlaceholder: '문의 제목을 입력하세요',
      message: '메시지',
      messagePlaceholder: '문의 내용을 자세히 설명해 주세요...'
    },
    submit: '제출',
    submitting: '제출 중...'
  },
  transactionHistory: {
    title: '거래 내역',
    search: '검색',
    noResults: '검색 결과가 없습니다',
    columns: {
      type: '유형',
      bankName: '은행명',
      bankAccountName: '예금주명',
      bankAccount: '계좌번호',
      amount: '금액',
      status: '상태',
      date: '날짜'
    },
    types: {
      deposit: '입금',
      withdrawal: '출금',
      transfer: '이체'
    },
    status: {
      completed: '완료',
      pending: '대기중',
      failed: '실패',
      cancelled: '취소'
    }
  },
  transaction: {
    title: '거래 내역',
    tabs: {
      transHistory: '거래 내역',
      pointHistory: '포인트 내역'
    }
  },
  footer: {
    company: '회사 정보',
    copyright: '© 회사. 모든 권리 보유.',
    recentPlayed: '최근 플레이한',
    nav: {
      casino: '카지노',
      slots: '슬롯',
      holdem: '홀덤',
      wallet: '마이 월렛',
      notice: '공지',
      event: '이벤트',
      deposit: '입금신청',
      withdrawal: '출금신청',
      inquiry: '1:1 문의'
    },
    support: '고객 지원',
    terms: '이용약관',
    privacy: '개인정보처리방침',
    responsible: '책임감 있는 게임',
    about: '회사 소개',
    contact: '고객센터',
    faq: '자주 묻는 질문',
    help: '도움말'
  }
} 