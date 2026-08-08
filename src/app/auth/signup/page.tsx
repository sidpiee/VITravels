import { SignupForm } from "@/components/ui/singupForm";
import Image from "next/image";

export default function Signup() {
  return (
    <>
      <div className="flex relative">
        <div className="flex-1 justify-center items-center  flex z-30">
          <SignupForm />
        </div>
        <Image
          src="/background/background3.png"
          alt="bg-image"
          width={1122}
          height={1402}
          className="w-200 h-screen flex-1 z-10"
        />
        <div className=" absolute inset-0 bg-linear-to-l from-transparent via-background to-transparent z-20" />
      </div>
    </>
  );
}
