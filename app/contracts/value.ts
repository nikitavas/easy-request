import 'reflect-metadata';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsDate, IsEnum, IsInt, IsNotEmpty, Min, IsUUID, IsEmail, IsOptional, ValidateNested, ArrayUnique, ArrayMaxSize, IsBoolean, MinLength, IsString } from 'class-validator';



export class Value {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    /**
  * @property {string} msg - message to print to logger
  */
    msg: string;
}
