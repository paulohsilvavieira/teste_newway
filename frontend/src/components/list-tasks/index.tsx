import { Button } from '../ui/button';

export default function ListTasks(props: {
  tasks: any;
  role: string;
  myTasks: boolean;
  setEditMode: (task: any) => void;
  handleDelete: (taskId: string) => void;
}) {
  if (props.tasks.length === 0) return <div className='px-2'>No Tasks</div>;
  return (
    <ul className='space-y-4'>
      {props.tasks.map(
        (task: { uuid: string; title: string; description: string }) => (
          <li key={task.uuid} className='border rounded p-4'>
            <h2 className='font-semibold'>{task.title}</h2>
            <p>{task.description}</p>
            <div className='flex gap-2 mt-2'>
              {props.role === 'user' && props.myTasks ? (
                <>
                  <Button
                    variant='outline'
                    onClick={() => props.setEditMode(task)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant='destructive'
                    onClick={() => props.handleDelete(task.uuid)}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </li>
        )
      )}
    </ul>
  );
}
