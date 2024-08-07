import React, { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import Autoplay from "embla-carousel-autoplay";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const openPopup = (index: number) => {
    setPopupIndex(index);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const navigatePopup = (direction: number) => {
    setPopupIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <>
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full mx-auto relative max-h-[33rem]"
      >
        <CarouselContent className="max-h-[33rem]">
          {images.map((image, index) => (
            <CarouselItem key={index} className="max-h-[33rem]">
              <Card className="max-h-[33rem] relative">
                <CardContent className="p-0 max-h-[33rem]">
                  <AspectRatio ratio={16 / 9} className="max-h-[33rem]">
                    <img
                      src={`http://localhost:3000/uploads/${image}`}
                      alt={`Image ${index + 1}`}
                      className="object-cover w-full h-full rounded-md max-h-[33rem]"
                    />
                  </AspectRatio>
                  <button
                    onClick={() => openPopup(index)}
                    className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full shadow-lg hover:bg-opacity-75 transition-all duration-300"
                    aria-label="View full image"
                  >
                    <Maximize2 size={18} />
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>

      {popupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-[85vw] h-[85vh] flex items-center justify-center">
            <img
              src={`http://localhost:3000/uploads/${images[popupIndex]}`}
              alt={`Enlarged view ${popupIndex + 1}`}
              className="max-w-full max-h-full w-full h-full object-contain"
            />
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <button
              onClick={() => navigatePopup(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => navigatePopup(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
