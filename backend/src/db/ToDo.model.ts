
import { Table, Column, Model, PrimaryKey, CreatedAt, DataType, Default, AllowNull } from 'sequelize-typescript';

@Table({})
export default class ToDo extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: number;

  @Column({
    type: DataType.TEXT,
    comment: "Заголовок"
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    comment: "Описание"
  })
  description: string = '';

  @Column({
    type: DataType.BOOLEAN
  })
  isCompleted!: boolean;

  @Column(DataType.DATE)
  @CreatedAt
  createdAt!: Date;
}
