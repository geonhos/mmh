import type { MaterialType } from '../../types';
import BedShape from '../furniture-shapes/BedShape';
import TableShape from '../furniture-shapes/TableShape';
import ChairShape from '../furniture-shapes/ChairShape';
import SofaShape from '../furniture-shapes/SofaShape';
import ShelfShape from '../furniture-shapes/ShelfShape';
import GenericBoxShape from '../furniture-shapes/GenericBoxShape';

interface ShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

interface FurnitureGeometryProps extends ShapeProps {
  catalogId: string;
}

const shapeMap: Record<string, React.ComponentType<ShapeProps>> = {
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
