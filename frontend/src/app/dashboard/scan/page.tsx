'use client';

import { Suspense } from 'react';
import ScanInner from './scan-inner';

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ScanInner />
    </Suspense>
  );
}
