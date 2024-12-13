import "dotenv/config";
import express from "express";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";

const app = express();

// Configuração de CORS e JSON
app.use(cors({ origin: "*" }));
app.use(express.json());

// Configuração do Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome do banco de dados
  process.env.DB_USER, // Usuário do banco
  process.env.DB_PASS, // Senha do banco
  {
    host: process.env.DB_HOST, // Host do banco de dados
    dialect: "mysql", // Banco de dados utilizado
  }
);

// Modelo de Agendamento
const Agendamento = sequelize.define(
  "Agendamento",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

// o modelo com o banco de dados
sequelize
  .sync()
  .then(() => {
    console.log("Banco de dados sincronizado");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
  });

// Rotas da API
app.get("/agendamentos", async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll();
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/agendamentos/:id", async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) {
      res.json(agendamento);
    } else {
      res.status(404).json({ error: "Agendamento não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/agendamentos", async (req, res) => {
  try {
    const agendamento = await Agendamento.create(req.body);
    res.status(201).json(agendamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/agendamentos/:id", async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) {
      await agendamento.update(req.body);
      res.json(agendamento);
    } else {
      res.status(404).json({ error: "Agendamento não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/agendamentos/:id", async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) {
      await agendamento.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Agendamento não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
