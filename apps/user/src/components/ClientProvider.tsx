"use client";

import { ReactNode } from "react";

export function ClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
