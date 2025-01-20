import { ApiProperty } from '@nestjs/swagger';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'todos' })
export class TodoEntity {
	@PrimaryGeneratedColumn('uuid')
	@ApiProperty()
	id: string;

	@Column()
	@ApiProperty()
	task: string;

	@Column({ name: 'is_done', type: 'tinyint', width: 1 })
	@ApiProperty()
	isDone: number;

	@CreateDateColumn({ name: 'created_at' })
	@ApiProperty()
	createdAt: string;

	@UpdateDateColumn({ name: 'updated_at', nullable: true })
	@ApiProperty()
	updatedAt: string | null;

	@Column({
		name: 'deleted_at',
		nullable: true,
		type: 'timestamp',
		default: null,
	})
	@ApiProperty()
    @DeleteDateColumn()
	deletedAt: Date | null;

	constructor(todo?: Partial<TodoEntity>) {
		this.id = todo?.id;
		this.task = todo?.task;
		this.isDone = todo?.isDone;
		this.createdAt = todo?.createdAt;
		this.updatedAt = todo?.updatedAt;
		this.deletedAt = todo?.deletedAt;
	}
}
