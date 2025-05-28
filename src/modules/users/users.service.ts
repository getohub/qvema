import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return this.usersRepository.createUser({
      ...userData,
      password: hashedPassword
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
      const updatedUser = await this.usersRepository.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findOneWithRelations(id: string, relations: string[]): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: relations
    });
  }
  async updateWithPartialData(id: string, updateUserData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserData);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return updatedUser;
  }
}