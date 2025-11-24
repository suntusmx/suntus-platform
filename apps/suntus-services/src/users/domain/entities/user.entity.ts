/**
 * Entidad de dominio User
 * Representa las reglas de negocio puras, sin dependencias de infraestructura
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: 'user' | 'expert' | 'admin',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Regla de negocio: Un usuario puede cambiar su nombre
   */
  updateName(newName: string): User {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    return new User(
      this.id,
      this.email,
      newName.trim(),
      this.role,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Regla de negocio: Verificar si el usuario es experto
   */
  isExpert(): boolean {
    return this.role === 'expert';
  }

  /**
   * Regla de negocio: Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.role === 'admin';
  }
}

