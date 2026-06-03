import { Balance, Transfer, Expense } from "../types";
import { formatEuro } from "../utils";

interface Props {
  balances: Balance[];
  transfers: Transfer[];
  expenses: Expense[];
}

export default function BalanceSummary({ balances, transfers, expenses }: Props) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgPerPerson = balances.length > 0 ? total / balances.length : 0;

  return (
    <div className="space-y-4">
      {/* Totaux */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 text-white shadow-md">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-wide mb-1">Total du groupe</p>
        <p className="text-3xl font-bold">{formatEuro(total)}</p>
        {balances.length > 0 && (
          <p className="text-indigo-200 text-sm mt-1">
            Soit {formatEuro(avgPerPerson)} par personne (moyenne)
          </p>
        )}
      </div>

      {/* Soldes individuels */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚖️</span> Soldes
        </h2>
        {balances.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">Aucun participant.</p>
        ) : (
          <ul className="space-y-3">
            {balances.map((b) => {
              const isPositive = b.net > 0.005;
              const isNegative = b.net < -0.005;
              return (
                <li key={b.participantId} className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase shrink-0">
                    {b.name.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-slate-700 truncate min-w-0">{b.name}</span>
                      <span
                        className={`text-sm font-bold whitespace-nowrap ${
                          isPositive
                            ? "text-emerald-600"
                            : isNegative
                            ? "text-red-500"
                            : "text-slate-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}{formatEuro(b.net)}
                      </span>
                    </div>
                    {/* Barre de progression */}
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span>Payé {formatEuro(b.paid)}</span>
                      <span>·</span>
                      <span>Part {formatEuro(b.owes)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Règlement simplifié */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💸</span> Règlement simplifié
        </h2>
        {transfers.length === 0 ? (
          <div className="text-center py-4">
            {balances.length > 0 ? (
              <div className="inline-flex flex-col items-center gap-2">
                <span className="text-3xl">🎉</span>
                <p className="text-slate-500 text-sm font-medium">Tout est équilibré !</p>
                <p className="text-slate-400 text-xs">Personne ne doit rien à personne.</p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Aucune donnée à afficher.</p>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {transfers.map((t, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase shrink-0">
                  {t.from.charAt(0)}
                </span>
                <div className="flex-1 min-w-0 text-sm text-slate-700 break-words">
                  <span className="font-semibold text-slate-800">{t.from}</span>
                  {" doit "}
                  <span className="font-bold text-amber-700">{formatEuro(t.amount)}</span>
                  {" à "}
                  <span className="font-semibold text-slate-800">{t.to}</span>
                </div>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold uppercase shrink-0">
                  {t.to.charAt(0)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
