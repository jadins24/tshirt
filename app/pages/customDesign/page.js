"use client";

export const dynamic = "force-dynamic";
export const ssr = false;
import React, { useState, useEffect, useRef } from "react";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import {
  IoMoveOutline,
  IoCloseOutline,
  IoDuplicateOutline,
  IoImagesOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoLayersOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import { MdTextFields } from "react-icons/md";
import "./customDesign.scss";
import { useRouter } from "next/navigation";
import Templates from "./Templates/page";
import { useDispatch, useSelector } from "react-redux";
import AddCartSection from "./AddCartSection";
import { setCartData } from "@/app/redux/slice/cartSlice";
import { API_URL } from "@/app/services/apicofig";
import axios from "axios";

const CustomDesign = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // State managemant
  // Redux state
  const userId = useSelector((state) => state?.auth?.user?.id);
  const cartDatalocal = useSelector((state) => state?.cart?.cartData);

  // canvas state
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);

  // Load Fabric.js only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('fabric').then((fabricModule) => {
        setFabric(fabricModule.fabric);
        setIsFabricLoaded(true);
      }).catch((error) => {
        console.error('Failed to load Fabric.js:', error);
      });
    }
  }, []);

  const [selectedSection, setSelectedSection] = useState("none");
  const [addCartSection, setAddCartSection] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Object properties state
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [layerObjects, setLayerObjects] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantData, setVariantData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  // URL parameters state
  const [designId, setDesignId] = useState(null);
  const [cartId, setCartId] = useState(null);

  // Custom design data state
  const [customDesignData, setCustomDesignData] = useState({
    id: 0,
    userId: userId,
    activeStatus: true,
    designJson: "",
  });
  // console.log(customDesignData.designJson);

  // Cart data state
  const [cartItemsData, setCartItemsData] = useState([]);
  const [cartData, setcartData] = useState({
    id: 0,
    name: "",
    designId: 0,
    userId: userId,
    imageUrl: "",
    createdAt: "2025-05-22T07:50:19.284Z",
  });

  // Position images state
  const [positions, setPositions] = useState({
    front: "/image/ttest/frontt.png",
    back: "/image/ttest/backt.png",
    right: "/image/ttest/rightt.png",
    left: "/image/ttest/leftt.png",
  });
  // console.log("log", positions);

  // urls

  const [currentPosition, setCurrentPosition] = useState("front");

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

  const initializeCanvas = (position) => {
    const canvasEl = canvasDomRefs[position].current;
    if (!canvasEl || !fabric) return;
  
    const isSideView = position === "left" || position === "right";
    const width = isSideView ? 100 : 170;
    const height = isSideView ? 100 : 320;
  
    const canvas = new fabric.Canvas(canvasEl, {
      width,
      height,
      selection: true,
      preserveObjectStacking: true,
    });
  
    // if (position === "front") {
    //   // Define the left chest area (positioned roughly upper-left)
    //   const leftChestArea = new fabric.Rect({
    //     left: 90,          // X position from left
    //     top: 30,           // Y position from top
    //     width: 70,
    //     height: 70,
    //     fill: "rgba(0, 0, 255, 0)",  // semi-transparent blue box
    //     stroke: "blue",
    //     strokeDashArray: [4, 4],
    //     selectable: false,
    //     evented: false,    // makes sure it's not interactive
    //     hoverCursor: "default",
    //   });
  
    //   canvas.add(leftChestArea);
    //   canvas.sendToBack(leftChestArea); // Keep it in the background
    // }
  
    // Rest of your event bindings
    canvas.on("text:editing:entered", () => console.log("Editing started"));
    canvas.on("text:editing:exited", () => {
      console.log("Editing finished");
      updateLayersList();
    });
  
    canvas.on("selection:created", (e) => {
      setSelectedObject(e.target);
      handleSelectionCreated(e);
    });
  
    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.target);
      handleSelectionCreated(e);
    });
  
    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
      handleSelectionCleared();
    });
  
    canvas.on("object:moving", checkBoundaries);
    canvas.on("object:rotating", handleObjectRotating);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:added", updateLayersList);
    canvas.on("object:removed", updateLayersList);
  
    canvasRefs.current[position] = canvas;
  };
  

  useEffect(() => {
    ["front", "back", "left", "right"].forEach((pos) => initializeCanvas(pos));
    return () => Object.values(canvasRefs.current).forEach((c) => c?.dispose());
  }, []);

  const getActiveCanvas = () => canvasRefs.current[currentPosition];
  const addTextbox = () => {
    addText();

    setSelectedSection("addText");
  };

  const addText = () => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const text = new fabric.IText("Type here...", {
      left: 50,
      top: 50,
      color: "#000000",
      fontFamily: "Roboto",
      fontSize: 20,
      fontWeight: "normal",
      textAlign: "center",
      borderWidth: 0,
      borderColor: "#000000",
      effect: "Normal",
      editable: true,
      data: {
        type: "text",
        id: `text_${Date.now()}`,
      },
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    setSelectedObject(text);
  };

  const handleSubmitDesign = () => {
    const allDesigns = {};

    Object.entries(canvasRefs.current).forEach(([side, canvas]) => {
      if (canvas) {
        allDesigns[side] = canvas.toJSON();
      } else {
        allDesigns[side] = null; // or skip if not needed
      }
    });

    const designJson = JSON.stringify(allDesigns); // Final JSON with all sides
    const finalCustomDesignData = {
      ...customDesignData,
      designJson,
    };

    console.log("🧾 Serialized full canvasRefs JSON:", designJson);
  };

  const CDN_BASE = "https://cdn.ssactivewear.com/";

  //utiliti

  const getImage = (path) => (path ? `${CDN_BASE}${path}` : null);

  const getLayerName = (obj) => {
    if (obj.data?.type === "text" || obj.data?.type === "textShape") {
      return obj.text || "Text";
    } else if (obj.data?.type === "image") {
      return "Image";
    } else {
      return "Object";
    }
  };

  const debugPositions = () => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const objects = canvas.getObjects();
    console.log("=== DEBUG POSITIONS ===");
    console.log(`Current position: ${currentPosition}`);
    console.log(`Total objects: ${objects.length}`);

    objects.forEach((obj, index) => {
      const objPosition = obj.data?.position || "UNDEFINED";
      const visible = obj.visible;
      const type = obj.data?.type || "unknown";

      console.log(
        `Object ${index}: type=${type}, position=${objPosition}, visible=${visible}`
      );
    });

    console.log("======================");
  };

  //  Initialization

  // Initialize URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDesignId(params.get("designId"));
    setCartId(params.get("cartId"));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const canvasesReady = ["front", "back", "left", "right"].every(
        (side) => canvasRefs.current[side]
      );
      if (!canvasesReady) {
        console.log("⏸️ Not all canvases are initialized yet.");
        return;
      }

      if (!designId && !cartId) {
        console.log("⏸️ Neither designId nor cartId provided.");
        return;
      }

      try {
        if (designId) {
          console.log("🔍 Fetching design for ID:", designId);
          const res = await fetch(
            `${API_URL}/customdesigns/design/${designId}`
          );
          const design = await res.json();

          if (design?.designJson) {
            const json = JSON.parse(design.designJson);

            const loadPromises = Object.entries(json).map(
              ([side, sideJson]) => {
                const canvas = canvasRefs.current[side];
                if (canvas && sideJson) {
                  return new Promise((resolve) => {
                    canvas.loadFromJSON(sideJson, () => {
                      canvas.renderAll();
                      console.log(`✅ Loaded ${side} canvas`);
                      resolve();
                    });
                  });
                } else {
                  console.warn(`⚠️ Canvas or data missing for side: ${side}`);
                  return Promise.resolve();
                }
              }
            );

            await Promise.all(loadPromises);
            console.log("✅ All canvases loaded");
          } else {
            console.warn("⚠️ No designJson found.");
          }
        }
        console.log(cartId);

        if (cartId) {
          console.log("🔍 Fetching cart data for cartId:", cartId);
          const cartRes = await fetch(`${API_URL}/Carts/${cartId}`);
          console.log("📥 Cart response received.");
          const cart = await cartRes.json();
          console.log("📄 Cart JSON parsed:", cart);
          setcartData(cart);

          console.log("🔍 Fetching cart items for cartId:", cartId);
          const itemsRes = await fetch(
            `${API_URL}/CartItems/GetByCartId/${cartId}`
          );
          console.log("📥 Cart items response received.");
          const items = await itemsRes.json();
          console.log("📄 Cart items JSON parsed:", items);
          setCartItemsData(items);
        }
      } catch (error) {
        console.error("❌ Failed to load data:", error);
      }
    };

    loadData();
  }, [designId, cartId, canvasRefs]);

  // Fetch product variants
  useEffect(() => {
    const fetchProductVariants = async () => {
      try {
        const source =
          (cartDatalocal?.[0]?.styleID && cartDatalocal) ||
          (cartItemsData?.[0]?.styleID && cartItemsData) ||
          null;

        if (!source || !source.length) {
          console.warn("❌ No valid data source found");
          return;
        }

        const styleID = source[0].styleID;
        const colorCode = source[0].colorCode;

        const response = await axios.get(
          `${API_URL}/Products/ProductByStyleId/${styleID}`
        );
        const data = response.data;

        setProductsData(data);

        const matchingVariants = data.filter(
          (item) => item.colorCode === colorCode
        );
        setVariantData(matchingVariants);
      } catch (error) {
        console.error("❌ Error fetching product variants:", error);
      }
    };

    fetchProductVariants();
  }, [cartDatalocal, cartItemsData]);

  // console.log("cartData", cartDatalocal);
  // console.log("variantData", variantData);
  // ==================== POSITION AND LAYER MANAGEMENT ====================

  // Update layers list
  const updateLayersList = () => {
    const canvas = getActiveCanvas();
console.log(canvas);

    if (!canvas) return;

    const objects = canvas.getObjects();
console.log(objects);

   // Create layer objects with metadata
   const layers = objects.map((obj) => {
    return {
      id: obj.data?.id || `unknown_${Date.now()}`,
      type: obj.data?.type || "unknown",
      name: getLayerName(obj),
      visible: obj.visible !== false,
      obj: obj,
    };
  });

console.log(layers);

    setLayerObjects(layers.reverse());
    // setSelectedObject(null);

  };

  const moveLayerUp = (layerId) => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const objects = canvas.getObjects();
    const targetIndex = objects.findIndex((obj) => obj.data?.id === layerId);

    if (targetIndex !== -1 && targetIndex < objects.length - 1) {
      canvas.bringForward(objects[targetIndex]);
      canvas.renderAll();
      updateLayersList();
    }
  };

  const moveLayerDown = (layerId) => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const objects = canvas.getObjects();
    const targetIndex = objects.findIndex((obj) => obj.data?.id === layerId);

    if (targetIndex > 0) {
      canvas.sendBackwards(objects[targetIndex]);
      canvas.renderAll();
      updateLayersList();
    }
  };

  // canvas handle
  const handleSelectionCreated = (e) => {
    if (e.selected && e.selected.length > 0) {
      const selectedObj = e.selected[0];
      setSelectedObject(selectedObj);
  
      // You can read the object type from its 'data' or fallback to 'type'
      // Detect and assign custom type
      let selectedType = "unknown";

      if (selectedObj.type === "image") {
        selectedType = "addImage";
      } else if (
        selectedObj.type === "i-text" ||
        selectedObj.type === "textbox" ||
        selectedObj.type === "text"
      ) {
        selectedType = "addText";
      }
  
      setSelectedSection(selectedType);
      // setSelectedSection(selectedType); // e.g., "addText", "image", etc.
    } else {
      setSelectedObject(null);
      setSelectedSection(null);
    }
    
  };

  const handleSelectionCleared = () => {
    setSelectedObject(null);
  };

  const checkBoundaries = (e) => {
    const obj = e.target;
    const objBounds = obj.getBoundingRect(true);
    const canvas = e.target.canvas;

    let outOfBounds = false;
    let message = "";

    if (objBounds.left < 0 || objBounds.left + objBounds.width > canvas.width) {
      message = "Object is moving out of horizontal boundary!";
      outOfBounds = true;
    }

    if (objBounds.top < 0 || objBounds.top + objBounds.height > canvas.height) {
      message = "Object is moving out of vertical boundary!";
      outOfBounds = true;
    }

    if (outOfBounds) {
      setWarningMessage(message);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    } else {
      setShowWarning(false);
    }
  };

  const handleObjectRotating = (e) => {
    const obj = e.target;
    setRotation(Math.round(obj.angle));
  };

  const handleObjectModified = (e) => {
    const obj = e.target;
    setRotation(Math.round(obj.angle || 0));
    setOpacity(Math.round((obj.opacity || 1) * 100));

    if (!obj) obj = {};
    obj.position = currentPosition;
    updateLayersList();
  };
  // add text ,image

  const addImage = (src) => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    fabric.Image.fromURL(src, (img) => {
      const maxWidth = 100;
      const scale = maxWidth / img.width;

      img.set({
        left: 50,
        top: 50,
        imageUrl: src,
        scaleX: scale,
        scaleY: scale,
        data: {
          type: "image",
          id: `image_${Date.now()}`,
        },
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      setSelectedObject(img);
      updateLayersList();
    });
  };

  // Apply template
  const applyTemplate = () => {
    const canvas = getActiveCanvas();
    if (!canvas || !selectedImageUrl) return;

    // canvas.clear();

    // Add selected image to canvas
    fabric.Image.fromURL(selectedImageUrl, (img) => {
      const maxWidth = 100;
      const scale = maxWidth / img.width;

      img.set({
        left: 10,
        top: 10,
        imageUrl: selectedImageUrl,
        scaleX: scale,
        scaleY: scale,
        data: {
          type: "image",
          id: `image_${Date.now()}`,
        },
      });

      canvas.add(img);
      canvas.renderAll();
      updateLayersList();
    });

    setSelectedImageUrl(null);
  };

  // text effects
  const updateTextEffect = (effect) => {
    const canvas = getActiveCanvas();

    if (
      !canvas ||
      !selectedObject ||
      (selectedObject.data?.type !== "text" &&
        selectedObject.data?.type !== "textShape")
    )
      return;

    // Get current properties
    const currentProps = {
      left: selectedObject.left,
      top: selectedObject.top,
      text: selectedObject.text,
      fill: selectedObject.fill,
      fontFamily: selectedObject.fontFamily,
      fontSize: selectedObject.fontSize,

      fontWeight: selectedObject.fontWeight,
      angle: selectedObject.angle,
      opacity: selectedObject.opacity,
    };

    // Remove current object
    canvas.remove(selectedObject);

    // Create new object with desired effect and properties
    const newTextObj = createTextWithEffect(
      currentProps.text,
      effect,
      currentProps
    );

    // Set position data
    if (!newTextObj.data) newTextObj.data = {};
    newTextObj.data.position = currentPosition;

    canvas.add(newTextObj);
    canvas.setActiveObject(newTextObj);
    setSelectedObject(newTextObj);
    canvas.renderAll();
    updateLayersList();
  };
  const createTextWithEffect = (text, effect, options = {}) => {
    const baseOptions = {
      left: 50,
      top: 50,
      fill: "#000000",
      fontFamily: "Roboto",
      fontSize: 20,
      fontWeight: "normal",
      textAlign: "center",
    };

    const fullOptions = { ...baseOptions, ...options };
    let textObject;

    switch (effect) {
      case "Bridge":
        textObject = new fabric.IText(text, {
          ...fullOptions,
          path: new fabric.Path("M 0 0 Q 100 -50 200 0", { visible: false }),
        });
        break;
      case "Valley":
        textObject = new fabric.IText(text, {
          ...fullOptions,
          path: new fabric.Path("M 0 0 Q 100 50 200 0", { visible: false }),
        });
        break;
      case "Perspective":
        textObject = new fabric.IText(text, fullOptions);
        textObject.set({ skewX: 15, skewY: 0 });
        break;
      case "Normal":
      default:
        textObject = new fabric.IText(text, fullOptions);
        break;
    }

    return textObject;
  };

  // updateTextProperty
  const updateTextProperty = (property, value) => {
    const canvas = getActiveCanvas();

    if (
      !canvas ||
      !selectedObject ||
      (selectedObject.data?.type !== "text" &&
        selectedObject.data?.type !== "textShape")
    ) {
      return;
    }

    switch (property) {
      case "text":
        selectedObject.set("text", value);
        break;
      case "color":
        selectedObject.set("fill", value);
        break;
      case "fontFamily":
        selectedObject.set("fontFamily", value);
        break;
      case "fontSize":
        selectedObject.set("fontSize", value);
        break;
      
      case "fontWeight":
        selectedObject.set("fontWeight", value);
        break;
        case "textStyle":
          selectedObject.set(
            "fontStyle",
            value === "italic" ? "italic" : "normal"
          );
          selectedObject.set("data", {
            ...selectedObject.data,
            fontStyle: value,
          });
          break;
          case "textAlign":
            selectedObject.set("textAlign", value);
            selectedObject.set("data", {
              ...selectedObject.data,
              textAlign: value,
            });
            break;
          case "textDecoration":
            selectedObject.set("underline", value === "underline");
            selectedObject.set("linethrough", value === "linethrough");
            selectedObject.set("data", {
              ...selectedObject.data,
              textDecoration: value,
            });
            break;
       
            case "textTransform":
              // Handle text transformation
              let text = selectedObject.text;
              switch (value) {
                case "uppercase":
                  text = text.toUpperCase();
                  break;
                case "lowercase":
                  text = text.toLowerCase();
                  break;
                case "capitalize":
                  text = text.replace(/\b\w/g, (l) => l.toUpperCase());
                  break;
                default:
                  // Keep the original text
                  break;
              }
              selectedObject.set("text", text);
              selectedObject.set("data", {
                ...selectedObject.data,
                textTransform: value,
              });
              break;
              
      // Add more text properties as needed
    }

    canvas.renderAll();
    updateLayersList();
  };

  const updateObjectProperty = (property, value) => {
    const canvas = getActiveCanvas();

    if (!canvas || !selectedObject) return;

    switch (property) {
      case "rotation":
        selectedObject.set("angle", parseInt(value, 10));
        setRotation(parseInt(value, 10));
        break;
      case "opacity":
        selectedObject.set("opacity", parseInt(value, 10) / 100);
        setOpacity(parseInt(value, 10));
        break;
    }

    canvas.renderAll();
    updateLayersList();
  };

  // layer managemant
  const toggleLayerVisibility = (layerId) => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const objects = canvas.getObjects();
    const targetObject = objects.find((obj) => obj.data?.id === layerId);

    if (targetObject) {
      targetObject.visible = !targetObject.visible;
      canvas.renderAll();
      updateLayersList();
    }
  };

  const selectLayer = (layerId) => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const objects = canvas.getObjects();
    const targetObject = objects.find((obj) => obj.data?.id === layerId);

    if (targetObject) {
      canvas.setActiveObject(targetObject);
      canvas.renderAll();
      setSelectedObject(targetObject);
    }
  };

  const deleteLayer = async (layerId) => {
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const objects = canvas.getObjects();
    const targetObject = objects.find((obj) => obj.data?.id === layerId);

    if (targetObject) {
      const imageUrl = targetObject?.data?.imageUrl;
      if (imageUrl) {
        await deleteImageFromServer(imageUrl);
      }

      canvas.remove(targetObject);
      canvas.renderAll();
      if (selectedObject && selectedObject.data?.id === layerId) {
        setSelectedObject(null);
      }
      updateLayersList();
    }
  };

  // ==================== FILE HANDLING FUNCTIONS ====================

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/images/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.imageUrl) {
        addImage(data.imageUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const deleteImageFromServer = async (imageUrl) => {
    const encodedUrl = encodeURIComponent(imageUrl);
    try {
      const res = await fetch(`${API_URL}/images/url/${encodedUrl}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Failed to delete image from server.");
      }
    } catch (err) {
      console.error("Error deleting image from server:", err);
    }
  };
  // ==================== UI SECTION HANDLERS ====================

  const addImagebox = () => setSelectedSection("addImage");
  const addTemplates = () => setSelectedSection("addTemplates");
  const addLayersbox = () => setSelectedSection("layers");
  const changeColor = () => setSelectedSection("changeColor");

  const addCart = () => {
    setAddCartSection(true);
  };

  const handlePositionClick = (position) => {
    setSelectedObject(null);

    setCurrentPosition(position);
    console.log(position);
    updateLayersList();
setSelectedSection("none")

  };

  // product management

  const handleColorChange = (colorCode) => {
    const available = productsData.filter(
      (v) => v.colorCode === colorCode && v.qty > 0
    );
    setVariantData(available);

    if (available.length > 0) {
      setSelectedVariant(available[0]);
    }
  };

  const openPage = async (link) => {
    if (canvas) {
      canvas.clear();
    }
    dispatch(setCartData([]));
    await router.push(link);
  };
  //  VALUES

  const uniqueColors = Array.from(
    new Map((productsData || []).map((v) => [v.colorCode, v])).values()
  );

  const availableSizes = (productsData || [])
    .filter((v) => v.colorCode === selectedVariant?.colorCode && v.qty > 0)
    .map((v) => v.sizeName);

  console.log(availableSizes);

  //  SIDE EFFECTS

  // Set selected variant from variant data
  useEffect(() => {
    if (
      Array.isArray(variantData) &&
      variantData.length > 0 &&
      !selectedVariant
    ) {
      setSelectedVariant(variantData[0]);
    }
  }, [variantData, selectedVariant]);

  // Update positions based on selected variant
  useEffect(() => {
    if (!selectedVariant) return;

    setPositions({
      front:
        getImage(selectedVariant.colorFrontImage) ||
        getImage(selectedVariant.colorOnModelFrontImage) ||
        "/image/ttest/frontt.png",
      back:
        getImage(selectedVariant.colorBackImage) ||
        getImage(selectedVariant.colorOnModelBackImage) ||
        "/image/ttest/backt.png",
      right:
        getImage(selectedVariant.colorSideImage) ||
        getImage(selectedVariant.colorOnModelSideImage) ||
        "/image/ttest/rightt.png",
      left:
        getImage(selectedVariant.colorDirectSideImage) ||
        "/image/ttest/leftt.png",
    });
  }, [selectedVariant]);

  // Update rotation and opacity when selected object changes
  useEffect(() => {
    if (selectedObject) {
      setRotation(Math.round(selectedObject.angle || 0));
      setOpacity(Math.round((selectedObject.opacity || 1) * 100));
    } else {
      setRotation(0);
      setOpacity(100);
    }
  }, [selectedObject]);

  // console.log(selectedVariant);

  // Delete selected object
  const handleDelete = async () => {
    const canvas = getActiveCanvas();

    if (!canvas || !selectedObject) return;

    const imageUrl = selectedObject?.data?.imageUrl;
    if (imageUrl) {
      await deleteImageFromServer(imageUrl); // ✅ server cleanup
    }

    canvas.remove(selectedObject);
    canvas.renderAll();
    setSelectedObject(null);
    updateLayersList();
  };

  // Duplicate selected object
  const duplicateObject = () => {
    const canvas = getActiveCanvas();

    if (!canvas || !selectedObject) return;
console.log(selectedObject);

    selectedObject.clone((cloned) => {
      cloned.set({
        left: selectedObject.left + 10,
        top: selectedObject.top + 10,
      });
console.log(cloned.data);

      // Ensure position data is preserved
      if (!cloned.data) cloned.data = {};
      cloned.data.id = `${selectedObject.data.type}_${Date.now()}`;
      cloned.data.type = `${selectedObject.data.type}`;
console.log(cloned);

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      setSelectedObject(cloned);
      updateLayersList();
    });
  };

  // Handle drag and drop for images
  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Common controls for all objects
 const renderCommonControls = () => {
  if (!selectedObject) return null;

  return (
    <div className="common-controls">
      <div className="section-title">Object Controls</div>
      
      <div className="control-group">
        {/* Rotation Control */}
        <div className="control-item rotation-control">
          <div className="control-header">
            <span className="control-label">Rotation</span>
            <span className="control-value value-change">
              {rotation}°
            </span>
          </div>
          <div className="slider-container">
            <span className="slider-icon"></span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => updateObjectProperty("rotation", e.target.value)}
              className="slider"
            />
            <span className="slider-icon">↻</span>
          </div>
          <div className="slider-labels">
            <span>0°</span>
            <span>180°</span>
            <span>360°</span>
          </div>
        </div>

        {/* Opacity Control */}
        <div className="control-item opacity-control">
          <div className="control-header">
            <span className="control-label">Opacity</span>
            <span className="control-value value-change">
              {opacity}%
            </span>
          </div>
          <div className="slider-container">
            <span className="slider-icon">○</span>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => updateObjectProperty("opacity", e.target.value)}
              className="slider"
            />
            <span className="slider-icon">●</span>
          </div>
          <div className="slider-labels">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="object-actions">
        <button
          onClick={duplicateObject}
          className="action-btn duplicate-btn"
          title="Duplicate Object"
        >
          <IoDuplicateOutline className="btn-icon" />
          Duplicate
        </button>
        <button
          onClick={handleDelete}
          className="action-btn delete-btn"
          title="Delete Object"
        >
          <IoCloseOutline className="btn-icon" />
          Delete
        </button>
      </div>
    </div>
  );
};

  // Show loading until Fabric.js is loaded
  if (!isFabricLoaded) {
    return (
      <div className="custom-design">
        <div className="custom-design-container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-design">
      <div className="custom-design-container">
        {/* Header */}

        <div className="custom-design-head">
          <img
            src="/image/KustomteeLogo.png"
            alt="Logo"
            onClick={() => openPage("/")}
            width={150}
            height={50}
            className="logo"
          />
          {/* <button onClick={handleSubmitDesign}>Submit Design</button> */}
        </div>

        <div className="custom-design-content">
          {/* image edit area */}

          <div
            className="custom-design-image-area"
            style={{ justifyContent: addCartSection ? "flex-start" : "center" }}
          >
            <div className="custom-design-image-list">
              <div className="image-container">
                <img src={positions[currentPosition]} alt={currentPosition} />
              </div>

              <div className="image-edit-area-position">
                <div
                  className="canvas-container"
                  style={{
                    position: "relative",
                    width: "170px",
                    height: "320px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {["front", "back", "left", "right"].map((side) => (
                    <div
                      key={side}
                      style={{
                        visibility:
                          currentPosition === side ? "visible" : "hidden",
                        pointerEvents:
                          currentPosition === side ? "auto" : "none",
                        border: "1px solid #aaa",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        // top: "150px",
                        // left: "90px",
                        // backgroundColor: "red",
                      }}
                    >
                      <canvas
                        key={side}
                        ref={canvasDomRefs[side]}
                        width={170}
                        height={30}
                      />
                    </div>  
                  ))}

                  {/* <canvas ref={canvasRef} /> */}

                  {/* Out of canvas warning */}
                  {showWarning && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(255, 87, 34, 0.9)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        zIndex: 100,
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      }}
                    >
                      <IoMoveOutline
                        style={{ marginRight: "5px", verticalAlign: "middle" }}
                      />
                      {warningMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/*side bar */}

          <div
            className="custom-design-btns"
            style={{ display: addCartSection ? "none" : "flex" }}
          >
            <div className="btns-lists">
              <button onClick={addTextbox}>
                <MdTextFields />
                <p>Add Text</p>
              </button>
              <button onClick={addImagebox}>
                <IoImagesOutline />
                <p>Add Image</p>
              </button>

              <button onClick={addTemplates}>
                <IoImagesOutline />
                <p>Templates</p>
              </button>
              <button onClick={addLayersbox}>
                <IoLayersOutline />
                <p>Layers</p>
              </button>
              <button onClick={changeColor}>
                <IoColorPaletteOutline />
                <p>Change Color</p>
              </button>
            </div>
            <div className="btn-content">
              {/* Default section */}
              {selectedSection === "none" && (
                <div className="default">
                  <h3>Select an option to start customizing</h3>
                  <div className="tools-buttons">
                    <button onClick={addTextbox} className="tool-button">
                      <MdTextFields className="tool-icon" />
                      <span>Add Text</span>
                    </button>
                    <button onClick={addImagebox} className="tool-button">
                      <IoImagesOutline className="tool-icon" />
                      <span>Add Image</span>
                    </button>
                    <button onClick={addTemplates} className="tool-button">
                      <IoLayersOutline className="tool-icon" />
                      <span>Templates</span>
                    </button>
                    <button onClick={addLayersbox} className="tool-button">
                      <IoLayersOutline className="tool-icon" />
                      <span>Layers</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Add Text Section */}
              {selectedSection === "addText" && (
                <div className="add-text">
                  <div className="section-header">
                    <h4>Text</h4>
                    <span
                      onClick={() => setSelectedSection("none")}
                      className="close-section"
                    >
                      <IoCloseOutline />
                    </span>
                  </div>
                  <div className="add-text-area">
                    <div className="add-form">
                      <label>Text</label>
                      <input
                        type="text"
                        value={selectedObject?.text || ""}
                        onChange={(e) =>
                          updateTextProperty("text", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      />
                    </div>
                    <div className="add-form w50">
                      <label>Color</label>
                      <input
                        type="color"
                        value={selectedObject?.fill || "#000000"}
                        onChange={(e) =>
                          updateTextProperty("color", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      />
                    </div>
                    <div className="add-form w50">
                      <label>Text Transformation</label>
                      <select
                        value={selectedObject?.textTransform || "none"}
                        onChange={(e) =>
                          updateTextProperty("textTransform", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      >
                        <option value="none">None</option>
                        <option value="uppercase">Uppercase</option>
                        <option value="lowercase">Lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                    </div>
                    <div className="add-form">
                      <label>Select Font Family</label>
                      <select
                        value={selectedObject?.fontFamily || "Roboto"}
                        onChange={(e) =>
                          updateTextProperty("fontFamily", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      >
                        <option value="Roboto">Roboto</option>
                        <option value="Magra">Magra</option>

                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Oswald">Oswald</option>
                      </select>
                    </div>
                    <div className="add-form w50">
                      <label>Font Size</label>
                      <input
                        type="range"
                        min="8"
                        max="72"
                        value={selectedObject?.fontSize || 20}
                        onChange={(e) =>
                          updateTextProperty(
                            "fontSize",
                            parseInt(e.target.value, 10)
                          )
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>8</span>
                        <span>{selectedObject?.fontSize || 20}</span>
                        <span>72</span>
                      </div>
                    </div>
                    <div className="add-form w50">
                      <label>Font Weight</label>
                      <select
                        value={selectedObject?.fontWeight || "normal"}
                        onChange={(e) =>
                          updateTextProperty("fontWeight", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="lighter">Lighter</option>
                      </select>
                    </div>
                    <div className="add-form w50">
                      <label>Style</label>
                      <select
                        value={selectedObject?.fontStyle || "normal"}
                        onChange={(e) =>
                          updateTextProperty("textStyle", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                    <div className="add-form w50">
                      <label>Text Decoration</label>
                      <select
                        value={selectedObject?.data?.textDecoration || "none"}
                        onChange={(e) =>
                          updateTextProperty("textDecoration", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      >
                        <option value="none">None</option>
                        <option value="underline">Underline</option>
                        <option value="linethrough">Line-through</option>
                      </select>
                    </div>
                    <div className="add-form w50">
                      <label>Text Align</label>
                      <select
                        value={selectedObject?.textAlign || "left"}
                        onChange={(e) =>
                          updateTextProperty("textAlign", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    {/* <div className="add-form w50">
                      <label>Border Width</label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={selectedObject?.data?.borderWidth || 0}
                        onChange={(e) =>
                          updateTextProperty(
                            "borderWidth",
                            parseInt(e.target.value, 10)
                          )
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text"
                        }
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>0</span>
                        <span>{selectedObject?.data?.borderWidth || 0}</span>
                        <span>5</span>
                      </div>
                    </div> */}
                    {/* <div className="add-form w50">
                      <label>Border Color</label>
                      <input
                        type="color"
                        value={selectedObject?.data?.borderColor || "#000000"}
                        onChange={(e) =>
                          updateTextProperty("borderColor", e.target.value)
                        }
                        disabled={
                          !selectedObject ||
                          selectedObject.data?.type !== "text" ||
                          (selectedObject?.data?.borderWidth || 0) === 0
                        }
                      />
                    </div> */}

                    {/* <div style={{ marginTop: "10px" }}>
                      <label>Update Selected Text Effect:</label>
                      <select
                        value={selectedObject?.data?.effect || "Normal"}
                        onChange={(e) => updateTextEffect(e.target.value)}
                        disabled={
                          !selectedObject ||
                          (selectedObject.data?.type !== "text" &&
                            selectedObject.data?.type !== "textShape")
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          marginTop: "5px",
                        }}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Bridge">Bridge</option>
                        <option value="Valley">Valley</option>
                        <option value="Pinch">Pinch</option>
                        <option value="Bulge">Bulge</option>
                        <option value="Perspective">Perspective</option>
                        <option value="PointedDownward">Pointed Down</option>
                        <option value="PointedUpward">Pointed Up</option>
                      </select>
                    </div> */}
                    {renderCommonControls()}
                  </div>
                </div>
              )}

              {/* Add Image Section */}
              {selectedSection === "addImage" && (
                <div className="add-image">
                  <div className="section-header">
                    <h4>Image</h4>
                    <span
                      onClick={() => setSelectedSection("none")}
                      className="close-section"
                    >
                      <IoCloseOutline />
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="upload-input"
                  />

                  <div
                    style={{
                      border: "2px dashed #ccc",
                      padding: "20px",
                      marginTop: "10px",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <p>Or drag and drop an image here</p>
                  </div>

                  {selectedObject &&
                    selectedObject.data?.type === "image" &&
                    renderCommonControls()}
                </div>
              )}

              {/* Add Templates Section */}
              {selectedSection === "addTemplates" && (
                <div className="add-templates">
                  <div className="section-header">
                    <h4>Templates</h4>
                    <span
                      onClick={() => setSelectedSection("none")}
                      className="close-section"
                    >
                      <IoCloseOutline />
                    </span>
                  </div>
                  {selectedImageUrl ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "16px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          // maxWidth: "170px",
                          marginTop: "16px",
                        }}
                      >
                        <img
                          src={selectedImageUrl}
                          alt="Selected Template"
                          style={{
                            width: "75px",
                            height: "75px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            // border: "1px solid #ccc",
                          }}
                        />
                        <button
                          onClick={applyTemplate}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Apply Template
                        </button>
                      </div>
                    </>
                  ) : (
                    <Templates
                      onSelectImage={(url) => {
                        // console.log("Selected Image URL:", url);
                        setSelectedImageUrl(url);
                      }}
                    />
                  )}
                </div>
              )}
              {/* Layer Section */}

              {selectedSection === "layers" && (
                <div className="section-content layers-section">
                  <div className="section-header">
                    <h4>Layers</h4>
                    <span
                      onClick={() => setSelectedSection("none")}
                      className="close-section"
                    >
                      <IoCloseOutline />
                    </span>
                  </div>
                  <div className="layers-list">
                    {layerObjects.length === 0 ? (
                      <p>No layers to display</p>
                    ) : (
                      layerObjects.map((layer) => (
                        <div
                          key={layer.id}
                          className={`layer-item ${
                            selectedObject &&
                            selectedObject.data?.id === layer.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => selectLayer(layer.id)}
                        >
                          <div className="layer-info">
                            <button
                              className="visibility-toggle"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerVisibility(layer.id);
                              }}
                            >
                              {layer.visible ? (
                                <IoEyeOutline className="layer-icon" />
                              ) : (
                                <IoEyeOffOutline className="layer-icon" />
                              )}
                            </button>
                            <span className="layer-name">{layer.name}</span>
                          </div>
                          <div className="layer-actions">
                            <button
                              className="layer-move-up"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLayerUp(layer.id);
                              }}
                            >
                              <IoChevronUpOutline className="layer-icon" />
                            </button>
                            <button
                              className="layer-move-down"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLayerDown(layer.id);
                              }}
                            >
                              <IoChevronDownOutline className="layer-icon" />
                            </button>
                            <button
                              className="layer-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLayer(layer.id);
                              }}
                            >
                              <IoCloseOutline className="layer-icon" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              {/* color change Section */}

              {selectedSection === "changeColor" && (
                <>
                  <div className="section-content changeColor-section">
                    <div className="section-header">
                      <h4>Change Color</h4>
                      <span
                        onClick={() => setSelectedSection("none")}
                        className="close-section"
                      >
                        <IoCloseOutline />
                      </span>
                    </div>
                    <div>
                      <h4>colors: </h4>
                    </div>
                    <div className="swatches">
                      {uniqueColors.map((variantData) => (
                        <img
                          key={variantData.colorCode}
                          src={`https://cdn.ssactivewear.com/${variantData.colorSwatchImage}`}
                          alt={variantData.colorName}
                          title={variantData.colorName}
                          className={`swatch ${
                            variantData.colorCode === variantData.colorCode
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleColorChange(variantData.colorCode)
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Positions change area */}

          <div
            className="custom-design-tshirt-position"
            style={{ display: addCartSection ? "none" : "" }}
          >
            <div className="tshirt-position-head">
              <p>position</p>
            </div>
            <div className="tshirt-positions">
              {Object.keys(positions)
                .filter(
                  (position) =>
                    position === "front" ||
                    position === "back" ||
                    position === "left" ||
                    position === "right"
                )
                .map((position) => (
                  <div
                    className="position1"
                    key={position}
                    onClick={() => handlePositionClick(position)}
                    style={{
                      cursor: "pointer",
                      border:
                        currentPosition === position
                          ? "2px solid #000"
                          : "none",
                    }}
                  >
                    <img src={positions[position]} alt={position} />
                    <p>{position}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* Footer */}

        <div className="custom-design-foot">
          <div className="foot-start">
            <div className="foot-logo">
              <h3>KustomTee</h3>
            </div>
            <div className="foot-cart-products">
              {cartDatalocal.map((item, index) => (
                <div key={index} className="cart-item-card">
                  <div className="cart-item-preview">
                    <div className="preview-img-wrapper">
                      <img
                        src={`https://cdn.ssactivewear.com/${
                          item.colorFrontImage || item.colorOnModelFrontImage
                        }`}
                        alt={`Product in ${item.colorName || "selected color"}`}
                        className="preview-img"
                      />
                      <span className="remove-icon">✕</span>
                    </div>
                  </div>

                  <div className="cart-item-info">
                    <div className="color-row">
                      <h4>{item.brandName}</h4>
                      {/* <a href="#" className="action-link">Change Product</a> */}
                    </div>
                    <div className="color-row">
                      {/* <span className="color-swatch" style={{ backgroundColor: getColorHex(item.colorName) }}></span> */}
                      <span className="color-name">{item.colorName}</span>
                      <a href="#" className="action-link">
                        Change Color
                      </a>
                    </div>

                    {/* <p>Size: {item.sizeName} | Qty: {item.quantity}</p>
        <span>${(item.price * item.quantity).toFixed(2)}</span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="custom-design-foot-btns">
            {/* <button  className="save-button">
              <IoIosSave /> Save Design
            </button> */}
            <button onClick={addCart} className="add-Cart">
              <FiShoppingCart /> Add Cart
            </button>
          </div>
        </div>
      </div>

      {addCartSection && (
        <AddCartSection
          customDesignData={customDesignData}
          cartItemsData={cartItemsData}
          cartData={cartData}
          canvas={canvas}
          variantData={variantData}
          canvasRefs={canvasRefs}
          onClose={() => setAddCartSection(false)}
        />
      )}
    </div>
  );
};

export default CustomDesign;
