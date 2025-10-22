"use client";

import React, { useEffect, useRef, useState } from "react";
import "./CustomDesignCanvas.scss";

const CustomDesignCanvas = ({ designJson, productDetails }) => {
  const canvasDomRefs = {
    front: useRef(null),
    back: useRef(null),
    left: useRef(null),
    right: useRef(null),
  };

  const canvasRefs = useRef({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const [fabricLib, setFabricLib] = useState(null);

  // ✅ Load fabric only in browser (prevents DOMParser errors)
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("fabric").then((mod) => {
        setFabricLib(mod.fabric);
      });
    }
  }, []);

  // ✅ Base image URLs
  const CDN_BASE = "https://cdn.ssactivewear.com/";

  const getImage = (path) => (path ? `${CDN_BASE}${path}` : null);

  const [positions, setPositions] = useState({
    front: "/image/ttest/frontt.png",
    back: "/image/ttest/backt.png",
    left: "/image/ttest/leftt.png",
    right: "/image/ttest/rightt.png",
  });

  // ✅ Update product base images when productDetails change
  useEffect(() => {
    if (!productDetails) return;

    setPositions({
      front:
        getImage(productDetails.colorFrontImage) ||
        getImage(productDetails.colorOnModelFrontImage) ||
        "/image/ttest/frontt.png",
      back:
        getImage(productDetails.colorBackImage) ||
        getImage(productDetails.colorOnModelBackImage) ||
        "/image/ttest/backt.png",
      right:
        getImage(productDetails.colorSideImage) ||
        getImage(productDetails.colorOnModelSideImage) ||
        "/image/ttest/rightt.png",
      left:
        getImage(productDetails.colorDirectSideImage) ||
        "/image/ttest/leftt.png",
    });
  }, [productDetails]);

  // ✅ Initialize canvas for each side
  const initializeCanvas = (side) => {
    if (!fabricLib) return;

    const canvasEl = canvasDomRefs[side].current;
    if (!canvasEl) return;

    const isSide = side === "left" || side === "right";
    const width = isSide ? 100 : 170;
    const height = isSide ? 100 : 320;

    const canvas = new fabricLib.Canvas(canvasEl, {
      width,
      height,
      preserveObjectStacking: true,
      selection: false,
    });

    canvasRefs.current[side] = canvas;
  };

  // ✅ Load design JSON after fabric is available
  useEffect(() => {
    if (!fabricLib) return;

    // Initialize all canvases
    ["front", "back", "left", "right"].forEach((side) => {
      initializeCanvas(side);
    });

    // Load design JSON onto canvases
    if (designJson) {
      try {
        const parsed =
          typeof designJson === "string" ? JSON.parse(designJson) : designJson;

        Object.entries(parsed).forEach(([side, sideJson]) => {
          const canvas = canvasRefs.current[side];
          if (canvas && sideJson) {
            canvas.loadFromJSON(sideJson, () => {
              canvas.getObjects().forEach((obj) => {
                obj.selectable = false;
                obj.evented = false;
              });
              canvas.renderAll();
            });
          }
        });
      } catch (err) {
        console.error("Error parsing design JSON:", err);
      }
    }

    // Cleanup canvases when component unmounts
    return () => {
      Object.values(canvasRefs.current).forEach((canvas) => {
        if (canvas?.dispose) canvas.dispose();
      });
    };
  }, [fabricLib, designJson]);

  // ✅ Render view
  return (
    <div className="design-image-list">
      {["front", "back", "left", "right"].map((side) => {
        const isSide = side === "left" || side === "right";
        const width = isSide ? 100 : 170;
        const height = isSide ? 100 : 320;

        return (
          <div key={side} className="image-container">
            {/* Base Product Image */}
            <img
              src={positions[side]}
              alt={`${side} view`}
              style={{
                height: "465px",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Canvas Overlay */}
            <div
              className="image-edit-area-position"
              style={{ width, height }}
            >
              <canvas
                ref={canvasDomRefs[side]}
                width={width}
                height={height}
                className="canvas-container"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomDesignCanvas;
