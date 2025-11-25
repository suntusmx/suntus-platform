import { User } from '../entities/user.entity';

/**
 * Interfaz del repositorio de usuarios
 * Define el contrato sin depender de implementaciones específicas
 */
export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAuth0Id(auth0Id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: {
    auth0Id?: string;
    email: string;
    name: string;
    role: 'CLIENT' | 'EXPERT';
    language?: string;
  }): Promise<User>;
  update(id: string, data: Partial<{
    auth0Id?: string;
    name?: string;
    language?: string;
  }>): Promise<User>;
  delete(id: string): Promise<void>;
}

