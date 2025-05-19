


resource "aws_ecs_cluster" "todoapp_cluster" {
  name = "todoapp-api-cluster"
}

resource "aws_ecs_task_definition" "todoapp_task" {
  family                   = "todoapp-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "todoapp-api"
      image     = "paulohsv/todoapp-api:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "todoapp_service" {
  name            = "todoapp-service"
  cluster         = aws_ecs_cluster.todoapp_cluster.id
  task_definition = aws_ecs_task_definition.todoapp_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.api_sg.id]
  }

  depends_on = [aws_ecs_cluster.todoapp_cluster]
}
