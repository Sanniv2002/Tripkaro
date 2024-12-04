export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center ">
        <img className="rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiMa0N3X9LL47n9IvTRsxqgnUA9-WFzTPEUw&s" />
      </div>
      <div className="bg-secondary rounded-lg px-4 py-4">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" />
        </div>
      </div>
    </div>
  );
}