import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

function GestorPersonaje() {
  const [personaje, setPersonaje] = useState({
    nombre: '',
    raza: '',
    apariencia: '',
    caracteristicasDistintivas: '',
    estiloVestimenta: '',
    rasgosPersonalidad: '',
    valoresCreencias: '',
    temoresDebilidades: '',
    aliados: '',
    enemigos: '',
    objetivosCortoPlazo: '',
    objetivosLargoPlazo: '',
    fuerza: 0,
    destreza: 0,
    inteligencia: 0,
    carisma: 0,
    habilidadesAdicionales: '',
    talentosUnicos: '',
    equipoActual: '',
    recursosFinancieros: '',
    logrosTitulos: '',
    eventosSignificativos: '',
  });

  const [errorMensaje, setErrorMensaje] = useState('');
  const [pasoActual, setPasoActual] = useState(0);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [editarCampo, setEditarCampo] = useState(null);

  useEffect(() => {
    const datosGuardados = localStorage.getItem('personaje');
    if (datosGuardados) {
      setPersonaje(JSON.parse(datosGuardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('personaje', JSON.stringify(personaje));
  }, [personaje]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonaje((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarBloque = () => {
    const bloques = [
      ['nombre', 'raza'],
      ['apariencia', 'caracteristicasDistintivas', 'estiloVestimenta'],
      ['rasgosPersonalidad', 'valoresCreencias', 'temoresDebilidades'],
      ['aliados', 'enemigos'],
      ['objetivosCortoPlazo', 'objetivosLargoPlazo'],
      ['fuerza', 'destreza', 'inteligencia', 'carisma'],
      ['habilidadesAdicionales', 'talentosUnicos'],
      ['equipoActual', 'recursosFinancieros'],
      ['logrosTitulos', 'eventosSignificativos']
    ];
    
    const camposBloqueActual = bloques[pasoActual];

    for (const campo of camposBloqueActual) {
      if (campo === 'fuerza' || campo === 'destreza' || campo === 'inteligencia' || campo === 'carisma') {
        if (personaje[campo] < 0 || personaje[campo] > 20) {
          setErrorMensaje('Los atributos deben estar entre 0 y 20.');
          return false;
        }
      } else if (personaje[campo].trim() === '') {
        setErrorMensaje('Completa todos los campos.');
        return false;
      }
    }

    setErrorMensaje('');
    return true;
  };

  const siguientePaso = () => {
    if (validarBloque()) {
      setPasoActual(pasoActual + 1);
    }
  };

  const pasoAnterior = () => {
    setPasoActual(pasoActual - 1);
  };

  const finalizar = () => {
    if (validarBloque()) {
      setMostrarResumen(true);
      localStorage.setItem('personaje', JSON.stringify(personaje));
    }
  };

  const editar = (campo) => {
    setEditarCampo(campo);
  };

  const guardarEdicion = () => {
    setEditarCampo(null);
  };

  const renderPaso = () => {
    const bloques = [
      {
        title: '1. Identidad del Personaje',
        fields: ['nombre', 'raza']
      },
      {
        title: '2. Descripción Física y Personal',
        fields: ['apariencia', 'caracteristicasDistintivas', 'estiloVestimenta']
      },
      {
        title: '3. Personalidad y Psicología',
        fields: ['rasgosPersonalidad', 'valoresCreencias', 'temoresDebilidades']
      },
      {
        title: '4. Relaciones y Conexiones',
        fields: ['aliados', 'enemigos']
      },
      {
        title: '5. Motivaciones y Objetivos',
        fields: ['objetivosCortoPlazo', 'objetivosLargoPlazo']
      },
      {
        title: '6. Atributos',
        fields: ['fuerza', 'destreza', 'inteligencia', 'carisma']
      },
      {
        title: '7. Habilidades y Talentos Especiales',
        fields: ['habilidadesAdicionales', 'talentosUnicos']
      },
      {
        title: '8. Inventario y Recursos',
        fields: ['equipoActual', 'recursosFinancieros']
      },
      {
        title: '9. Historial de Aventura',
        fields: ['logrosTitulos', 'eventosSignificativos']
      }
    ];

    const bloque = bloques[pasoActual];
    
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">{bloque.title}</h2>
        {bloque.fields.map((campo) => (
          <div key={campo} className="mb-4">
            <label className="block text-gray-700">{campo.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
            <input
              type={campo.includes('fuerza') || campo.includes('destreza') || campo.includes('inteligencia') || campo.includes('carisma') ? 'number' : 'text'}
              name={campo}
              value={personaje[campo]}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderResumen = () => {
    if (!mostrarResumen) return null;

    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Resumen del Personaje</h2>
        {Object.entries(personaje).map(([campo, valor]) => (
          <div key={campo} className="mb-4 flex items-center justify-between">
            <div>
              <strong className="block text-gray-700">{campo.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong>
              <p>{valor}</p>
            </div>
            <button
              type="button"
              onClick={() => editar(campo)}
              className="ml-4 p-2 text-gray-600 hover:text-gray-800"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        {editarCampo && (
          <div className="mt-4">
            <input
              type="text"
              name={editarCampo}
              value={personaje[editarCampo]}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="button"
              onClick={guardarEdicion}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    );
  };

  const crearOtroPersonaje = () => {
    localStorage.removeItem('personaje');
    setPersonaje({
      nombre: '',
      raza: '',
      apariencia: '',
      caracteristicasDistintivas: '',
      estiloVestimenta: '',
      rasgosPersonalidad: '',
      valoresCreencias: '',
      temoresDebilidades: '',
      aliados: '',
      enemigos: '',
      objetivosCortoPlazo: '',
      objetivosLargoPlazo: '',
      fuerza: 0,
      destreza: 0,
      inteligencia: 0,
      carisma: 0,
      habilidadesAdicionales: '',
      talentosUnicos: '',
      equipoActual: '',
      recursosFinancieros: '',
      logrosTitulos: '',
      eventosSignificativos: '',
    });
    setPasoActual(0);
    setMostrarResumen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full p-6 bg-white shadow-md rounded-lg">
        {mostrarResumen ? renderResumen() : renderPaso()}
        <div className="flex justify-between mt-6">
          {pasoActual > 0 && !mostrarResumen && (
            <button
              type="button"
              onClick={pasoAnterior}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Atras
            </button>
          )}
          {pasoActual < 8 && !mostrarResumen && (
            <button
              type="button"
              onClick={siguientePaso}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Siguiente
            </button>
          )}
          {pasoActual === 8 && !mostrarResumen && (
            <button
              type="button"
              onClick={finalizar}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Finalizar
            </button>
          )}
          {mostrarResumen && (
            <button
              type="button"
              onClick={crearOtroPersonaje}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Crear Otro Personaje
            </button>
          )}
        </div>
        {errorMensaje && <div className="mt-4 text-red-500">{errorMensaje}</div>}
      </div>
    </div>
  );
}

export default GestorPersonaje;
