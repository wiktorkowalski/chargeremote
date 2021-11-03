terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}


# resource "aws_db_instance" "postgres" {
#   allocated_storage   = 20
#   engine              = "postgres"
#   engine_version      = "13.4"
#   instance_class      = "db.t4g.micro"
#   name                = "postgres"
#   username            = "postgres"
#   password            = "mysecretpassword"
#   publicly_accessible = true
#   skip_final_snapshot = true
# }

# resource "aws_elasticache_cluster" "redis" {
#   cluster_id           = "cluster-example"
#   engine               = "redis"
#   node_type            = "cache.t2.micro"
#   num_cache_nodes      = 1
#   parameter_group_name = "default.redis3.2"
#   engine_version       = "3.2.10"
#   port                 = 6379
# }

resource "aws_vpc" "main" {
  cidr_block = "172.17.0.0/16"
}

resource "aws_subnet" "public" {
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, 1)
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true
  availability_zone       = "eu-central-1a"
}

resource "aws_ecs_cluster" "cluster" {
  name = "cluster"
}

resource "aws_ecs_task_definition" "ecs-task" {
  family                   = "ecs-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "1024"
  memory                   = "2048"

  container_definitions = <<EOF
[
  {
    "cpu": 1024,
    "essential": true,
    "image": "nginx:latest",
    "memory": 2048,
    "name": "nginx"
  }
]
EOF
}

resource "aws_ecs_service" "service" {
  name            = "service"
  cluster         = "cluster"
  task_definition = "ecs-task"
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public.*.id
    assign_public_ip = true
  }

  depends_on = [
    aws_ecs_task_definition.ecs-task
  ]
}
