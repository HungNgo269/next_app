export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      <span className="font-medium">{before}</span>
      <span className="font-bold">{match}</span>
      <span className="font-medium">{after}</span>
    </>
  );
}
