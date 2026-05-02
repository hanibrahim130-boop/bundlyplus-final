import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-40 pb-32 px-6 max-w-3xl mx-auto min-h-[80vh] flex flex-col items-center justify-center text-center"
    >
      <div className="text-8xl sm:text-9xl font-display font-bold text-gradient mb-6 select-none">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-800 dark:text-slate-100 mb-4">
        {t.notFound.title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md text-lg leading-relaxed">
        {t.notFound.desc}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-lg shadow-slate-900/20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {t.notFound.back}
      </Link>
    </motion.div>
  );
}
