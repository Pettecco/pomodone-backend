import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { TodoEntity } from './todo/entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './todo/dto/create-todo.dto';
import { UpdateTodoDto } from './todo/dto/update-todo.dto';

@Injectable()
export class TodoService {
	constructor(
		@InjectRepository(TodoEntity)
		private readonly todoRepository: Repository<TodoEntity>,
	) {}

	async findAll() {
		return await this.todoRepository.find();
	}

	async findAllDeleted() {
		return await this.todoRepository.find({
            withDeleted: true,
            where: {
                deletedAt: Not(IsNull()),
            }
        });
	}

	async findOneOrFail(id: string) {
		try {
			return await this.todoRepository.findOneOrFail({ where: { id } });
		} catch (error) {
			throw new NotFoundException(error.message);
		}
	}

	async create(data: CreateTodoDto) {
		const todo = this.todoRepository.create({
			...data,
			updatedAt: null,
		});
		return await this.todoRepository.save(todo);
	}

	async softDeleteById(id: string) {
        return this.todoRepository.softDelete(id);
	}

	async update(id: string, data: UpdateTodoDto) {
		const todo = await this.findOneOrFail(id);
		const updatedTodo = this.todoRepository.merge(todo, data);
		return await this.todoRepository.save(updatedTodo);
	}
}
