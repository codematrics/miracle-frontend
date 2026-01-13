const CommonTable = ({
  columns = [],
  data = [],
  loading = false,
  pagination = { page: 1, limit: 10, total: 0 },
  onPageChange,
}) => {
  const totalPages = Math.max(Math.ceil(pagination.total / pagination.limit), 1);

  const goToPage = page => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  // Generate page numbers with **only one ellipsis**
  const getPageNumbers = () => {
    const current = pagination.page;
    const delta = 1; // pages around current
    const pages = [];

    // Always show first page
    pages.push(1);

    // Ellipsis if needed
    if (current - delta > 2) {
      pages.push('...');
    }

    // Pages around current
    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(totalPages - 1, current + delta);
      i++
    ) {
      pages.push(i);
    }

    // Ellipsis if needed
    if (current + delta < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className="card-table dataTables_wrapper no-footer"
      style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
    >
      <div className="table-responsive" style={{ flexGrow: 1 }}>
        <table className="dataTable text-black" style={{ width: '100%' }}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    textWrap: 'nowrap',
                    paddingRight: '15px',
                    width: col.width || 'fit-content',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No Data found
                </td>
              </tr>
            ) : (
              data.map((item, ind) => (
                <tr key={item.id || ind}>
                  {columns.map((col, ci) => (
                    <td
                      key={ci}
                      style={{
                        textWrap: 'nowrap',
                        paddingRight: '15px',
                        width: col.width || 'fit-content',
                      }}
                    >
                      {col.render
                        ? col.render(item, ind)
                        : col.key
                          ? (col.key
                              .split('.')
                              .reduce((acc, k) => (acc ? acc[k] : undefined), item) ?? '')
                          : ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-sm-flex text-center justify-content-between align-items-center">
        <div className="dataTables_info">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
          entries
        </div>

        <div className="dataTables_paginate paging_simple_numbers d-flex justify-content-center align-items-center pb-3">
          <button
            className={`paginate_button previous ${pagination.page <= 1 ? 'disabled' : ''}`}
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>

          <span className="d-flex">
            {pageNumbers.map((number, index) =>
              number === '...' ? (
                <span key={index} className="paginate_ellipsis ms-1 px-2">
                  …
                </span>
              ) : (
                <button
                  key={index}
                  className={`paginate_button d-flex align-items-center justify-content-center ${
                    pagination.page === number ? 'current' : ''
                  } ms-1`}
                  onClick={() => goToPage(number)}
                >
                  {number}
                </button>
              )
            )}
          </span>

          <button
            className={`paginate_button next ${pagination.page >= totalPages ? 'disabled' : ''}`}
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
