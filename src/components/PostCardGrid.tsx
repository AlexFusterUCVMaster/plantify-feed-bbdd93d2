interface PostCardGridProps {
  plantName: string;
  plantImage: string;
}

const PostCardGrid = ({ plantName, plantImage }: PostCardGridProps) => {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer group">
      <img 
        src={plantImage} 
        alt={plantName}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
  );
};

export default PostCardGrid;
