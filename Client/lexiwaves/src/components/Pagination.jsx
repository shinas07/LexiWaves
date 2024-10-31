import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageClick = (pageNumber) => {
        if (onPageChange) onPageChange(pageNumber);
    };

    const handlePreviousClick = () => {
        if (currentPage > 1) {
            handlePageClick(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            handlePageClick(currentPage + 1);
        }
    };

    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className='flex items-center mt-12 justify-center space-x-2'>
            <button 
                onClick={handlePreviousClick}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                    currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-white hover:bg-gray-600'
                }`}
            >
                &lt;
            </button>

            {getPageNumbers().map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => handlePageClick(pageNum)}
                    className={`w-8 h-8 rounded-full ${
                        currentPage === pageNum 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {pageNum}
                </button>
            ))}

            <button 
                onClick={handleNextClick} 
                disabled={currentPage === totalPages}    
                className={`p-2 rounded-full ${
                    currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-white hover:bg-gray-600'
                }`}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
    
