"use client";
import { GeminiMessage } from "@/types/Resume";
import { convertFileToUrl } from "@/utils/Convert_File";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
export default function Chat() {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<GeminiMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const fileParts =
        files && files.length > 0 ? await convertFileToUrl(files) : [];
      try {
        await sendMessage({
          role: "user",
          parts: [{ type: "text", text: input }, ...fileParts],
        });
        toast("Resume uploaded successfully");
      } catch (error) {
        toast("Error while uploading resume");
      }

      setFiles(undefined);
      setInput("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      router.push("/job-description");
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // if (messages.length > 0) {
    //   const lastMessage = messages[messages.length - 1];
    //   setResume(lastMessage as GeminiMessage);
    // }
  }, [messages]);
  // console.log(resume?.parts[1].text);

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="flex flex-col w-full  h-full">
        {/* Messages */}
        {/* <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-full whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-bl-none"
                    : "bg-gray-100 text-black rounded-br-none"
                }`}
              >
                <span className="font-bold block mb-1">
                  {message.role === "user" ? "User" : "AI"}:
                </span>
                {message.parts.map((part) =>
                  part.type === "text" ? (
                    <div key={`${message.id}-text`}>{part.text}</div>
                  ) : null
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div> */}

        {/* Input Form */}
        <form
          className="sticky bottom-0 w-lg  mx-auto bg-white p-4  flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-2">
            <input
              id="fileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              ref={fileInputRef}
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Upload Your Resume
            </label>
            {files && files.length > 0 && (
              <p className="text-sm truncate">
                {Array.from(files)
                  .map((file) => file.name)
                  .join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className={` px-4 py-2 rounded-2xl  ${
              loading ? "bg-gray-400" : "bg-blue-300"
            } ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? "Wait.." : "Proceed"}
          </button>
          {/* <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-2 border-gray-200 p-2 rounded-2xl outline-none w-full"
            placeholder="Say something..."
          /> */}
        </form>
      </div>
    </div>
  );
}
