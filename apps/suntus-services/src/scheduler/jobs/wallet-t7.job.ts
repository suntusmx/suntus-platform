import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class WalletT7Job {
  private readonly logger = new Logger(WalletT7Job.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cron Job T+7 (Diario): Mueve fondos de PENDING a AVAILABLE
   * Ejecuta todos los días a las 2:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleWalletT7() {
    this.logger.log('Ejecutando cron job T+7: Moviendo fondos de pending a available');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Buscar transacciones que deben moverse a available
      const transactionsToMove = await this.prisma.paymentTransaction.findMany({
        where: {
          walletStatus: 'PENDING',
          pendingUntil: {
            lte: today,
          },
        },
        include: {
          wallet: true,
        },
      });

      this.logger.log(
        `Encontradas ${transactionsToMove.length} transacciones para mover a available`,
      );

      for (const transaction of transactionsToMove) {
        // Usar transacción para atomicidad
        await this.prisma.$transaction(async (tx) => {
          // Actualizar wallet: mover de pendingBalance a availableBalance
          await tx.expertWallet.update({
            where: { expertId: transaction.expertId },
            data: {
              pendingBalance: {
                decrement: transaction.expertPayout,
              },
              availableBalance: {
                increment: transaction.expertPayout,
              },
            },
          });

          // Actualizar estado de la transacción
          await tx.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              walletStatus: 'AVAILABLE',
              movedToAvailableAt: new Date(),
            },
          });
        });

        this.logger.log(
          `Transacción ${transaction.id} movida a AVAILABLE para experto ${transaction.expertId}`,
        );
      }

      this.logger.log('Cron job T+7 completado exitosamente');
    } catch (error) {
      this.logger.error('Error en cron job T+7:', error);
    }
  }
}

