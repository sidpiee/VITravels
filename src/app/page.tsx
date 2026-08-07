import backgrond from "../../public/background/background2.png";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <Image
        src={backgrond}
        alt="background-img"
        className="bg-cover absolute bg-center z-0 h-screen"
      />
      <div className="flex items-center justify-start h-screen px-10 ">
        <h1 className="z-10 text-white text-4xl font-extrabold font-heading">
          Find your next travel-buddy{" "}
          <span className="bg-linear-to-l from-pink-300 to-white bg-clip-text text-transparent">
            on
          </span>{" "}
          <div className="text-7xl bg-linear-to-r from-indigo-500  to-indigo-900 bg-clip-text text-transparent">
            VITravels
          </div>
        </h1>
      </div>
    </div>
  );
}
