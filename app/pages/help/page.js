// pages/help/page.js
import Link from "next/link";
import "./help.scss";
import { WiDirectionRight } from "react-icons/wi";
import {
  fetchHelpSectionFours,
  fetchHelpSectionOnes,
  fetchHelpSectionThrees,
  fetchHelpSectionTwoes,
} from "@/app/services/apicofig";

// This will revalidate the page every 60 seconds
export const revalidate = 60; 

async function fetchHelpData() {
  try {
    const [
      helpSectionOnes,
      helpSectionTwoes,
      helpSectionThrees,
      helpSectionFours,
    ] = await Promise.all([
      fetchHelpSectionOnes(),
      fetchHelpSectionTwoes(),
      fetchHelpSectionThrees(),
      fetchHelpSectionFours(),
    ]);

    return {
      helpSectionOnes,
      helpSectionTwoes,
      helpSectionThrees,
      helpSectionFours,
    };
  } catch (error) {
    console.error("Error fetching Help data:", error.message);
    return {
      helpSectionOnes: [],
      helpSectionTwoes: [],
      helpSectionThrees: [],
      helpSectionFours: [],
    };
  }
}

export default async function Help() {
  const helpData = await fetchHelpData();
  const {
    helpSectionOnes = [],
    helpSectionTwoes = [],
    helpSectionThrees = [],
    helpSectionFours = [],
  } = helpData;

  return (
    <>
      <div className="helpBannerSection">
        <div className="helpBgContainer">
          {helpSectionOnes.map((item) => (
            <div key={item.id} className="helpBannerContainer">
              <div className="helpBannerImg">
                <img
                  src={item.imageUrl || "/image/helpMain.png"} 
                  alt={item.heading || "Help main image"}
                  width={650}
                  height={300}
                />
              </div>

              <div className="helpBannerContent">
                <h3>{item.heading || "Group orders made easy"}</h3>
                <p>{item.description || "Lorem ipsum dolor sit amet."}</p>
                <div className="contentBtns">
                  <div className="btns">
                    <Link href="/pages/templates">
                      <button className="btn">Use an existing design</button>
                    </Link>
                    <Link href="/pages/products">
                      <button className="btn">Start a new design</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="groupDesign">
          {helpSectionTwoes.map((item) => (
            <div key={item.id} className="groupDesignContainer">
              <div className="groupDesignImg">
                <img
                  src={item.imageUrl || "/image/designedImg.png"}
                  alt={item.heading || "Help main image"}
                  width={500}
                  height={200}
                />
              </div>

              <div className="groupDesignContent">
                <h3>{item.heading || "Group orders made easy"}</h3>
                <p>{item.description || "Lorem ipsum dolor sit amet."}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cardContainer">
          {helpSectionThrees.map((section) => (
            <div key={section.id} className="cards">
              <div className="cardImg">
                <img
                  src={section.imageUrl}
                  alt={section.heading}
                  width={120}
                  height={120}
                />
              </div>
              <div className="cardHead">
                <h4>{section.heading}</h4>
              </div>
              <div className="cardContent">
                <p>{section.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="worksContainer">
          {helpSectionFours.map((section) => (
            <div key={section.id} className="works">
              <div className="worksImg">
                <img
                  src={section.imageUrl}
                  alt="vacation image"
                  width={350}
                  height={420}
                />
              </div>

              <div className="worksDetails">
                <h1>{section.heading}</h1>
                <div className="cardsCollection">
                  <div className="worksCard">
                    <h4><span>1</span> {section.firstHeading}</h4>
                    <p>{section.firstDescription}</p>
                  </div>

                  <div className="worksCard">
                    <h4><span>2</span> {section.secondHeading}</h4>
                    <p>{section.secondDescription}</p>
                  </div>

                  <div className="worksCard">
                    <h4><span>3</span> {section.thridHeading}</h4>
                    <p>{section.thridDescription}</p>
                  </div>
                </div>
                <div className="btnHead">
                  <h4>Ready to get started?</h4>
                </div>
                <div className="btns">
                    <Link href="/pages/templates">
                      <button className="btn">
                      Use an existing design
                      </button>
                    </Link>
                     <Link href="/pages/products">
                      <button className="btn">
                      Start a new design
                      </button>
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
