"use client";
import { convertFileToUrl } from "@/utils/Convert_File";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState, useEffect } from "react";

export default function Chat() {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileParts =
      files && files.length > 0 ? await convertFileToUrl(files) : [];
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }, ...fileParts],
    });
    setFiles(undefined);
    setInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="flex flex-col w-full  h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
        </div>

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
              Choose File
            </label>
            {files && files.length > 0 && (
              <p className="text-sm truncate">
                {Array.from(files)
                  .map((file) => file.name)
                  .join(", ")}
              </p>
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-2 border-gray-200 p-2 rounded-2xl outline-none w-full"
            placeholder="Say something..."
          />
        </form>
      </div>
    </div>
  );
}
