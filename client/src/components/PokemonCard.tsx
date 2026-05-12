import { typeBadgeColor } from "@/constants/typeBadgeColor";
import type { PokemonSummary } from "@/types/pokemon";

const PokemonCard = ({
  pokemon,
  isSelected,
  togglePokemon,
}: {
  pokemon: PokemonSummary;
  isSelected: boolean;
  togglePokemon: (pokemon: PokemonSummary) => void;
}) => {
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
        <p className="font-medium capitalize text-sm">{pokemon.name}</p>
        <p className="text-xs text-base-content/50">⚖️ {pokemon.weight} hg</p>
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
};
export default PokemonCard;
