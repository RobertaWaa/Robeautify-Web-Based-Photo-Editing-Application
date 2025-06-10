import React, { useState } from "react";
import styled from "styled-components";
import { FaDownload, FaSave, FaUser, FaTimes } from "react-icons/fa";

const SaveModal = ({
  isOpen,
  onClose,
  onDownload,
  onSave,
  onSaveAndDownload,
  isLoggedIn,
  fileName,
  onFileNameChange,
  fileType,
  onFileTypeChange,
  downloadOnly = false,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <ModalHeader>Download Your Photo</ModalHeader>

        <FileNameSection>
          <label>File Name:</label>
          <FileNameInput
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
          />
        </FileNameSection>

        <FileTypeSection>
          <label>File Format:</label>
          <FileTypeSelect
            value={fileType}
            onChange={(e) => onFileTypeChange(e.target.value)}
          >
            <option value="jpg">JPG (.jpg)</option>
            <option value="png">PNG (.png)</option>
            <option value="webp">WebP (.webp)</option>
          </FileTypeSelect>
        </FileTypeSection>

        <SaveOption onClick={onDownload}>
          <FaDownload /> Download
        </SaveOption>

        {!downloadOnly && isLoggedIn ? (
          <>
            <SaveOption onClick={onSave}>
              <FaSave /> Save to My Account Only
            </SaveOption>
            <SaveOption onClick={onSaveAndDownload}>
              <div>
                <FaSave /> <FaDownload />
              </div>
              Save and Download
            </SaveOption>
          </>
        ) : (
          !downloadOnly && (
            <LoginPrompt>
              <FaUser /> Want to save your photos in your account? Log in next
              time!
            </LoginPrompt>
          )
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #ff69b4;
  }
`;

const ModalHeader = styled.h3`
  color: #ff69b4;
  margin-bottom: 20px;
  text-align: center;
`;

const FileNameSection = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
`;

const FileNameInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #ff69b4;
  }
`;

const FileTypeSection = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
`;

const FileTypeSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #ff69b4;
  }
`;

const SaveOption = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff4081;
  }

  div {
    display: flex;
    gap: 8px;
  }
`;

const LoginPrompt = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
`;

export default SaveModal;
