import { usePokemons } from "@/hooks/queries/Pokemon/usePokemons";
import { useSearchPokemon } from "@/hooks/queries/Pokemon/useSearchPokemon";
import { useDebounce } from "@/hooks/common/useDebounce";
import type { PokemonSummary } from "@/types/pokemon";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PokemonCard from "@/components/PokemonCard";
import Loading from "@/components/Loading";
import UploadCollection from "@/components/UploadCollection";
import CreatePokemonForm from "@/components/CreatePokemonForm";

const MAX_TOTAL_WEIGHT = Number(import.meta.env.VITE_MAX_TOTAL_WEIGHT);
const MIN_SPECIES = Number(import.meta.env.VITE_MIN_SPECIES);

const CreateList = () => {
  const { ref, inView } = useInView();
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

  const { data, fetchNextPage, hasNextPage, isLoading } = usePokemons();
  const { data: searchData, isFetching: isSearching } =
    useSearchPokemon(debouncedSearch);

  const isSearchMode = debouncedSearch.length > 0;
  const pokemons = isSearchMode
    ? (searchData?.data ?? [])
    : (data?.pages.flatMap((p) => p.data) ?? []);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <Loading />;
  }

  if ((!pokemons || pokemons.length === 0) && !isSearchMode) {
    return (
      <div className="hero min-h-64 bg-base-100 rounded-2xl">
        <div className="hero-content text-center">
          <div>
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold">No Pokemon found</h2>
            <p className="text-base-content/60 my-3">
              Try adjusting your search or check back later
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New List</h1>
        <p className="text-base-content/60 mt-1">
          Select at least {MIN_SPECIES} Pokemon. Total weight must not exceed{" "}
          {MAX_TOTAL_WEIGHT} hg.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <UploadCollection />

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
              placeholder="Search Pokemon..."
              className="grow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {pokemons.map((pokemon) => {
              const isSelected = selected.some((p) => p.id === pokemon.id);
              return (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isSelected={isSelected}
                  togglePokemon={togglePokemon}
                />
              );
            })}
          </div>

          {isSearchMode && !isSearching && pokemons.length === 0 && (
            <div className="hero min-h-40 bg-base-100 rounded-2xl mt-4">
              <div className="hero-content text-center">
                <div>
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-semibold">No Pokemon found</p>
                  <p className="text-sm text-base-content/50 mt-1">
                    Try a different name, e.g. "pikachu" or "bulbasaur"
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={ref} className="h-10 flex items-center justify-center mt-4">
            {!isSearchMode && hasNextPage && (
              <span className="loading loading-spinner loading-sm" />
            )}
            {isSearchMode && isSearching && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </div>
        </div>

        <CreatePokemonForm
          selected={selected}
          togglePokemon={togglePokemon}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
};

export default CreateList;
