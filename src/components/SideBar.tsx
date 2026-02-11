"use client";

import React, { useState } from "react";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import ResizableLayout from "./ResizableLayout";
import MainContent from "./MainContent";

interface SideBarProps {
  posts: SanityDocument[];
  selExhs: SanityDocument[];
  award: SanityDocument[];
  clients: SanityDocument[];
}

type Tab = "Contact" | "CV" | "Client";

export default function SideBar({
  posts,
  selExhs,
  award,
  clients,
}: SideBarProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Contact");
  const [language, setLanguage] = useState<"kr" | "en">("kr");

  const allCvs = [...(selExhs || []), ...(award || [])];

  const renderAsideContent = () => {
    switch (activeTab) {
      case "Contact":
        return (
          <>
            <h3 className="text-size-lg leading-[1.4] font-semibold text-system-text font-ep-gothic break-keep">
              {language === "kr" ? (
                <>
                  일상의실천은 권준호, 김경철, 김어진이 운영하는 그래픽디자인
                  스튜디오입니다.
                  <br />
                  일상의실천은 오늘날 우리가 살아가는 현실에서 디자인이 어떤
                  역할을 해야 하며, 또한 무엇을 할 수 있는가를 고민하는 소규모
                  공동체입니다.
                  <br />
                  그래픽디자인을 기반으로 하고 있지만, 평면 작업에만 머무르지
                  않는 다양한 디자인의 방법론을 탐구하고 있습니다.
                </>
              ) : (
                <>
                  Everyday Practice is a graphic design studio founded by Joonho
                  Kwon, Kyung-chul Kim, and Eojin Kim.
                  <br />
                  Everyday Practice is a small community that contemplates what
                  role design should play in the reality we live in today and
                  what it can do.
                  <br />
                  While based on graphic design, we explore various design
                  methodologies that go beyond two-dimensional work.
                </>
              )}
            </h3>
            <table className="mt-3 text-size-md font-medium text-system-text font-ep-sans w-full">
              <tbody>
                <tr className="h-[1.5rem]">
                  <td className="w-[6.25rem] align-top">address.</td>
                  <td className="align-top">
                    {language === "kr"
                      ? "서울시 마포구 포은로 127 망원제일빌딩 3층"
                      : "3F, 127, Poeun-ro, Mapo-gu, Seoul, Republic of Korea"}
                  </td>
                </tr>
                <tr className="h-[1.5rem]">
                  <td className="w-[6.25rem] align-top">email.</td>
                  <td className="align-top">
                    <Link
                      href="mailto:hello@everyday-practice.com"
                      className="hover:text-system-text transition-colors"
                    >
                      hello@everyday-practice.com
                    </Link>
                  </td>
                </tr>
                <tr className="h-[1.5rem]">
                  <td className="w-[6.25rem] align-top">tel.</td>
                  <td className="align-top">02.6352.7407</td>
                </tr>
                <tr className="h-[1.5rem]">
                  <td className="w-[6.25rem] align-top">instagram.</td>
                  <td className="align-top">
                    <button>
                      <Link
                        href="https://www.instagram.com/hello_ep/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @hello_ep
                      </Link>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        );
      case "CV": {
        const categoryOrder = ["Selected Exhibitions", "Award"];
        const categories = categoryOrder.filter((cat) =>
          allCvs.some((cv: SanityDocument) => cv.category === cat),
        );
        const otherCategories = Array.from(
          new Set(allCvs.map((cv: SanityDocument) => cv.category)),
        ).filter((cat) => !categoryOrder.includes(cat));
        const finalCategories = [...categories, ...otherCategories];

        return (
          <div className="text-[0.9rem] font-normal text-system-text font-ep-sans space-y-10">
            {finalCategories.map((category) => {
              const categoryCvs = allCvs.filter(
                (cv: SanityDocument) => cv.category === category,
              );
              const typeOrder = [
                "Solo Exhibition",
                "Selected Group Exhibition",
              ];
              const types = Array.from(
                new Set(categoryCvs.map((cv: SanityDocument) => cv.type)),
              ).sort((a, b) => {
                const indexA = typeOrder.indexOf(a as string);
                const indexB = typeOrder.indexOf(b as string);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
              });

              return (
                <div key={category} className="space-y-2">
                  <h3 className="underline underline-offset-6 decoration-1 uppercase font-medium">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {types.map((type) => (
                      <div key={type} className="space-y-1">
                        {type && <p className="font-medium">{type}</p>}
                        <div className="space-y-0">
                          {categoryCvs
                            .filter((cv: SanityDocument) => cv.type === type)
                            .map((cv: SanityDocument) => (
                              <div key={cv._id} className="group">
                                <div className="flex items-baseline gap-x-4">
                                  <span className="shrink-0 w-10">
                                    {cv.date}
                                  </span>
                                  <span>{cv.title}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      case "Client":
        return (
          <div className="text-[0.9rem] font-normal text-system-text font-ep-sans space-y-4">
            <h3 className="underline underline-offset-6 decoration-1 uppercase font-medium">
              <p>Clients</p>
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {clients.map((client: SanityDocument) => (
                <p key={client._id} className="text-system-text break-keep">
                  {client.client}
                </p>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const asideContent = (
    <aside className="flex flex-col h-full">
      <header className="flex justify-end items-center p-1 border-b border-system-gray submenu h-[2.5rem] gap-x-2 px-2">
        {(["Contact", "CV", "Client"] as Tab[]).map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[1.4rem] font-light transition-colors cursor-pointer font-ep-sans ${
              activeTab === tab
                ? "text-system-text"
                : "text-system-gray hover:text-system-text"
            }`}
          >
            {tab}
          </div>
        ))}
      </header>
      <div className="p-2 flex flex-col h-full overflow-y-auto no-scrollbar">
        {renderAsideContent()}
      </div>
    </aside>
  );

  return (
    <ResizableLayout
      left={
        <MainContent
          posts={posts}
          language={language}
          setLanguage={setLanguage}
        />
      }
      right={asideContent}
    />
  );
}
