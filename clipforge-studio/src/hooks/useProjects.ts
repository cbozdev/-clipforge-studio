import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../types';
import { listProjects } from '../services/storage/db';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setProjects(await listProjects());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open local storage. Private browsing can block it.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  return { projects, loading, error, refresh };
}
