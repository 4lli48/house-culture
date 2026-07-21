import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-6 bg-ivory-200 dark:bg-navy-950 text-navy-900 dark:text-ivory-100 font-arabic">
      <div className="relative">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 tracking-widest select-none font-mono">
          404
        </h1>
        <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white">
          {t('not_found')}
        </h2>
        <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
        </p>
      </div>

      <Link to="/" className="btn-gold px-6 py-3 text-sm gap-2">
        <Home className="w-4 h-4" />
        <span>{t('back_home')}</span>
      </Link>
    </div>
  );
}
