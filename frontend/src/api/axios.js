import axios from 'axios'

// Instance centralisée — toutes les requêtes passent par ici
// En dev, le proxy Vite (/api → localhost:3000) gère le cross-origin
// En prod, VITE_API_URL doit pointer vers l'URL réelle du backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

// Intercepteur réponse : si 401 → tenter un refresh automatique
let isRefreshing = false
let queue = []

function processQueue(error) {
  queue.forEach(({ resolve, reject }) => error ? reject(error) : resolve())
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Exclure les routes qui ne doivent pas déclencher un refresh
    const noRetryRoutes = ['/auth/refresh', '/auth/logout', '/auth/login', '/auth/register']
    const isNoRetryRoute = noRetryRoutes.some(r => original.url?.includes(r))
    if (error.response?.status === 401 && !original._retry && !isNoRetryRoute) {
      // Si un refresh est déjà en cours, mettre en queue et attendre
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then(() => {
          original._retry = true
          return api(original)
        }).catch(err => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        // Utilise une instance axios séparée pour éviter que l'intercepteur
        // intercepte lui-même la requête de refresh → boucle infinie
        await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        processQueue(null)
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
