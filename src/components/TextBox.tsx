"use client";

import { useState } from "react";

function TextBox({ jobTitle, JobDescription, setJobDescription }: any) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: [
            {
              id: "User-msg-1",
              role: "user",
              parts: [
                {
                  type: "text",
                  text: jobTitle,
                },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      const description = data.steps[0].response.messages[0].content[0].text;
      setJobDescription(description);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div
        className="w-[25vw] h-[25vw] p-10 border-2 overflow-y-scroll scroll-smooth relative"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="font-semibold text-xl overflow-clip">
          Your Job description here
        </div>
        {/* <div>{JobDescription}</div> */}
        <textarea
          className="border-2 outline-none w-full h-full resize-none"
          value={JobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
      <div>
        <button
          onClick={handleSubmit}
          className={`   px-4 py-2 rounded-xl mb-2  ${
            loading ? "bg-slate-400" : "bg-blue-300"
          } ${JobDescription ? "cursor-not-allowed" : "cursor-pointer"} ${
            JobDescription ? "bg-slate-400" : "bg-blue-300"
          }`}
        >
          {loading ? "Generating...." : "Generate with AI"}
        </button>
        <button
          onClick={() => setJobDescription("")}
          className={`px-4 py-2 rounded-xl mb-2  bg-blue-300 cursor-pointer`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default TextBox;
