import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post("/auth/login", data).then((res) => res.data),

  register: (data) => api.post("/auth/register", data).then((res) => res.data),

  getCurrentUser: () => api.get("/auth/me").then((res) => res.data),
};

export const blogService = {
  getAllBlogs: (page = 0, size = 10) =>
    api.get(`/blogs?page=${page}&size=${size}`).then((res) => res.data),

  getBlogById: (id) => api.get(`/blogs/${id}`).then((res) => res.data),

  createBlog: (data) => api.post("/blogs", data).then((res) => res.data),

  updateBlog: (id, data) =>
    api.put(`/blogs/${id}`, data).then((res) => res.data),

  deleteBlog: (id) => api.delete(`/blogs/${id}`).then((res) => res.data),

  getMyBlogs: () => api.get("/blogs/my-blogs").then((res) => res.data),

  getBlogsByAuthor: (authorId) =>
    api.get(`/blogs/author/${authorId}`).then((res) => res.data),
};

export const reviewService = {
  createReview: (blogId, data) =>
    api.post(`/reviews/blogs/${blogId}`, data).then((res) => res.data),

  updateReview: (reviewId, data) =>
    api.put(`/reviews/${reviewId}`, data).then((res) => res.data),

  deleteReview: (reviewId) =>
    api.delete(`/reviews/${reviewId}`).then((res) => res.data),

  getReviewsByBlog: (blogId) =>
    api.get(`/reviews/blogs/${blogId}`).then((res) => res.data),

  getMyReviews: () => api.get("/reviews/my-reviews").then((res) => res.data),
};

export const adminService = {
  getAllUsers: () => api.get("/admin/users").then((res) => res.data),

  getPendingAuthorRequests: () =>
    api.get("/admin/users/pending-author-requests").then((res) => res.data),

  updateUserRole: (userId, role) =>
    api.put(`/admin/users/${userId}/role?role=${role}`).then((res) => res.data),

  approveAuthorRequest: (userId) =>
    api.put(`/admin/users/${userId}/approve-author`).then((res) => res.data),

  rejectAuthorRequest: (userId) =>
    api.put(`/admin/users/${userId}/reject-author`).then((res) => res.data),

  deleteUser: (userId) =>
    api.delete(`/admin/users/${userId}`).then((res) => res.data),

  getPendingBlogs: () =>
    api.get("/admin/blogs/pending").then((res) => res.data),

  approveBlog: (blogId) =>
    api.put(`/admin/blogs/${blogId}/approve`).then((res) => res.data),

  rejectBlog: (blogId) =>
    api.put(`/admin/blogs/${blogId}/reject`).then((res) => res.data),
};

export default api;
