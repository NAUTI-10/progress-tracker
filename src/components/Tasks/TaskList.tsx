import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import type { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  isLoading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-gray-500/60"
          >
            <p className="text-lg">No tasks yet. Add one to get started! 🌸</p>
          </motion.div>
        ) : (
          tasks.map((task, index) => {
            const isCompleted = task.completed;

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div
                  className={`card-base p-4 flex items-center gap-4 transition-smooth ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => !isLoading && onToggle(task.id)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-smooth ${
                      isCompleted
                        ? 'bg-gradient-to-br from-pink-300 to-pink-400 border-pink-400'
                        : 'border-pink-300/40 hover:border-pink-400'
                    }`}
                  >
                    {isCompleted && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>

                  {/* Task content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold truncate transition-smooth ${
                        isCompleted
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(task)}
                        className="p-2 rounded-md hover:bg-soft-pink/20 text-soft-gray/60 hover:text-soft-pink transition-smooth"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(task.id)}
                      className="p-2 rounded-md hover:bg-red-100/50 text-soft-gray/60 hover:text-red-500 transition-smooth"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface AddTaskFormProps {
  onAdd: (title: string) => Promise<boolean>;
  isLoading?: boolean;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setError('');
      const added = await onAdd(title);

      if (added) {
        setTitle('');
        setIsOpen(false);
      } else {
        setError('Unable to add task. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-base p-4 space-y-3"
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="rounded-lg border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Task title (e.g., Drink 3L water)"
                maxLength={100}
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-soft-pink/70 focus:border-transparent transition-smooth disabled:opacity-50"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !title.trim()}
                  className="button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                  }}
                  disabled={isLoading}
                  className="button-secondary px-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setError('');
            setIsOpen(true);
          }}
          disabled={isLoading}
          className="card-base p-4 w-full flex items-center justify-center gap-2 text-soft-gray hover:text-soft-pink transition-smooth disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Task</span>
        </motion.button>
      )}
    </div>
  );
};
