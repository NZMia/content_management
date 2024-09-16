export default function Paragraph({ block }: { block: any }) {
  return (
    <p className="mb-4">
      {block.paragraph.rich_text.map((text: any, index: number) => (
        <span key={index}>{text.plain_text}</span>
      ))}
    </p>
  );
}
