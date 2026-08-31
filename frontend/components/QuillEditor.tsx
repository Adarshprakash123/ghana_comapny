"use client";

import { useEffect, useRef, useState } from "react";

type QuillInstance = {
  root: HTMLElement;
  on: (eventName: "text-change", handler: () => void) => void;
  off: (eventName: "text-change", handler: () => void) => void;
};

type QuillConstructor = new (
  container: string | HTMLElement,
  options: Record<string, unknown>
) => QuillInstance;

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Write the blog content here..."
}: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const isSelfChangeRef = useRef(false);
  const [editorReady, setEditorReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const existingQuill = (window as unknown as { Quill?: QuillConstructor }).Quill;
    if (existingQuill) {
      setEditorReady(true);
      return;
    }

    if (!document.querySelector('link[href*="quill.snow.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.quilljs.com/1.3.7/quill.snow.css";
      document.head.appendChild(link);
    }

    const scriptUrl = "https://cdn.quilljs.com/1.3.7/quill.min.js";
    let script = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);

    if (!script) {
      script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      document.body.appendChild(script);
    }

    const handleLoad = () => setEditorReady(true);
    const handleError = () => setLoadError(true);

    if ((window as unknown as { Quill?: QuillConstructor }).Quill) {
      setEditorReady(true);
    } else {
      script.addEventListener("load", handleLoad);
      script.addEventListener("error", handleError);
    }

    return () => {
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (!editorReady || !containerRef.current || quillRef.current) {
      return;
    }

    const Quill = (window as unknown as { Quill?: QuillConstructor }).Quill;
    if (!Quill) {
      return;
    }

    const container = containerRef.current;

    if (
      container.previousElementSibling &&
      container.previousElementSibling.classList.contains("ql-toolbar")
    ) {
      container.previousElementSibling.remove();
    }
    container.innerHTML = "";

    const quill = new Quill(container, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "blockquote", "code-block"],
          ["clean"]
        ]
      }
    });

    const toolbarEl = container.previousElementSibling;
    if (toolbarEl && toolbarEl.classList.contains("ql-toolbar")) {
      const buttons = toolbarEl.querySelectorAll("button");
      buttons.forEach((btn) => {
        btn.setAttribute("type", "button");
      });
    }

    if (value) {
      quill.root.innerHTML = value;
    } else {
      quill.root.innerHTML = "<p><br></p>";
    }

    const handleTextChange = () => {
      isSelfChangeRef.current = true;
      const html = quill.root.innerHTML ?? "";
      onChange(html === "<p><br></p>" ? "" : html);
    };

    quill.on("text-change", handleTextChange);
    quillRef.current = quill;

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change", handleTextChange);
        quillRef.current = null;
      }
      if (toolbarEl && toolbarEl.parentNode) {
        toolbarEl.parentNode.removeChild(toolbarEl);
      }
      container.innerHTML = "";
    };
  }, [editorReady, placeholder]);

  useEffect(() => {
    if (isSelfChangeRef.current) {
      isSelfChangeRef.current = false;
      return;
    }

    if (quillRef.current) {
      const currentHTML = quillRef.current.root.innerHTML;
      const targetHTML = value || "<p><br></p>";
      if (currentHTML !== targetHTML && (value || currentHTML !== "<p><br></p>")) {
        quillRef.current.root.innerHTML = targetHTML;
      }
    }
  }, [value]);

  if (loadError) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        placeholder="Quill failed to load. Type HTML or plain text here..."
        style={{ width: "100%", padding: "12px", border: "1px solid #cfdbe8", borderRadius: "6px" }}
      />
    );
  }

  return (
    <div className="quill-editor-wrapper">
      <div ref={containerRef} className="blog-quill-editor" />
    </div>
  );
}
