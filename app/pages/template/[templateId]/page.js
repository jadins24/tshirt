import { fetchTemplateImages } from "@/app/services/apicofig";

// Use ISR with a short revalidation time instead of SSG
export const revalidate = 60;

async function fetchTemplateImagesData(templateId) {
  try {
    const images = await fetchTemplateImages(templateId);
    return images.filter((image) => image.activeStatus);
  } catch (error) {
    console.error("Error fetching template images:", error);
    return [];
  }
}

export default async function TemplateDetails({ params }) {
  const { templateId } = params;
  const images = await fetchTemplateImagesData(templateId);

  return (
    <div className="template-details">
      <h2>Template Details</h2>
      <div className="template-details-images">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} className="template-details-image">
              <img
                src={image.imageUrl || "/images/image-placeholder.png"}
                alt="Template Image"
                width={300}
                height={300}
              />
            </div>
          ))
        ) : (
          <p>No images available for this template.</p>
        )}
      </div>
    </div>
  );
}

// Remove generateStaticParams completely to bypass the error
// The page will be generated on-demand instead