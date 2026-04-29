import React from 'react';
import { motion } from 'framer-motion';
import { BundleCard } from '@/components/shared/BundleCard';
import { ProductGridSkeleton } from '@/components/shared/ProductGridSkeleton';
import { PageLayout } from '@/components/shared/PageLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { useBundles } from '@/lib/firestore-hooks';
import { Bundle } from '@/types';
import { fadeUp, staggerContainerFast, DURATION, EASE } from '@/lib/motion';
import { useI18n } from '@/lib/i18n';

export default function Bundles() {
  const { data: bundles = [], isLoading } = useBundles();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <PageLayout>
        <PageHeader title={t.bundles.title} gradientWord={t.bundles.gradientWord} subtitle={t.bundles.subtitle} />
        <ProductGridSkeleton count={4} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={t.bundles.title}
        gradientWord={t.bundles.gradientWord}
        subtitle={t.bundles.subtitle}
      />

      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
      >
        {(bundles as Bundle[]).map((bundle, index) => (
          <motion.div key={bundle.id} variants={fadeUp} transition={{ duration: DURATION.normal, ease: EASE.smooth }}>
            <BundleCard bundle={bundle} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  );
}
