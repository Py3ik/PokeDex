import { useCreateCollection } from "@/hooks/mutations/Collection/useCreateCollection";
import type { PokemonSummary } from "@/types/pokemon";
import { memo, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/Modal";

const MAX_TOTAL_WEIGHT = Number(import.meta.env.VITE_MAX_TOTAL_WEIGHT);
const MIN_SPECIES = Number(import.meta.env.VITE_MIN_SPECIES);

const CreatePokemonForm = ({
  selected,
  togglePokemon,
  setSelected,
}: {
  selected: Map<number, PokemonSummary>;
  togglePokemon: (pokemon: PokemonSummary) => void;
  setSelected: (selected: Map<number, PokemonSummary>) => void;
}) => {
  const selectedPokemons = useMemo(
    () => Array.from(selected.values()),
    [selected],
  );
  const navigate = useNavigate();
  const [listName, setListName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const successModalRef = useRef<HTMLDialogElement>(null);

  const totalWeight = useMemo(() => {
    let sum = 0;
    for (const p of selected.values()) {
      sum += p.weight;
    }
    return sum;
  }, [selected]);

  const weightPercent = Math.min((totalWeight / MAX_TOTAL_WEIGHT) * 100, 100);
  const isOverweight = totalWeight > MAX_TOTAL_WEIGHT;
  const hasEnoughSpecies = selected.size >= MIN_SPECIES;
  const { mutateAsync, isPending } = useCreateCollection();
  const createCollection = async () => {
    const payload = {
      name: listName,
      pokemons: selectedPokemons,
    };
    await mutateAsync(payload).then((created) => {
      setCreatedId(created._id);
      setListName("");
      setSelected(new Map());
      setNameTouched(false);
      successModalRef.current?.showModal();
    });
  };
  return (
    <div className="lg:w-80 shrink-0">
      <div className="card bg-base-100 shadow-sm sticky top-4">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-lg">Selected Pokemon</h2>
            {selected.size > 0 && (
              <button
                className="btn btn-ghost btn-xs text-base-content/50"
                onClick={() => setSelected(new Map())}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-base-content/60">Total weight</span>
              <span className={`font-bold ${isOverweight ? "text-error" : ""}`}>
                {totalWeight} / {MAX_TOTAL_WEIGHT} hg
              </span>
            </div>
            <progress
              className={`progress w-full ${isOverweight ? "progress-error" : "progress-primary"}`}
              value={weightPercent}
              max="100"
            />
          </div>

          <div className="flex flex-col gap-1 mb-3">
            <div
              className={`flex items-center gap-2 text-sm ${hasEnoughSpecies ? "text-success" : "text-base-content/50"}`}
            >
              <span>{hasEnoughSpecies ? "✓" : "○"}</span>
              <span>At least {MIN_SPECIES} different species</span>
            </div>
            <div
              className={`flex items-center gap-2 text-sm ${!isOverweight ? "text-success" : "text-error"}`}
            >
              <span>{!isOverweight ? "✓" : "✗"}</span>
              <span>Total weight ≤ {MAX_TOTAL_WEIGHT} hg</span>
            </div>
          </div>

          {selected.size === 0 ? (
            <div className="text-center py-6 text-base-content/40">
              <div className="text-3xl mb-2">👆</div>
              <p className="text-sm">Click on Pokemon to add them</p>
            </div>
          ) : (
            <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
              {selectedPokemons.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={p.image ?? ""}
                      alt={p.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="capitalize text-sm font-medium">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/50">
                      {p.weight} hg
                    </span>
                    <button
                      onClick={() => togglePokemon(p)}
                      className="btn btn-ghost btn-xs text-error"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <label className="form-control mb-3">
            <div className="label">
              <span className="label-text text-sm">
                List name
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <input
              type="text"
              placeholder="My awesome team..."
              className={`input input-bordered input-sm ${
                nameTouched && listName.trim() === "" ? "input-error" : ""
              }`}
              required
              maxLength={32}
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onBlur={() => setNameTouched(true)}
            />
            {nameTouched && listName.trim() === "" && (
              <div className="label">
                <span className="label-text-alt text-error">
                  This field is required
                </span>
              </div>
            )}
          </label>

          <button
            className="btn btn-primary w-full"
            disabled={
              !hasEnoughSpecies ||
              isOverweight ||
              selected.size === 0 ||
              listName.trim() === "" ||
              isPending
            }
            onClick={() => createCollection()}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Save List"
            )}
          </button>

          <Modal
            ref={successModalRef}
            title="Collection created!"
            actions={
              <div className="flex gap-2 justify-end w-full">
                <form method="dialog">
                  <button className="btn">Stay here</button>
                </form>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    createdId && navigate(`/collection/${createdId}`)
                  }
                >
                  Go to collection
                </button>
              </div>
            }
          >
            <p>Your collection was successfully saved.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default memo(CreatePokemonForm);
