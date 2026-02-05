# استبيان رضا العملاء | Customer Satisfaction Survey

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?logo=google-sheets)

**🌐 موقع استبيان ثنائي اللغة (العربية/الإنجليزية) مع تكامل Google Sheets**

**Bilingual Survey Website (Arabic/English) with Google Sheets Integration**

[مشاهدة العرض التوضيحي](#) | [View Demo](#)

</div>

---

## 📋 جدول المحتويات | Table of Contents

- [المميزات | Features](#-المميزات--features)
- [الهيكل | Structure](#-الهيكل--structure)
- [متطلبات ما قبل التثبيت | Prerequisites](#-متطلبات-ما-قبل-التثبيت--prerequisites)
- [خطوات الإعداد الكاملة | Full Setup Steps](#-خطوات-الإعداد-الكاملة--full-setup-steps)
  - [الخطوة 1: إنشاء Google Sheet](#الخطوة-1-إنشاء-google-sheet)
  - [الخطوة 2: إعداد Google Apps Script](#الخطوة-2-إعداد-google-apps-script)
  - [الخطوة 3: رفع الكود على GitHub](#الخطوة-3-رفع-الكود-على-github)
  - [الخطوة 4: النشر على Vercel](#الخطوة-4-النشر-على-vercel)
- [تخصيص الخلفية | Customize Background](#-تخصيص-الخلفية--customize-background)
- [استكشاف الأخطاء | Troubleshooting](#-استكشاف-الأخطاء--troubleshooting)
- [الترخيص | License](#-الترخيص--license)

---

## ✨ المميزات | Features

### 🇸🇦 بالعربية
- ✅ **تصميم عصري وأنيق** مع رسوم متحركة سلسة
- ✅ **دعم كامل للغتين** (العربية أولاً، الإنجليزية)
- ✅ **تكامل مع Google Sheets** لحفظ البيانات تلقائياً
- ✅ **هيدر بتأثير الضباب** (Blur) قابل للتخصيص
- ✅ **نموذج بسيط بـ 3 حقول**:
  - اسم العميل
  - نوع الشكوى
  - ملاحظات
- ✅ **تصميم متجاوب** يعمل على جميع الأجهزة
- ✅ **رسوم متحركة احترافية** عند التمرير والإرسال

### 🇬🇧 In English
- ✅ **Modern & Elegant Design** with smooth animations
- ✅ **Full Bilingual Support** (Arabic first, English)
- ✅ **Google Sheets Integration** for automatic data saving
- ✅ **Blur Effect Header** customizable via image upload
- ✅ **Simple 3-Field Form**:
  - Customer Name
  - Complaint Type
  - Notes
- ✅ **Responsive Design** works on all devices
- ✅ **Professional Animations** on scroll and submit

---

## 🏗️ الهيكل | Structure

```
project/
├── 📁 app/                          # React Application
│   ├── 📁 src/
│   │   ├── 📄 App.tsx               # Main application component
│   │   ├── 📄 App.css               # App-specific styles
│   │   ├── 📄 index.css             # Global styles & animations
│   │   └── 📁 components/           # UI components (shadcn/ui)
│   ├── 📄 index.html                # HTML entry point
│   ├── 📄 package.json              # Dependencies
│   └── 📄 vite.config.ts            # Vite configuration
│
├── 📄 GoogleAppsScript.gs           # Google Apps Script code
├── 📄 README.md                     # This file
└── 📄 .gitignore                    # Git ignore rules
```

---

## 📦 متطلبات ما قبل التثبيت | Prerequisites

قبل البدء، تأكد من أن لديك:

1. **حساب Google** (Gmail)
2. **حساب GitHub** - [سجل هنا](https://github.com/signup)
3. **حساب Vercel** - [سجل هنا](https://vercel.com/signup) (يمكنك التسجيل بحساب GitHub)
4. **Node.js** مثبت على جهازك (للتطوير المحلي) - [حمّله من هنا](https://nodejs.org/)

---

## 🚀 خطوات الإعداد الكاملة | Full Setup Steps

### الخطوة 1: إنشاء Google Sheet

#### 1.1 أنشئ ملف Google Sheets جديد
1. اذهب إلى [Google Sheets](https://sheets.google.com)
2. انقر على **"+ Blank"** لإنشاء ملف جديد
3. أعد تسمية الملف إلى **"Customer Survey Data"** (أو أي اسم تفضله)

#### 1.2 احصل على معرف الورقة (Sheet ID)
1. انظر إلى عنوان URL في المتصفح
2. سيكون بالشكل:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit
   ```
3. انسخ الجزء بعد `/d/` وقبل `/edit`:
   ```
   1ABC123xyz...
   ```
4. **احتفظ بهذا المعرف - ستحتاجه لاحقاً**

---

### الخطوة 2: إعداد Google Apps Script

#### 2.1 أنشئ مشروع Apps Script جديد
1. اذهب إلى [Google Apps Script](https://script.google.com)
2. انقر على **"New project"** (مشروع جديد)
3. سترى مشروعاً فارغاً مع دالة `myFunction()` افتراضية

#### 2.2 أضف الكود
1. **احذف كل الكود الافتراضي**
2. افتح ملف `GoogleAppsScript.gs` من هذا المشروع
3. انسخ كل الكود
4. الصقه في محرر Apps Script
5. **عدل السطر التالي**:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
   ```
   استبدل `YOUR_GOOGLE_SHEET_ID_HERE` بمعرف الورقة الذي نسخته في الخطوة 1.2

#### 2.3 احفظ المشروع
1. اضغط **Ctrl + S** (أو **Cmd + S** على Mac)
2. أعد تسمية المشروع إلى **"Customer Survey API"**

#### 2.4 انشر كـ Web App
1. انقر على زر **"Deploy"** (نشر)
2. اختر **"New deployment"** (نشر جديد)
3. انقر على أيقونة **الترس (⚙️)**
4. اختر **"Web app"**
5. املأ الإعدادات:
   - **Description**: `Customer Survey API v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (للسماح للجميع بالوصول)
6. انقر **"Deploy"**
7. **وافق على الأذونات** عند الطلب:
   - انقر على حسابك
   - اضغط **"Advanced"** (متقدم)
   - اضغط **"Go to Customer Survey API (unsafe)"**
   - اضغط **"Allow"** (سماح)
8. انسخ **Web App URL** (سيكون بالشكل):
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
9. **احتفظ بهذا الرابط - ستحتاجه في الخطوة 3**

#### 2.5 اختبار الاتصال
1. في محرر Apps Script، افتح القائمة **"Select function"**
2. اختر `testSetup`
3. اضغط على زر **"Run"** (▶️)
4. افتح **"Execution log"** للتحقق من النتائج

---

### الخطوة 3: رفع الكود على GitHub

#### 3.1 أنشئ مستودعاً جديداً
1. اذهب إلى [GitHub](https://github.com)
2. انقر على **"+"** → **"New repository"**
3. أدخل اسم المستودع: `customer-survey`
4. اجعله **Public** (عام)
5. **لا تضف README أو .gitignore الآن**
6. انقر **"Create repository"**

#### 3.2 جهّز المشروع محلياً
1. افتح Terminal/Command Prompt
2. انتقل إلى مجلد المشروع:
   ```bash
   cd path/to/app
   ```
3. ثبّت الاعتماديات:
   ```bash
   npm install
   ```

#### 3.3 عدّل رابط Google Script
1. افتح ملف `src/App.tsx`
2. ابحث عن هذا السطر:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. استبدله برابط Web App الذي نسخته في الخطوة 2.4

#### 3.4 ابنِ المشروع
```bash
npm run build
```

#### 3.5 ارفع الملفات على GitHub
1. في مجلد المشروع، نفّذ:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Customer Survey App"
   ```

2. اربط المستودع البعيد (استبدل `YOUR_USERNAME` باسم المستخدم):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/customer-survey.git
   ```

3. ارفع الملفات:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

### الخطوة 4: النشر على Vercel

#### 4.1 انشر الموقع
1. اذهب إلى [Vercel](https://vercel.com)
2. سجّل الدخول بحساب GitHub
3. انقر **"Add New Project"**
4. استورد مستودع `customer-survey`
5. في إعدادات البناء:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. انقر **"Deploy"**

#### 4.2 احصل على رابط الموقع
بعد اكتمال النشر، ستحصل على رابط مثل:
```
https://customer-survey-xxx.vercel.app
```

**🎉 مبروك! موقعك الآن متاح على الإنترنت!**

---

## 🎨 تخصيص الخلفية | Customize Background

### تغيير صورة خلفية الهيدر

#### الطريقة 1: رفع الصورة على GitHub
1. احفظ صورتك باسم `header-bg.jpg` (أو أي صيغة)
2. ارفعها إلى مجلد `public/` في المستودع
3. في `App.tsx`، ابحث عن:
   ```tsx
   {/* Animated Background Elements */}
   ```
4. أضف صورتك:
   ```tsx
   <div 
     className="absolute inset-0 bg-cover bg-center opacity-30"
     style={{ backgroundImage: 'url(/header-bg.jpg)' }}
   />
   ```

#### الطريقة 2: استخدام رابط خارجي
```tsx
<div 
  className="absolute inset-0 bg-cover bg-center opacity-30"
  style={{ backgroundImage: 'url(https://your-image-url.com/image.jpg)' }}
/>
```

### تغيير الألوان
في ملف `src/index.css`، عدّل متغيرات CSS:
```css
:root {
  --primary: 221 83% 53%;        /* اللون الأساسي */
  --accent: 221 83% 53%;         /* لون التمييز */
}
```

---

## 🔧 استكشاف الأخطاء | Troubleshooting

### المشكلة: البيانات لا تُرسل إلى Google Sheets

#### الحلول:
1. **تحقق من رابط Web App**:
   - تأكد من نسخ الرابط كاملاً
   - تأكد من أنه يبدأ بـ `https://script.google.com/macros/s/`

2. **تحقق من معرف الورقة**:
   - افتح `GoogleAppsScript.gs`
   - تأكد من أن `SHEET_ID` صحيح

3. **أعد نشر Apps Script**:
   - في محرر Apps Script، اذهب إلى **Deploy** → **Manage deployments**
   - انقر على القلم (✏️)
   - اختر **Version** → **New version**
   - انقر **Deploy**

4. **افحص Console في المتصفح**:
   - اضغط **F12** → **Console**
   - ابحث عن رسائل خطأ

### المشكلة: CORS Error

#### الحل:
في `GoogleAppsScript.gs`، تأكد من أن الوظيفة `doPost` تُرجع JSON:
```javascript
return ContentService.createTextOutput(JSON.stringify(data))
  .setMimeType(ContentService.MimeType.JSON);
```

### المشكلة: التصميم لا يظهر بشكل صحيح

#### الحلول:
1. تأكد من بناء المشروع:
   ```bash
   npm run build
   ```
2. تأكد من رفع مجلد `dist/` على GitHub
3. امسح ذاكرة التخزين المؤقت في المتصفح (**Ctrl + Shift + R**)

---

## 📄 الترخيص | License

هذا المشروع مرخص بموجب [MIT License](LICENSE).

---

## 🙏 شكراً | Thanks

شكراً لاستخدام هذا المشروع! إذا كان لديك أي أسئلة أو مشاكل، لا تتردد في فتح **Issue** في GitHub.

---

<div align="center">

**صنع بـ ❤️ للعالم العربي**

**Made with ❤️ for the Arab World**

</div>
