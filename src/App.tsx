// Router + global state (spec §9.2). react-router-dom v7 declarative API.

import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import type { Role } from './types';
import { DemoStateProvider, useDemo } from './state/DemoState';
import { AppShell } from './components/AppShell';
import Landing from './screens/Landing';
import Board from './screens/Board';
import PostNeed from './screens/PostNeed';
import NeedDetail from './screens/NeedDetail';
import MyRep from './screens/MyRep';
import SquadDetail from './screens/SquadDetail';
import Registry from './screens/Registry';
import Readiness from './screens/Readiness';
import Wall from './screens/Wall';
import Calendar from './screens/Calendar';
import Rewards from './screens/Rewards';
import Primitives from './screens/Primitives';

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { role: current } = useDemo();
  if (current !== role) return <Navigate to="/board" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoStateProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<ShellLayout />}>
            <Route path="/board" element={<Board />} />
            <Route path="/post" element={<RequireRole role="requester"><PostNeed /></RequireRole>} />
            <Route path="/need/:needId" element={<NeedDetail />} />
            <Route path="/me" element={<RequireRole role="resident"><MyRep /></RequireRole>} />
            <Route path="/calendar" element={<RequireRole role="resident"><Calendar /></RequireRole>} />
            <Route path="/squad/:squadId" element={<SquadDetail />} />
            <Route path="/registry" element={<Registry />} />
            <Route path="/readiness" element={<RequireRole role="admin"><Readiness /></RequireRole>} />
            <Route path="/wall" element={<Wall />} />
            <Route path="/rewards" element={<Rewards />} />
            {/* Scratch route for §6.5 primitives — intentionally not in nav. */}
            <Route path="/_primitives" element={<Primitives />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DemoStateProvider>
    </BrowserRouter>
  );
}
