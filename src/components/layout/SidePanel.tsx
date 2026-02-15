"use client";

import React from "react";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

interface SideBarProps {
  exhibition: SanityDocument[];
  award: SanityDocument[];
  clients: string[];
}

// Contact
const ContactSection = ({ language }: { language: string }) => (
  <>
    <h3 className="text-size-md md:text-size-lg leading-[1.4] font-semibold text-system-white font-ep-gothic break-keep">
      {language === "kr" ? (
        <>
          일상의실천은 권준호, 김경철, 김어진이 운영하는 그래픽디자인
          스튜디오입니다.
          <br />
          일상의실천은 오늘날 우리가 살아가는 현실에서 디자인이 어떤 역할을 해야
          하며, 또한 무엇을 할 수 있는가를 고민하는 소규모 공동체입니다.
          그래픽디자인을 기반으로 하고 있지만, 평면 작업에만 머무르지 않는
          다양한 디자인의 방법론을 탐구하고 있습니다.
        </>
      ) : (
        <>
          Everyday Practice is a graphic design studio founded by Joonho Kwon,
          Kyung-chul Kim, and Eojin Kim.
          <br />
          Everyday Practice is a small community that contemplates what role
          design should play in the reality we live in today and what it can do.
          While based on graphic design, we explore various design methodologies
          that go beyond two-dimensional work.
        </>
      )}
    </h3>
    <table className="mt-3 text-size-sm md:text-size-md font-medium text-system-white font-ep-sans w-full">
      <tbody>
        <tr className="h-6">
          <td className="w-25 align-top">address.</td>
          <td className="align-top">
            {language === "kr"
              ? "서울시 마포구 포은로 127 망원제일빌딩 3층"
              : "3F, 127, Poeun-ro, Mapo-gu, Seoul, Republic of Korea"}
          </td>
        </tr>
        <tr className="h-6">
          <td className="w-25 align-top">email.</td>
          <td className="align-top">
            <Link
              href="mailto:hello@everyday-practice.com"
              className="hover:text-system-white transition-colors"
            >
              hello@everyday-practice.com
            </Link>
          </td>
        </tr>
        <tr className="h-6">
          <td className="w-25 align-top">tel.</td>
          <td className="align-top">02.6352.7407</td>
        </tr>
        <tr className="h-6">
          <td className="w-25 align-top">instagram.</td>
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

// CV
const parseCvDate = (dateStr: string | number | null | undefined) => {
  if (!dateStr) return 0;
  const str = String(dateStr);
  const parts = str.split(".");
  const year = parseInt(parts[0]) || 0;
  const month = parseInt(parts[1]) || 0;
  return year * 100 + month;
};

const CvItem = ({ cv }: { cv: SanityDocument }) => (
  <div key={cv._id} className="group">
    <div className="flex items-baseline gap-x-8">
      <span className="shrink-0 w-10">{cv.date}</span>
      <span>{cv.title}</span>
    </div>
  </div>
);

const CvTypeSection = ({
  type,
  cvs,
}: {
  type: string | null;
  cvs: SanityDocument[];
}) => (
  <div key={type || "undefined"} className="space-y-1">
    {type && <p className="font-medium">{type}</p>}
    <div className="space-y-0">
      {cvs
        .sort((a, b) => parseCvDate(a.date) - parseCvDate(b.date))
        .map((cv) => (
          <CvItem key={cv._id} cv={cv} />
        ))}
    </div>
  </div>
);

const CvCategorySection = ({
  category,
  allCvs,
}: {
  category: string;
  allCvs: SanityDocument[];
}) => {
  const categoryCvs = allCvs.filter(
    (cv: SanityDocument) => cv.category === category,
  );
  const typeOrder = ["Solo Exhibition", "Selected Group Exhibition"];
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
    <div key={category} className="space-y-4">
      <h3 className="underline underline-offset-6 decoration-1 decoration-system-gray uppercase font-medium text-size-sm md:text-size-md">
        {category}
      </h3>
      <div className="space-y-4">
        {types.map((type) => (
          <CvTypeSection
            key={type || "undefined"}
            type={type}
            cvs={categoryCvs.filter((cv) => cv.type === type)}
          />
        ))}
      </div>
    </div>
  );
};

// Clients
const ClientSection = ({
  clients,
  setSearchTerm,
  isMobile,
  setIsMobileSidebarOpen,
  router,
  visibleClients,
}: {
  clients: string[];
  setSearchTerm: (term: string) => void;
  isMobile: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  router: ReturnType<typeof useRouter>;
  visibleClients: string[];
}) => (
  <div className="text-size-sm md:text-size-md font-medium text-system-white font-ep-sans space-y-4">
    <h3 className="underline underline-offset-6 decoration-1 decoration-system-gray uppercase font-medium mb-5">
      <p>Clients</p>
    </h3>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] w-full items-start justify-items-start ">
      {clients.map((client: string) => {
        const isVisible = visibleClients.includes(client.trim());
        return (
          <button
            key={client}
            className={`break-keep text-left text-size-sm md:text-size-md transition-colors cursor-pointer ${
              isVisible
                ? "text-system-gray"
                : "text-system-white hover:text-system-gray"
            }`}
            onClick={() => {
              setSearchTerm(client);
              if (isMobile) setIsMobileSidebarOpen(false);
              router.push("/");
            }}
          >
            {client}
          </button>
        );
      })}
    </div>
  </div>
);

export default function SideBar({ exhibition, award, clients }: SideBarProps) {
  const {
    activeTab,
    language,
    setSearchTerm,
    setIsMobileSidebarOpen,
    isMobile,
    visibleClients,
  } = useAppContext();
  const router = useRouter();

  const allCvs = [...(exhibition || []), ...(award || [])];

  const renderAsideContent = () => {
    switch (activeTab) {
      case "Contact":
        return <ContactSection language={language} />;
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
          <div className="text-size-sm md:text-size-md font-medium text-system-white font-ep-sans space-y-10">
            {finalCategories.map((category) => (
              <CvCategorySection
                key={category}
                category={category}
                allCvs={allCvs}
              />
            ))}
          </div>
        );
      }
      case "Client":
        return (
          <ClientSection
            clients={clients}
            setSearchTerm={setSearchTerm}
            isMobile={isMobile}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            router={router}
            visibleClients={visibleClients}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-2 flex flex-col h-full overflow-y-auto no-scrollbar">
      {renderAsideContent()}
    </div>
  );
}
