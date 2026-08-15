// Squad Detail (spec §7.6). Filled in Phase 6.
import { useParams } from 'react-router-dom';

export default function SquadDetail() {
  const { squadId } = useParams();
  return <h1 className="text-3xl font-semibold">Squad — {squadId}</h1>;
}
