interface StatCardProps {
  label: string;
  value: string;
  change: string;
}

export default function StatCard({ label, value, change }: StatCardProps) {
  const isPositive = !change.startsWith('-');
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-200/80 transition-all duration-200">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold tracking-tight text-gray-900">{value}</h3>
        <div className={`flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          <span>{change}%</span>
        </div>
      </div>
    </div>
  );
}
