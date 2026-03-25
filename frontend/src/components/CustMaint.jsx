import DataMaint from './DataMaint';
import { custApi } from '../services/api';

const FIELDS = [
  { name: 'cust_code', caption: '客戶代碼' },
  { name: 'cust_name', caption: '客戶名稱' },
  { name: 'cust_remark', caption: '備註說明' },
];

export default function CustMaint() {
  return <DataMaint title="客戶資料維護" api={custApi} fields={FIELDS} keyField="cust_code" />;
}
