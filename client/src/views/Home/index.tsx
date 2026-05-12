import Loading from "@/components/Loading";
import { useCollections } from "@/hooks/queries/Collection/useCollections";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading } = useCollections();

  if (isLoading) {
    return <Loading />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="hero min-h-64 bg-base-100 rounded-2xl">
        <div className="hero-content text-center">
          <div>
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold">No collections yet</h2>
            <p className="text-base-content/60 my-3">
              Create your first Pokemon list to get started
            </p>
            <Link to="/create" className="btn btn-primary">
              Create New List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Collections</h1>
          <p className="text-base-content/60 mt-1">
            saved list
            {data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to="/create" className="btn btn-primary">
          + Create New List
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((col) => (
          <div
            key={col._id}
            className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-start justify-between">
                <h2 className="card-title">{col.name}</h2>
                <div className="badge badge-primary badge-outline">
                  {col.pokemons.length} Pokemon
                </div>
              </div>

              <div className="flex gap-4 text-sm text-base-content/60 mt-1">
                <span>⚖️ {col.totalWeight} hg</span>
                <span>📅 {new Date(col.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="card-actions justify-end mt-3">
                <Link
                  to={`/collection/${col._id}`}
                  className="btn btn-sm btn-primary"
                >
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
