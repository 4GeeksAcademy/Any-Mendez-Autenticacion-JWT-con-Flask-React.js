import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Private = () => {
  const [infoMe, setInfoMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');

    if (!token) {
      navigate('/login');
      return;
    }
    const handleMe = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json()
          setInfoMe(data);
        } else if (response.status === 401 || response.status === 403) {
          navigate('/login');
        } else {
          console.error('Error al obtener datos de /api/me:', response.status);
        }

      } catch (error) {
        console.error('Error de red:', error);
        navigate('/login');
      }
    };

    handleMe();
  }, [navigate]);
  if (!infoMe) {
    return <div>Cargando...</div>;
  }
  return (
    <div>
      <h1>Informacion del Usuario</h1>

      <form className="row g-3 needs-validation" noValidate>

        <div className="col-md-4">
          <label htmlFor="validationCustom02" className="form-label">Id de usuario</label>
          <label className="form-control">{infoMe.user.id}</label>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustomUsername" className="form-label">Username</label>
          <div className="input-group has-validation">
            <label className="form-control">{infoMe.user.email}</label>
          </div>
        </div>
      </form>




    </div>
  );
};

export default Private;