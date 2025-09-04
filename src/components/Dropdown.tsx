"use client";
import { useState } from "react";
import DownArrow from "./DownArrow";
const jobs = [
  "Full Stack developer",
  "Frontend developer",
  "Backend developer",
];

type DropdownProps = {
  jobTitle: string;
  setJobTitle: (job: string) => void;
};

function Dropdown({ jobTitle, setJobTitle }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[10vw] relative">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex cursor-pointer w-full border-2 border-gray-500 px-4 py-2 items-center justify-between"
      >
        <p>{jobTitle === "" ? "Select" : jobTitle}</p>
        <DownArrow isOpen={isOpen} />
      </div>
      {isOpen && (
        <div>
          {jobs.map((job) => (
            <p
              key={job}
              onClick={() => {
                setJobTitle(job);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {job}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
