import SignaturePreloader from "@/components/SignaturePreloader";

export default function Home() {
  return (
    // Nền màu đen, min-h-screen để phủ kín màn hình
    <main className="relative bg-[#000000] text-[#E5E5E5] min-h-screen flex flex-col items-center justify-center">

      {/* 1. Gọi Preloader */}
      <SignaturePreloader />

    </main>
  );
}