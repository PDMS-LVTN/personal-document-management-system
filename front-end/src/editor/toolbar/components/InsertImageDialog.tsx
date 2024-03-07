import React from "react";

const InsertImageDialog = ({ editor }) => {
  return (
    <>
      <label htmlFor="image">Choose an image:</label>
      <input
        type="file"
        id="avatar"
        name="image"
        accept="image/png, image/jpeg"
      />
    </>
  );
};

export default InsertImageDialog;
