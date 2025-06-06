const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 80;  // Porta que o servidor vai escutar

// Habilitar CORS para permitir requisições de qualquer origem
app.use(cors());

// Habilitar o parser para JSON
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/portfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Dados fictícios de projetos
const projects = [
  {
    title: "Projeto A",
    description: "Descrição do Projeto A",
    skills: ["React", "Node", "Express"],
    demo: "https://demo.com/a",
    source: "https://github.com/exemplo/projectA"
  },
  {
    title: "Projeto B",
    description: "Descrição do Projeto B",
    skills: ["React", "MongoDB"],
    demo: "https://demo.com/b",
    source: "https://github.com/exemplo/projectB"
  }
];

// Rota para retornar os projetos
app.get('/projects', (req, res) => {
  res.json(projects);
});

// Rota POST para adicionar um novo projeto
app.post('/projects', (req, res) => {
  const { title, description, skills, demo, source } = req.body;

  // Validação simples
  if (!title || !description || !skills) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const newProject = {
    title,
    description,
    skills,
    demo,
    source
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
