import { create } from "zustand";

import { supabase } from "@/lib/supabase";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
  created_at: string;
};

type ProjectsState = {
  projects: Project[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  refreshProjects: () => Promise<void>;
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: true,
  refreshing: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: get().projects.length === 0, error: null });

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set({ projects: data ?? [], loading: false });
  },

  refreshProjects: async () => {
    set({ refreshing: true, error: null });

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      set({ error: error.message, refreshing: false });
      return;
    }

    set({ projects: data ?? [], refreshing: false });
  },
}));
