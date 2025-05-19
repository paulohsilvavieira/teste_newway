import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export default function CardUser(props: {
  role: string;
  name: string;
  handleLogout: () => void;
}) {
  return (
    <Card className='h-max flex flex-row gap-10 w-[260px]'>
      <CardContent>
        {props.name}
        <Badge
          variant={props.role === 'admin' ? `default` : `secondary`}
          className='mx-4'
        >
          {props.role}
        </Badge>
        <Button
          variant='destructive'
          className='cursor-pointer'
          type='button'
          onClick={() => props.handleLogout()}
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
