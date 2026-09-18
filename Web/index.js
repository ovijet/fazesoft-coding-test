const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use = express.json();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const tasks = [''];
const validateTask = ["work", "personal", "study"];

app.post("/api/tasks", (req, res) => {
  const { title, category } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: "Title and category are required" });
  }

  if (typeof title !== "string" || title.trim() === "") {
    return res
      .status(400)
      .json({ error: "Title and category must be strings" });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    category,
    status: "pending",
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.get("/api/tasks", (req, res) => {
  const { category } = req.query;
  if (category) {
    if (validateTask.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const filteredTasks = tasks.filter((task) => task.category === category);
    return res.status(200).json(filteredTasks);
  }
  return res.status(200).json(tasks);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
