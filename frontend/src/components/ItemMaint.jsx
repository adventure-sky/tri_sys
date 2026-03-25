import DataMaint from './DataMaint';
import { itemApi } from '../services/api';

const FIELDS = [
  { name: 'item_code', caption: '商品代碼' },
  { name: 'item_name', caption: '商品名稱' },
  { name: 'item_remark', caption: '備註說明' },
];

export default function ItemMaint() {
  return <DataMaint title="商品資料維護" api={itemApi} fields={FIELDS} keyField="item_code" />;
}
