import type { PropsWithChildren } from "react";

export function AuroraBackground({ children }: PropsWithChildren) {
  return (
    <div className="aurora-background">
      <span className="aurora-blob aurora-blob-mint" aria-hidden="true" />
      <span className="aurora-blob aurora-blob-green" aria-hidden="true" />
      <span className="aurora-blob aurora-blob-soft" aria-hidden="true" />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
