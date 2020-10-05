import React, { useEffect, useState } from 'react';
import './Results.scss';
import BarChart from './Chart';
import loc from '../img/localizacion.png';
import eco from '../img/ecosistemas.png';
import sispas from '../img/sispas.png';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import projectStore from '../stores/projectStore';
import { getScores, loadProjects } from '../actions/projectActions';
import LinearBuffer from './LinearBuffer';



function Results({ match }) {

  const [scores, setScores] = useState([]);
  const [project, setProject] = useState(projectStore.getProjectById(match.params.projectId));
  const [allScores, setAllScores] = useState([]);
  const [wait, setWait] = useState(false);

  let user = JSON.parse(sessionStorage.user);


  let total = (allScores.reduce((a, b) => a + b, 0)).toFixed();


  function waiting() {
    setWait(false)

    setTimeout(() => {
      //si ve de la llista
      if (project && project.answers) {
        setScores(projectStore.getScoresByCat(project.answers));
      } else {
        setProject(projectStore.getProjectById(match.params.projectId));
        setAllScores(projectStore.getArrAllScores());
      }
      setWait(true)
    }, 1000);
  }

  useEffect(() => {
    projectStore.addChangeListener(onChange);
    if (!wait) {
      getScores(match.params.projectId);

      waiting();
      loadProjects(user.data.userId);
    }
    if (project) {
      setScores(projectStore.getScoresByCat(project.answers));
    }

    return () => projectStore.removeChangeListener(onChange);

  }, [wait]);

  function onChange() {
    if (project) {
      setAllScores(projectStore.getArrAllScores());
      setScores(projectStore.getScoresByCat(project.answers));
    }
  }


  return (

    <>
      {!wait && (
        <div style={{
          marginTop: "80px",
          marginBottom: "60px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "200px",
          paddingLeft: "10px",
          paddingRight: "10px"
        }}><h3>Calculando la sostenibilidad de su proyecto...</h3>
          <LinearBuffer />
        </div>
      )}
      {wait && project && scores.length && total > 1 && (
        <div className="results-container">
          <BarChart data={scores} />
          <div className="results-container__img">
            <h3>{`Resultados Proyecto: ${project.projectName}`}</h3>

            <CircularProgressbar className="results-container__circle" value={total} text={`${total} p`} />

            <div className="results-container__img-pics">
              <img src={loc} alt="Localización" />
              <img src={eco} alt="Ecosistemas" />
              <img src={sispas} alt="Sistemas Pasivos" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Results;