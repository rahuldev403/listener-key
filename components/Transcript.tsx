import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export interface TranscriptMessage {
  role: string;
  content: string;
}

export interface TranscriptProps {
  messages: TranscriptMessage[];
  currentMessage: string;
  currentUserMessage: string;
}

const Transcript: React.FC<TranscriptProps> = ({
  messages,
  currentMessage,
  currentUserMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages or streaming text changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty =
    messages.length === 0 && !currentMessage && !currentUserMessage;

  return (
    <>
      {isEmpty ? (
        <div className="transcript-empty">
          <Mic className="w-16 h-16 mb-4 text-[#212a3b] opacity-50 mx-auto" />
          <p className="transcript-empty-text">No conversation yet</p>
          <p className="transcript-empty-hint">
            Tap the microphone button to start speaking.
          </p>
        </div>
      ) : (
        <div className="transcript-messages">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`transcript-message ${
                  isUser
                    ? "transcript-message-user"
                    : "transcript-message-assistant"
                }`}
              >
                <div
                  className={`transcript-bubble ${
                    isUser
                      ? "transcript-bubble-user"
                      : "transcript-bubble-assistant"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {currentUserMessage && (
            <div className="transcript-message transcript-message-user">
              <div className="transcript-bubble transcript-bubble-user">
                {currentUserMessage}
                <span className="transcript-cursor bg-white" />
              </div>
            </div>
          )}

          {currentMessage && (
            <div className="transcript-message transcript-message-assistant">
              <div className="transcript-bubble transcript-bubble-assistant">
                {currentMessage}
                <span className="transcript-cursor" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </>
  );
};

export default Transcript;
