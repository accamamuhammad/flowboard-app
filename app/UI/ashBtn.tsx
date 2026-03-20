// ashBtn.tsx — ensure onClick is accepted
type Props = {
  title: string;
  onClick?: () => void;
};

export const AshBtn = ({ title, onClick }: Props) => (
  <button onClick={onClick} className="text-sm px-4 py-2 text-asphalt shadow-sm border border-wind rounded-md hover:bg-neutral-100 cursor-pointer">
    {title}
  </button>
);

