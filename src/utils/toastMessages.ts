// utils/toastMessages.ts
export const toastMessages = {
  // Authentication
  auth: {
    loginSuccess: "Welcome back! You're now signed in.",
    loginError: "Login failed. Please check your email and password.",
    logoutSuccess: "You've been signed out successfully.",
    signupSuccess: "Account created! Welcome to the platform.",
    signupError: "Unable to create account. Please try again.",
    passwordReset: "Password reset email sent. Check your inbox.",
    tokenExpired: "Your session has expired. Please sign in again.",
    unauthorized: "You need to be signed in to do that.",
  },

  // Trading Journal Specific
  trading: {
    tradeAdded: "Trade recorded successfully!",
    tradeUpdated: "Trade details updated.",
    tradeDeleted: "Trade removed from your journal.",
    tradeError: "Couldn't save trade. Please check your details.",
    portfolioUpdated: "Portfolio balance updated.",
    invalidAmount: "Please enter a valid amount.",
    invalidDate: "Please select a valid date.",
  },

  // File Operations
  files: {
    uploadSuccess: "File uploaded successfully!",
    uploadError: "Upload failed. Please try a smaller file.",
    uploadLimit: "File too large. Maximum size is 5MB.",
    invalidFormat: "Invalid file format. Please use JPG, PNG, or PDF.",
    deleteSuccess: "File deleted successfully.",
    deleteError: "Couldn't delete file. Please try again.",
  },

  // Network & API
  network: {
    offline: "You're offline. Changes will sync when connected.",
    online: "Back online! Syncing your data...",
    timeout: "Request timed out. Please check your connection.",
    serverError: "Something went wrong on our end. We're fixing it!",
    maintenance: "System under maintenance. Please try again later.",
  },

  // Form Validation
  validation: {
    required: (field: string) => `${field} is required.`,
    email: "Please enter a valid email address.",
    password: "Password must be at least 8 characters.",
    phoneNumber: "Please enter a valid phone number.",
    generic: "Please check your input and try again.",
  },

  // General Operations
  general: {
    saveSuccess: "Changes saved successfully!",
    saveError: "Couldn't save changes. Please try again.",
    copySuccess: "Copied to clipboard!",
    copyError: "Couldn't copy. Please try selecting manually.",
    updateAvailable: "New version available! Refresh to update.",
  }
};
