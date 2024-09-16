export default function Callout({ block }: { block: any }) {
  return (
    <div className="mb-4 flex items-start rounded-md bg-gray-100 p-4">
      {block.callout.icon && (
        <div className="mr-3">{block.callout.icon.emoji}</div>
      )}
      <div>
        {block.callout.rich_text.map((text: any, index: number) => (
          <span key={index}>{text.plain_text}</span>
        ))}
      </div>
    </div>
  );
}
