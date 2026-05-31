import { useState } from "react";
import { Participant, Expense } from "../types";
import { generateId } from "../utils";

interface Props {
  participants: Participant[];
  onAdd: (expense: Expense) => void;
}

export default function ExpenseForm({ participants, onAdd }: Props) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  function allSelected() {
    return sharedWith.length === participants.length;
  }

  function toggleParticipant(id: string) {
    setSharedWith((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (allSelected()) {
      setSharedWith([]);
    } else {
      setSharedWith(participants.map((p) => p.id));
    }
  }

  function handleOpen() {
    setSharedWith(participants.map((p) => p.id));
    setPaidBy(participants[0]?.id ?? "");
    setLabel("");
    setAmount("");
    setError("");
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimLabel = label.trim();
    if (!trimLabel) { setError("Le libellé est requis."); return; }
    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) { setError("Montant invalide (doit être > 0)."); return; }
    if (!paidBy) { setError("Choisissez qui a payé."); return; }
    if (sharedWith.length === 0) { setError("Sélectionnez au moins un participant."); return; }

    onAdd({
      id: generateId(),
      label: trimLabel,
      amount: Math.round(parsedAmount * 100) / 100,
      paidBy,
      sharedWith,
      date: new Date().toISOString(),
    });

    setOpen(false);
    setError("");
  }

  if (participants.length === 0) return null;

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
      >
        <span className="text-xl">+</span> Ajouter une dépense
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Nouvelle dépense</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Libellé</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ex : Restaurant, courses..."
                  maxLength={80}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Montant (MAD)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex : 42.50"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payé par</label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                >
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Répartie entre</label>
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    {allSelected() ? "Désélectionner tout" : "Sélectionner tout"}
                  </button>
                </div>
                <div className="space-y-2">
                  {participants.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={sharedWith.includes(p.id)}
                        onChange={() => toggleParticipant(p.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-400"
                      />
                      <span className="text-sm text-slate-700">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
