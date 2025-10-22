"use client";

export const dynamic = "force-dynamic";
export const ssr = false;

import React, { useEffect, useRef, useState } from "react";
// Dynamic import for Fabric.js to prevent SSR issues
let fabric;
if (typeof window !== 'undefined') {
  import("fabric").then(module => {
    fabric = module.fabric;
  });
}
import axios from "axios";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import "./MyDesigns.scss";
import { useSelector } from "react-redux";
import { API_URL } from "@/app/services/apicofig";
import { FaTrash } from "react-icons/fa";

const Mydesigns = () => {
  const user = useSelector((state) => state.auth?.user || null);
  const userId = user?.id || null;
  const [showConfirm, setShowConfirm] = useState(false);
  const [designToDelete, setDesignToDelete] = useState(null);

  const [designs, setDesigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const designsPerPage = 12;

  useEffect(() => {
    const fetchDesigns = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `${API_URL}/CustomDesigns/user/${userId}`
        );
        setDesigns(response.data);
      } catch (error) {
        console.log(
          "Error fetching designs:",
          error.response?.data || error.message
        );
      }
    };
    fetchDesigns();
  }, [userId]);

  const offset = currentPage * designsPerPage;
  const currentDesigns = designs.slice(offset, offset + designsPerPage);
  const pageCount = Math.ceil(designs.length / designsPerPage);

  const renderFrontCanvas = (designJson, canvasRef) => {
    try {
      const parsed = JSON.parse(designJson);
      const canvas = new fabric.StaticCanvas(canvasRef, {
        width: 170,
        height: 320,
        backgroundColor: "#fff",
      });
      canvas.loadFromJSON(parsed.front, () => {
        canvas.renderAll();
      });
    } catch (err) {
      console.error("Failed to render canvas", err);
    }
  };

  const handleDeleteClick = (designId) => {
    setDesignToDelete(designId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/CustomDesigns/${designToDelete}`);
      setDesigns(designs.filter((d) => d.id !== designToDelete));
      setShowConfirm(false);
      setDesignToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  return (
    <div className="mydesigns-page">
      <h2>My Designs</h2>
      {designs.length === 0 ? (
        <p>No designs found.</p>
      ) : (
        <>
          <div className="design-list">
            {currentDesigns.map((design) => (
              <div key={design.id} className="design-card">
                <div className="design-header">
                  <h3>Design: {design.id}</h3>
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDeleteClick(design.id)}
                  />
                </div>
                <canvas
                  ref={(ref) => {
                    if (ref) renderFrontCanvas(design.designJson, ref);
                  }}
                />
              </div>
            ))}
          </div>
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <p>Are you sure you want to delete this design?</p>
            <div className="confirm-btns">
              <button className="cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="confirm" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mydesigns;
