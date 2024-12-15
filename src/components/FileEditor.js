import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
} from "@mui/material";

const FileEditor = () => {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [fileHandle, setFileHandle] = useState(null);

  const handleOpenFile = async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Text Files",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });
      const file = await handle.getFile();
      const content = await file.text();
      setFileHandle(handle);
      setFileName(file.name);
      setFileContent(content);
      setIsModified(false);
    } catch (err) {
      console.error("Error opening file:", err);
    }
  };

  const handleSaveFile = async () => {
    try {
      if (fileHandle) {
        // Save to existing file
        const writable = await fileHandle.createWritable();
        await writable.write(fileContent);
        await writable.close();
        alert("File saved successfully!");
        setIsModified(false);
      } else {
        // Save as a new file
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName || "newfile.txt",
          types: [
            {
              description: "Text Files",
              accept: { "text/plain": [".txt"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(fileContent);
        await writable.close();
        setFileHandle(handle);
        setFileName(handle.name);
        alert("File saved successfully!");
        setIsModified(false);
      }
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };

  const handleContentChange = (event) => {
    setFileContent(event.target.value);
    setIsModified(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Selected File Name: {fileName || "None"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button variant="outlined" onClick={handleOpenFile}>
            Open a file
          </Button>
          <Button
            variant="outlined"
            onClick={handleSaveFile}
            disabled={!fileContent}
          >
            Save file
          </Button>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Selected file content shown in the text area below:
        </Typography>
        <TextField
          multiline
          rows={10}
          fullWidth
          variant="outlined"
          value={fileContent}
          onChange={handleContentChange}
        />
      </Box>
    </Container>
  );
};

export default FileEditor;
