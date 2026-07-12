export type Locale = 'en' | 'ur';

export interface Dictionary {
  // Navigation & Shell
  appTitle: string;
  appSubtitle: string;
  notes: string;
  allNotes: string;
  trash: string;
  categories: string;
  newNote: string;
  newCategory: string;
  searchPlaceholder: string;
  toggleTheme: string;
  toggleLocale: string;
  offlineBadge: string;
  onlineBadge: string;

  // Auth
  signIn: string;
  signUp: string;
  emailLabel: string;
  passwordLabel: string;
  continueWithGoogle: string;
  continueAsDemo: string;
  logout: string;
  welcomeBack: string;
  createAccount: string;
  authSubtitle: string;
  noAccountPrompt: string;
  haveAccountPrompt: string;

  // Notes & Editor
  noteTitlePlaceholder: string;
  noteBodyPlaceholder: string;
  pinNote: string;
  unpinNote: string;
  moveToTrash: string;
  restoreNote: string;
  deletePermanently: string;
  saving: string;
  saved: string;
  tagsPlaceholder: string;
  colorLabel: string;
  exportNote: string;
  exportMarkdown: string;
  exportJson: string;
  exportText: string;
  pinnedSection: string;
  otherNotesSection: string;

  // Category & Modal
  categoryNamePlaceholder: string;
  pickColor: string;
  pickEmoji: string;
  saveCategory: string;
  deleteCategory: string;
  uncategorized: string;

  // Trash & Purge
  trashTitle: string;
  trashSubtitle: string;
  emptyTrash: string;
  confirmEmptyTrash: string;

  // Empty States
  noNotesTitle: string;
  noNotesSubtitle: string;
  noSearchResultsTitle: string;
  noSearchResultsSubtitle: string;
  emptyTrashTitle: string;
  emptyTrashSubtitle: string;

  // Keyboard Shortcuts
  shortcutsModalTitle: string;
  shortcutSearch: string;
  shortcutNewNote: string;
  shortcutToggleSidebar: string;
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    appTitle: 'Brain Library',
    appSubtitle: 'Your Bilingual Knowledge Sanctuary',
    notes: 'Notes',
    allNotes: 'All Notes',
    trash: 'Trash',
    categories: 'Categories',
    newNote: 'New Note',
    newCategory: 'New Section',
    searchPlaceholder: 'Search titles, text, tags, sections (Ctrl+K)...',
    toggleTheme: 'Toggle Dark/Light Mode',
    toggleLocale: 'Switch to Urdu (RTL)',
    offlineBadge: 'Offline Mode • Local Cache',
    onlineBadge: 'Synced with Cloud',

    signIn: 'Sign In',
    signUp: 'Sign Up',
    emailLabel: 'Email address',
    passwordLabel: 'Password',
    continueWithGoogle: 'Continue with Google',
    continueAsDemo: 'Try Instant Demo (Offline-First)',
    logout: 'Sign Out',
    welcomeBack: 'Welcome back to your Brain Library',
    createAccount: 'Create your Brain Library account',
    authSubtitle: 'Organize your knowledge across English & Urdu with offline multi-tab storage.',
    noAccountPrompt: "Don't have an account?",
    haveAccountPrompt: 'Already have an account?',

    noteTitlePlaceholder: 'Untitled Note...',
    noteBodyPlaceholder: 'Start writing your thoughts in English or Urdu...',
    pinNote: 'Pin Note',
    unpinNote: 'Unpin Note',
    moveToTrash: 'Move to Trash',
    restoreNote: 'Restore Note',
    deletePermanently: 'Delete Permanently',
    saving: 'Saving...',
    saved: 'Saved',
    tagsPlaceholder: 'Add tag + Enter...',
    colorLabel: 'Card Accent Color',
    exportNote: 'Export Note',
    exportMarkdown: 'Markdown (.md)',
    exportJson: 'JSON Document (.json)',
    exportText: 'Plain Text (.txt)',
    pinnedSection: 'Pinned Notes',
    otherNotesSection: 'Other Notes',

    categoryNamePlaceholder: 'Section Name (e.g. Literature, Research)',
    pickColor: 'Choose Accent Color',
    pickEmoji: 'Choose Icon Emoji',
    saveCategory: 'Save Section',
    deleteCategory: 'Delete Section',
    uncategorized: 'Uncategorized',

    trashTitle: 'Recycle Bin',
    trashSubtitle: 'Notes in trash are automatically purged after 30 days.',
    emptyTrash: 'Empty Trash',
    confirmEmptyTrash: 'Are you sure you want to permanently delete all trashed notes?',

    noNotesTitle: 'Your Library is Quiet',
    noNotesSubtitle: 'Create your first note or section to start capturing your knowledge.',
    noSearchResultsTitle: 'No Matching Notes Found',
    noSearchResultsSubtitle: 'Try searching for different keywords, tags, or switch categories.',
    emptyTrashTitle: 'Trash is Empty',
    emptyTrashSubtitle: 'No deleted notes here. Safe and clean!',

