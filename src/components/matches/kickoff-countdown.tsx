"use client";

import { useEffect, useState } from "react";

import { getKickoffStatus, type KickoffStatus } from "@/lib/kickoff";

type KickoffCountdownProps = {
  kickoffAt: string;
  matchStatus: string;
  compact?: boolean;
};

export function KickoffCountdown({
  kickoffAt,
  matchStatus,
  compact = false,
}: KickoffCountdownProps) {
  const [status, setStatus] = useState<KickoffStatus>(() =>
    getKickoffStatus(kickoffAt, matchStatus),
  );

  useEffect(() => {
    const tick = () => setStatus(getKickoffStatus(kickoffAt, matchStatus));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [kickoffAt, matchStatus]);

  if (status.kind === "postponed") {
    return (
      <span className="inline-flex rounded-full badge-postponed px-2.5 py-1 text-xs font-semibold">
        {status.label}
      </span>
    );
  }

  if (status.kind === "closed") {
    return (
      <span
        className={`text-boludo-muted ${compact ? "text-xs" : "text-sm font-medium"}`}
      >
        {status.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-semibold ${
        compact ? "text-xs" : "text-sm"
      } ${
        status.urgent
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-boludo-accent-light text-boludo-accent-dark border border-[#fcd34d]"
      }`}
    >
      ⏱ {status.label}
    </span>
  );
}
