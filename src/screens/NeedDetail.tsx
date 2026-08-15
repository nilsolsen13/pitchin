// Need Detail (spec §7.4). Filled in Phase 4.
import { useParams } from 'react-router-dom';

export default function NeedDetail() {
  const { needId } = useParams();
  return <h1 className="text-3xl font-semibold">Need detail — {needId}</h1>;
}
