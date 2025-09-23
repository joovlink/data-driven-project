"use client";

import { useEffect, useState } from "react";
import { Edit, Blocks, Award, Plus } from "lucide-react";

type Skill = {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Native";
};

type Certification = {
  issuer: string;
  name: string;
  credential_id: string;
  due: string;
};

type SkillAndLanguage = {
  skills: Skill[];
  languages: Skill[];
  certifications: Certification[];
};

export default function SkillsPage() {
  const [data, setData] = useState<SkillAndLanguage | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dummy: SkillAndLanguage = {
      skills: [
        { name: "React Native", level: "Beginner" },
        { name: "React JS", level: "Intermediate" },
        { name: "Next JS", level: "Intermediate" },
        { name: "Express JS", level: "Intermediate" },
        { name: "Node JS", level: "Advanced" },
        { name: "TypeScript", level: "Intermediate" },
        { name: "JavaScript (ES6+)", level: "Advanced" },
        { name: "Tailwind CSS", level: "Advanced" },
        { name: "MongoDB", level: "Intermediate" },
        { name: "PostgreSQL", level: "Beginner" },
        { name: "Docker", level: "Beginner" },
        { name: "Git / GitHub", level: "Advanced" },
      ],
      languages: [
        { name: "Bahasa Indonesia", level: "Native" },
        { name: "English", level: "Advanced" },
      ],
      certifications: [
        {
          issuer: "Cisco",
          name: "Cisco Certified Network Professional Routing and Switching",
          credential_id: "CSCO12981208",
          due: "Oct 2028",
        },
        {
          issuer: "AWS",
          name: "AWS Certified Solutions Architect – Associate",
          credential_id: "AWS123456789",
          due: "Dec 2026",
        },
        {
          issuer: "Google Cloud",
          name: "Professional Cloud Architect",
          credential_id: "GCP987654321",
          due: "Jun 2027",
        },
        {
          issuer: "Microsoft",
          name: "Microsoft Certified: Azure Administrator Associate",
          credential_id: "MSFT55667788",
          due: "Mar 2026",
        },
        {
          issuer: "CompTIA",
          name: "CompTIA Security+",
          credential_id: "COMPTIA12345",
          due: "Sep 2025",
        },
        {
          issuer: "Oracle",
          name: "Oracle Certified Professional, Java SE 11 Developer",
          credential_id: "ORCL11223344",
          due: "Nov 2027",
        },
        {
          issuer: "PMI",
          name: "Project Management Professional (PMP)",
          credential_id: "PMI44556677",
          due: "Jul 2026",
        },
        {
          issuer: "Scrum.org",
          name: "Professional Scrum Master I (PSM I)",
          credential_id: "SCRUM112244",
          due: "May 2027",
        },
        {
          issuer: "Linux Foundation",
          name: "Certified Kubernetes Administrator (CKA)",
          credential_id: "LFCKA778899",
          due: "Feb 2028",
        },
      ],
    };
    setData(dummy);
  }, []);

  const levelStyle = (level: string) => {
    switch (level) {
      case "Beginner":
        return { border: "border-[#56DACA]", badge: "bg-[#56DACA] text-black" };
      case "Intermediate":
        return { border: "border-[#007C84]", badge: "bg-[#007C84] text-white" };
      case "Advanced":
        return { border: "border-[#004A5F]", badge: "bg-[#004A5F] text-white" };
      case "Native":
        return { border: "border-[#00253F]", badge: "bg-[#00253F] text-white" };
      default:
        return { border: "border-gray-400", badge: "bg-gray-400 text-white" };
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Skills & Languages */}
      <div className="relative rounded-2xl shadow-md overflow-hidden bg-white">
        <div className="relative px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex space-x-2 items-center">
              <Blocks className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Skills</h2>
            </div>
            <button type="button" onClick={() => setOpen(true)}>
              <Edit className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Showcase your hard skills or soft skills and languages to highlight your strengths.
          </div>

          {/* Body */}
          {data ? (
            <div className="flex flex-col gap-4 mt-4">
              {/* Skills */}
              <div>
                <span className="font-semibold block mb-2">Skills</span>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s, idx) => {
                    const style = levelStyle(s.level);
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-1 rounded-2xl bg-white flex items-center shadow-md gap-2 border ${style.border}`}
                      >
                        <span className={`px-2 rounded-xl text-[10px]  ${style.badge}`}>{s.level}</span>
                        <span className="text-sm text-gray-800">{s.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Languages */}
              <div>
                <span className="font-semibold block mb-2">Languages</span>
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((l, idx) => {
                    const style = levelStyle(l.level);
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-1 rounded-2xl bg-white flex items-center shadow-md gap-2 border ${style.border}`}
                      >
                        <span className={`px-2 rounded-xl text-[10px] ${style.badge}`}>{l.level}</span>
                        <span className="text-sm text-gray-800">{l.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-6">Loading...</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="relative rounded-2xl shadow-md overflow-hidden bg-white">
        <div className="relative px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex space-x-2 items-center">
              <Award className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Certificates</h2>
            </div>
            <button type="button" onClick={() => setOpen(true)}>
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Add your certifications to demonstrate verified skills and strengthen your profile.
          </div>

          {data ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.certifications.map((c, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-2xl  bg-white border shadow-md border-gray-200 flex justify-between gap-3 text-sm min-w-[280px]"
                >
                  {/* Isi cert */}
                  <div className="flex flex-col w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-white bg-[#004A5F] px-2 rounded-xl">{c.issuer}</span>
                      {/* Edit button */}
                      <button
                        type="button"
                        className="p-1 rounded-md hover:bg-gray-100"
                        onClick={() => console.log("Edit", c.name)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{c.name}</span>
                      <span className="text-xs">
                        <span className="font-semibold text-[#004A5F]">{c.credential_id}</span>{" "}
                        <span className="text-gray-600">(due {c.due})</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-6">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
