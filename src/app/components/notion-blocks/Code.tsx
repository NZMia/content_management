export default function Code({ block }: { block: any }) {
  return (
    <pre className="mb-4 overflow-x-auto rounded-md bg-gray-100 p-4">
      <code className={`language-${block.code.language}`}>
        {block.code.rich_text.map((text: any, index: number) => (
          <span key={index}>{text.plain_text}</span>
        ))}
      </code>
    </pre>
  );
}
