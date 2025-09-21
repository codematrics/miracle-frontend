const CommonTable = ({
  columns = [],
  data = [],
  loading = false,
  pagination = { page: 1, limit: 10, total: 0 },
  onPageChange,
}) => {
  // derive total pages
  const totalPages = Math.max(Math.ceil(pagination.total / pagination.limit), 1);

  // build page numbers array
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPage = page => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  return (
    <div className="card-table dataTables_wrapper no-footer">
      <div className="table-responsive">
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

      {/* Pagination Footer */}
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
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`paginate_button d-flex align-items-center justify-content-center ${
                  pagination.page === number ? 'current' : ''
                } ms-1`}
                onClick={() => goToPage(number)}
              >
                {number}
              </button>
            ))}
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
