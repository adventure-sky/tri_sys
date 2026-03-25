import DataMaint from './DataMaint';
import { userApi } from '../services/api';

const FIELDS = [
  { name: 'userid', caption: '用戶代碼' },
  { name: 'username', caption: '用戶名稱' },
  { name: 'pwd', caption: '用戶密碼' },
];

export default function UserMaint() {
  return <DataMaint title="用戶資料維護" api={userApi} fields={FIELDS} keyField="userid" />;
}
