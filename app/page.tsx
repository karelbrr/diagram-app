import CanvasGrid from "@/components/canvas/canvas-grid";
import Dock from "@/components/canvas-ui/dock";
import { LeftBar } from "@/components/canvas-ui/left-bar";

export default function Home() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <CanvasGrid />
      <Dock panelHeight={70} baseItemSize={50} magnification={60} />
      <LeftBar />
    </section>
  );
}
