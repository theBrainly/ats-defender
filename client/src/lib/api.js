// API service for backend communication
import { getToken } from "@/lib/token"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

class ApiService {
  getAuthHeaders() {
    const token = getToken()
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  async analyzeResume(resumeText, jobDescription, jobTitle, company, location) {
    const response = await fetch(`${API_BASE_URL}/analysis/scan`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        resumeText,
        jobDescription,
        jobTitle,
        company,
        location,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Analysis failed")
    }

    return data
  }

  async getAnalysisHistory(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/analysis/history?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch history")
    }

    return data
  }

  async getAnalysisById(id) {
    const response = await fetch(`${API_BASE_URL}/analysis/${id}`, {
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch analysis")
    }

    return data
  }

  async deleteAnalysis(id) {
    const response = await fetch(`${API_BASE_URL}/analysis/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete analysis")
    }

    return data
  }

  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/analysis/stats/overview`, {
      headers: this.getAuthHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch stats")
    }

    return data
  }
}

export const apiService = new ApiService()
