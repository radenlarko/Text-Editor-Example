import React, { useState } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function Editor2() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [dataForStorage, setDataForStorage] = useState(null);
  const [dataNow, setDataNow] = useState(null);
  const [dataFromStorage, setDataFromStorage] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertData();
  };
  const convertData = () => {
    const dataRaw = convertToRaw(editorState.getCurrentContent());
    const dataHtml = convertToHTML(editorState.getCurrentContent());
    setDataForStorage(dataRaw);
    setDataNow(dataHtml);
  };

  const saveContent = (content) => {
    window.localStorage.setItem("content", JSON.stringify(content));
  };

  const handleContentFromStorage = () => {
    const savedContent = window.localStorage.getItem("content");
    const dataFromRaw = EditorState.createWithContent(
      convertFromRaw(JSON.parse(savedContent))
    );
    const currentContentAsHTML = convertToHTML(dataFromRaw.getCurrentContent());
    setDataFromStorage(currentContentAsHTML);
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
        }}
      />
      <button onClick={() => saveContent(dataForStorage)}>
        Save to storage
      </button>
      <button onClick={handleContentFromStorage}>Show</button>
      <h1>Data Sekarang</h1>
      <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(dataNow)}
      ></div>
      <h1>Data dari server</h1>
      <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(dataFromStorage)}
      ></div>
    </div>
  );
}

export default Editor2;
