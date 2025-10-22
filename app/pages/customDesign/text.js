  "use client";
  import React, { useState, useRef } from "react";
  import { IoMoveOutline, IoCloseOutline ,IoDuplicateOutline, IoResizeOutline} from "react-icons/io5";
  import './customDesign.scss';
import Image from "next/image";


  const customDesign = () => {
    const [elements, setElements] = useState([]); 
    const [selectedElementId, setSelectedElementId] = useState(null); 
    const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false); 
    const canvasRef = useRef(null);

    // Add a new text element
    const addText = () => {
      const newElement = {
        id: `text-${Date.now()}`,
        text: "Custom Text",
        type: "text",
        x: 100,
        y: 100,
        width: 150,
        height: 40,
        color: "#000000",
        fontFamily: "Roboto", 
        textTransform: "none",
        fontWeight:  "normal", 
        fontSize: 20,
        textShape:"none",
      };
      setElements([...elements, newElement]);
      setSelectedElementId(newElement.id);
    };

    // Update an element by ID
    const updateElement = (id, updatedProps) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updatedProps } : el))
      );
    };

    const handleTextStyleChange = (property, value) => {
      if (selectedElementId) {
        updateElement(selectedElementId, { [property]: value });
      }
    };
    
    // Handle selecting an element
    const selectElement = (id) => {
      setSelectedElementId(id);
    };

    // Handle dragging
    const handleDragStart = (e, id) => {
      e.stopPropagation();
      const rect = canvasRef.current.getBoundingClientRect();
      const element = elements.find((el) => el.id === id);
      setSelectedElementId(id);
      setDragging(true);
      setDraggingOffset({
        x: e.clientX - rect.left - element.x,
        y: e.clientY - rect.top - element.y,
      });
    };

    const handleDragMove = (e) => {
      if (!dragging || !selectedElementId) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - draggingOffset.x;
      const newY = e.clientY - rect.top - draggingOffset.y;

      const element = elements.find((el) => el.id === selectedElementId);
      const maxX = rect.width - element.width;
      const maxY = rect.height - element.height;

      updateElement(selectedElementId, {
        x: Math.min(Math.max(newX, 0), maxX),
        y: Math.min(Math.max(newY, 0), maxY),
      });
    };

    const handleDragEnd = () => {
      setDragging(false);
    };

    // Deselect the current text
    const deselectElement = () => {
      setSelectedElementId(null);
    };

    const [resizing, setResizing] = useState(false); 
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 }); 

    const handleResizeStart = (e, id) => {
      e.stopPropagation();
      setSelectedElementId(id);
      setResizing(true);
      setResizeStart({ x: e.clientX, y: e.clientY });
    };


  const handleResizeMove = (e) => {
    if (!resizing || !selectedElementId) return;

    const dx = e.clientX - resizeStart.x; 
    const dy = e.clientY - resizeStart.y; 

    setResizeStart({ x: e.clientX, y: e.clientY }); 

    const element = elements.find((el) => el.id === selectedElementId);
    updateElement(selectedElementId, {
      width: Math.max(element.width + dx, 50), 
      height: Math.max(element.height + dy, 20),
    });
  };

    const handleResizeEnd = () => {
      setResizing(false);
    };

  const duplicateElement = () => {
    if (!selectedElementId) return;

    const elementToDuplicate = elements.find((el) => el.id === selectedElementId);
    if (!elementToDuplicate) return;

    const newElement = {
      ...elementToDuplicate,
      id: `text-${Date.now()}`, 
      x: elementToDuplicate.x + 20, 
      y: elementToDuplicate.y + 20,
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id); 
  };

  const handleDelete = () => {
    setElements(elements.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const addImage = (src) => {
    const newElement = {
      id: `image-${Date.now()}`,
      type: "image",
      src,
      x: 100,
      y: 100,
      width: 150,
      height: 150,
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

    return (
      <div style={{ display: "flex", padding: "20px" }}>
        {/* Sidebar */}
        <div style={{ width: "20%", padding: "10px", background: "#f4f4f4" }}>
          <h3>Controls</h3>
          <button onClick={addText}>Add Text</button>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {selectedElementId && (
            <>
              <h4>Edit Text</h4>
              <input
                type="text"
                value={
                  elements.find((el) => el.id === selectedElementId)?.text || ""
                }
                onChange={(e) =>
                  updateElement(selectedElementId, { text: e.target.value })
                }
              />
              <h4>Text Color</h4>
              <input
                type="color"
                value={
                  elements.find((el) => el.id === selectedElementId)?.color || ""
                }
                onChange={(e) =>
                  updateElement(selectedElementId, { color: e.target.value })
                }
              />
              <h4>Select Font Family</h4>

              <select
                value={elements.find((el) => el.id === selectedElementId)?.fontFamily || "Roboto"}
                onChange={(e) => handleTextStyleChange("fontFamily", e.target.value)}
              >
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Courier New">Courier New</option>
              <option value="Lucida Console">Lucida Console</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Oswald">Oswald</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Raleway">Raleway</option>
              <option value="Poppins">Poppins</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Roboto Slab">Roboto Slab</option>
              <option value="Noto Sans">Noto Sans</option>
            </select>

            <h4>Text Transformation</h4>
            <select
              value={elements.find((el) => el.id === selectedElementId)?.textTransform || "none"}
              onChange={(e) =>
                updateElement(selectedElementId, { textTransform: e.target.value })
              }
            >
              <option value="none">None</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>

              <h4>Font Weight</h4>
              <select
                value={elements.find((el) => el.id === selectedElementId)?.fontWeight || "normal"}
                onChange={(e) =>
                  updateElement(selectedElementId, { fontWeight: e.target.value })
                }
              >
                <option value="normal">Regular</option>
                <option value="500">Medium</option>
                <option value="900  ">Bold</option>
              </select>

              <h4>Font Size</h4>
              <input
                type="number"
                value={
                  elements.find((el) => el.id === selectedElementId)?.fontSize ||
                  ""
                }
                onChange={(e) =>
                  updateElement(selectedElementId, {
                    fontSize: parseInt(e.target.value, 10),
                  })
                }
              />
              <label>
                Select Text Shape:
                    <select
                      value={selectedElementId && elements.find(el => el.id === selectedElementId)?.textShape || "none"}
                      onChange={(e) =>
                        updateElement(selectedElementId, {
                          textShape: e.target.value,
                        })
                      }
                    >
                      <option value="none">None</option>
                      <option value="curve">Curve</option>
                      <option value="pinch">Pinch</option>
                      <option value="perspective">Perspective</option>
                      <option value="bridge">Bridge</option>
                      <option value="arc">Arc</option>
                    </select>
              </label>

                          
              <button onClick={handleDelete} disabled={!selectedElementId}>
                Delete Selected
              </button>
            </>
          )}
        </div>

        <div  style={{
            height:"100vh",
            width:"100%",
            background: "red",
            display:'flex',
            alignItems: "center",
            justifyContent: "center",

          }}>

      {/* Canvas */}
      <div
          ref={canvasRef}
          style={{
          height: '500px',
          width: '500px',
          backgroundImage: 'url("/image/tbg.jpg")', 
          backgroundSize: 'cover',  
          backgroundPosition: 'center', 
          position: 'relative',
        }}
          onMouseMove={(e) => {
            handleDragMove(e); 
            handleResizeMove(e);
          }}
          onMouseUp={() => {
            handleDragEnd(); 
            handleResizeEnd(); 
          }}
          onMouseLeave={() => {
            handleDragEnd(); 
            handleResizeEnd(); 
          }}
        >
          {elements.map((el) => (
            el.type === "text" ? (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: el.x,
                top: el.y,
                color: el.color,
                fontSize: `${el.fontSize}px`,
                fontFamily: el.fontFamily || "Roboto",
                textTransform: el.textTransform || "none", 
                userSelect: "none",
                width: `${el.width}px`,
                height: `${el.height}px`,
                fontWeight: el.fontWeight || "normal",
                border:el.id === selectedElementId ? "1px solid blue" : "none",
                boxSizing: "border-box",
                textShape:"none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onDoubleClick={() => selectElement(el.id)}
            >
              {el.text}
              {el.id === selectedElementId && (
                <IoCloseOutline
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={deselectElement}
                />
              )}

              {/* Move Icon */}
              {el.id === selectedElementId && (
                <IoMoveOutline
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "-10px",
                    fontSize: "16px",
                    cursor: "move",
                  }}
                  onMouseDown={(e) => handleDragStart(e, el.id)}
                />
              )}
              {el.id === selectedElementId && (
                <IoResizeOutline
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "100%",
                    fontSize: "16px",
                    cursor: "nwse-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, el.id)}
                />
              )}
              {el.id === selectedElementId && (
              <IoDuplicateOutline
                style={{
                  position: "absolute",
                  top: "0%",
                  right: "100%",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "green",
                }}
                onClick={duplicateElement} 
              />
            )}

            </div>
          ) : (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: el.x,
                top: el.y,
                width: `${el.width}px`,
                height: `${el.height}px`,
                border: el.id === selectedElementId ? "1px solid blue" : "none",
              }}
              onMouseDown={(e) => handleDragStart(e, el.id)}
            >
              <Image
                src={el.src}
                alt="Custom Element"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  userSelect: "none",
                  pointerEvents: "none", 
                }}
              />

              {/* Close Icon */}
              {el.id === selectedElementId && (
                <IoCloseOutline
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={handleDelete}
                />
              )}

              {/* Move Icon */}
              {el.id === selectedElementId && (
                <IoMoveOutline
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "-10px",
                    fontSize: "16px",
                    cursor: "move",
                  }}
                  onMouseDown={(e) => handleDragStart(e, el.id)}
                />
              )}

              {/* Resize Icon */}
              {el.id === selectedElementId && (
                <IoResizeOutline
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "100%",
                    fontSize: "16px",
                    cursor: "nwse-resize",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, el.id)}
                />
              )}

              {/* Duplicate Icon */}
              {el.id === selectedElementId && (
                <IoDuplicateOutline
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "-10px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "green",
                  }}
                  onClick={duplicateElement}
                />
              )}
            </div>
          )
          ))}
        </div>
      </div>
    
      </div>
    );
  };

  export default customDesign;
