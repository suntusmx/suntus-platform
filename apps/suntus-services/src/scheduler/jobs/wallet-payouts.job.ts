import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class WalletPayoutsJob {
  private readonly logger = new Logger(WalletPayoutsJob.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cron Job de Payouts (Miércoles): Dispersa fondos disponibles a expertos
   * Ejecuta cada miércoles a las 9:00 AM
   */
  @Cron('0 9 * * 3') // Cada miércoles a las 9:00 AM
  async handleWalletPayouts() {
    this.logger.log('Ejecutando cron job de Payouts: Dispersando fondos disponibles');

    try {
      // Buscar expertos con fondos disponibles
      const walletsWithFunds = await this.prisma.expertWallet.findMany({
        where: {
          availableBalance: {
            gt: 0,
          },
        },
        include: {
          expert: {
            select: {
              stripeAccountId: true,
            },
          },
        },
      });

      this.logger.log(
        `Encontrados ${walletsWithFunds.length} expertos con fondos disponibles`,
      );

      for (const wallet of walletsWithFunds) {
        if (!wallet.expert.stripeAccountId) {
          this.logger.warn(
            `Experto ${wallet.expertId} no tiene stripeAccountId configurado, saltando payout`,
          );
          continue;
        }

        try {
          // TODO: Integrar con Stripe Connect para crear transferencia
          // Por ahora solo registramos en ExpertPayout
          await this.prisma.$transaction(async (tx) => {
            // Crear registro de payout
            await tx.expertPayout.create({
              data: {
                expertId: wallet.expertId,
                totalAmount: wallet.availableBalance,
                status: 'PROCESSED',
                processedAt: new Date(),
              },
            });

            // Actualizar wallet: limpiar availableBalance y actualizar totalPaidOut
            await tx.expertWallet.update({
              where: { expertId: wallet.expertId },
              data: {
                totalPaidOut: {
                  increment: wallet.availableBalance,
                },
                availableBalance: 0,
                lastPayoutAt: new Date(),
                nextPayoutAt: this.getNextWednesday(),
              },
            });

            // Actualizar estado de transacciones a PAID_OUT
            await tx.paymentTransaction.updateMany({
              where: {
                expertId: wallet.expertId,
                walletStatus: 'AVAILABLE',
              },
              data: {
                walletStatus: 'PAID_OUT',
              },
            });
          });

          this.logger.log(
            `Payout de ${wallet.availableBalance} procesado para experto ${wallet.expertId}`,
          );
        } catch (error) {
          this.logger.error(
            `Error procesando payout para experto ${wallet.expertId}:`,
            error,
          );
        }
      }

      this.logger.log('Cron job de Payouts completado exitosamente');
    } catch (error) {
      this.logger.error('Error en cron job de Payouts:', error);
    }
  }

  private getNextWednesday(): Date {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7; // 3 = miércoles
    date.setDate(date.getDate() + daysUntilWednesday);
    date.setHours(9, 0, 0, 0);
    return date;
  }
}

