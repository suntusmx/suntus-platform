import { User } from '../entities/user.entity';

/**
 * Interfaz del repositorio de usuarios
 * Define el contrato sin depender de implementaciones específicas
 */
export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<void>;
}

