import DataMaint from './DataMaint';
import { factApi } from '../services/api';

const FIELDS = [
  { name: 'fact_code', caption: '廠商代碼' },
  { name: 'fact_name', caption: '廠商名稱' },
  { name: 'fact_remark', caption: '備註說明' },
];

export default function FactMaint() {
  return <DataMaint title="廠商資料維護" api={factApi} fields={FIELDS} keyField="fact_code" />;
}
