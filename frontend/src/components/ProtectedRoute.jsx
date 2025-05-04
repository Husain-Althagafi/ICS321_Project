import {Navigate} from 'react-router-dom'

const ProtectedRoute = ({element: Component}) => {
    const token = localStorage.getItem('token')

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.role === 'admin') {
          return Component;
        } else {
          return <Navigate to="/admin/login" />
        }
      } catch (err) {
        return <Navigate to="/admin/login" />
      }
}

export default ProtectedRoute