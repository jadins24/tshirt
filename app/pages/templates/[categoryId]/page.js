import {
  fetchTemplateCategories,
  fetchTemplates,
} from "@/app/services/apicofig";
import Link from "next/link";
import "./CategoryTemplates.scss";

export const revalidate = 60;

async function fetchAllTemplates() {
  try {
    const templates = await fetchTemplates(); 
    return templates.filter((template) => template.activeStatus); 
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}

async function fetchActiveCategories() {
  try {
    const categories = await fetchTemplateCategories();
    return categories.filter((category) => category.activeStatus);
  } catch (error) {
    console.error("Error fetching template categories:", error);
    return [];
  }
}

export default async function CategoryTemplates({ params }) {
  const { categoryId } = params;
  const allTemplates = await fetchAllTemplates();

  // Filter templates by the given categoryId
  const templates = allTemplates.filter(
    (template) => template.templateCategoryId.toString() === categoryId
  );

  return (
    <div className="category-templates">
      <div className="category-templates-head">
      <div className="category-templates-head-text">
      <h2>Templates </h2>

      </div>

      </div>
      <div className="category-templates-container">
      
        <div className="category-templates-cards">
          {templates.length > 0 ? (
            templates.map((template) => (
              <>
             
              {/* <Link
                key={template.id}
                href={`/pages/template/${template.id}`}
                className="category-template-card"
              > */}
              <div className="category-template-card" >
                <div className="category-template-card-img">
                  <img
                    src={
                      template.imageUrl
                    }
                    alt={template.name || "Template"}
                    width={250}
                    height={250}
                  />
                </div>
                <div className="category-template-card-text">
                  {/* <h3>{template.name}</h3> */}
                </div>
                </div>
              {/* </Link> */}
                 
              </>
            ))
          ) : (
            <p>No templates available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories = await fetchActiveCategories();
  return categories.map((category) => ({
    params: { categoryId: category.id.toString() },
  }));
}
