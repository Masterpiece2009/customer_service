import { useState, useEffect } from 'react';
import { 
  Send, 
  User, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Loader2, 
  Globe, 
  Sparkles,
  Headphones,
  Star,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import './App.css';

// Language type
type Language = 'ar' | 'en';

// Translation object
const translations = {
  ar: {
    title: 'استبيان رضا العملاء',
    subtitle: 'نحن نهتم برأيكم - ساعدونا في تحسين خدماتنا',
    formTitle: 'نموذج الشكاوى والملاحظات',
    customerName: 'اسم العميل',
    customerNamePlaceholder: 'أدخل اسمك الكريم',
    complaintType: 'نوع الشكوى',
    complaintTypePlaceholder: 'اختر نوع الشكوى',
    notes: 'ملاحظات',
    notesPlaceholder: 'اكتب ملاحظاتك أو تفاصيل الشكوى هنا...',
    submit: 'إرسال البيانات',
    submitting: 'جاري الإرسال...',
    successTitle: 'تم الإرسال بنجاح!',
    successMessage: 'شكراً لمشاركتك. تم إرسال بياناتك بنجاح وسنقوم بالتواصل معك قريباً.',
    sendAnother: 'إرسال استبيان آخر',
    serviceQuality: 'جودة الخدمة',
    technicalIssue: 'مشكلة تقنية',
    billingIssue: 'مشكلة في الفواتير',
    delayIssue: 'تأخر في الخدمة',
    other: 'أخرى',
    required: 'هذا الحقل مطلوب',
    error: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.',
    headerTitle: 'خدمة العملاء',
    languageSwitch: 'English',
    footerText: '© 2025 جميع الحقوق محفوظة',
    madeWith: 'صنع بـ',
    privacyNote: 'بياناتك آمنة ومحمية',
  },
  en: {
    title: 'Customer Satisfaction Survey',
    subtitle: 'We value your feedback - Help us improve our services',
    formTitle: 'Complaints & Feedback Form',
    customerName: 'Customer Name',
    customerNamePlaceholder: 'Enter your full name',
    complaintType: 'Complaint Type',
    complaintTypePlaceholder: 'Select complaint type',
    notes: 'Notes',
    notesPlaceholder: 'Write your notes or complaint details here...',
    submit: 'Submit Data',
    submitting: 'Submitting...',
    successTitle: 'Submitted Successfully!',
    successMessage: 'Thank you for your feedback. Your data has been sent successfully and we will contact you soon.',
    sendAnother: 'Submit Another Response',
    serviceQuality: 'Service Quality',
    technicalIssue: 'Technical Issue',
    billingIssue: 'Billing Issue',
    delayIssue: 'Service Delay',
    other: 'Other',
    required: 'This field is required',
    error: 'An error occurred while submitting. Please try again.',
    headerTitle: 'Customer Service',
    languageSwitch: 'العربية',
    footerText: '© 2025 All Rights Reserved',
    madeWith: 'Made with',
    privacyNote: 'Your data is secure and protected',
  }
};

// Complaint types
const complaintTypes = {
  ar: [
    { value: 'service_quality', label: 'جودة الخدمة' },
    { value: 'technical_issue', label: 'مشكلة تقنية' },
    { value: 'billing_issue', label: 'مشكلة في الفواتير' },
    { value: 'delay_issue', label: 'تأخر في الخدمة' },
    { value: 'other', label: 'أخرى' },
  ],
  en: [
    { value: 'service_quality', label: 'Service Quality' },
    { value: 'technical_issue', label: 'Technical Issue' },
    { value: 'billing_issue', label: 'Billing Issue' },
    { value: 'delay_issue', label: 'Service Delay' },
    { value: 'other', label: 'Other' },
  ]
};

// Google Apps Script URL - REPLACE THIS WITH YOUR DEPLOYED SCRIPT URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxlFYgzbrPgEMsZJ90nKf-t96gq-govSvqRHRGyLQ5V9C84njlQJ-ORPTpbnLCTq-Frjw/exec';

function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [formData, setFormData] = useState({
    customerName: '',
    complaintType: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const t = translations[language];
  const types = complaintTypes[language];
  const isRTL = language === 'ar';

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName.trim() || !formData.complaintType) {
      setError(t.required);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Prepare data for Google Sheets
      const data = {
        timestamp: new Date().toISOString(),
        language: language,
        customerName: formData.customerName,
        complaintType: formData.complaintType,
        notes: formData.notes,
      };

      // Send to Google Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Since no-cors doesn't return readable response, we assume success
      // In production, you should handle the response properly
      setIsSuccess(true);
      setFormData({ customerName: '', complaintType: '', notes: '' });
    } catch (err) {
      setError(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form for new submission
  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ customerName: '', complaintType: '', notes: '' });
    setError('');
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 bg-pattern">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Header with Blur Background */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'header-blur shadow-lg py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-lg ${isScrolled ? 'text-slate-800' : 'text-slate-800'}`}>
                {t.headerTitle}
              </span>
            </div>

            {/* Language Switch */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 hover:bg-blue-100/50 transition-all duration-300 animate-fadeIn delay-200"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{t.languageSwitch}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 rounded-full mb-6 animate-fadeInUp">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {language === 'ar' ? 'نحن هنا لمساعدتك' : 'We are here to help'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 animate-fadeInUp delay-100">
              {t.title}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-fadeInUp delay-200">
              {t.subtitle}
            </p>
          </div>

          {/* Form Card */}
          <Card className="glass border-0 shadow-2xl overflow-hidden animate-fadeInUp delay-300">
            {/* Card Header Gradient */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-bounce-subtle">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800">
                {t.formTitle}
              </CardTitle>
              <CardDescription className="text-slate-500 mt-2">
                {language === 'ar' 
                  ? 'يرجى ملء النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن'
                  : 'Please fill out the form below and we will respond as soon as possible'}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              {isSuccess ? (
                // Success State
                <div className="text-center py-8 animate-success">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {t.successTitle}
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {t.successMessage}
                  </p>
                  <Button
                    onClick={handleReset}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl btn-hover-lift"
                  >
                    {t.sendAnother}
                  </Button>
                </div>
              ) : (
                // Form
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Name Field */}
                  <div className="space-y-2 animate-fadeIn delay-100">
                    <Label 
                      htmlFor="customerName" 
                      className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      {t.customerName}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder={t.customerNamePlaceholder}
                      className="h-12 text-base border-slate-200 focus:border-blue-500 form-input-focus rounded-xl"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>

                  {/* Complaint Type Field */}
                  <div className="space-y-2 animate-fadeIn delay-200">
                    <Label 
                      htmlFor="complaintType" 
                      className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      {t.complaintType}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.complaintType}
                      onValueChange={(value) => handleInputChange('complaintType', value)}
                    >
                      <SelectTrigger className="h-12 text-base border-slate-200 focus:border-blue-500 form-input-focus rounded-xl">
                        <SelectValue placeholder={t.complaintTypePlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes Field */}
                  <div className="space-y-2 animate-fadeIn delay-300">
                    <Label 
                      htmlFor="notes" 
                      className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      {t.notes}
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder={t.notesPlaceholder}
                      rows={5}
                      className="text-base border-slate-200 focus:border-blue-500 form-input-focus rounded-xl resize-none"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive" className="animate-fadeIn">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl btn-hover-lift animate-pulse-glow animate-fadeIn delay-400"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.submitting}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        {t.submit}
                      </span>
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 animate-fadeIn delay-500">
                    <Shield className="w-4 h-4" />
                    <span>{t.privacyNote}</span>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: Star, 
                title: language === 'ar' ? 'جودة عالية' : 'High Quality',
                desc: language === 'ar' ? 'نحن نسعى دائماً لتقديم أفضل الخدمات' : 'We always strive to provide the best services'
              },
              { 
                icon: Shield, 
                title: language === 'ar' ? 'أمان البيانات' : 'Data Security',
                desc: language === 'ar' ? 'بياناتك محمية ومشفرة بأعلى معايير الأمان' : 'Your data is protected with highest security standards'
              },
              { 
                icon: Headphones, 
                title: language === 'ar' ? 'دعم 24/7' : '24/7 Support',
                desc: language === 'ar' ? 'فريق الدعم جاهز لمساعدتك على مدار الساعة' : 'Support team ready to help you around the clock'
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass rounded-2xl p-6 text-center card-hover animate-fadeInUp"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">{t.headerTitle}</span>
            </div>
            
            <Separator className="hidden md:block w-px h-6 bg-slate-700" />
            
            <p className="text-slate-400 text-sm flex items-center gap-1">
              {t.madeWith} <Sparkles className="w-4 h-4 text-yellow-400" /> {t.footerText}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
