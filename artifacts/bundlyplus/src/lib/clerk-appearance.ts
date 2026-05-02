import { shadcn } from "@clerk/themes";
import { arSA, enUS } from "@clerk/localizations";
import type { Appearance } from "@clerk/types";
import type { Lang } from "./i18n";

export const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function buildClerkAppearance(): Appearance {
  return {
    theme: shadcn,
    cssLayerName: "clerk",
    layout: {
      logoPlacement: "inside",
      logoLinkUrl: basePath || "/",
      logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    },
    variables: {
      colorPrimary: "#E8456A",
      colorForeground: "#0f172a",
      colorMutedForeground: "#64748b",
      colorBackground: "#ffffff",
      colorInput: "#f8fafc",
      colorInputForeground: "#0f172a",
      colorNeutral: "#cbd5e1",
      colorDanger: "#dc2626",
      fontFamily: "'Inter', system-ui, sans-serif",
      borderRadius: "0.875rem",
    },
    elements: {
      rootBox: "w-full flex justify-center",
      cardBox:
        "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 rounded-3xl w-[440px] max-w-full overflow-hidden shadow-xl shadow-pink-900/5",
      card: "!shadow-none !border-0 !bg-transparent !rounded-none px-2",
      footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
      headerTitle: "text-slate-900 dark:text-slate-100 font-display",
      headerSubtitle: "text-slate-500 dark:text-slate-400",
      socialButtonsBlockButton:
        "!bg-white dark:!bg-slate-800 hover:!bg-slate-50 dark:hover:!bg-slate-700 !border !border-slate-200 dark:!border-slate-700 !rounded-xl",
      socialButtonsBlockButtonText: "!text-slate-700 dark:!text-slate-200 !font-semibold",
      formButtonPrimary:
        "!bg-gradient-to-r !from-pink-500 !to-purple-500 hover:!opacity-90 !text-white !font-semibold !rounded-xl !shadow-md !shadow-pink-500/30",
      formFieldLabel: "!text-slate-700 dark:!text-slate-200 !font-semibold !text-sm",
      formFieldInput:
        "!bg-slate-50 dark:!bg-slate-800 !border !border-slate-200 dark:!border-slate-700 !rounded-xl !text-slate-800 dark:!text-slate-100 focus:!border-pink-400 focus:!ring-2 focus:!ring-pink-200 dark:focus:!ring-pink-900/40",
      footerActionLink: "!text-pink-600 dark:!text-pink-400 hover:!text-pink-500 !font-semibold",
      footerActionText: "!text-slate-500 dark:!text-slate-400",
      dividerText: "!text-slate-400 dark:!text-slate-500",
      dividerLine: "!bg-slate-200 dark:!bg-slate-700",
      identityPreviewEditButton: "!text-pink-600 dark:!text-pink-400 hover:!text-pink-500",
      formFieldSuccessText: "!text-emerald-600 dark:!text-emerald-400",
      alertText: "!text-slate-700 dark:!text-slate-200",
      alert:
        "!bg-pink-50 dark:!bg-pink-950/40 !border !border-pink-100 dark:!border-pink-900/50 !rounded-xl",
      logoBox: "h-10 mb-2",
      logoImage: "h-9 w-auto",
      otpCodeFieldInput:
        "!bg-slate-50 dark:!bg-slate-800 !border !border-slate-200 dark:!border-slate-700 !rounded-xl !text-slate-800 dark:!text-slate-100",
      formFieldRow: "space-y-1.5",
      main: "px-2",
    },
  };
}

export function getClerkLocalization(lang: Lang) {
  return lang === "ar" ? arSA : enUS;
}
