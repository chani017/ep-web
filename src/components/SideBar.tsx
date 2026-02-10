"use client";

import React, { useState } from "react";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import ResizableLayout from "./ResizableLayout";

interface SideBarProps {
  posts: SanityDocument[];
  selExhs: SanityDocument[];
  award: SanityDocument[];
}

type Tab = "Contact" | "CV" | "Client";

export default function SideBar({ posts, selExhs, award }: SideBarProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Contact");

  const allCvs = [...(selExhs || []), ...(award || [])];

  const mainContent = (
    <>
      <header className="flex justify-between items-center p-1 border-b border-[#787878] submenu h-[2.5rem]">
        <div className="relative flex-1 px-1 h-full flex items-center group cursor-pointer overflow-hidden">
          <div className="text-[1.32rem] font-me text-[#e2e2e2] font-ep-sans uppercase transition-all duration-300 transform opacity-100 group-hover:opacity-0 whitespace-nowrap">
            Everyday Practice
          </div>
          <div className="absolute inset-0 flex items-center px-1 text-[1.32rem] font-medium text-[#e2e2e2] font-ep-sans transition-all duration-300 transform translate-x-2 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 whitespace-nowrap">
            일상의실천
          </div>
        </div>
        <div className="flex-1 text-center text-[1.32rem] font-normal text-[#787878] font-ep-sans">
          Kor / Eng
        </div>
        <div className="flex-1 text-right px-1 text-[1.32rem] font-normal text-[#787878] font-ep-sans hover:text-[#e2e2e2] transition-colors">
          hello@everyday-practice.com
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Posts</h1>
        <ul className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <li className="hover:underline" key={post._id}>
              <Link href={`/${post.slug.current}`}>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderAsideContent = () => {
    switch (activeTab) {
      case "Contact":
        return (
          <>
            <h3 className="text-[1.1rem] leading-[1.4] font-semibold text-[#e2e2e2] font-ep-gothic break-keep">
              일상의실천은 권준호, 김경철, 김어진이 운영하는 그래픽디자인
              스튜디오입니다.
              <br />
              일상의실천은 오늘날 우리가 살아가는 현실에서 디자인이 어떤 역할을
              해야 하며, 또한 무엇을 할 수 있는가를 고민하는 소규모
              공동체입니다. 그래픽디자인을 기반으로 하고 있지만, 평면 작업에만
              머무르지 않는 다양한 디자인의 방법론을 탐구하고 있습니다.
            </h3>
            <table className="mt-3 text-[1rem] font-medium text-[#e2e2e2] font-ep-sans w-full">
              <tbody>
                <tr className="h-[1.5rem]">
                  <td className="w-[6.25rem] align-top">address.</td>
                  <td className="align-top">
                    서울시 마포구 포은로 127 망원제일빌딩 3층
                  </td>
                </tr>
                <tr className="h-[1.5rem]">
                  <td className="w-[6.25rem] align-top">email.</td>
                  <td className="align-top">
                    <Link
                      href="mailto:hello@everyday-practice.com"
                      className="hover:text-[#e2e2e2] transition-colors"
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
          <div className="text-[0.8rem] font-normal text-[#e2e2e2] font-ep-sans space-y-10">
            {finalCategories.map((category) => {
              const categoryCvs = allCvs.filter(
                (cv: SanityDocument) => cv.category === category,
              );
              const types = Array.from(
                new Set(categoryCvs.map((cv: SanityDocument) => cv.type)),
              );

              return (
                <div key={category} className="space-y-4">
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
          <div className="text-[1rem] font-normal text-[#e2e2e2] font-ep-sans space-y-4">
            <h3 className="text-xl font-bold uppercase">Selected Clients</h3>
            <div className="grid grid-cols-1 gap-2 text-[#787878]">
              <p>National Museum of Modern and Contemporary Art (MMCA)</p>
              <p>Seoul Museum of Art (SeMA)</p>
              <p>KF Korea Foundation</p>
              <p>Seoul Metropolitan Government</p>
              <p>Greenpeace Office East Asia</p>
              <p>The Beautiful Foundation</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const asideContent = (
    <aside className="flex flex-col h-full">
      <header className="flex justify-end items-center p-1 border-b border-[#787878] submenu h-[2.5rem] gap-x-2 px-2">
        {(["Contact", "CV", "Client"] as Tab[]).map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[1.32rem] font-light transition-colors cursor-pointer font-ep-sans ${
              activeTab === tab
                ? "text-[#e2e2e2]"
                : "text-[#787878] hover:text-[#e2e2e2]"
            }`}
          >
            {tab}
          </div>
        ))}
      </header>
      <div className="p-2 flex flex-col h-full overflow-y-auto">
        {renderAsideContent()}
      </div>
    </aside>
  );

  return <ResizableLayout left={mainContent} right={asideContent} />;
}
