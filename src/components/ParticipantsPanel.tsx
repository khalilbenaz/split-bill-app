import { useState } from "react";
import { Participant } from "../types";
import { generateId } from "../utils";

interface Props {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
  expenseParticipantIds: Set<string>;
}

export default function ParticipantsPanel({ participants, onChange, expenseParticipantIds }: Props) {
  const [inputName, setInputName] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const name = inputName.trim();
    if (!name) {
      setError("Veuillez saisir un prénom.");
      return;
    }
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError("Ce participant existe déjà.");
      return;
    }
    onChange([...participants, { id: generateId(), name }]);
    setInputName("");
    setError("");
  }

  function handleRemove(id: string) {
    if (expenseParticipantIds.has(id)) {
      alert("Impossible de supprimer ce participant : il est lié à une ou plusieurs dépenses.");
      return;
    }
    onChange(participants.filter((p) => p.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">👥</span> Participants
      </h2>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputName}
          onChange={(e) => { setInputName(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder="Prénom du participant"
          maxLength={40}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-slate-400"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Ajouter
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      {participants.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-4">Aucun participant. Ajoutez-en un !</p>
      ) : (
        <ul className="space-y-2 mt-3">
          {participants.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                  {p.name.charAt(0)}
                </span>
                <span className="text-sm font-medium text-slate-700">{p.name}</span>
              </div>
              <button
                onClick={() => handleRemove(p.id)}
                aria-label={`Supprimer ${p.name}`}
                className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
