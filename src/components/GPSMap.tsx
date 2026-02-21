import { MapPin, Navigation } from 'lucide-react';

interface GPSMapProps {
  lat: number;
  lng: number;
}

export default function GPSMap({ lat, lng }: GPSMapProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.008},${lng + 0.01},${lat + 0.008}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="glass-card neon-border-blue overflow-hidden rounded-xl h-full min-h-[280px]">
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <span className="font-display text-xs tracking-wider uppercase text-neon-blue flex items-center gap-2">
          <Navigation size={14} />
          Live GPS
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] text-muted-foreground font-mono">TRACKING</span>
        </div>
      </div>
      <div className="relative">
        <iframe
          src={mapUrl}
          className="w-full h-[240px] border-0 opacity-80"
          style={{ filter: 'invert(0.9) hue-rotate(180deg) saturate(0.5)' }}
          title="GPS Location"
        />
        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border/50">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <MapPin size={12} className="text-neon-red" />
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}
