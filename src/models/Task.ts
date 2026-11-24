
import mongoose, { Schema, models, model, Types } from "mongoose";

// Define os valores permitidos para o status da tarefa.
export type TaskStatus = "pendente" | "completa";

// Define os níveis permitidos de prioridade.
export type TaskPriority = "baixa" | "média" | "alta";

// Define a estrutura de uma tarefa no MongoDB.
export interface TaskDocument extends mongoose.Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define o esquema da tarefa.
const TaskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["pendente", "completa"],
      default: "pendente",
      required: true,
    },

    priority: {
      type: String,
      enum: ["baixa", "média", "alta"],
      default: "média",
      required: true,
    },

    dueDate: {
      type: Date,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Evita recompilar o modelo durante o hot reload do Next.js
const Task =
  models.Task || model<TaskDocument>("Task", TaskSchema);

export default Task;
