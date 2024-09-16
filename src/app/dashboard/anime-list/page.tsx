import { SeasonalAnimeComponent } from "@/components/anime-api/app-components-seasonal-anime";

export default function page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Bảng tin anime!!</h1>
      <SeasonalAnimeComponent  />
    </div>
  )
}