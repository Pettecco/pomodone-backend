import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './todo/entity/todo.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './todo/dto/create-todo.dto';
import { UpdateTodoDto } from './todo/dto/update-todo.dto';

const TodoEntityList: TodoEntity[] = [
	new TodoEntity({ task: 'Task 1', isDone: 0 }),
	new TodoEntity({ task: 'Task 2', isDone: 0 }),
	new TodoEntity({ task: 'Task 3', isDone: 0 }),
];

const updatedTodoEntity: TodoEntity = new TodoEntity({
	task: 'Task 1',
	isDone: 1,
});

describe('TodoService', () => {
	let todoService: TodoService;
	let todoRepository: Repository<TodoEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TodoService,
				{
					provide: getRepositoryToken(TodoEntity),
					useValue: {
						find: jest.fn().mockResolvedValue(TodoEntityList),
						findOneOrFail: jest.fn().mockResolvedValue(TodoEntityList[0]),
						create: jest.fn().mockResolvedValue(TodoEntityList[0]),
						merge: jest.fn().mockResolvedValue(updatedTodoEntity),
						save: jest.fn().mockResolvedValue(TodoEntityList[0]),
					},
				},
			],
		}).compile();

		todoService = module.get<TodoService>(TodoService);
		todoRepository = module.get<Repository<TodoEntity>>(
			getRepositoryToken(TodoEntity),
		);
	});

	it('should be defined', () => {
		expect(todoService).toBeDefined();
		expect(todoRepository).toBeDefined();
	});

	describe('findAll', () => {
		it('should return a todo entity list successfully', async () => {
			const result = await todoService.findAll();

			expect(result).toEqual(TodoEntityList);
			expect(todoRepository.find).toHaveBeenCalledTimes(1);
		});

		it('should throw an exception', () => {
			jest.spyOn(todoRepository, 'find').mockRejectedValue(new Error());
			expect(todoService.findAll()).rejects.toThrow();
		});
	});

	describe('findOneOrFail', () => {
		it('should return a todo entity item successfully', async () => {
			const result = await todoService.findOneOrFail('1');

			expect(result).toEqual(TodoEntityList[0]);
			expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
		});

		it('should throw an exception', () => {
			jest
				.spyOn(todoRepository, 'findOneOrFail')
				.mockRejectedValueOnce(new Error());
			expect(todoService.findOneOrFail('1')).rejects.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		it('should create a new todo entity item successfully', async () => {
			const data: CreateTodoDto = { task: 'Task 1', isDone: 0 };

			const result = await todoService.create(data);
			expect(result).toEqual(TodoEntityList[0]);
			expect(todoRepository.create).toHaveBeenCalledTimes(1);
			expect(todoRepository.save).toHaveBeenCalledTimes(1);
		});

		it('should throw an exception', () => {
			const data: CreateTodoDto = { task: 'Task 1', isDone: 0 };

			jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());
			expect(todoService.create(data)).rejects.toThrow();
		});
	});

	describe('update', () => {
		it('should update a todo entity item successfully', async () => {
			const data: UpdateTodoDto = { task: 'Task 1', isDone: 1 };

			jest
				.spyOn(todoRepository, 'save')
				.mockResolvedValueOnce(updatedTodoEntity);

			const result = await todoService.update('1', data);

			expect(result).toEqual(updatedTodoEntity);
		});

		it('should throw a not found exception', () => {
			jest
				.spyOn(todoRepository, 'findOneOrFail')
				.mockRejectedValueOnce(new Error());
			expect(
				todoService.update('1', { task: 'Task 1', isDone: 1 }),
			).rejects.toThrow(NotFoundException);
		});

		it('should throw an exception', () => {
			const data: CreateTodoDto = { task: 'Task 1', isDone: 0 };

			jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());
			expect(todoService.update('1', data)).rejects.toThrow();
		});
	});

	describe('deleteById', () => {
		it('should delete a todo entity item successfully', async () => {
			const result = await todoService.deleteById('1');

			expect(result).toEqual(TodoEntityList[0]);
			expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found exception', () => {
			jest
				.spyOn(todoRepository, 'findOneOrFail')
				.mockRejectedValueOnce(new Error());
			expect(todoService.deleteById('1')).rejects.toThrow(NotFoundException);
		});

		it('should throw an exception', () => {
			jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());
			expect(todoService.deleteById('1')).rejects.toThrow();
		});
	});
});
