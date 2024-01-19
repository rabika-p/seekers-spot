interface ITitleSectionProps {
    title: string;
}

const TitleSection = (props: ITitleSectionProps) => {
    return (
      <div className="flex items-center pl-5 py-5 font-medium text-gray-600 bg-white text-2xl">
        {props.title}
      </div>
    );
};

export default TitleSection;
  