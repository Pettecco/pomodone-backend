import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from './todo/entity/todo.entity';
import { CreateTodoDto } from './todo/dto/create-todo.dto';
import { UpdateTodoDto } from './todo/dto/update-todo.dto';

const todoEntityList: TodoEntity[] = [
	new TodoEntity({ id: '1', task: 'Todo 1', isDone: 0 }),
	new TodoEntity({ id: '2', task: 'Todo 2', isDone: 0 }),
	new TodoEntity({ id: '3', task: 'Todo 3', isDone: 0 }),
];
const newTodoEntity: TodoEntity = new TodoEntity({
	task: 'Nova task',
	isDone: 0,
});

const updateTodoEntity = new TodoEntity({ task: 'Todo 1', isDone: 1 });

describe('TodoController', () => {
	let todoController: TodoController;
	let todoService: TodoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TodoController],
			providers: [
				{
					provide: TodoService,
					useValue: {
						findAll: jest.fn().mockResolvedValue(todoEntityList),
						create: jest.fn().mockResolvedValue(newTodoEntity),
						findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
						update: jest.fn().mockResolvedValue(updateTodoEntity),
						softDeleteById: jest.fn().mockResolvedValue({ affected: 1 }),
					},
				},
			],
		}).compile();

		todoController = module.get<TodoController>(TodoController);
		todoService = module.get<TodoService>(TodoService);
	});

	it('should be defined', () => {
		expect(todoController).toBeDefined();
		expect(todoService).toBeDefined();
	});

	describe('index', () => {
		it('should return a todo list entity successfully', async () => {
			const result = await todoController.index();

			expect(result).toEqual(todoEntityList);
			expect(typeof result).toEqual('object');
			expect(todoService.findAll).toHaveBeenCalledTimes(1);
		});

		it('should throw an exception', () => {
			jest.spyOn(todoService, 'findAll').mockRejectedValue(new Error());

			expect(todoController.index()).rejects.toThrow();
		});
	});

	describe('create', () => {
		it('should create a todo entity successfully', async () => {
			const body: CreateTodoDto = {
				task: 'Nova task',
				isDone: 0,
			};

			const result = await todoController.create(body);
			expect(result).toEqual(newTodoEntity);
			expect(todoService.create).toHaveBeenCalledTimes(1);
			expect(todoService.create).toHaveBeenCalledWith(body);
		});

		it('should throw an exception', () => {
			const body: CreateTodoDto = {
				task: 'Nova task',
				isDone: 0,
			};

			jest.spyOn(todoService, 'create').mockRejectedValue(new Error());

			expect(todoController.create(body)).rejects.toThrow();
		});
	});

	describe('show', () => {
		it('should return a todo entity successfully', async () => {
			const id = '1';

			const result = await todoController.show(id);
			expect(result).toEqual(todoEntityList[0]);
			expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
			expect(todoService.findOneOrFail).toHaveBeenCalledWith(id);
		});

		it('should throw an exception', () => {
			const id = '1';

			jest.spyOn(todoService, 'findOneOrFail').mockRejectedValue(new Error());

			expect(todoController.show(id)).rejects.toThrow();
		});
	});

	describe('update', () => {
		it('should update a todo entity successfully', async () => {
			const body: UpdateTodoDto = {
				task: 'Todo 1',
				isDone: 1,
			};
			const result = await todoController.update('1', body);
			expect(result).toEqual(updateTodoEntity);
			expect(todoService.update).toHaveBeenCalledTimes(1);
			expect(todoService.update).toHaveBeenCalledWith('1', body);
		});

		it('should throw an exception', () => {
			const body: UpdateTodoDto = {
				task: 'Todo 1',
				isDone: 1,
			};

			jest.spyOn(todoService, 'update').mockRejectedValue(new Error());

			expect(todoController.update('1', body)).rejects.toThrow();
		});
	});

	describe('destroy', () => {
		it('should remove a todo item successfully', async () => {
			const result = await todoController.destroy('1');
			expect(result).toEqual({ affected: 1 });
		});

		it('should throw an exception', () => {
			jest.spyOn(todoService, 'softDeleteById').mockRejectedValue(new Error());

			expect(todoController.destroy('1')).rejects.toThrow();
		});
	});
});
