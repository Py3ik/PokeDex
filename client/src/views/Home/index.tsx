import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Collections</h1>
        </div>
        <Link to="/create" className="btn btn-primary">
          + Create New List
        </Link>
      </div>
    </div>
  );
};

export default Home;
