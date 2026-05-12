import Loading from "@/components/Loading";
import { typeBadgeColor } from "@/constants/typeBadgeColor.ts";
import { useCollectionById } from "@/hooks/queries/Collection/useCollectionById";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const ViewList = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCollectionById(id!);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="hero min-h-64 bg-base-100 rounded-2xl">
        <div className="hero-content text-center">
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold">Collection not found</h2>
            <p className="text-base-content/60 my-3">
              The collection you are looking for does not exist or has been
              deleted.
            </p>
            <Link to="/" className="btn btn-primary">
              Back to Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link to="/" className="btn btn-ghost btn-sm mb-2 -ml-2">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <p className="text-base-content/50 text-sm mt-1">
            Created {new Date(data.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button className="btn btn-outline btn-primary">⬇ Download</button>
      </div>

      <div className="stats shadow bg-base-100 w-full mb-6">
        <div className="stat">
          <div className="stat-title">Pokemon Count</div>
          <div className="stat-value text-primary">{data.pokemons.length}</div>
          <div className="stat-desc">species selected</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Weight</div>
          <div className="stat-value">{data.totalWeight}</div>
          <div className="stat-desc">hg out of 1300 max</div>
        </div>
        <div className="stat">
          <div className="stat-title">Weight Usage</div>
          <div className="stat-value text-success">
            {Math.round((data.totalWeight / 1300) * 100)}%
          </div>
          <div className="stat-desc">of weight limit</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Pokemon</h2>
          <ul className="divide-y divide-base-200">
            {data.pokemons.map((pokemon, index) => (
              <li key={pokemon.id} className="flex items-center gap-4 py-3">
                <span className="text-base-content/30 text-sm w-6 text-center font-mono">
                  #{index + 1}
                </span>
                <img
                  src={pokemon.image || ""}
                  alt={pokemon.name}
                  className="w-14 h-14 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold capitalize">{pokemon.name}</p>
                  <div className="flex gap-1 mt-1">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`badge badge-sm ${typeBadgeColor[type] ?? "badge-ghost"}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{pokemon.weight} hg</p>
                  <p className="text-xs text-base-content/40">weight</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="divider" />

          <div className="flex justify-between items-center text-sm font-medium">
            <span>Total weight</span>
            <span className="text-lg font-bold">{data.totalWeight} hg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewList;
