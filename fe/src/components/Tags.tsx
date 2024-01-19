interface ITagsProps {
  tags: string;
  onTagClick?: (tag: string) => void;
  hoverEffect?: boolean;
}

const Tags = ({ tags, onTagClick, hoverEffect = true }: ITagsProps) => {
  const tagList = tags.split(",").map((tag) => tag.trim());

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className="flex">
      {tagList?.map((tag, i) => (
        <div
          key={i}
          className={`bg-[#9988DD] text-white rounded-xl py-1 px-3 mr-2 text-xs mt-2 ${
            hoverEffect ? "hover:cursor-pointer hover:scale-105" : ""
          }`}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default Tags;
