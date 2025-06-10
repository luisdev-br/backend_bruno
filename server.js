const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Iniciar o app do Express
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

// Definir o modelo de Projeto no MongoDB
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  skills: [String],
  demo: String,
  source: String
});

// Criar o modelo a partir do esquema
const Project = mongoose.model('Project', projectSchema);

// Rota para retornar todos os projetos
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find(); // Buscar todos os projetos no banco de dados
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
});

// Rota POST para adicionar um novo projeto
app.post('/projects', async (req, res) => {
  const { title, description, skills, demo, source } = req.body;

  // Validação simples
  if (!title || !description || !skills) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const newProject = new Project({
    title,
    description,
    skills,
    demo,
    source
  });

  try {
    await newProject.save();  // Salvar o projeto no MongoDB
    res.status(201).json(newProject);  // Retornar o projeto salvo
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o projeto" });
  }
});

// Rota PUT para editar um projeto pelo ID
app.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, skills, demo, source } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, {
      title,
      description,
      skills,
      demo,
      source
    }, { new: true });  // Retornar o projeto atualizado

    if (!updatedProject) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.status(200).json(updatedProject);  // Retornar o projeto atualizado
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar o projeto" });
  }
});

// Rota DELETE para deletar um projeto pelo ID
app.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.status(200).json(deletedProject);  // Retornar o projeto deletado
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar o projeto" });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
