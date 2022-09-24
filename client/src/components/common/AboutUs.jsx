import { useEffect, useState } from "react";
import { ExternalLinkIcon as LinkIcon } from "@chakra-ui/icons";
import "./about.css";

const AboutUs = () => {
  const [order, setOrder] = useState(false);

  useEffect(() => {
    Math.round(Math.random() * 20) % 2 === 0 ? setOrder(true) : setOrder(false);
  }, []);

  return (
    <div className="about-container component-fadeIn">
      <div className='profile-section-indicator'>NOSOTROS</div>
      <div
        className="about-cards-container"
        style={{ flexDirection: order ? "column-reverse" : "column" }}
      >
        <div
          className="about-card"
          style={{
            flexDirection: order ? "row-reverse" : "row",
            borderRadius: order ? "0 7rem 7rem 0" : "7rem 0 0 7rem",
            background: `linear-gradient(${
              order ? "-90deg" : "90deg"
            }, rgba(10,10,10,1) 29%, rgba(0,0,0,0) 100%)`,
          }}
        >
          <div className="about-avatar-container">
            <img
              src="https://avatars.githubusercontent.com/u/93217713"
              alt="avatar"
            />
          </div>

          <div>
            <h1> Fabricio Repetto</h1>
            <ul>
              <li>
                <a
                  href="https://github.com/FabricioJRepetto"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                  <LinkIcon className="about-link" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/fabricio-repetto/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                  <LinkIcon className="about-link" />
                </a>
              </li>
              <li>
                <p>fabricio.j.repetto@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="about-card"
          style={{
            flexDirection: order ? "row" : "row-reverse",
            borderRadius: order ? "7rem 0 0 7rem" : "0 7rem 7rem 0",
            background: `linear-gradient(${
              order ? "90deg" : "-90deg"
            }, rgba(10,10,10,1) 29%, rgba(0,0,0,0) 100%)`,
          }}
        >
          <div className="about-avatar-container">
            <img
              src="https://avatars.githubusercontent.com/u/93392994"
              alt="avatar"
            />
          </div>

          <div>
            <h1> Fernando Ramirez</h1>
            <ul>
              <li>
                <a
                  href="https://github.com/fereramirez"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                  <LinkIcon className="about-link" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/fernando-e-ramirez/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                  <LinkIcon className="about-link" />
                </a>
              </li>
              <li>
                <p>fer.eze.ram@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
