import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from './todo/dto/create-todo.dto';
import { UpdateTodoDto } from './todo/dto/update-todo.dto';
import { IndexTodoSwagger } from './todo/swagger/index-todo.swagger';
import { CreateTodoSwagger } from './todo/swagger/create-todo.swagger';
import { ShowTodoSwagger } from './todo/swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './todo/swagger/update-todo.swagger';
import { BadRequestSwagger } from 'src/helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/helpers/swagger/not-found.swagger';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	@Get()
	@ApiOperation({ summary: 'Listar todas as tarefas' })
	@ApiResponse({
		status: 200,
		description: 'Lista de tarefas',
		type: IndexTodoSwagger,
		isArray: true,
	})
	async index() {
		return await this.todoService.findAll();
	}

	@Post()
	@ApiResponse({ status: 201, description: 'Criado', type: CreateTodoSwagger })
	@ApiResponse({
		status: 400,
		description: 'Requisição inválida',
		type: BadRequestSwagger,
	})
	@ApiOperation({ summary: 'Criar uma nova tarefa' })
	async create(@Body() body: CreateTodoDto) {
		return await this.todoService.create(body);
	}

	@Get(':id')
	@ApiResponse({
		status: 200,
		description: 'Tarefa encontrada',
		type: ShowTodoSwagger,
	})
	@ApiResponse({
		status: 404,
		description: 'Tarefa não encontrada',
		type: NotFoundSwagger,
	})
	@ApiOperation({ summary: 'Exibir uma tarefa' })
	async show(@Param('id', new ParseUUIDPipe()) id: string) {
		return await this.todoService.findOneOrFail(id);
	}

	@Put(':id')
	@ApiResponse({
		status: 200,
		description: 'Tarefa atualizada',
		type: UpdateTodoSwagger,
	})
	@ApiResponse({
		status: 400,
		description: 'Requisição inválida',
		type: BadRequestSwagger,
	})
	@ApiResponse({
		status: 404,
		description: 'Tarefa não encontrada',
		type: NotFoundSwagger,
	})
	@ApiOperation({ summary: 'Atualizar uma tarefa' })
	async update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() data: UpdateTodoDto,
	) {
		return await this.todoService.update(id, data);
	}

	@Delete(':id')
	@ApiResponse({ status: 204, description: 'Tarefa excluída' })
	@ApiResponse({
		status: 404,
		description: 'Tarefa não encontrada',
		type: NotFoundSwagger,
	})
	@ApiOperation({ summary: 'Excluir uma tarefa' })
	@HttpCode(HttpStatus.NO_CONTENT)
	async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
		return await this.todoService.deleteById(id);
	}
}
