import BedShape from '../furniture-shapes/BedShape';
import TableShape from '../furniture-shapes/TableShape';
import ChairShape from '../furniture-shapes/ChairShape';
import SofaShape from '../furniture-shapes/SofaShape';
import ShelfShape from '../furniture-shapes/ShelfShape';
import GenericBoxShape from '../furniture-shapes/GenericBoxShape';

interface FurnitureGeometryProps {
  catalogId: string;
  width: number;
  depth: number;
  height: number;
  color: string;
}

const shapeMap: Record<string, React.ComponentType<{ width: number; depth: number; height: number; color: string }>> = {
  bed: BedShape,
  table: TableShape,
  chair: ChairShape,
  sofa: SofaShape,
  shelf: ShelfShape,
};

export default function FurnitureGeometry({ catalogId, ...props }: FurnitureGeometryProps) {
  const Shape = shapeMap[catalogId] ?? GenericBoxShape;
  return <Shape {...props} />;
}
