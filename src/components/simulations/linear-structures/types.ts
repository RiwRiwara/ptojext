export interface LinearDataItem {
  id: string;
  value: string | number;
  label?: string;
  color?: string;
}

export interface LinearVisualizationProps {
  initialData?: LinearDataItem[];
}

export type OperationType = 'add' | 'remove' | 'update' | 'highlight' | 'reset';

export interface DataOperation {
  type: OperationType;
  item?: LinearDataItem;
  index?: number;
}
