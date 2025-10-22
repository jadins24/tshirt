'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  fetchTemplateGroups,
  fetchTemplateCategories,
  fetchTemplateSectionOnes,
  fetchTemplatesByCategoryAndGroup,
  fetchTemplates,
} from '@/app/services/apicofig';
import './templates.scss';
import Pagination from '@/app/utils/Pagenation/Pagenation';
import { useRouter } from 'next/navigation';
import { RiCloseCircleLine, RiSearchLine, RiEyeLine, RiDownloadLine, RiHeartLine, RiHeartFill } from "react-icons/ri";
import { FiFilter, FiGrid, FiList } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";

export default function Templates() {
  const router = useRouter();

  const [templateSectionOnes, setTemplateSectionOnes] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  
  // New state for enhanced functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, date, popularity
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [favoriteTemplates, setFavoriteTemplates] = useState(new Set());

  const productPerPage = 12;

  // Fetch initial data
  useEffect(() => {
   const fetchInitialData = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const [sections, categories, groups] = await Promise.all([
      fetchTemplateSectionOnes(),
      fetchTemplateCategories(),
      fetchTemplateGroups(),
    ]);
    
    setTemplateSectionOnes(sections);
    setCategoryOptions(categories);
    setGroupOptions(groups);
    
    // Load all templates initially (no filters)
    try {
      console.log('Fetching initial templates...');
      const allTemplates = await fetchTemplates();
      console.log('Initial templates fetched:', allTemplates);
      console.log('Templates length:', allTemplates?.length);
      if (allTemplates && allTemplates.length > 0) {
        setFilteredTemplates(allTemplates);
        setError(null); // Clear any previous errors
      } else {
        console.log('No templates found, setting empty array');
        setFilteredTemplates([]);
        setError(null); // Don't show error for empty results
      }
    } catch (error) {
      console.error('Error fetching initial templates:', error);
      console.error('Error details:', error.message, error.stack);
      setError('Failed to load templates.');
      setFilteredTemplates([]);
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
    setError('Failed to load templates. Please try again later.');
  } finally {
    setIsLoading(false);
    setHasAttemptedLoad(true);
  }
};
    fetchInitialData();
  }, []);

  // Fetch filtered templates with debounce
  useEffect(() => {
    const fetchFilteredTemplates = async () => {
      // Only fetch if we have at least one filter selected
      if (!selectedCategoryId && !selectedGroupId) {
        // If no filters are selected, show all templates
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTemplates();
        if (data && data.length > 0) {
          setFilteredTemplates(data);
          setError(null);
        } else {
          setFilteredTemplates([]);
          setError(null); // Don't show error for empty results
        }
      } catch (error) {
        console.error('Error fetching all templates:', error);
        setError('Failed to load templates.');
        setFilteredTemplates([]);
      } finally {
        setIsLoading(false);
      }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTemplatesByCategoryAndGroup(
          selectedCategoryId,
          selectedGroupId
        );
        if (data && data.length > 0) {
          setFilteredTemplates(data);
          setError(null);
        } else {
          setFilteredTemplates([]);
          setError(null); // Don't show error for empty results
        }
      } catch (error) {
        console.error('Error fetching filtered templates:', error);
        setError('Failed to load filtered templates.');
        setFilteredTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce
    const timeoutId = setTimeout(fetchFilteredTemplates, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategoryId, selectedGroupId]);

  const handleGroupChange = useCallback((e) => {
    setSelectedGroupId(e.target.value);
    setCurrentPage(0);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategoryId(e.target.value);
    setCurrentPage(0);
  }, []);

const handleClearFilters = useCallback(() => {
  setSelectedGroupId('');
  setSelectedCategoryId('');
  setSearchQuery('');
  setCurrentPage(0);
}, []);

// New event handlers
const handleSearchChange = useCallback((e) => {
  setSearchQuery(e.target.value);
  setCurrentPage(0);
}, []);

const handleSortChange = useCallback((e) => {
  setSortBy(e.target.value);
  setCurrentPage(0);
}, []);

const handleViewModeChange = useCallback((mode) => {
  setViewMode(mode);
}, []);

const handleTemplateClick = useCallback((template) => {
  setSelectedTemplate(template);
  setShowPreviewModal(true);
}, []);

const handleClosePreview = useCallback(() => {
  setShowPreviewModal(false);
  setSelectedTemplate(null);
}, []);

const handleToggleFavorite = useCallback((templateId, e) => {
  e.stopPropagation();
  setFavoriteTemplates(prev => {
    const newFavorites = new Set(prev);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    return newFavorites;
  });
}, []);

const handleDownloadTemplate = useCallback((template, e) => {
  e.stopPropagation();
  // Implement download functionality
  console.log('Downloading template:', template);
  // You can add actual download logic here
}, []);

  // Enhanced filtering and sorting logic
  const processedTemplates = useMemo(() => {
    let templates = [...filteredTemplates];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      templates = templates.filter(template => 
        template.name?.toLowerCase().includes(query) ||
        template.templateNo?.toString().includes(query)
      );
    }
    
    // Apply sorting
    templates.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'date':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'popularity':
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        default:
          return 0;
      }
    });
    
    return templates;
  }, [filteredTemplates, searchQuery, sortBy]);

  // Memoized pagination calculations
  const { currentTemplates, pageCount } = useMemo(() => {
    const offset = currentPage * productPerPage;
    const currentTemplates = processedTemplates.slice(offset, offset + productPerPage);
    const pageCount = Math.ceil(processedTemplates.length / productPerPage);
    
    return { currentTemplates, pageCount };
  }, [currentPage, processedTemplates, productPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filteredTemplates]);

  const hasActiveFilters = selectedCategoryId || selectedGroupId || searchQuery.trim();
  const showEmptyState = hasAttemptedLoad && !isLoading && !error && currentTemplates.length === 0 && processedTemplates.length === 0;

  return (
    <div className="templates">
      {/* Header Section */}
      <div className="templates-head">
        <div className="templates-head-content">
          <h1>Templates</h1>
          <p>
            <span className="back-home" onClick={() => router.push('/')}>
              Home
            </span>{" "}
            | Templates
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="templates-container">
        <div className="templates-categories">
          {/* Header with Filters */}
          <div className="templates-categories-header">
            <div className="header-title">
              <h2>Browse Templates</h2>
              <p>Find the perfect template for your needs</p>
            </div>

            <div className="table-filters">
              <div className="filters-container">
                {/* Search Bar */}
                <div className="search-group">
                  <RiSearchLine className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>

                <div className="filter-group">
                  <FiFilter className="filter-icon" />
                  <select
                    value={selectedGroupId}
                    onChange={handleGroupChange}
                    className="status-filter-group"
                  >
                    <option value="">All Groups</option>
                    {groupOptions.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    className="status-filter-categories"
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="sort-select"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                    <option value="popularity">Sort by Popularity</option>
                  </select>
                </div>

                <div className="view-controls">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('grid')}
                    title="Grid View"
                  >
                    <FiGrid />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => handleViewModeChange('list')}
                    title="List View"
                  >
                    <FiList />
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    className="clear-filters-button"
                    onClick={handleClearFilters}
                  >
                    <RiCloseCircleLine />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {(isLoading || !hasAttemptedLoad) && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading templates...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {/* Templates Grid */}
          {hasAttemptedLoad && !isLoading && !error && (filteredTemplates.length > 0 || showEmptyState) && (
            <>
              {processedTemplates.length > 0 && (
                <div className="results-count">
                  Showing {processedTemplates.length} template{processedTemplates.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                </div>
              )}

              <div className={`templates-categories-cards ${viewMode}`}>
                {currentTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    className="templates-categories-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleTemplateClick(template)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTemplateClick(template);
                      }
                    }}
                  >
                    <div className="templates-categories-card-img">
                      <img
                        src={template.imageUrl || '/images/temp.png'}
                        alt={template.name || 'Template'}
                        loading="lazy"
                      />
                      <div className="template-overlay">
                        <button
                          className="template-action-btn preview-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateClick(template);
                          }}
                          title="Preview Template"
                        >
                          <IoMdEye />
                        </button>
                        <button
                          className="template-action-btn download-btn"
                          onClick={(e) => handleDownloadTemplate(template, e)}
                          title="Download Template"
                        >
                          <RiDownloadLine />
                        </button>
                        <button
                          className={`template-action-btn favorite-btn ${favoriteTemplates.has(template.id) ? 'favorited' : ''}`}
                          onClick={(e) => handleToggleFavorite(template.id, e)}
                          title={favoriteTemplates.has(template.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                        >
                          {favoriteTemplates.has(template.id) ? <RiHeartFill /> : <RiHeartLine />}
                        </button>
                      </div>
                    </div>
                    <div className="templates-categories-card-text">
                      <h3>{template.name || `Template ${template.templateNo}`}</h3>
                      {template.templateNo && (
                        <p className="template-number">#{template.templateNo}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {showEmptyState && (
                <div className="empty-state">
                  <p>
                    {hasActiveFilters 
                      ? "No templates found for the selected filters." 
                      : "No templates available at the moment. Please try again later."}
                  </p>
                  {hasActiveFilters && (
                    <button onClick={handleClearFilters} className="clear-filters-suggestion">
                      Clear filters to see all templates
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pageCount > 1 && !isLoading && !error && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Template Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="template-preview-modal" onClick={handleClosePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTemplate.name || `Template ${selectedTemplate.templateNo}`}</h3>
              <button className="close-btn" onClick={handleClosePreview}>
                <RiCloseCircleLine />
              </button>
            </div>
            <div className="modal-body">
              <div className="template-preview-image">
                <img
                  src={selectedTemplate.imageUrl || '/images/temp.png'}
                  alt={selectedTemplate.name || 'Template'}
                />
              </div>
              <div className="template-details">
                <div className="detail-item">
                  <strong>Template Number:</strong> #{selectedTemplate.templateNo || 'N/A'}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> {selectedTemplate.activeStatus ? 'Active' : 'Inactive'}
                </div>
                <div className="detail-item">
                  <strong>Category ID:</strong> {selectedTemplate.templateCategoryId || 'N/A'}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => handleDownloadTemplate(selectedTemplate)}
              >
                <RiDownloadLine />
                Download Template
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  handleClosePreview();
                  router.push('/pages/customDesign');
                }}
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}