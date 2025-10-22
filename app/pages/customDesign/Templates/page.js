"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
// ✅ Ensure API_URL is PUBLIC (e.g., NEXT_PUBLIC_API_URL) and the path is correct.
// If your file is actually "apiconfig", fix the import.
import { API_URL } from "@/app/services/apicofig";

const box = {
  border: "1px solid #ccc",
  borderRadius: 2,
  padding: 5,
  cursor: "pointer",
  textAlign: "center",
  width: "calc(50% - 10px)",
};

const btn = {
  backgroundColor: "#f0f0f0",
  border: "none",
  borderRadius: 4,
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 14,
};

const row = { display: "flex", gap: 10, padding: "10px 0", flexWrap: "wrap" };

const Templates = ({ onSelectImage }) => {
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [loading, setLoading] = useState({ groups: false, categories: false, templates: false });
  const [error, setError] = useState({ groups: "", categories: "", templates: "" });

  // ---- Load groups on mount ----
  useEffect(() => {
    let cancelled = false;
    const loadGroups = async () => {
      setLoading((s) => ({ ...s, groups: true }));
      setError((e) => ({ ...e, groups: "" }));
      try {
        const res = await axios.get(`${API_URL}/TemplateGroups`);
        if (!cancelled) setGroups(res.data ?? []);
      } catch (err) {
        if (!cancelled) setError((e) => ({ ...e, groups: "Failed to load template groups." }));
        console.error("Groups error:", err);
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, groups: false }));
      }
    };
    loadGroups();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Handlers ----
  const fetchCategories = async (groupId) => {
    setSelectedGroupId(groupId);
    setSelectedCategoryId(null);
    setTemplates([]);
    setCategories([]);
    setLoading((s) => ({ ...s, categories: true }));
    setError((e) => ({ ...e, categories: "" }));

    try {
      const res = await axios.get(`${API_URL}/TemplateCategories`);
      const list = res.data ?? [];
      const filtered = list.filter(
        (cat) => Number(cat.templateGroupId) === Number(groupId)
      );
      setCategories(filtered);
    } catch (err) {
      setError((e) => ({ ...e, categories: "Failed to load categories." }));
      console.error("Categories error:", err);
    } finally {
      setLoading((s) => ({ ...s, categories: false }));
    }
  };

  const fetchTemplates = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setTemplates([]);
    setLoading((s) => ({ ...s, templates: true }));
    setError((e) => ({ ...e, templates: "" }));

    try {
      const res = await axios.get(`${API_URL}/Templates`);
      const list = res.data ?? [];
      const filtered = list.filter(
        (t) => Number(t.templateCategoryId) === Number(categoryId)
      );
      setTemplates(filtered);
      console.log("Templates filtered:", filtered);
    } catch (err) {
      setError((e) => ({ ...e, templates: "Failed to load templates." }));
      console.error("Templates error:", err);
    } finally {
      setLoading((s) => ({ ...s, templates: false }));
    }
  };

  const goBackToGroups = () => {
    setSelectedGroupId(null);
    setSelectedCategoryId(null);
    setCategories([]);
    setTemplates([]);
  };

  const goBackToCategories = () => {
    setSelectedCategoryId(null);
    setTemplates([]);
  };

  // ---- Render ----
  return (
    <div>
      {/* GROUPS */}
      {selectedGroupId === null && <h4>Template Groups</h4>}

      {selectedGroupId === null && (
        <>
          {loading.groups && <div style={{ padding: 8 }}>Loading groups…</div>}
          {error.groups && <div style={{ padding: 8, color: "crimson" }}>{error.groups}</div>}

          <div style={{ display: "flex", gap: 10, padding: "5px 0", flexWrap: "wrap" }}>
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => fetchCategories(group.id)}
                style={box}
              >
                <img src={group.imageUrl} alt={group.name} style={{ width: 50 }} />
                <p style={{ fontSize: 16 }}>{group.name}</p>
              </div>
            ))}
          </div>

          {!loading.groups && !error.groups && groups.length === 0 && (
            <div style={{ padding: 8, color: "#666" }}>No groups found.</div>
          )}
        </>
      )}

      {/* CATEGORIES */}
      {selectedGroupId !== null && selectedCategoryId === null && (
        <>
          <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={goBackToGroups} style={btn}>←</button>
            <h4 style={{ margin: 0 }}>Template Categories</h4>
          </div>

          {loading.categories && <div style={{ padding: 8 }}>Loading categories…</div>}
          {error.categories && <div style={{ padding: 8, color: "crimson" }}>{error.categories}</div>}

          <div style={row}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => fetchTemplates(cat.id)}
                style={box}
              >
                <div>{cat.name}</div>
              </div>
            ))}
          </div>

          {!loading.categories && !error.categories && categories.length === 0 && (
            <div style={{ padding: 8, color: "#666" }}>
              No categories found for this group.
            </div>
          )}
        </>
      )}

      {/* TEMPLATES */}
      {selectedCategoryId !== null && (
        <>
          <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={goBackToCategories} style={btn}>←</button>
            <h4 style={{ margin: 0 }}>Templates</h4>
          </div>

          {loading.templates && <div style={{ padding: 8 }}>Loading templates…</div>}
          {error.templates && <div style={{ padding: 8, color: "crimson" }}>{error.templates}</div>}

          <div style={row}>
            {templates.map((temp) => (
              <div
                key={temp.id}
                onClick={() => onSelectImage?.(temp.imageUrl)}
                style={box}
              >
                <img src={temp.imageUrl} alt={temp.name} style={{ width: 75 }} />
              </div>
            ))}
          </div>

          {!loading.templates && !error.templates && templates.length === 0 && (
            <div style={{ padding: 8, color: "#666" }}>
              No templates found for this category.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Templates;
