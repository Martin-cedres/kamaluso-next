// /components/CategoryPageLayout.tsx
import React, { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export function CategoryPageLayout({ title, children }: Props) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-pink-700 text-center">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
}