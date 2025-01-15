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

@Controller('api/v1/todos')
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	@Get()
	async index() {
		return await this.todoService.findAll();
	}

	@Post()
	async create(@Body() body: any) {
		return await this.todoService.create(body);
	}

	@Get(':id')
	async show(@Param('id', new ParseUUIDPipe()) id: string) {
		return await this.todoService.findOneOrFail(id);
	}

	@Put(':id')
	async update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() data: any,
	) {
		return await this.todoService.update(id, data);
	}

	@Put(':id/complete')
	async complete(@Param('id', new ParseUUIDPipe()) id: string) {
		return await this.todoService.update(id, { isDone: 1 });
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
		return await this.todoService.deleteById(id);
	}
}