    shortcutsModalTitle: 'Keyboard Shortcuts',
    shortcutSearch: 'Open Search & Filter',
    shortcutNewNote: 'Create New Note',
    shortcutToggleSidebar: 'Toggle Sidebar Drawer'
  },
  ur: {
    appTitle: 'برین لائبریری',
    appSubtitle: 'آپ کا دو لسانی علمی ذخیرہ',
    notes: 'یادداشتیں',
    allNotes: 'تمام یادداشتیں',
    trash: 'ردی ٹوکری',
    categories: 'زمرے',
    newNote: 'نئی یادداشت',
    newCategory: 'نیا زمرہ',
    searchPlaceholder: 'عنوانات، متن، ٹیگز، یا زمرے تلاش کریں (Ctrl+K)...',
    toggleTheme: 'ڈارک اور لائٹ موڈ تبدیل کریں',
    toggleLocale: 'انگریزی میں تبدیل کریں (LTR)',
    offlineBadge: 'آف لائن موڈ • مقامی کیشے',
    onlineBadge: 'کلاؤڈ کے ساتھ مربوط',

    signIn: 'لاگ ان کریں',
    signUp: 'اکاؤنٹ بنائیں',
    emailLabel: 'ای میل ایڈریس',
    passwordLabel: 'پاس ورڈ',
    continueWithGoogle: 'گوگل کے ساتھ جاری رکھیں',
    continueAsDemo: 'فوری ڈیمو آزمائیں (آف لائن موڈ)',
    logout: 'لاگ آؤٹ',
    welcomeBack: 'برین لائبریری میں خوش آمدید',
    createAccount: 'اپنی برین لائبریری کا آغاز کریں',
    authSubtitle: 'اردو اور انگریزی میں اپنے علمی ذخیرے کو منظم کریں، آف لائن مطابقت پذیری کے ساتھ۔',
    noAccountPrompt: 'کیا آپ کا اکاؤنٹ نہیں ہے؟',
    haveAccountPrompt: 'کیا پہلے سے اکاؤنٹ موجود ہے؟',

    noteTitlePlaceholder: 'بغیر عنوان یادداشت...',
    noteBodyPlaceholder: 'اردو یا انگریزی میں اپنے خیالات لکھنا شروع کریں...',
    pinNote: 'پن کریں',
    unpinNote: 'ان پن کریں',
    moveToTrash: 'ردی ٹوکری میں بھیجیں',
    restoreNote: 'بحال کریں',
    deletePermanently: 'ہمیشہ کے لیے حذف کریں',
    saving: 'محفوظ ہو رہا ہے...',
    saved: 'محفوظ کر لیا گیا',
    tagsPlaceholder: 'ٹیگ شامل کریں + Enter...',
    colorLabel: 'کارڈ کا رنگ',
    exportNote: 'ایکسپورٹ کریں',
    exportMarkdown: 'مارک ڈاؤن (.md)',
    exportJson: 'جے سن دستاویز (.json)',
    exportText: 'سادہ متن (.txt)',
    pinnedSection: 'پن شدہ یادداشتیں',
    otherNotesSection: 'دیگر یادداشتیں',

    categoryNamePlaceholder: 'زمرے کا نام (مثلاً تحقیق، ادب، افکار)',
    pickColor: 'رنگ منتخب کریں',
    pickEmoji: 'ایموجی منتخب کریں',
    saveCategory: 'زمرہ محفوظ کریں',
    deleteCategory: 'زمرہ حذف کریں',
    uncategorized: 'بغیر زمرہ',

    trashTitle: 'ردی ٹوکری',
    trashSubtitle: 'ردی ٹوکری میں موجود یادداشتیں 30 دن بعد خودکار طور پر حذف ہو جاتی ہیں۔',
    emptyTrash: 'ردی ٹوکری خالی کریں',
    confirmEmptyTrash: 'کیا آپ واقعی تمام یادداشتیں ہمیشہ کے لیے حذف کرنا چاہتے ہیں؟',

    noNotesTitle: 'آپ کی لائبریری خاموش ہے',
    noNotesSubtitle: 'اپنے علم کو محفوظ کرنے کے لیے پہلی یادداشت یا زمرہ بنائیں۔',
    noSearchResultsTitle: 'کوئی متعلقہ یادداشت نہیں ملی',
    noSearchResultsSubtitle: 'مختلف الفاظ یا ٹیگز سے تلاش کریں یا زمرہ تبدیل کریں۔',
    emptyTrashTitle: 'ردی ٹوکری خالی ہے',
    emptyTrashSubtitle: 'یہاں کوئی حذف شدہ یادداشت نہیں ہے۔',

    shortcutsModalTitle: 'کی بورڈ شارٹ کٹس',
    shortcutSearch: 'تلاش اور فلٹر کھولیں',
    shortcutNewNote: 'نئی یادداشت بنائیں',
    shortcutToggleSidebar: 'سائیڈ بار کھولیں / بند کریں'
  }
};
