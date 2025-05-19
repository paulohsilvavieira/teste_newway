'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useTaskStore, Task } from '@/store/task.store';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardUser from '@/components/card-user';
import { toast } from 'sonner';
import ListTasks from '@/components/list-tasks';
import RegisterUserAdmin from '@/components/form-user-admin';

export default function TasksPage() {
  const router = useRouter();
  const { logout, role, username, getRole } = useAuthStore();
  const {
    tasks,
    getAllTasks,
    getMyTasks,
    createTask,
    updateTask,
    deleteTask,
    myTasks,
    loadMyTasks,
    loadTasks,
  } = useTaskStore();

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadTaskLists();
  }, []);

  const loadTaskLists = async () => {
    try {
      const roleUser = await getRole();

      await getMyTasks();

      if (roleUser && roleUser === 'admin') {
        await getAllTasks();
      }
    } catch (error) {
      toast.error('Erro ao carregar tarefas');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sendTaskEdited = async (
    editingId: string,
    taskForm: {
      title: string;
      description: string;
    }
  ) => {
    try {
      await updateTask(editingId, taskForm);
      toast('Task Edited!');
    } catch (error) {
      toast.error('Error on edit task');
    }
  };

  const sendTaskToCreate = async () => {
    try {
      await createTask(taskForm);
      toast('Task Created!');
    } catch (error) {
      toast.error('Error on create task');
    }
  };

  const handleSubmit = async () => {
    if (editingId) {
      setEditingId(null);
      await sendTaskEdited(editingId, taskForm);
    } else {
      await sendTaskToCreate();
    }
    setTaskForm({
      title: '',
      description: '',
    });
    await loadTaskLists();
  };

  const setEditMode = (task: Task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
    });
    setEditingId(task.uuid);
    toast('Task Deleted!');
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    await loadTaskLists();
  };

  return (
    <div className='w-[800px] p-10  mx-auto'>
      <div className='flex flex-row gap-20 '>
        <div className='flex flex-col gap-5'>
          <CardUser
            role={role ?? 'user'}
            name={username ?? 'User'}
            handleLogout={handleLogout}
          />
          {role === 'admin' ? <RegisterUserAdmin /> : <></>}
        </div>
        <div className='w-[400px]'>
          <h1 className='text-2xl font-bold mb-4'>TODO APP NewWay</h1>

          <div className='space-y-2 mb-6'>
            <Input
              placeholder='Title'
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
            />
            <Input
              placeholder='Description'
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
            />
            <Button onClick={handleSubmit}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
          <Tabs defaultValue='mytasks'>
            <TabsList>
              <TabsTrigger value='mytasks'>My Tasks</TabsTrigger>
              {role === 'admin' ? (
                <TabsTrigger value='alltasks' hidden={role !== 'admin'}>
                  All Tasks
                </TabsTrigger>
              ) : (
                <></>
              )}
            </TabsList>
            <TabsContent value='mytasks'>
              {loadMyTasks ? (
                'Loading...'
              ) : (
                <ListTasks
                  tasks={myTasks}
                  role={'user'}
                  myTasks={true}
                  setEditMode={setEditMode}
                  handleDelete={handleDeleteTask}
                />
              )}
            </TabsContent>
            {role === 'admin' ? (
              <TabsContent value='alltasks'>
                {loadTasks ? (
                  'Loading...'
                ) : (
                  <ListTasks
                    tasks={tasks}
                    role={'admin'}
                    myTasks={false}
                    setEditMode={setEditMode}
                    handleDelete={handleDeleteTask}
                  />
                )}
              </TabsContent>
            ) : (
              <></>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
