type PaginationProps = {
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
};

const Pagination = ({
  total,
  limit,
  offset,
  onPageChange,
}: PaginationProps) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      <p className="text-sm text-base-content/50">
        Showing{" "}
        <span className="font-semibold text-base-content">
          {offset + 1}–{Math.min(offset + limit, total)}
        </span>{" "}
        of <span className="font-semibold text-base-content">{total}</span>{" "}
        collections
      </p>
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(offset - limit)}
        >
          «
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`join-item btn btn-sm ${page === currentPage ? "btn-active btn-primary" : ""}`}
            onClick={() => onPageChange((page - 1) * limit)}
          >
            {page}
          </button>
        ))}
        <button
          className="join-item btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(offset + limit)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
