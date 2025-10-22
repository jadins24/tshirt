import React from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight, FaEllipsisH, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Pagenation.scss';

function Pagination({ currentPage, pageCount, setCurrentPage }) {
  const getPageNumbers = () => {
    const pages = [];
    const totalVisible = 7;
    
    if (pageCount <= totalVisible) {
      return [...Array(pageCount).keys()];
    }

    // Always show first page
    pages.push(0);

    if (currentPage <= 3) {
      // Show pages 1, 2, 3, 4, 5
      for (let i = 1; i <= Math.min(4, pageCount - 2); i++) {
        pages.push(i);
      }
      if (pageCount > 6) {
        pages.push(-1); // Ellipsis
      }
    } else if (currentPage >= pageCount - 4) {
      // Show last 5 pages
      if (pageCount > 6) {
        pages.push(-1); // Ellipsis
      }
      for (let i = Math.max(pageCount - 5, 1); i < pageCount - 1; i++) {
        pages.push(i);
      }
    } else {
      // Show current page with context
      pages.push(-1); // Ellipsis
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push(-1); // Ellipsis
    }

    // Always show last page
    if (pageCount > 1) {
      pages.push(pageCount - 1);
    }

    return pages;
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== -1 && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFirstPage = () => {
    if (currentPage !== 0) {
      setCurrentPage(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLastPage = () => {
    if (currentPage !== pageCount - 1) {
      setCurrentPage(pageCount - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (pageCount <= 1) return null;

  return (
    <div className="pagination">
      <div className="pagination-container">
        {/* Page Info */}
        <div className="page-info">
          <div className="page-info-badge">
            <span className="page-info-text">
              Page <span className="current-page">{currentPage + 1}</span> of <span className="total-pages">{pageCount}</span>
            </span>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          {/* First Page Button */}
          <button
            className={`pagination-btn first-btn ${currentPage === 0 ? 'disabled' : ''}`}
            disabled={currentPage === 0}
            onClick={handleFirstPage}
            aria-label="First page"
            title="First page"
          >
            <FaArrowLeft className="btn-icon" />
          </button>

          {/* Previous Button */}
          <button
            className={`pagination-btn prev-btn ${currentPage === 0 ? 'disabled' : ''}`}
            disabled={currentPage === 0}
            onClick={handlePrevious}
            aria-label="Previous page"
            title="Previous page"
          >
            <FaChevronLeft className="btn-icon" />
            <span className="btn-text">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="page-numbers">
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(pageNumber)}
                className={`page-number ${currentPage === pageNumber ? 'active' : ''} ${pageNumber === -1 ? 'ellipsis' : ''}`}
                disabled={pageNumber === -1}
                aria-label={pageNumber === -1 ? 'More pages' : `Go to page ${pageNumber + 1}`}
                title={pageNumber === -1 ? 'More pages' : `Go to page ${pageNumber + 1}`}
              >
                {pageNumber === -1 ? <FaEllipsisH /> : pageNumber + 1}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            className={`pagination-btn next-btn ${currentPage === pageCount - 1 ? 'disabled' : ''}`}
            disabled={currentPage === pageCount - 1}
            onClick={handleNext}
            aria-label="Next page"
            title="Next page"
          >
            <span className="btn-text">Next</span>
            <FaChevronRight className="btn-icon" />
          </button>

          {/* Last Page Button */}
          <button
            className={`pagination-btn last-btn ${currentPage === pageCount - 1 ? 'disabled' : ''}`}
            disabled={currentPage === pageCount - 1}
            onClick={handleLastPage}
            aria-label="Last page"
            title="Last page"
          >
            <FaArrowRight className="btn-icon" />
          </button>
        </div>

        {/* Quick Jump */}
        <div className="quick-jump">
          <span className="quick-jump-label">Jump to:</span>
          <select 
            className="quick-jump-select"
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value))}
            aria-label="Jump to page"
          >
            {[...Array(pageCount).keys()].map(page => (
              <option key={page} value={page}>
                Page {page + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default Pagination;
