import clsx from "clsx";

type TextGridOneSingleProps = {
  data: {
    id: string;
    title: string;
    text: string;
  };
  spaceBottomClass: string;
};

const TextGridOneSingle: React.FC<TextGridOneSingleProps> = ({
  data,
  spaceBottomClass,
}) => {
  return (
    <div className={clsx("single-mission", spaceBottomClass)}>
      <h3>{data.title}</h3>
      <p>{data.text}</p>
    </div>
  );
};

export default TextGridOneSingle;
