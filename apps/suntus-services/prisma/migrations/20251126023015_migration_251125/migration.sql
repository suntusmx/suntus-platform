/*
  Warnings:

  - The values [USER,ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[auth0Id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'SUPPORT');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ExerciseVisibility" AS ENUM ('SYSTEM', 'PRIVATE', 'PUBLIC_COMMUNITY');

-- CreateEnum
CREATE TYPE "WikiCategory" AS ENUM ('NUTRITION', 'TRAINING', 'PHARMACOLOGY', 'PSYCHOLOGY');

-- CreateEnum
CREATE TYPE "MedicalRecordType" AS ENUM ('MEASUREMENT', 'INJURY', 'NOTE', 'PROGRESS_PHOTO', 'PLAN');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('NUTRITION', 'TRAINING', 'BOTH');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('PERSONAL', 'NUTRITION', 'TRAINING');

-- CreateEnum
CREATE TYPE "RecipeSource" AS ENUM ('SYSTEM', 'EXPERT');

-- CreateEnum
CREATE TYPE "MacroType" AS ENUM ('PROTEIN', 'CARB', 'FAT');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACCEPT', 'REJECT', 'APPROVE', 'SUSPEND', 'UNSUSUSPEND', 'PAYMENT', 'REFUND', 'ACCESS', 'EXPORT');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'EXPERT', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ExpertHistoryStatus" AS ENUM ('ACTIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WalletTransactionStatus" AS ENUM ('PENDING', 'AVAILABLE', 'RELEASED', 'PAID_OUT');

-- CreateEnum
CREATE TYPE "PaymentTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CreditReason" AS ENUM ('CANCELLATION_PARTIAL', 'EXPERT_SWITCH', 'REFUND_CREDIT', 'PROMOTIONAL');

-- CreateEnum
CREATE TYPE "CreditStatus" AS ENUM ('ACTIVE', 'APPLIED', 'EXPIRED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CLIENT', 'EXPERT');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "auth0Id" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "isSuspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'es',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "sexualOrientation" TEXT,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "system_admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeAccountId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rankingScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "documentsUrl" JSONB,
    "specialties" TEXT[],
    "bio" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "code" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "capital" TEXT,
    "currency" TEXT[],
    "phone" INTEGER[],
    "continent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipalities" (
    "id" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "municipalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postal_codes" (
    "code" TEXT NOT NULL,
    "municipalityId" TEXT,
    "cityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postal_codes_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT,
    "visibility" "ExerciseVisibility" NOT NULL DEFAULT 'PRIVATE',
    "name" JSONB NOT NULL,
    "description" JSONB,
    "mediaUrl" TEXT,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wiki_articles" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "WikiCategory" NOT NULL,
    "tags" TEXT[],
    "reputationScore" INTEGER NOT NULL DEFAULT 0,
    "isVerifiedInfo" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wiki_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" "MedicalRecordType" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_templates" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weekStructure" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_blocks" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight" DECIMAL(65,30),
    "rest" INTEGER,
    "notes" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "routine_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assigned_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "templateId" TEXT,
    "nutritionPlanId" TEXT,
    "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isContentConsumed" BOOLEAN NOT NULL DEFAULT false,
    "contentConsumedAt" TIMESTAMP(3),
    "screenshotDetected" BOOLEAN NOT NULL DEFAULT false,
    "screenshotDetectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assigned_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_plans" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "amount" DECIMAL(65,30) NOT NULL,
    "cycle" "BillingCycle" NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCustomerId" TEXT,
    "snapshotId" TEXT,
    "cancelsAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "cancelAt" TIMESTAMP(3),
    "isContentConsumed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "suntusCommission" DECIMAL(65,30) NOT NULL,
    "expertPayout" DECIMAL(65,30) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_subscriptions" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "activeUsersCount" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalCommission" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalPayout" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_payouts" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expert_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_templates" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "type" "TemplateType" NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_answers" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "macros" JSONB NOT NULL,
    "equivalents" JSONB,
    "ingredients" JSONB NOT NULL,
    "instructions" JSONB NOT NULL,
    "imageUrl" TEXT,
    "source" "RecipeSource" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "macro_equivalents" (
    "id" TEXT NOT NULL,
    "type" "MacroType" NOT NULL,
    "unit" TEXT NOT NULL,
    "grams" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "macro_equivalents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_rankings" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "verificationScore" INTEGER NOT NULL DEFAULT 0,
    "reputationScore" INTEGER NOT NULL DEFAULT 0,
    "salesVolumeScore" INTEGER NOT NULL DEFAULT 0,
    "fitotecaContribution" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_and_conditions" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "content" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terms_and_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_acceptances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "termsId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "terms_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "actorName" TEXT,
    "actorEmail" TEXT,
    "snapshot" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeExpertId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "ExpertHistoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "paymentId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "suntusFee" DECIMAL(65,30) NOT NULL,
    "expertPayout" DECIMAL(65,30) NOT NULL,
    "status" "PaymentTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "stripeFee" DECIMAL(65,30),
    "walletStatus" "WalletTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "pendingUntil" TIMESTAMP(3),
    "movedToAvailableAt" TIMESTAMP(3),
    "isEscrow" BOOLEAN NOT NULL DEFAULT false,
    "escrowTotalMonths" INTEGER,
    "escrowCurrentMonth" INTEGER,
    "escrowReleaseAmount" DECIMAL(65,30),
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_wallets" (
    "expertId" TEXT NOT NULL,
    "pendingBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "availableBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalEarned" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalPaidOut" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastPayoutAt" TIMESTAMP(3),
    "nextPayoutAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_wallets_pkey" PRIMARY KEY ("expertId")
);

-- CreateTable
CREATE TABLE "subscription_snapshots" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "cycle" "BillingCycle" NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "priceMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "subscription_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "reason" "CreditReason" NOT NULL,
    "sourceSubscriptionId" TEXT,
    "appliedToSubscriptionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "status" "CreditStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_admins_email_key" ON "system_admins"("email");

-- CreateIndex
CREATE INDEX "system_admins_email_idx" ON "system_admins"("email");

-- CreateIndex
CREATE INDEX "system_admins_role_idx" ON "system_admins"("role");

-- CreateIndex
CREATE UNIQUE INDEX "expert_profiles_userId_key" ON "expert_profiles"("userId");

-- CreateIndex
CREATE INDEX "expert_profiles_isVerified_idx" ON "expert_profiles"("isVerified");

-- CreateIndex
CREATE INDEX "expert_profiles_verificationStatus_idx" ON "expert_profiles"("verificationStatus");

-- CreateIndex
CREATE INDEX "expert_profiles_rankingScore_idx" ON "expert_profiles"("rankingScore");

-- CreateIndex
CREATE INDEX "states_countryCode_idx" ON "states"("countryCode");

-- CreateIndex
CREATE INDEX "municipalities_stateId_idx" ON "municipalities"("stateId");

-- CreateIndex
CREATE INDEX "cities_municipalityId_idx" ON "cities"("municipalityId");

-- CreateIndex
CREATE INDEX "postal_codes_municipalityId_idx" ON "postal_codes"("municipalityId");

-- CreateIndex
CREATE INDEX "postal_codes_cityId_idx" ON "postal_codes"("cityId");

-- CreateIndex
CREATE INDEX "exercises_creatorId_idx" ON "exercises"("creatorId");

-- CreateIndex
CREATE INDEX "exercises_visibility_idx" ON "exercises"("visibility");

-- CreateIndex
CREATE INDEX "wiki_articles_authorId_idx" ON "wiki_articles"("authorId");

-- CreateIndex
CREATE INDEX "wiki_articles_category_idx" ON "wiki_articles"("category");

-- CreateIndex
CREATE INDEX "wiki_articles_reputationScore_idx" ON "wiki_articles"("reputationScore");

-- CreateIndex
CREATE INDEX "wiki_articles_publishedAt_idx" ON "wiki_articles"("publishedAt");

-- CreateIndex
CREATE INDEX "medical_records_userId_idx" ON "medical_records"("userId");

-- CreateIndex
CREATE INDEX "medical_records_authorId_idx" ON "medical_records"("authorId");

-- CreateIndex
CREATE INDEX "medical_records_type_idx" ON "medical_records"("type");

-- CreateIndex
CREATE INDEX "measurements_userId_idx" ON "measurements"("userId");

-- CreateIndex
CREATE INDEX "measurements_date_idx" ON "measurements"("date");

-- CreateIndex
CREATE INDEX "workout_templates_expertId_idx" ON "workout_templates"("expertId");

-- CreateIndex
CREATE INDEX "routine_blocks_exerciseId_idx" ON "routine_blocks"("exerciseId");

-- CreateIndex
CREATE INDEX "assigned_plans_userId_idx" ON "assigned_plans"("userId");

-- CreateIndex
CREATE INDEX "assigned_plans_subscriptionId_idx" ON "assigned_plans"("subscriptionId");

-- CreateIndex
CREATE INDEX "assigned_plans_status_idx" ON "assigned_plans"("status");

-- CreateIndex
CREATE INDEX "assigned_plans_isContentConsumed_idx" ON "assigned_plans"("isContentConsumed");

-- CreateIndex
CREATE INDEX "nutrition_plans_expertId_idx" ON "nutrition_plans"("expertId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_expertId_idx" ON "subscriptions"("expertId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_stripeSubscriptionId_idx" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "subscriptions_stripePriceId_idx" ON "subscriptions"("stripePriceId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_expertId_idx" ON "payments"("expertId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "expert_subscriptions_expertId_key" ON "expert_subscriptions"("expertId");

-- CreateIndex
CREATE INDEX "expert_payouts_expertId_idx" ON "expert_payouts"("expertId");

-- CreateIndex
CREATE INDEX "expert_payouts_status_idx" ON "expert_payouts"("status");

-- CreateIndex
CREATE INDEX "question_templates_expertId_idx" ON "question_templates"("expertId");

-- CreateIndex
CREATE INDEX "question_templates_type_idx" ON "question_templates"("type");

-- CreateIndex
CREATE INDEX "template_answers_subscriptionId_idx" ON "template_answers"("subscriptionId");

-- CreateIndex
CREATE INDEX "template_answers_templateId_idx" ON "template_answers"("templateId");

-- CreateIndex
CREATE INDEX "recipes_source_idx" ON "recipes"("source");

-- CreateIndex
CREATE UNIQUE INDEX "macro_equivalents_type_unit_key" ON "macro_equivalents"("type", "unit");

-- CreateIndex
CREATE UNIQUE INDEX "expert_rankings_expertId_key" ON "expert_rankings"("expertId");

-- CreateIndex
CREATE INDEX "expert_rankings_totalScore_idx" ON "expert_rankings"("totalScore");

-- CreateIndex
CREATE UNIQUE INDEX "terms_and_conditions_version_key" ON "terms_and_conditions"("version");

-- CreateIndex
CREATE INDEX "terms_and_conditions_isActive_idx" ON "terms_and_conditions"("isActive");

-- CreateIndex
CREATE INDEX "terms_acceptances_userId_idx" ON "terms_acceptances"("userId");

-- CreateIndex
CREATE INDEX "terms_acceptances_version_idx" ON "terms_acceptances"("version");

-- CreateIndex
CREATE UNIQUE INDEX "terms_acceptances_userId_termsId_key" ON "terms_acceptances"("userId", "termsId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "client_profiles_userId_key" ON "client_profiles"("userId");

-- CreateIndex
CREATE INDEX "client_profiles_activeExpertId_idx" ON "client_profiles"("activeExpertId");

-- CreateIndex
CREATE INDEX "expert_history_userId_idx" ON "expert_history"("userId");

-- CreateIndex
CREATE INDEX "expert_history_expertId_idx" ON "expert_history"("expertId");

-- CreateIndex
CREATE INDEX "expert_history_status_idx" ON "expert_history"("status");

-- CreateIndex
CREATE INDEX "expert_history_startDate_idx" ON "expert_history"("startDate");

-- CreateIndex
CREATE INDEX "payment_transactions_userId_idx" ON "payment_transactions"("userId");

-- CreateIndex
CREATE INDEX "payment_transactions_expertId_idx" ON "payment_transactions"("expertId");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_walletStatus_idx" ON "payment_transactions"("walletStatus");

-- CreateIndex
CREATE INDEX "payment_transactions_pendingUntil_idx" ON "payment_transactions"("pendingUntil");

-- CreateIndex
CREATE INDEX "payment_transactions_createdAt_idx" ON "payment_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "payment_transactions_processedAt_idx" ON "payment_transactions"("processedAt");

-- CreateIndex
CREATE INDEX "subscription_snapshots_expertId_idx" ON "subscription_snapshots"("expertId");

-- CreateIndex
CREATE INDEX "subscription_snapshots_stripePriceId_idx" ON "subscription_snapshots"("stripePriceId");

-- CreateIndex
CREATE INDEX "subscription_snapshots_createdAt_idx" ON "subscription_snapshots"("createdAt");

-- CreateIndex
CREATE INDEX "user_credits_userId_idx" ON "user_credits"("userId");

-- CreateIndex
CREATE INDEX "user_credits_status_idx" ON "user_credits"("status");

-- CreateIndex
CREATE INDEX "user_credits_expiresAt_idx" ON "user_credits"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0Id_key" ON "users"("auth0Id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_auth0Id_idx" ON "users"("auth0Id");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "expert_profiles" ADD CONSTRAINT "expert_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postal_codes" ADD CONSTRAINT "postal_codes_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postal_codes" ADD CONSTRAINT "postal_codes_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "expert_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_articles" ADD CONSTRAINT "wiki_articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_templates" ADD CONSTRAINT "workout_templates_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_blocks" ADD CONSTRAINT "routine_blocks_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_plans" ADD CONSTRAINT "assigned_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_plans" ADD CONSTRAINT "assigned_plans_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_plans" ADD CONSTRAINT "assigned_plans_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workout_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_plans" ADD CONSTRAINT "assigned_plans_nutritionPlanId_fkey" FOREIGN KEY ("nutritionPlanId") REFERENCES "nutrition_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_plans" ADD CONSTRAINT "nutrition_plans_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "subscription_snapshots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_subscriptions" ADD CONSTRAINT "expert_subscriptions_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_payouts" ADD CONSTRAINT "expert_payouts_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_templates" ADD CONSTRAINT "question_templates_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_answers" ADD CONSTRAINT "template_answers_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_answers" ADD CONSTRAINT "template_answers_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "question_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_rankings" ADD CONSTRAINT "expert_rankings_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_acceptances" ADD CONSTRAINT "terms_acceptances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_acceptances" ADD CONSTRAINT "terms_acceptances_termsId_fkey" FOREIGN KEY ("termsId") REFERENCES "terms_and_conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_activeExpertId_fkey" FOREIGN KEY ("activeExpertId") REFERENCES "expert_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_history" ADD CONSTRAINT "expert_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_history" ADD CONSTRAINT "expert_history_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_wallet_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_wallets"("expertId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_wallets" ADD CONSTRAINT "expert_wallets_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_snapshots" ADD CONSTRAINT "subscription_snapshots_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "expert_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_sourceSubscriptionId_fkey" FOREIGN KEY ("sourceSubscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_appliedToSubscriptionId_fkey" FOREIGN KEY ("appliedToSubscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
