import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class EscrowReleaseJob {
  private readonly logger = new Logger(EscrowReleaseJob.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cron Job de Escrow (Mensual): Libera fondos de packs pagados por adelantado
   * Ejecuta el primer día de cada mes a las 3:00 AM
   */
  @Cron('0 3 1 * *') // Primer día de cada mes a las 3:00 AM
  async handleEscrowRelease() {
    this.logger.log('Ejecutando cron job de Escrow: Liberando fondos de packs');

    try {
      // Buscar transacciones con escrow que aún no se han liberado completamente
      const escrowTransactions = await this.prisma.paymentTransaction.findMany({
        where: {
          isEscrow: true,
          walletStatus: {
            in: ['PENDING', 'AVAILABLE'],
          },
          escrowCurrentMonth: {
            not: null,
          },
          escrowTotalMonths: {
            not: null,
          },
        },
      });

      this.logger.log(
        `Encontradas ${escrowTransactions.length} transacciones con escrow pendiente`,
      );

      for (const transaction of escrowTransactions) {
        if (
          !transaction.escrowCurrentMonth ||
          !transaction.escrowTotalMonths ||
          !transaction.escrowReleaseAmount
        ) {
          continue;
        }

        // Verificar si ya se liberó todo
        if (transaction.escrowCurrentMonth >= transaction.escrowTotalMonths) {
          // Marcar como RELEASED
          await this.prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              walletStatus: 'RELEASED',
            },
          });
          continue;
        }

        // Liberar el monto de este mes
        await this.prisma.$transaction(async (tx) => {
          // Incrementar mes actual
          const newMonth = transaction.escrowCurrentMonth! + 1;

          // Agregar a pendingBalance (T+7)
          const pendingUntil = new Date();
          pendingUntil.setDate(pendingUntil.getDate() + 7);

          await tx.expertWallet.update({
            where: { expertId: transaction.expertId },
            data: {
              pendingBalance: {
                increment: transaction.escrowReleaseAmount,
              },
            },
          });

          // Actualizar transacción
          await tx.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              escrowCurrentMonth: newMonth,
              pendingUntil: newMonth === transaction.escrowTotalMonths ? null : pendingUntil,
              walletStatus:
                newMonth >= transaction.escrowTotalMonths! ? 'RELEASED' : 'PENDING',
            },
          });
        });

        this.logger.log(
          `Escrow liberado: Mes ${transaction.escrowCurrentMonth}/${transaction.escrowTotalMonths} para transacción ${transaction.id}`,
        );
      }

      this.logger.log('Cron job de Escrow completado exitosamente');
    } catch (error) {
      this.logger.error('Error en cron job de Escrow:', error);
    }
  }
}

