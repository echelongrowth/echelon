export function EntrepreneurialTrackLocked({
  reason,
}: {
  reason: string;
}) {
  return (
    <div className="mt-5 rounded-xl border border-slate-700/55 bg-slate-900/55 p-6">
      <p className="label-micro">Strategic Side-Project Engine</p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-100">
        Entrepreneurial Track Required
      </h3>
      <p className="mt-3 text-sm text-slate-300">{reason}</p>
    </div>
  );
}
