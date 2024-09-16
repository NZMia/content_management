export default function BulletedListItem({ block }: { block: any }) {
  return (
    <li className="mb-2 ml-6 list-disc">
      {block.bulleted_list_item.rich_text.map((text: any, index: number) => (
        <span key={index}>{text.plain_text}</span>
      ))}
    </li>
  );
}
