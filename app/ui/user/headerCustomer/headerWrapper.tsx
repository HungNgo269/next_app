import { auth } from "@/auth";

interface HeaderWrapperProps {
  children: React.ReactNode; //header
}
//65% trở lên trước => 000 = đen = ẩn mask
//75 sương sương
//100 trong suốt
export async function HeaderWrapper({ children }: HeaderWrapperProps) {
  const session = await auth();

  return (
    <div className="h-[66px] fixed top-0 left-0 w-full z-[21] text-black">
      <div
        className="absolute inset-0 backdrop-blur-2xl 
          [background-image:linear-gradient(#dde2ee66,#dde2ee00)] 
          [mask-image:linear-gradient(#000_65%,#000000e0_75%,#0000)]"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
