import React from "react";
import ImageInput from "../../components/ImageInput";

const Gallery = () => {
  return (
    <div className="min-h-screen w-full bg-skin-main text-skin-base">
      <div className="px-12">
        <ImageInput
          onImagesSelected={(imgs) => {
            console.log(imgs);
          }}
        />
      </div>
    </div>
  );
};

export default Gallery;
