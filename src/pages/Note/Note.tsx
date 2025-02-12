import { useEffect, useRef, useState } from "react";
import "./Note.css";
import { ContentItem } from "../../utils/documentStructure";

function Note() {
  const [content, setContent] = useState<ContentItem[]>([
    { id: 1, type: "heading", text: "" }, // Initial heading element
  ]);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const newParagraphIdRef = useRef<number | null>(null);
  const [focusedParagraphId, setFocusedParagraphId] = useState<number | null>(null);

  const handleKeyDown = (event: KeyboardEvent, id: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addParagraph(id); // add new paragraph on enter
    }

    const element = id === 1 ? titleRef.current : paragraphRefs.current.get(id);
    if (!element) return;

    // Delete paragraph if Backspace/Delete is pressed and the paragraph is empty
    if ((event.key === "Backspace" || event.key === "Delete") && element.innerText.trim() === "") {
      event.preventDefault();
      deleteParagraph(id);
    }
  };

  const handleInput = (id: number) => {
    const element = id === 1 ? titleRef.current : paragraphRefs.current.get(id);
    if (!element) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection?.getRangeAt(0);
    const cursorPosition = range ? range.startOffset : element.innerText.length;

    const newText = element.innerText;

    // Update state and placeholder class
    setContent((prevContent) => prevContent.map((item) => (item.id === id ? { ...item, text: newText } : item)));

    if (newText.trim() === "") {
      element.classList.add("placeholder");
    } else {
      element.classList.remove("placeholder");
    }

    // Restore cursor position
    requestAnimationFrame(() => {
      const updatedElement = id === 1 ? titleRef.current : paragraphRefs.current.get(id);
      if (!updatedElement) return;

      const newRange = document.createRange();
      newRange.setStart(updatedElement.childNodes[0] || updatedElement, cursorPosition);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    });
  };

  // Function to add a new paragraph to the content at a specific position
  const addParagraph = (id: number) => {
    setContent((prevContent) => {
      const newId = prevContent.length + 1;
      newParagraphIdRef.current = newId; // Track the ID of the new paragraph to set focus
      const index = prevContent.findIndex((item) => item.id === id);

      const newContent: ContentItem[] = [
        ...prevContent.slice(0, index + 1),
        { id: newId, type: "paragraph", text: "" }, // New paragraph
        ...prevContent.slice(index + 1),
      ];
      return newContent;
    });
  };

  // Delete current paragraph and go back to the one above
  const deleteParagraph = (id: number) => {
    setContent((prevContent) => {
      const index = prevContent.findIndex((item) => item.id === id);

      // Check if the paragraph being deleted is right below the heading
      if (index === 1 && prevContent[0].type === "heading") {
        newParagraphIdRef.current = 1; // Focus the heading
      } else {
        // Otherwise, focus the previous paragraph
        const previousParagraph = prevContent[index - 1];
        if (!previousParagraph) return prevContent;

        // Remove the paragraph and focus the previous one
        newParagraphIdRef.current = previousParagraph.id;
      }

      // Return content without paragraph
      return prevContent.filter((item) => item.id !== id);
    });
  };

  // Helper function to get the conditional class for placeholder visibility
  const getParagraphClass = (item: ContentItem) => {
    return item.text.trim() === "" && item.id === focusedParagraphId ? "note_paragraph placeholder" : "note_paragraph";
  };

  // Set cursor in new paragraph after it’s created
  useEffect(() => {
    if (newParagraphIdRef.current !== null) {
      const newParagraph =
        newParagraphIdRef.current === 1 ? titleRef.current : paragraphRefs.current.get(newParagraphIdRef.current);

      if (newParagraph) {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(newParagraph);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        newParagraph.focus();

        // Clear the reference to avoid re-focusing
        newParagraphIdRef.current = null;
      }
    }
  }, [content]);

  // Useffect for handling the title of the page
  useEffect(() => {
    const titleElement = titleRef.current;
    if (titleElement) {
      // Set initial placeholder state only if the element is empty
      if (titleElement.innerText.trim() === "") {
        titleElement.classList.add("placeholder");
      }
    }
  }, []);

  return (
    <main className="note_root">
      <section className="note_top">
        <div className="note_title">
          <h1
            contentEditable="plaintext-only"
            spellCheck="false"
            className="note_title_content"
            ref={titleRef}
            onInput={() => handleInput(1)}
            onKeyDown={(event) => handleKeyDown(event as unknown as KeyboardEvent, 1)}
          ></h1>
        </div>
      </section>

      <section className="note_content">
        {content.map((item) => {
          if (item.type === "paragraph") {
            return (
              <p
                key={item.id}
                ref={(el) => {
                  if (el) paragraphRefs.current.set(item.id, el);
                  else paragraphRefs.current.delete(item.id);
                }}
                spellCheck="false"
                contentEditable="plaintext-only"
                suppressContentEditableWarning
                className={getParagraphClass(item)} // Conditional class for placeholder
                onFocus={() => setFocusedParagraphId(item.id)} // Set focus state on focus
                onBlur={() => setFocusedParagraphId(null)} // Reset focus state on blur
                onInput={() => handleInput(item.id)}
                onKeyDown={(event) => handleKeyDown(event as unknown as KeyboardEvent, item.id)}
                data-placeholder="Write something..."
              >
                {item.text}
              </p>
            );
          }
          return null; // We already handle the heading separately
        })}
      </section>
    </main>
  );
}

export default Note;
