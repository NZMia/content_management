export default function Quote({ block }: { block: any }) {
  return (
    <blockquote className="mb-4 border-l-4 border-gray-300 pl-4 italic">
      {block.quote.rich_text.map((text: any, index: number) => (
        <span key={index}>{text.plain_text}</span>
      ))}
    </blockquote>
  );
}
