export default function Heading({ block }: { block: any }) {
  const Tag = `h${block.type.split('_')[1]}` as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={`font-bold mb-${5 - parseInt(block.type.split('_')[1])} text-${4 - parseInt(block.type.split('_')[1])}xl`}
    >
      {block[block.type].rich_text.map((text: any, index: number) => (
        <span key={index}>{text.plain_text}</span>
      ))}
    </Tag>
  );
}
