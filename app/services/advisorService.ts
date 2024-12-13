import { Advisor } from "../types/advisor";

const API_URL = "http://localhost:3001";

export const getAdvisor = async (id: string): Promise<Advisor> => {
  const response = await fetch(`${API_URL}/advisor/${id}`);
  if (!response.ok) throw new Error("Failed to fetch advisor");
  return response.json();
};

export const updateAdvisor = async (advisor: Advisor): Promise<void> => {
  const response = await fetch(`${API_URL}/advisor/${advisor.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(advisor),
  });
  if (!response.ok) throw new Error("Failed to update advisor");
};

export const deleteAdvisorById = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/advisor/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete advisor");
};
