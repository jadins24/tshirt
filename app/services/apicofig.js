// import axios from "axios";

// const apiClientCSR = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const apiClientSSR = axios.create({
//   baseURL: process.env.API_INTERNAL_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export { apiClientCSR, apiClientSSR };

import axios from "axios";
import { filterActiveItems } from "../utils/FilterUtils/filterUtils";

const isServer = typeof window === "undefined";
console.log(`[apicofig] isServer: ${isServer} - NODE_ENV=${process.env.NODE_ENV}`);
const API_URL = isServer
  ? process.env.API_INTERNAL_URL // for server-side usage (SSR/SSG)
  : process.env.NEXT_PUBLIC_API_URL; // for client-side usage (CSR)

const apiClient = axios.create({
  baseURL: isServer ? process.env.API_INTERNAL_URL : process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;

//Home


//About
export const fetchAboutUsTops = async () => {
  const response = await apiClient.get("/AboutusTops");
  // return response.data;
   return filterActiveItems(response.data);
};

export const fetchAboutUsSectionTwoes = async () => {
  const response = await apiClient.get("/AboutUsSectionTwoes");
   return filterActiveItems(response.data);
};

export const fetchAboutUsSectionThrees = async () => {
  const response = await apiClient.get("/AboutUsSectionThrees");
   return filterActiveItems(response.data);
};

export const fetchAboutUsSectionFives = async () => {
  const response = await apiClient.get("/AboutUsSectionFives");
   return filterActiveItems(response.data);
};

export const fetchAboutUsSectionFours = async () => {
  const response = await apiClient.get("/AboutUsSectionFours");
   return filterActiveItems(response.data);
};



// HelpSectionOnes
export const fetchHelpSectionOnes = async () => {
  const response = await apiClient.get("/HelpSectionOnes");
   return filterActiveItems(response.data);
};

// HelpSectionTwoes
export const fetchHelpSectionTwoes = async () => {
  const response = await apiClient.get("/HelpSectionTwoes");
   return filterActiveItems(response.data);
};

// HelpSectionThrees
export const fetchHelpSectionThrees = async () => {
  const response = await apiClient.get("/HelpSectionThrees");
   return filterActiveItems(response.data);
};

// HelpSectionFours
export const fetchHelpSectionFours = async () => {
  const response = await apiClient.get("/HelpSectionFours");
   return filterActiveItems(response.data);
};

//Template
export const fetchTemplateSectionOnes = async () => {
  const response = await apiClient.get("/TemplateSectionOnes");
   return filterActiveItems(response.data);
};

export const fetchTemplateGroups = async () => {
  const response = await apiClient.get("/TemplateGroups");
   return filterActiveItems(response.data);
};

export const fetchTemplateCategories = async () => {
  const response = await apiClient.get("/TemplateCategories");
   return filterActiveItems(response.data);
};


export const fetchTemplatesByCategoryAndGroup = async (categoryId, groupId) => {
  try {
    console.log("Fetching templates by category and group:", { categoryId, groupId });

    const response = await axios.get(`${API_URL}/Templates/ByCategoryAndGroup`, {
      params: {
        categoryId,
        groupId,
      },
    });
     return filterActiveItems(response.data);
  } catch (error) {
    console.error("Error fetching templates by category and group:", error);
    return [];
  }
};



export const fetchTemplates = async () => {
  try {
    console.log("Fetching templates");
    console.log("API URL:", apiClient.defaults.baseURL);
    
    // Try direct axios call first
    const response = await axios.get(`${API_URL}/Templates`);
    console.log("Templates API response:", response.data);
    console.log("Templates API response length:", response.data?.length);
    
    const filteredTemplates = filterActiveItems(response.data);
    console.log("Filtered templates:", filteredTemplates);
    console.log("Filtered templates length:", filteredTemplates?.length);
    
    return filteredTemplates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    console.error("Error details:", error.message, error.stack);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    
    // Return empty array instead of throwing error
    return [];
  }
};

export const fetchTemplateImages = async (templateId) => {
  try {
    console.log("Fetching template images for:", templateId);
    
    const response = await apiClient.get(`/TemplateImages/${templateId}`);
     return filterActiveItems(response.data);
  } catch (error) {
    console.error(`Error fetching images for template ${templateId}:`, error);
    return [];
  }
};

//Faq

export const fetchAllFAQs = async () => {
  try {
    console.log("Fetching all FAQs");

    const response = await apiClient.get("/FAQs/All");
     return filterActiveItems(response.data);
  } catch (error) {
    console.error("Error fetching all FAQs:", error);
    return []; 
  }
};


// Export the API_URL
export { API_URL };