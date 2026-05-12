import { typeBadgeColor } from "@/constants/typeBadgeColor.ts";
import { usePokemons } from "@/hooks/queries/Pokemon/usePokemons";
import { useSearchPokemon } from "@/hooks/queries/Pokemon/useSearchPokemon";
import { useDebounce } from "@/hooks/common/useDebounce";
import type { PokemonSummary } from "@/types/pokemon";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const MAX_TOTAL_WEIGHT = Number(import.meta.env.VITE_MAX_TOTAL_WEIGHT);
const MIN_SPECIES = Number(import.meta.env.VITE_MIN_SPECIES);

const CreateList = () => {
  const { ref, inView } = useInView();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<PokemonSummary[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const togglePokemon = (pokemon: PokemonSummary) => {
    setSelected((prev) =>
      prev.some((p) => p.id === pokemon.id)
        ? prev.filter((p) => p.id !== pokemon.id)
        : [...prev, pokemon],
    );
  };
  const totalWeight = selected.reduce((sum, p) => sum + p.weight, 0);
  const weightPercent = Math.min((totalWeight / MAX_TOTAL_WEIGHT) * 100, 100);
  const isOverweight = totalWeight > MAX_TOTAL_WEIGHT;
  const hasEnoughSpecies = selected.length >= MIN_SPECIES;

  const { data, fetchNextPage, hasNextPage } = usePokemons();
  const { data: searchData, isFetching: isSearching } =
    useSearchPokemon(debouncedSearch);

  const isSearchMode = debouncedSearch.length > 0;
  const pokemons = isSearchMode
    ? (searchData?.data ?? [])
    : (data?.pages.flatMap((p) => p.data) ?? []);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New List</h1>
        <p className="text-base-content/60 mt-1">
          Select at least {MIN_SPECIES} Pokémon. Total weight must not exceed{" "}
          {MAX_TOTAL_WEIGHT} hg.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div
            className="border-2 border-dashed border-base-300 rounded-2xl p-6 mb-6 text-center cursor-pointer hover:border-primary hover:bg-base-100 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
            />
            <div className="text-3xl mb-2">📂</div>
            <p className="font-medium">Upload saved list</p>
            <p className="text-sm text-base-content/50">
              Click or drag a .json file to restore a list
            </p>
          </div>

          <label className="input input-bordered flex items-center gap-2 mb-4">
            <svg
              className="h-4 w-4 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search Pokémon..."
              className="grow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {pokemons.map((pokemon) => {
              const isSelected = selected.some((p) => p.id === pokemon.id);
              return (
                <div
                  key={pokemon.id}
                  onClick={() => togglePokemon(pokemon)}
                  className={`card cursor-pointer border-2 transition-all hover:shadow-md ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-transparent bg-base-100"
                  }`}
                >
                  <div className="card-body items-center text-center p-3">
                    <div className="relative">
                      <img
                        src={pokemon.image ?? ""}
                        alt={pokemon.name}
                        className="w-16 h-16 object-contain"
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium capitalize text-sm">
                      {pokemon.name}
                    </p>
                    <p className="text-xs text-base-content/50">
                      ⚖️ {pokemon.weight} hg
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`badge badge-xs ${typeBadgeColor[type] ?? "badge-ghost"}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={ref} className="h-10 flex items-center justify-center mt-4">
            {!isSearchMode && hasNextPage && (
              <span className="loading loading-spinner loading-sm" />
            )}
            {isSearchMode && isSearching && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </div>
        </div>

        <div className="lg:w-80 shrink-0">
          <div className="card bg-base-100 shadow-sm sticky top-4">
            <div className="card-body">
              <h2 className="card-title text-lg">Selected Pokémon</h2>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-base-content/60">Total weight</span>
                  <span
                    className={`font-bold ${isOverweight ? "text-error" : ""}`}
                  >
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

              {selected.length === 0 ? (
                <div className="text-center py-6 text-base-content/40">
                  <div className="text-3xl mb-2">👆</div>
                  <p className="text-sm">Click on Pokémon to add them</p>
                </div>
              ) : (
                <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {selected.map((p) => (
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
                  <span className="label-text text-sm">List name</span>
                </div>
                <input
                  type="text"
                  placeholder="My awesome team..."
                  className="input input-bordered input-sm"
                />
              </label>

              <button
                className="btn btn-primary w-full"
                disabled={
                  !hasEnoughSpecies || isOverweight || selected.length === 0
                }
              >
                Save List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateList;
