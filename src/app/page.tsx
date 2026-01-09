"use client"

import Image from "next/image";
import Navbar from "../comps/Navbar"
import SquareComponent from "@/comps/SquareComponent";
import Footer from "@/comps/footer";

export default function Home() {
  return (
      <div className="flex flex-col ">
          <Navbar/>
          <div className="relative w-full h-[720px] bg-[#D9D9D9] visible">
              <img
                  src="/banner.png"
                  alt="Banner"
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
          </div>

          <div className="flex flex-col m-[40px] items-center justify-center">
              <hr className="border-gray-200 w-[80%]"/>
              <h1 className="font-semibold font-['Space_Grotesk'] m-[20px]  text-[45px] ">Soft fabric. Hard
                  presence.</h1>
              <hr className="border-gray-200 w-[80%]"/>
          </div>

          <div className="flex justify-center items-center gap-8 mx-10 my-10">
              {/* Left vertical image */}
              <img
                  src="/vertical%20(2).png"
                  className="w-72 object-cover flex-shrink-0"
                  alt="vertical"
              />

              <SquareComponent
                  imagePath="/clothes/hoodie_front_cropped.jpg"
                  hoverImagePath="/clothes/hoodie_back_cropped.jpg"
                  squareHeading="Soft Hoodies"
                  link="https://www.instagram.com/synisterwearofficial/"
              />

              <SquareComponent
                  imagePath="/clothes/tshirtcropped.jpg"
                  hoverImagePath="/clothes/tshirtcropped.jpg"
                  squareHeading="Streetwear Tees"
                  link="https://www.instagram.com/synisterwearofficial/"
              />

              <SquareComponent
                  imagePath="/clothes/beanie.jpg"
                  hoverImagePath="/clothes/beanie.jpg"
                  squareHeading="Caps & Beanies"
                  link="https://www.instagram.com/synisterwearofficial/"
              />
              <SquareComponent
                  imagePath="/clothes/front.jpg"
                  hoverImagePath="/clothes/back.jpg"
                  squareHeading="Limited Edition Tanks"
                  link="https://www.instagram.com/synisterwearofficial/"
              />

              <img
                  src="/vertical%20(2).png"
                  className="w-72 object-cover flex-shrink-0"
                  alt="vertical"
              />
          </div>
          <Footer/>
      </div>
  );
}
