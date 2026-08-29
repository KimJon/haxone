export function Logo({ className = "h-16", showText = true, lightText = false }: { className?: string, showText?: boolean, lightText?: boolean }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="HaxOne Logo" 
        className="h-full w-auto object-contain"
        style={lightText 
          ? { filter: 'grayscale(1) invert(1) contrast(200%)', mixBlendMode: 'screen' } 
          : { mixBlendMode: 'multiply' }
        }
      />
    </div>
  );
}
